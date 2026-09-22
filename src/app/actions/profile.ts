'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface ProfileActionResponse {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Update user profile information
 */
export async function updateProfile(formData: FormData): Promise<ProfileActionResponse> {
  const fullName = (formData.get('fullName') as string)?.trim();
  const username = (formData.get('username') as string)?.trim().toLowerCase();
  const bio = (formData.get('bio') as string)?.trim();
  const avatarUrl = (formData.get('avatarUrl') as string)?.trim();

  if (!fullName || fullName.length < 2) {
    return { success: false, error: 'Full name must be at least 2 characters long.' };
  }

  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters long.' };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { success: false, error: 'Username can only contain letters, numbers, underscores, and dashes.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    // Check if username is already taken by someone else
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .single();

    if (existingUser) {
      return { success: false, error: 'This username is already in use by another member.' };
    }

    // Update profile in profiles table
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: fullName,
        username,
        bio: bio || null,
        avatar_url: avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/dashboard/settings/profile');
    revalidatePath('/dashboard/team');
    return { success: true, message: 'Profile updated successfully!' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile.';
    return { success: false, error: message };
  }
}

/**
 * Update user password
 */
export async function updatePassword(formData: FormData): Promise<ProfileActionResponse> {
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/settings/security');
    return { success: true, message: 'Password changed successfully!' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update password.';
    return { success: false, error: message };
  }
}

/**
 * Sign out from all other active devices
 */
export async function signOutAllDevices(): Promise<ProfileActionResponse> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: 'others' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Signed out from all other active sessions.' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to terminate other sessions.';
    return { success: false, error: message };
  }
}
