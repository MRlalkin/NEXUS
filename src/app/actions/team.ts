'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { ProjectRole } from '@/types/team';

export interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
  inviteLink?: string;
}

/**
 * Check if the user has OWNER or ADMIN permissions for a project
 */
async function hasProjectAdminAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  userId: string
): Promise<boolean> {
  // Check if user is the direct project owner
  const { data: project } = await supabase
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single();

  if (project && project.owner_id === userId) {
    return true;
  }

  // Check if user has ADMIN or OWNER role in project_members
  const { data: member } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single();

  if (member && (member.role === 'ADMIN' || member.role === 'OWNER')) {
    return true;
  }

  return false;
}

/**
 * Invite a member to a project
 */
export async function inviteMember(formData: FormData): Promise<ActionResponse<{ token: string }>> {
  const projectId = formData.get('projectId') as string;
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const role = (formData.get('role') as ProjectRole) || 'MEMBER';

  if (!projectId || !email) {
    return { success: false, error: 'Project ID and valid email are required.' };
  }

  const validRoles: ProjectRole[] = ['ADMIN', 'MEMBER', 'VIEWER'];
  if (!validRoles.includes(role)) {
    return { success: false, error: 'Invalid role selected.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'You must be logged in to invite members.' };
    }

    // Check project admin/owner permissions
    const canInvite = await hasProjectAdminAccess(supabase, projectId, user.id);
    if (!canInvite) {
      return { success: false, error: 'Only project owners and administrators can invite new members.' };
    }

    // Get project information
    const { data: project } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .single();

    const projectName = project?.name || 'Workspace Project';

    // Generate unique invitation token
    const token = crypto.randomUUID();

    // Store in invitations table (using admin client to ensure schema permissions)
    const { error: inviteError } = await supabaseAdmin
      .from('invitations')
      .insert({
        project_id: projectId,
        email,
        role,
        token,
        invited_by: user.id,
        status: 'PENDING',
      });

    if (inviteError) {
      // If table doesn't exist yet, we still provide a graceful error message
      if (inviteError.code === 'PGRST205') {
        return {
          success: false,
          error: 'The invitations table has not been created yet in Supabase. Please run the migration script in supabase/schema.sql.',
        };
      }
      return { success: false, error: inviteError.message };
    }

    // If user with this email already exists in profiles, notify them
    const { data: targetProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('email', email)
      .single();

    if (targetProfile) {
      await supabaseAdmin.from('notifications').insert({
        user_id: targetProfile.id,
        title: 'Project Invitation',
        message: `You have been invited to join project "${projectName}" as ${role}.`,
        type: 'INVITATION',
        link: `/invite/${token}`,
      });
    }

    // Record activity log
    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'INVITED_MEMBER',
      metadata: {
        email,
        role,
        token,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteLink = `${appUrl}/invite/${token}`;

    revalidatePath('/dashboard/team');
    return {
      success: true,
      data: { token },
      inviteLink,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send invitation.';
    return { success: false, error: message };
  }
}

/**
 * Accept a project invitation via token
 */
export async function acceptInvitation(token: string): Promise<ActionResponse<{ projectId: string }>> {
  if (!token) {
    return { success: false, error: 'Invitation token is missing.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Please log in or register before accepting this invitation.' };
    }

    // Lookup pending invitation
    const { data: invitation, error: invError } = await supabaseAdmin
      .from('invitations')
      .select('*, project:projects(id, name)')
      .eq('token', token)
      .eq('status', 'PENDING')
      .single();

    if (invError || !invitation) {
      return { success: false, error: 'This invitation is either invalid, expired, or already accepted.' };
    }

    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from('project_members')
      .select('id')
      .eq('project_id', invitation.project_id)
      .eq('user_id', user.id)
      .single();

    if (!existingMember) {
      // Add user to project_members
      const { error: memberError } = await supabaseAdmin
        .from('project_members')
        .insert({
          project_id: invitation.project_id,
          user_id: user.id,
          role: invitation.role,
        });

      if (memberError) {
        return { success: false, error: memberError.message };
      }
    }

    // Mark invitation as accepted
    await supabaseAdmin
      .from('invitations')
      .update({ status: 'ACCEPTED', updated_at: new Date().toISOString() })
      .eq('id', invitation.id);

    // Record activity log
    await supabaseAdmin.from('activity_logs').insert({
      project_id: invitation.project_id,
      user_id: user.id,
      action: 'ACCEPTED_INVITATION',
      metadata: {
        invitation_id: invitation.id,
        role: invitation.role,
      },
    });

    revalidatePath('/dashboard/team');
    revalidatePath(`/dashboard/projects/${invitation.project_id}/board`);

    return {
      success: true,
      data: { projectId: invitation.project_id },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to accept invitation.';
    return { success: false, error: message };
  }
}

/**
 * Remove a member from a project
 */
export async function removeMember(projectId: string, memberUserId: string): Promise<ActionResponse> {
  if (!projectId || !memberUserId) {
    return { success: false, error: 'Project ID and User ID are required.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    // Check project admin/owner rights
    const canManage = await hasProjectAdminAccess(supabase, projectId, user.id);
    if (!canManage) {
      return { success: false, error: 'Only owners or admins can remove members.' };
    }

    // Prevent removing the project owner
    const { data: project } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', projectId)
      .single();

    if (project?.owner_id === memberUserId) {
      return { success: false, error: 'The project owner cannot be removed from the project.' };
    }

    // Delete from project_members
    const { error: deleteError } = await supabaseAdmin
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', memberUserId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Record activity log
    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'REMOVED_MEMBER',
      metadata: {
        removed_user_id: memberUserId,
      },
    });

    revalidatePath('/dashboard/team');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to remove member.';
    return { success: false, error: message };
  }
}

/**
 * Update a member's role in a project
 */
export async function updateMemberRole(
  projectId: string,
  memberUserId: string,
  newRole: string
): Promise<ActionResponse> {
  const validRoles: ProjectRole[] = ['ADMIN', 'MEMBER', 'VIEWER'];
  if (!validRoles.includes(newRole as ProjectRole)) {
    return { success: false, error: 'Invalid role specified.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    // Check project admin/owner rights
    const canManage = await hasProjectAdminAccess(supabase, projectId, user.id);
    if (!canManage) {
      return { success: false, error: 'Only owners or admins can modify member roles.' };
    }

    // Cannot modify project owner's role
    const { data: project } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', projectId)
      .single();

    if (project?.owner_id === memberUserId) {
      return { success: false, error: 'Cannot change the role of the project owner.' };
    }

    // Update in project_members
    const { error: updateError } = await supabaseAdmin
      .from('project_members')
      .update({ role: newRole })
      .eq('project_id', projectId)
      .eq('user_id', memberUserId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Record activity log
    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'UPDATED_MEMBER_ROLE',
      metadata: {
        member_user_id: memberUserId,
        new_role: newRole,
      },
    });

    revalidatePath('/dashboard/team');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update member role.';
    return { success: false, error: message };
  }
}
