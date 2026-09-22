import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';

export const metadata = {
  title: 'Analytics | NEXUS',
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  // Fetch tasks for the user to aggregate
  const { data: tasks } = await supabase
    .from('tasks')
    .select('status, priority')
    .eq('assignee_id', user.id);

  // Aggregate by status
  const statusCounts: Record<string, number> = {
    TODO: 0, IN_PROGRESS: 0, REVIEW: 0, DONE: 0
  };
  // Aggregate by priority
  const priorityCounts: Record<string, number> = {
    LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0
  };

  tasks?.forEach(t => {
    if (statusCounts[t.status] !== undefined) statusCounts[t.status]++;
    if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++;
  });

  const tasksByStatus = [
    { name: 'To Do', count: statusCounts.TODO },
    { name: 'In Progress', count: statusCounts.IN_PROGRESS },
    { name: 'Review', count: statusCounts.REVIEW },
    { name: 'Done', count: statusCounts.DONE },
  ];

  const tasksByPriority = [
    { name: 'LOW', value: priorityCounts.LOW },
    { name: 'MEDIUM', value: priorityCounts.MEDIUM },
    { name: 'HIGH', value: priorityCounts.HIGH },
    { name: 'URGENT', value: priorityCounts.URGENT },
  ].filter(p => p.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Analytics Hub
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Insights into your productivity and task distribution.
        </p>
      </div>

      <AnalyticsCharts 
        tasksByStatus={tasksByStatus} 
        tasksByPriority={tasksByPriority.length > 0 ? tasksByPriority : [{ name: 'NO DATA', value: 1 }]} 
        subscriptionTier={profile?.subscription_tier || 'FREE'} 
      />
    </div>
  );
}
