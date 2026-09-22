import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Kanban, LayoutGrid, Calendar, Users as UsersIcon, CheckCircle2, CheckSquare } from 'lucide-react';
import { redirect } from 'next/navigation';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';

export const metadata = {
  title: 'Projects | NEXUS',
  description: 'Manage your active projects.',
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile for subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  // Get total projects OWNED by the user for the limit check
  const { count: ownedCount } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', user.id);

  // Fetch projects the user is a member of or owns, including task stats and member counts
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      color,
      created_at,
      project_members!inner(user_id, role),
      tasks (id, status)
    `)
    .eq('project_members.user_id', user.id)
    .order('created_at', { ascending: false });

  // Deduplicate projects if Supabase inner join returns duplicates (rare but possible depending on RLS)
  const uniqueProjectsMap = new Map();
  projects?.forEach(p => uniqueProjectsMap.set(p.id, p));
  const uniqueProjects = Array.from(uniqueProjectsMap.values());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-indigo-400" />
            Мои проекты
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Управляйте вашими кросс-функциональными проектами и досками задач.
          </p>
        </div>
        
        <CreateProjectDialog 
          currentProjectCount={ownedCount || 0} 
          subscriptionTier={profile?.subscription_tier || 'FREE'} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {uniqueProjects.length === 0 && (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            <Kanban className="w-12 h-12 text-indigo-400/50 mb-4 relative z-10" />
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">У вас пока нет проектов</h3>
            <p className="text-slate-400 text-sm max-w-sm mb-6 relative z-10">
              Создайте свой первый проект и начните работу.
            </p>
          </div>
        )}

        {uniqueProjects.map((project) => {
          // Calculate task stats
          const tasks = project.tasks || [];
          const totalTasks = tasks.length;
          const doneTasks = tasks.filter((t: any) => t.status === 'DONE').length;
          const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
          
          return (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}/board`}
              className="glass-panel p-6 rounded-2xl border border-white/[0.08] hover:border-indigo-500/30 hover:scale-[1.01] transition-all group flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/20"
                    style={{ backgroundColor: project.color || '#6366f1' }}
                  >
                    <Kanban className="w-5 h-5" />
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-white leading-none">{progress}%</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Прогресс</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-300 transition-colors">{project.name}</h3>
                
                {project.description ? (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500/50 mt-1 italic">
                    Без описания
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-5 mb-4">
                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/[0.05] pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white/[0.04] px-2 py-1 rounded-md" title="задач">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-300">{doneTasks}/{totalTasks} задач</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Дедлайн">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="участников">
                    <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.project_members ? project.project_members.length : 1} участников</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
