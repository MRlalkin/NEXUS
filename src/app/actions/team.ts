'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function inviteMemberByEmail({ projectId, email, role }: { projectId: string; email: string; role?: string }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Пользователь не авторизован' };

    // Проверь, что текущий пользователь имеет роль 'OWNER' или 'ADMIN' в этом проекте
    const { data: memberCheck } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!memberCheck || (memberCheck.role !== 'OWNER' && memberCheck.role !== 'ADMIN')) {
      return { success: false, error: 'Недостаточно прав для приглашения участников' };
    }

    const { data: targetUser } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email')
      .eq('email', email)
      .maybeSingle();

    if (!targetUser) {
      return { success: false, error: 'Пользователь с таким email не найден в системе' };
    }

    const { data: existingMember } = await supabaseAdmin
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', targetUser.id)
      .single();

    if (existingMember) {
      return { success: false, error: 'Пользователь уже является участником проекта' };
    }

    const { error: insertError } = await supabaseAdmin
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: targetUser.id,
        role: role || 'MEMBER'
      });

    if (insertError) return { success: false, error: insertError.message };

    await supabaseAdmin.from('notifications').insert({
      user_id: targetUser.id,
      title: 'Вас добавили в проект',
      message: 'Вы добавлены в проект как ' + (role || 'MEMBER'),
      type: 'TEAM_INVITE',
      link: `/dashboard/projects/${projectId}/board`
    });

    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'INVITED_MEMBER',
      metadata: { email, role: role || 'MEMBER' }
    });

    revalidatePath('/dashboard/team');
    revalidatePath(`/dashboard/projects/${projectId}/board`, 'page');
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function removeMember({ projectId, targetUserId }: { projectId: string; targetUserId: string }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const { data: caller } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!caller || (caller.role !== 'OWNER' && caller.role !== 'ADMIN')) {
      return { success: false, error: 'Not authorized to remove members' };
    }

    const { data: target } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', targetUserId)
      .single();

    if (target?.role === 'OWNER') {
      return { success: false, error: 'Cannot remove the project owner' };
    }

    const { error } = await supabaseAdmin
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', targetUserId);

    if (error) return { success: false, error: error.message };

    revalidatePath('/dashboard/team');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateMemberRole({ projectId, targetUserId, newRole }: { projectId: string; targetUserId: string; newRole: string }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const { data: caller } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!caller || (caller.role !== 'OWNER' && caller.role !== 'ADMIN')) {
      return { success: false, error: 'Not authorized to change roles' };
    }

    const { data: target } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', targetUserId)
      .single();

    if (target?.role === 'OWNER' || newRole === 'OWNER') {
      return { success: false, error: 'Cannot change OWNER role' };
    }

    const { error } = await supabaseAdmin
      .from('project_members')
      .update({ role: newRole })
      .eq('project_id', projectId)
      .eq('user_id', targetUserId);

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/dashboard/team');
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

    if (new Date(invite.expires_at) < new Date()) {
      return { success: false, error: 'Invitation expired' };
    }

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

    const { error: insertError } = await supabaseAdmin
      .from('project_members')
      .insert({
        project_id: invite.project_id,
        user_id: user.id,
        role: invite.role,
      });

    if (insertError) return { success: false, error: insertError.message };

    await supabaseAdmin.from('invitations').delete().eq('id', invite.id);

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
