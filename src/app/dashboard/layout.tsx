import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { NotificationsPopover } from '@/components/dashboard/notifications-popover';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { CommandPalette } from '@/components/command-palette';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { DashboardHeaderUser } from '@/components/dashboard/dashboard-header-user';
import { 
  Layers, 
  LogOut, 
  Settings 
} from 'lucide-react';
import type { NotificationItem } from '@/types/team';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name || profile?.username || 'User';

  // Fetch recent notifications for the bell popover
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 bg-grid-pattern">
      {/* Global Command Menu (Ctrl + K) */}
      <CommandPalette />

      {/* Top Application Header with Cyber-Glass Bevel */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#07090e]/85 backdrop-blur-2xl px-4 sm:px-8 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Sliding Nav */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-[1px] shadow-lg shadow-indigo-500/25">
                <div className="w-full h-full bg-[#121622] rounded-[15px] flex items-center justify-center transition-colors group-hover:bg-[#161c28]">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wider text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                  NEXUS
                </span>
                <span className="text-[9px] uppercase tracking-widest text-indigo-400 -mt-1 font-semibold">
                  Spatial OS
                </span>
              </div>
            </Link>

            {/* Sliding Navigation */}
            <div className="hidden md:block">
              <DashboardNav />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {/* Notification Bell */}
            <NotificationsPopover notifications={(notifications || []) as NotificationItem[]} />

            {/* Settings Quick Link */}
            <Link
              href="/dashboard/settings/profile"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <DashboardHeaderUser 
              displayName={displayName} 
              email={user.email || ''}
              onLogout={logout} 
            />
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="block md:hidden mt-3 pt-2 border-t border-white/[0.05]">
          <DashboardNav />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
