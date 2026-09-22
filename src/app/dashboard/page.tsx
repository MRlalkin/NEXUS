import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export const metadata = {
  title: 'Workspace Dashboard | NEXUS',
  description: 'Enterprise workspace overview and project hub.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // We will calculate project count from the fetched projects below

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

  // Fetch projects to calculate task stats
  const { data: projects } = await supabase
    .from('projects')
    .select('id, owner_id, project_members(user_id), tasks(id, status, due_date)');
  
  const userProjects = projects?.filter(p => p.owner_id === user?.id || (p.project_members && p.project_members.some((m: any) => m.user_id === user?.id))) || [];
  const projectCount = userProjects.length;

  let tasksInProgress = 0;
  let tasksDone = 0;
  let upcomingDeadlines = 0;
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  userProjects.forEach(p => {
    p.tasks?.forEach((t: any) => {
      if (t.status === 'IN_PROGRESS') tasksInProgress++;
      if (t.status === 'DONE') tasksDone++;
      
      if (t.due_date) {
        const due = new Date(t.due_date);
        if (due >= now && due <= nextWeek && t.status !== 'DONE') {
          upcomingDeadlines++;
        }
      }
    });
  });

  // Fetch recent activity
  const { data: activities } = await supabase
    .from('activity_logs')
    .select('id, action, created_at, metadata, user:user_id(full_name, username)')
    .in('project_id', userProjects.map(p => p.id))
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <DashboardContent 
      displayName={displayName} 
      projectCount={projectCount} 
      unreadNotifs={unreadNotifs || 0}
      metrics={{ tasksInProgress, tasksDone, upcomingDeadlines }}
      activities={activities || []}
    />
  );
}
