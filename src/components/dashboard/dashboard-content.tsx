'use client';

import Link from 'next/link';
import { 
  Users, 
  Bell, 
  ArrowRight, 
  Shield, 
  Kanban, 
  Sparkles 
} from 'lucide-react';
import { useTranslation } from '@/context/language-context';

interface DashboardContentProps {
  displayName: string;
  projectCount: number;
  unreadNotifs: number;
}

export function DashboardContent({ displayName, projectCount, unreadNotifs }: DashboardContentProps) {
  const { t } = useTranslation();

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
            {t.dashboard.welcome} {displayName}
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.dashboard.subtitle}
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
            <h3 className="text-lg font-bold text-white mb-1">{t.dashboard.cards.teamTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.dashboard.cards.teamDesc}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
            <span>{t.dashboard.cards.teamLink}</span>
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
              {unreadNotifs > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  {unreadNotifs} new
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{t.dashboard.cards.notifTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.dashboard.cards.notifDesc}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300">
            <span>{t.dashboard.cards.notifLink}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500/20 transition-colors">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{t.dashboard.cards.projectsTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.dashboard.cards.projectsDesc.replace('{count}', String(projectCount))}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{t.dashboard.cards.projectsBadge}</span>
            </div>
            <Link 
              href="/dashboard/projects"
              className="inline-flex justify-center items-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              {t.dashboard.cards.projectsLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
