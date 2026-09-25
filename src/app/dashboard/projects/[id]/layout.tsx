import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Kanban, ArrowLeft } from 'lucide-react';
import { ProjectTabs } from '@/components/projects/project-tabs';
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
      id, name, color, description, owner_id,
      project_members (role, user_id)
    `)
    .eq('id', id)
    .maybeSingle();

  if (!project) {
    redirect('/dashboard/projects');
  }

  const isOwner = project.owner_id === user.id;
  const memberRecord = project.project_members?.find((m: any) => m.user_id === user.id);
  const isMember = !!memberRecord;

  if (!isOwner && !isMember) {
    redirect('/dashboard/projects');
  }

  // Auto-add owner if missing from project_members
  if (isOwner && !isMember) {
    await supabase.from('project_members').upsert({
      project_id: project.id,
      user_id: user.id,
      role: 'OWNER'
    });
  }

  const role = isOwner ? 'OWNER' : memberRecord?.role;
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
        <ProjectTabs projectId={id} role={role} />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
