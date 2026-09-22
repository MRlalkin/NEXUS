import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Kanban, CheckSquare, Users, Activity, Settings, ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify access and get project details
  const { data: project } = await supabase
    .from('projects')
    .select(`
      id, name, color, description,
      project_members!inner(role)
    `)
    .eq('id', id)
    .eq('project_members.user_id', user.id)
    .single();

  if (!project) {
    redirect('/dashboard/projects');
  }

  const role = project.project_members[0].role;
  const basePath = `/dashboard/projects/${id}`;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Project Header */}
      <header className="border-b border-white/[0.08] bg-black/20 backdrop-blur-md px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard/projects" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-white/[0.08]" />
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: project.color || '#6366f1' }}
          >
            <Kanban className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{project.name}</h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5">
              <span>Роль: {role}</span>
            </div>
          </div>
        </div>

        {/* Project Navigation Tabs */}
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <Link href={`${basePath}/board`} className="flex items-center gap-2 pb-3 border-b-2 border-indigo-500 text-white font-medium text-sm whitespace-nowrap">
            <Kanban className="w-4 h-4 text-indigo-400" />
            Доска
          </Link>
          <Link href={`${basePath}/tasks`} className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-slate-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
            <CheckSquare className="w-4 h-4" />
            Задачи
          </Link>
          <Link href={`${basePath}/team`} className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-slate-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
            <Users className="w-4 h-4" />
            Команда
          </Link>
          <Link href={`${basePath}/activity`} className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-slate-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
            <Activity className="w-4 h-4" />
            Активность
          </Link>
          {role === 'OWNER' && (
            <Link href={`${basePath}/settings`} className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-slate-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
              <Settings className="w-4 h-4" />
              Настройки
            </Link>
          )}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
