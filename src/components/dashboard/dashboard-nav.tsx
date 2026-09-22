'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  BarChart3,
  Kanban
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';

type NavKey = 'dashboard' | 'projects' | 'team' | 'analytics';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    key: 'dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/dashboard/projects',
    key: 'projects',
    icon: Kanban,
    exact: false,
  },
  {
    href: '/dashboard/team',
    key: 'team',
    icon: Users,
    exact: false,
  },
  {
    href: '/dashboard/analytics',
    key: 'analytics',
    icon: BarChart3,
    exact: false,
  },
] as const;

export function DashboardNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="flex items-center gap-1.5 p-1 rounded-2xl cyber-glass border border-white/[0.08] shadow-inner">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/30 via-violet-600/25 to-indigo-600/30 border border-indigo-500/50 shadow-md shadow-indigo-500/20"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span className="relative z-10">{t.nav[item.key as NavKey]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
