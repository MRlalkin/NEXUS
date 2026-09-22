import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Shield, Smartphone, Key } from 'lucide-react';

export const metadata = {
  title: 'Security Settings | NEXUS',
};

export default async function SecuritySettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-indigo-400" />
          Security & Authentication
        </h2>
        <p className="text-sm text-slate-400">Manage your password and secure your account.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-slate-400" /> Change Password
        </h3>
        
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <div className="pt-2">
            <button
              type="button"
              className="px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl text-sm font-medium transition-colors border border-white/[0.05]"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-slate-400" /> Active Sessions
        </h3>
        
        <div className="divide-y divide-white/[0.05]">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Windows • Chrome</p>
              <p className="text-xs text-slate-500 mt-0.5">San Francisco, US • Active now</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              Current
            </span>
          </div>
          
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">iPhone • Safari</p>
              <p className="text-xs text-slate-500 mt-0.5">San Francisco, US • 2 days ago</p>
            </div>
            <button className="text-xs text-slate-400 hover:text-rose-400 transition-colors">
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
