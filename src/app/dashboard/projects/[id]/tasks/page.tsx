import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CheckSquare } from 'lucide-react';
import { TaskFilters } from '@/components/tasks/task-filters';

export default async function TasksPage(
  props: { 
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const statusFilter = searchParams?.status as string | undefined;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let query = supabase
    .from('tasks')
    .select(`
      id, title, description, status, priority, created_at,
      assignee:assignee_id(id, full_name, username)
    `)
    .eq('project_id', id);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: tasks } = await query.order('created_at', { ascending: false });

  return (
    <div className="h-full w-full p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-400" />
          Project Tasks
        </h2>
        <TaskFilters />
      </div>

      <div className="glass-panel rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/[0.02] border-b border-white/[0.05] text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Assignee</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {tasks?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No tasks found in this project.
                </td>
              </tr>
            ) : (
              tasks?.map((rawTask: any) => {
                const task = {
                  ...rawTask,
                  assignee: Array.isArray(rawTask.assignee) ? rawTask.assignee[0] : rawTask.assignee
                };
                return (
                <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{task.title}</div>
                    {task.description && <div className="text-xs text-slate-500 truncate max-w-xs">{task.description}</div>}
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
                  <td className="px-6 py-4">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                          {task.assignee.full_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-xs">{task.assignee.full_name || 'Unknown'}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
