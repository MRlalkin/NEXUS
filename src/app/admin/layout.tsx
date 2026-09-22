import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { 
  ShieldAlert, 
  Users, 
  BarChart3, 
  ArrowLeft, 
  LogOut 
} from 'lucide-react';

export const metadata = {
  title: 'NEXUS Admin Panel',
  description: 'Administration and telemetry for NEXUS workspace.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.08] bg-[#090b0e]/95 backdrop-blur-xl relative z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.4)]">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold tracking-widest text-sm text-white">NEXUS</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 inline-block mt-0.5">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span>Overview</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Users Management</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/[0.08]">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#090b0e]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile branding */}
            <div className="md:hidden flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span className="font-bold text-sm">ADMIN</span>
            </div>
            
            <div className="hidden md:block text-xs font-semibold text-slate-500 uppercase tracking-widest">
              System Administration
            </div>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
