import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CheckSquare, Filter, Kanban } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Tasks | NEXUS',
};

export default async function MyTasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      id, title, description, status, priority, created_at,
      project:project_id(id, name, color)
    `)
    .eq('assignee_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            My Tasks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            All tasks assigned to you across all projects.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded-lg text-sm transition-colors border border-white/[0.05]">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="glass-panel rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/[0.02] border-b border-white/[0.05] text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {tasks?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <CheckSquare className="w-10 h-10 text-slate-600 mb-3" />
                    <h3 className="text-lg font-medium text-white">No tasks assigned</h3>
                    <p className="text-sm mt-1">You have no tasks assigned to you yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks?.map((task: any) => (
                <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{task.title}</div>
                    {task.description && <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">{task.description}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/projects/${task.project.id}/board`} className="flex items-center gap-2 hover:text-indigo-300 transition-colors">
                      <div className="w-4 h-4 rounded shadow-sm" style={{ backgroundColor: task.project.color }} />
                      <span className="font-medium">{task.project.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-white/[0.05] border border-white/[0.1] px-2 py-1 rounded text-xs font-medium">
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border 
                      ${task.priority === 'HIGH' ? 'text-amber-400 border-amber-400/20 bg-amber-400/10' : 
                        task.priority === 'URGENT' ? 'text-rose-400 border-rose-400/20 bg-rose-400/10' : 
                        task.priority === 'LOW' ? 'text-slate-400 border-slate-400/20 bg-slate-400/10' :
                        'text-blue-400 border-blue-400/20 bg-blue-400/10'}`}>
                      {task.priority}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
