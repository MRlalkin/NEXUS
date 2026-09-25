import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Settings, AlertTriangle } from 'lucide-react';
import { ProjectSettings } from '@/components/projects/project-settings';

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

        <ProjectSettings project={project} />
      </div>
    </div>
  );
}
