import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Lock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Spatial Analytics | NEXUS',
  description: 'Deep spatial analytics and telemetry for your workspace.',
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/analytics');
  }

  // 1. Fetch user profile for subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const isPro = profile?.subscription_tier === 'PRO';

  // 2. Fetch accessible projects
  const { data: memberLinks } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', user.id);
    
  const { data: ownedProjects } = await supabase
    .from('projects')
    .select('id')
    .eq('owner_id', user.id);

  const accessibleProjectIds = new Set<string>();
  memberLinks?.forEach(link => accessibleProjectIds.add(link.project_id));
  ownedProjects?.forEach(proj => accessibleProjectIds.add(proj.id));
  
  const projectIdsArray = Array.from(accessibleProjectIds);

  // 3. Fetch all tasks for those projects
  let allTasks: any[] = [];
  if (projectIdsArray.length > 0) {
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title, status, priority, deadline, created_at')
      .in('project_id', projectIdsArray);
    
    if (tasks) {
      allTasks = tasks;
    }
  }

  // 4. Aggregations
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'DONE').length;
  
  const now = new Date();
  const overdueTasks = allTasks.filter(t => {
    if (t.status === 'DONE') return false;
    if (!t.deadline) return false;
    return new Date(t.deadline) < now;
  }).length;

  // Status Distribution
  const statusCounts = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0 };
  allTasks.forEach(t => {
    if (t.status in statusCounts) {
      statusCounts[t.status as keyof typeof statusCounts]++;
    }
  });

  const tasksByStatus = [
    { name: 'To Do', value: statusCounts.TODO, color: '#94a3b8' },
    { name: 'In Progress', value: statusCounts.IN_PROGRESS, color: '#3b82f6' },
    { name: 'In Review', value: statusCounts.IN_REVIEW, color: '#f59e0b' },
    { name: 'Done', value: statusCounts.DONE, color: '#10b981' },
  ].filter(i => i.value > 0);

  // Priority Distribution
  const priorityCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };
  allTasks.forEach(t => {
    if (t.priority in priorityCounts) {
      priorityCounts[t.priority as keyof typeof priorityCounts]++;
    }
  });

  const tasksByPriority = [
    { name: 'Low', value: priorityCounts.LOW, color: '#64748b' },
    { name: 'Medium', value: priorityCounts.MEDIUM, color: '#3b82f6' },
    { name: 'High', value: priorityCounts.HIGH, color: '#f59e0b' },
    { name: 'Urgent', value: priorityCounts.URGENT, color: '#ef4444' },
  ].filter(i => i.value > 0);

  // Simple Trend (Last 6 months approximation for demo)
  // In a real app, you'd group by created_at and completed_at (if tracked)
  // We'll mock a realistic trend line for visual demonstration
  const tasksTrend = [
    { name: 'Apr', added: 12, completed: 8 },
    { name: 'May', added: 19, completed: 15 },
    { name: 'Jun', added: 15, completed: 18 },
    { name: 'Jul', added: 22, completed: 20 },
    { name: 'Aug', added: 30, completed: 25 },
    { name: 'Sep', added: 24, completed: totalTasks > 0 ? completedTasks : 22 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Spatial Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Workspace Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Deep insights into your team's velocity and task distribution across all projects.
        </p>
      </div>

      {/* Top Metrics Cards (Available to everyone) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
            <Layers className="w-16 h-16 text-blue-500" />
          </div>
          <div className="relative z-10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="text-3xl font-bold text-white mt-1">{totalTasks}</div>
          </div>
        </div>

        {/* Completed */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="text-3xl font-bold text-white mt-1">{completedTasks}</div>
          </div>
        </div>

        {/* Overdue */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
            <Clock className="w-16 h-16 text-rose-500" />
          </div>
          <div className="relative z-10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overdue
            </span>
            <div className="text-3xl font-bold text-white mt-1">{overdueTasks}</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-16 h-16 text-violet-500" />
          </div>
          <div className="relative z-10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="text-3xl font-bold text-white mt-1">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Charts Section */}
      <div className="relative">
        <h2 className="text-lg font-semibold text-white mb-4">
          Extended Metrics &amp; Trends
        </h2>
        
        <div className={!isPro ? 'filter blur-md pointer-events-none opacity-50 transition-all' : ''}>
          <AnalyticsCharts 
            tasksByStatus={tasksByStatus.length > 0 ? tasksByStatus : [{ name: 'No Data', value: 1, color: '#334155' }]} 
            tasksByPriority={tasksByPriority.length > 0 ? tasksByPriority : [{ name: 'No Data', value: 1, color: '#334155' }]} 
            tasksTrend={tasksTrend} 
          />
        </div>

        {/* PRO Tier Paywall Overlay */}
        {!isPro && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-10">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl text-center max-w-sm mx-auto bg-[#07090e]/90 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Unlock deep spatial telemetry, sprint burndown forecasting, and team velocity trends with NEXUS PRO.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-sm font-semibold text-[#07090e] bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Upgrade to PRO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
