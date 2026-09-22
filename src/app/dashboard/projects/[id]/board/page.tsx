import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { KanbanBoard } from '@/components/kanban/kanban-board';

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      id, title, description, status, priority, order_index,
      assignee:assignee_id(id, full_name, username)
    `)
    .eq('project_id', id)
    .order('order_index', { ascending: true });
  const typedTasks = (tasks || []).map((t: any) => ({
    ...t,
    assignee: Array.isArray(t.assignee) ? t.assignee[0] : t.assignee,
  }));

  return (
    <div className="h-full w-full p-6 overflow-hidden flex flex-col">
      <KanbanBoard projectId={id} initialTasks={typedTasks as any} />
    </div>
  );
}
