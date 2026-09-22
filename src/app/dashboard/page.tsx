import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export const metadata = {
  title: 'Workspace Dashboard | NEXUS',
  description: 'Enterprise workspace overview and project hub.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch quick stats
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: unreadNotifs } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id || '')
    .eq('is_read', false);

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username')
    .eq('id', user?.id || '')
    .single();

  const displayName = profile?.full_name || profile?.username || 'User';

  return (
    <DashboardContent 
      displayName={displayName} 
      projectCount={projectCount || 0} 
      unreadNotifs={unreadNotifs || 0} 
    />
  );
}
