import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { 
  Users, 
  Bell, 
  ArrowRight, 
  Shield, 
  Kanban, 
  Sparkles 
} from 'lucide-react';

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

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-white/10 bg-gradient-to-br from-[#12161f] via-[#0e121a] to-[#0a0c10] shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEXUS Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome, {user?.email?.split('@')[0]}
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
            Manage your cross-functional projects, invite team members with role-based access, and orchestrate delivery.
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Team & Roles Card */}
        <Link
          href="/dashboard/team"
          className="glass-panel p-6 rounded-2xl border border-white/[0.08] hover:border-indigo-500/30 hover:scale-[1.01] transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Team &amp; Roles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Invite colleagues via email, manage RBAC permissions (Owner, Admin, Member, Viewer), and collaborate.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
            <span>Manage Team</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Notifications Card */}
        <Link
          href="/dashboard/notifications"
          className="glass-panel p-6 rounded-2xl border border-white/[0.08] hover:border-violet-500/30 hover:scale-[1.01] transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                <Bell className="w-6 h-6" />
              </div>
              {(unreadNotifs ?? 0) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  {unreadNotifs} new
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Notifications</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Check project invitations, task assignments, and workspace audit notifications in real-time.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300">
            <span>Open Notification Center</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Projects Hub Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Projects &amp; Tasks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You have {projectCount ?? 0} active project{(projectCount ?? 0) === 1 ? '' : 's'}. Track progress with interactive Kanban boards.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Security Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
