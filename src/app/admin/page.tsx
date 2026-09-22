import { getPlatformMetrics } from '@/app/actions/admin';
import { 
  Users, 
  Activity, 
  Star, 
  DollarSign, 
  Briefcase, 
  CheckSquare,
  Shield,
  Ban
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Platform Overview | NEXUS Admin',
};

export default async function AdminDashboardPage() {
  const result = await getPlatformMetrics();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20">
        Failed to load platform metrics: {result.error}
      </div>
    );
  }

  const {
    totalUsers,
    activeUsers,
    proUsers,
    mrr,
    totalProjects,
    totalTasks,
    recentRegistrations
  } = result.data;

  const metrics = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      label: 'Active Accounts',
      value: activeUsers,
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      label: 'PRO Subscribers',
      value: proUsers,
      icon: <Star className="w-6 h-6 text-amber-400" />,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      label: 'Est. MRR',
      value: `$${mrr}`,
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: <Briefcase className="w-6 h-6 text-cyan-400" />,
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: <CheckSquare className="w-6 h-6 text-violet-400" />,
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Platform Overview
        </h1>
        <p className="text-sm text-slate-400">
          Global statistics and telemetry for the NEXUS platform.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/[0.08] flex items-center gap-5">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${m.bg} ${m.border} border`}>
              {m.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">{m.value}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Registrations Table */}
      <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Registrations</h2>
          <Link 
            href="/admin/users"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors"
          >
            View All Users &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Role & Status</th>
                <th className="px-6 py-4 font-semibold text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                    No recent registrations found.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((u: any) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                          {u.full_name?.charAt(0).toUpperCase() || u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{u.full_name || 'Anonymous User'}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.subscription_tier === 'PRO' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          <Star className="w-3 h-3" /> PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/20 text-slate-300 border border-slate-500/30">
                          FREE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {u.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                            <Shield className="w-3.5 h-3.5" /> ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            USER
                          </span>
                        )}
                        <span className="text-slate-600">•</span>
                        {u.is_banned ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500">
                            <Ban className="w-3.5 h-3.5" /> BANNED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
