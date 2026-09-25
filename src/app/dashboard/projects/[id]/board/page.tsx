import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { KanbanBoard } from '@/components/kanban/kanban-board';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectBoardPage({ params }: PageProps) {
  // 1. Асинхронно резолвим params для совместимости с Next.js 15
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. Безопасный запрос проекта без падения на .single()
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(`
      *,
      tasks (
        id, title, description, status, priority, order_index,
        assignee:assignee_id(id, full_name, username)
      ),
      project_members (*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (projectError || !project) {
    console.error('Project fetch error:', projectError);
    notFound();
  }

  // 3. Проверка прав (владелец ИЛИ участник)
  const isOwner = project.owner_id === user.id;
  const isMember = Array.isArray(project.project_members) && project.project_members.some((m: any) => m.user_id === user.id);

  if (!isOwner && !isMember) {
    redirect('/dashboard/projects');
  }

  // 4. Если владелец отсутствует в project_members — автоматически добавляем его туда
  if (isOwner && !isMember) {
    await supabase.from('project_members').upsert({
      project_id: project.id,
      user_id: user.id,
      role: 'OWNER'
    });
  }

  // Обработка данных для совместимости (иногда assignee приходит массивом)
  const typedTasks = (project.tasks || []).map((t: any) => ({
    ...t,
    assignee: Array.isArray(t.assignee) ? t.assignee[0] : t.assignee,
  }));

  return (
    <div className="h-full w-full p-6 overflow-hidden flex flex-col">
      <KanbanBoard projectId={project.id} initialTasks={typedTasks} />
    </div>
  );
}
