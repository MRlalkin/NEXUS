'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function inviteMember(formData: FormData) {
  try {
    const projectId = formData.get('projectId') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string || 'MEMBER';
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // Check if the current user has OWNER or ADMIN role
    const { data: memberCheck } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!memberCheck || (memberCheck.role !== 'OWNER' && memberCheck.role !== 'ADMIN')) {
      return { success: false, error: 'Доступ запрещен. Только OWNER или ADMIN могут приглашать участников.' };
    }

    // Check if user already exists in platform
    const { data: targetProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (targetProfile) {
      // Check if already in project
      const { data: existingMember } = await supabaseAdmin
        .from('project_members')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', targetProfile.id)
        .single();

      if (existingMember) {
        return { success: false, error: 'Пользователь уже является участником проекта.' };
      }

      // Add them directly
      const { error: insertError } = await supabaseAdmin
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: targetProfile.id,
          role
        });

      if (insertError) return { success: false, error: insertError.message };

      // Log activity
      await supabaseAdmin.from('activity_logs').insert({
        project_id: projectId,
        user_id: user.id,
        action: 'INVITED_MEMBER',
        metadata: { email, role, type: 'direct' }
      });

      // Send notification
      await supabaseAdmin.from('notifications').insert({
        user_id: targetProfile.id,
        title: 'Project Invitation',
        message: `You have been added to a new project as ${role}.`,
        type: 'PROJECT_INVITE',
        link: `/dashboard/projects/${projectId}/board`
      });
      
    } else {
      // Create invitation token for non-existing users
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      const { error: inviteError } = await supabaseAdmin
        .from('invitations')
        .insert({
          project_id: projectId,
          email,
          role,
          invited_by: user.id,
          token,
          expires_at: expiresAt.toISOString()
        });

      if (inviteError) return { success: false, error: inviteError.message };

      // Log activity
      await supabaseAdmin.from('activity_logs').insert({
        project_id: projectId,
        user_id: user.id,
        action: 'INVITED_MEMBER',
        metadata: { email, role, type: 'token' }
      });
      
      const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`;
      revalidatePath(`/dashboard/projects/${projectId}/team`);
      return { success: true, inviteLink };
    }

    revalidatePath(`/dashboard/projects/${projectId}/team`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function removeMember(projectId: string, userId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // Prevent removing yourself if you're the owner? Actually, owners can't remove themselves unless transferring.
    // For simplicity, just attempt the delete. RLS or admin client will do it.
    // Ensure caller is OWNER or ADMIN
    const { data: caller } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!caller || (caller.role !== 'OWNER' && caller.role !== 'ADMIN')) {
      return { success: false, error: 'Not authorized to remove members' };
    }

    // Don't allow removing the OWNER
    const { data: target } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();

    if (target?.role === 'OWNER') {
      return { success: false, error: 'Cannot remove the project owner' };
    }

    const { error } = await supabaseAdmin
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) return { success: false, error: error.message };

    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'REMOVED_MEMBER',
      metadata: { targetUserId: userId }
    });

    revalidatePath(`/dashboard/projects/${projectId}/team`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function acceptInvitation(token: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const { data: invite } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single();

    if (!invite) return { success: false, error: 'Invalid or expired invitation' };

    // Check expiry
    if (new Date(invite.expires_at) < new Date()) {
      return { success: false, error: 'Invitation expired' };
    }

    // Check if already a member
    const { data: existingMember } = await supabaseAdmin
      .from('project_members')
      .select('id')
      .eq('project_id', invite.project_id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      await supabaseAdmin.from('invitations').delete().eq('id', invite.id);
      return { success: false, error: 'You are already a member of this project' };
    }

    // Add to project
    const { error: insertError } = await supabaseAdmin
      .from('project_members')
      .insert({
        project_id: invite.project_id,
        user_id: user.id,
        role: invite.role,
      });

    if (insertError) return { success: false, error: insertError.message };

    // Delete invite
    await supabaseAdmin.from('invitations').delete().eq('id', invite.id);

    // Log activity
    await supabaseAdmin.from('activity_logs').insert({
      project_id: invite.project_id,
      user_id: user.id,
      action: 'JOINED_PROJECT',
      metadata: { role: invite.role }
    });

    revalidatePath(`/dashboard/projects/${invite.project_id}/board`);
    revalidatePath('/dashboard/team');
    return { success: true, projectId: invite.project_id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateMemberRole(projectId: string, userId: string, newRole: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabaseAdmin
      .from('project_members')
      .update({ role: newRole })
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) return { success: false, error: error.message };
    
    revalidatePath(`/dashboard/projects/${projectId}/team`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
