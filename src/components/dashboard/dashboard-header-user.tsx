'use client';

import { LogOut } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

export function DashboardHeaderUser({
  displayName,
  email,
  onLogout
}: {
  displayName: string;
  email: string;
  onLogout: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
      <div className="hidden sm:flex flex-col text-right">
        <span className="text-xs font-semibold text-white truncate max-w-[150px]">
          {displayName}
        </span>
        <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Online</span>
        </span>
      </div>

      <form action={onLogout}>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 border border-white/[0.08] transition-colors cursor-pointer"
          title={t.navigation.logout}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.navigation.logout}</span>
        </button>
      </form>
    </div>
  );
}
