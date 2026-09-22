'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ArrowLeft, 
  Layers 
} from 'lucide-react';

const ADMIN_LINKS = [
  {
    href: '/admin',
    label: 'Overview & Metrics',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/admin/users',
    label: 'User Directory',
    icon: Users,
    exact: false,
  },
  {
    href: '/admin/projects',
    label: 'Platform Projects',
    icon: Briefcase,
    exact: false,
  },
];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col justify-between cyber-glass rounded-3xl p-5 border border-rose-500/20 shadow-2xl relative overflow-hidden">
      {/* Top Crimson Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-red-500 to-transparent" />

      <div className="space-y-6">
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 p-[1px] shadow-lg shadow-rose-500/25">
            <div className="w-full h-full bg-[#121622] rounded-[15px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-base text-white">NEXUS</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Control Center</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-md shadow-rose-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-white/[0.06] space-y-3">
        <div className="px-2">
          <span className="text-[10px] text-slate-500 block">Logged in as Admin:</span>
          <span className="text-xs font-semibold text-slate-300 truncate block mt-0.5">
            {userEmail}
          </span>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}
