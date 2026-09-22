import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Palette, Moon, Sun, Monitor } from 'lucide-react';

export const metadata = {
  title: 'Appearance Settings | NEXUS',
};

export default async function AppearanceSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-indigo-400" />
          Appearance
        </h2>
        <p className="text-sm text-slate-400">Customize how NEXUS looks on your device.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4">Theme Preference</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-indigo-500 bg-indigo-500/10 text-white transition-all">
            <Moon className="w-8 h-8" />
            <span className="text-sm font-semibold">Dark Mode</span>
          </button>
          
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-white/[0.05] hover:border-white/[0.1] bg-white/[0.02] text-slate-400 hover:text-white transition-all opacity-50 cursor-not-allowed" disabled title="Coming soon">
            <Sun className="w-8 h-8" />
            <span className="text-sm font-semibold">Light Mode</span>
          </button>
          
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-white/[0.05] hover:border-white/[0.1] bg-white/[0.02] text-slate-400 hover:text-white transition-all opacity-50 cursor-not-allowed" disabled title="Coming soon">
            <Monitor className="w-8 h-8" />
            <span className="text-sm font-semibold">System</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4">NEXUS is currently optimized for Dark Spatial Glassmorphism. Light mode is coming soon.</p>
      </div>
      
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4">Accent Color</h3>
        
        <div className="flex flex-wrap gap-4">
          {['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#22c55e'].map(color => (
            <button
              key={color}
              className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${color === '#6366f1' ? 'ring-2 ring-white ring-offset-2 ring-offset-[#12161f] scale-110' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
