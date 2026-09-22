import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NotificationsView } from '@/components/notifications/notifications-view';
import type { NotificationItem } from '@/types/team';

export const metadata = {
  title: 'Notifications | NEXUS',
  description: 'View and manage workspace invitations, updates, and activities.',
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/notifications');
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <NotificationsView
      initialNotifications={(notifications || []) as NotificationItem[]}
    />
  );
}
