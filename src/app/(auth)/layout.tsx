'use client';

import Link from 'next/link';
import { Layers } from 'lucide-react';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useLanguage } from '@/context/language-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t: typedT } = useLanguage();
  const t = typedT as any;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0a0c10] bg-grid-pattern">
      {/* Dynamic ambient gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-cyan-500/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[450px] h-[300px] bg-gradient-to-br from-indigo-500/10 via-purple-600/10 to-transparent blur-[120px] rounded-full" />

      {/* Top navigation / branding header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-[1px] shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-[#12161f] rounded-[11px] flex items-center justify-center transition-colors group-hover:bg-[#161c28]">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
              NEXUS
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 -mt-1 font-medium">
              Enterprise Suite
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.dashboard.systemStatus}</span>
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-white/[0.04]">
        <div>
          {t.footer.copyright}
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
        </div>
      </footer>
    </div>
  );
}

