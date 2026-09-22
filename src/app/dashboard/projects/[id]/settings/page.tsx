import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Settings, Trash2, AlertTriangle, Save } from 'lucide-react';

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  const { data: member } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .single();

  if (member?.role !== 'OWNER') {
    return (
      <div className="p-6">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Only the project owner can access settings.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-indigo-400" />
            Project Settings
          </h2>
          <p className="text-sm text-slate-400">Update project details and preferences.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Project Name
              </label>
              <input
                defaultValue={project?.name}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                defaultValue={project?.description || ''}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 transition-all text-sm resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end border-t border-white/[0.05]">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Deleting a project is irreversible. All tasks, comments, and files will be permanently deleted.
          </p>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-rose-500/25">
            <Trash2 className="w-4 h-4" />
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}
