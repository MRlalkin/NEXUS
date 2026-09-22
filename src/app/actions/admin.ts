'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Validates that the current user is authenticated and has the ADMIN role.
 * Throws an error if unauthorized.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  // Assuming `profiles` table has `role` field.
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile || profile.role !== 'ADMIN') {
    throw new Error('Unauthorized: Insufficient privileges');
  }

  return user;
}

/**
 * Bans or unbans a user.
 */
export async function toggleUserBan(targetUserId: string, shouldBan: boolean) {
  try {
    const adminUser = await requireAdmin();

    if (adminUser.id === targetUserId) {
      return { success: false, error: 'You cannot ban yourself' };
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ is_banned: shouldBan })
      .eq('id', targetUserId);

    if (error) {
      console.error('Failed to toggle ban:', error);
      return { success: false, error: 'Database error' };
    }

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${targetUserId}`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Changes a user's role.
 */
export async function changeUserRole(targetUserId: string, newRole: 'USER' | 'ADMIN') {
  try {
    const adminUser = await requireAdmin();

    if (adminUser.id === targetUserId && newRole !== 'ADMIN') {
      return { success: false, error: 'You cannot remove your own admin privileges' };
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetUserId);

    if (error) {
      console.error('Failed to change role:', error);
      return { success: false, error: 'Database error' };
    }

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${targetUserId}`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetches platform-wide metrics for the admin dashboard.
 */
export async function getPlatformMetrics() {
  try {
    await requireAdmin();

    // In a highly optimized app, these could be cached or materialized views.
    // We'll perform basic aggregations here.

    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: proUsers },
      { count: totalProjects },
      { count: totalTasks },
      { data: recentRegistrations }
    ] = await Promise.all([
      // Total users
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      
      // Active users
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('is_banned', false),
      
      // PRO users
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'PRO'),
      
      // Total projects
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
      
      // Total tasks
      supabaseAdmin.from('tasks').select('*', { count: 'exact', head: true }),
      
      // Recent registrations
      supabaseAdmin
        .from('profiles')
        .select('id, full_name, username, email, subscription_tier, role, is_banned, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    const proCount = proUsers || 0;
    const mrr = proCount * 9; // $9 per PRO user

    return {
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        proUsers: proCount,
        mrr,
        totalProjects: totalProjects || 0,
        totalTasks: totalTasks || 0,
        recentRegistrations: recentRegistrations || []
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
