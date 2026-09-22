'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface NotificationActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(notificationId: string): Promise<NotificationActionResponse> {
  if (!notificationId) {
    return { success: false, error: 'Notification ID is required.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update notification.';
    return { success: false, error: message };
  }
}

/**
 * Mark all notifications for the current user as read
 */
export async function markAllAsRead(): Promise<NotificationActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to mark all notifications as read.';
    return { success: false, error: message };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<NotificationActionResponse> {
  if (!notificationId) {
    return { success: false, error: 'Notification ID is required.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete notification.';
    return { success: false, error: message };
  }
}
