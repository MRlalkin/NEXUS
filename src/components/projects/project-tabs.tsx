'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Kanban, 
  CheckSquare, 
  Users, 
  Activity, 
  Settings 
} from 'lucide-react';

interface ProjectTabsProps {
  projectId: string;
  role?: string;
}

export function ProjectTabs({ projectId, role }: ProjectTabsProps) {
  const pathname = usePathname();

  const allTabs = [
    { name: 'Доска', href: `/dashboard/projects/${projectId}/board`, icon: Kanban },
    { name: 'Задачи', href: `/dashboard/projects/${projectId}/tasks`, icon: CheckSquare },
    { name: 'Команда', href: `/dashboard/projects/${projectId}/team`, icon: Users },
    { name: 'Активность', href: `/dashboard/projects/${projectId}/activity`, icon: Activity },
    { name: 'Настройки', href: `/dashboard/projects/${projectId}/settings`, icon: Settings, ownerOnly: true },
  ];

  const tabs = allTabs.filter(tab => !tab.ownerOnly || role === 'OWNER');

  return (
    <nav className="relative flex items-center gap-2 z-20 overflow-x-auto no-scrollbar -mb-[17px]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative flex items-center gap-2 pb-3 px-2 text-sm font-medium transition-colors select-none whitespace-nowrap ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
            <span>{tab.name}</span>
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
