'use client';

import { LogOut, Globe } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function DashboardHeaderUser({
  displayName,
  email,
  onLogout
}: {
  displayName: string;
  email: string;
  onLogout: () => void;
}) {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
      
      {/* Language Switcher */}
      <button
        onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/[0.08] transition-colors"
        title="Toggle Language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="uppercase">{lang}</span>
      </button>

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
          title={t.nav.logout}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.nav.logout}</span>
        </button>
      </form>
    </div>
  );
}
