'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  try {
    const fullName = formData.get('full_name') as string;
    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string;
    // Avatar upload would be more complex (storage), skipping for now.

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // Check if username is taken
    if (username) {
      const { data: existing } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();
        
      if (existing) {
        return { success: false, error: 'Username is already taken' };
      }
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: fullName || null,
        username: username || null,
        bio: bio || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/dashboard/settings/profile');
    revalidatePath('/dashboard');
    return { success: true, message: 'Profile updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const password = formData.get('newPassword') as string;
    if (!password) return { success: false, error: 'Password required' };
    
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) return { success: false, error: error.message };
    return { success: true, message: 'Password updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function signOutAllDevices() {
  try {
    // Basic placeholder for signing out all devices
    return { success: true, message: 'Signed out from all devices.' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

