import { supabaseAdmin } from '@/lib/supabase/admin';
import { ProjectTable, type AdminProjectItem } from '@/components/admin/project-table';
import { Briefcase, Layers, CheckCircle2, Users } from 'lucide-react';

export const metadata = {
  title: 'Platform Projects | Administrator Portal',
  description: 'Inspect all active workspaces and project deliverables across NEXUS.',
};

export default async function AdminProjectsPage() {
  // 1. Fetch all projects
  const { data: projectsData } = await supabaseAdmin
    .from('projects')
    .select('id, name, description, color, owner_id, created_at')
    .order('created_at', { ascending: false });

  const rawProjects = projectsData || [];

  // 2. Fetch owner profiles for these projects
  const ownerIds = Array.from(new Set(rawProjects.map((p) => p.owner_id).filter(Boolean)));
  const { data: profilesData } = ownerIds.length > 0
    ? await supabaseAdmin
        .from('profiles')
        .select('id, full_name, username, email')
        .in('id', ownerIds)
    : { data: [] };

  const profileMap = new Map<string, { id: string; full_name: string | null; username: string | null; email: string | null }>();
  (profilesData || []).forEach((p) => {
    profileMap.set(p.id, p);
  });

  // 3. Fetch all tasks to compute workload counts per project
  const projectIds = rawProjects.map((p) => p.id);
  const { data: tasksData } = projectIds.length > 0
    ? await supabaseAdmin
        .from('tasks')
        .select('id, project_id, status')
        .in('project_id', projectIds)
    : { data: [] };

  const taskCountMap = new Map<string, { total: number; completed: number }>();
  (tasksData || []).forEach((t) => {
    const curr = taskCountMap.get(t.project_id) || { total: 0, completed: 0 };
    curr.total += 1;
    if (t.status === 'DONE') {
      curr.completed += 1;
    }
    taskCountMap.set(t.project_id, curr);
  });

  // 4. Assemble AdminProjectItems
  const adminProjects: AdminProjectItem[] = rawProjects.map((p) => {
    const taskStats = taskCountMap.get(p.id) || { total: 0, completed: 0 };
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      color: p.color || '#6366f1',
      created_at: p.created_at,
      owner: p.owner_id ? profileMap.get(p.owner_id) || null : null,
      taskCount: taskStats.total,
      completedTaskCount: taskStats.completed,
    };
  });

  const totalTasks = (tasksData || []).length;
  const completedTasks = (tasksData || []).filter((t) => t.status === 'DONE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Workspace &amp; Portfolio Supervision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Platform Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overview of all workspaces, team deliverables, and operational progress across NEXUS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold cyber-glass px-3.5 py-1.5 rounded-xl border border-white/[0.08] text-slate-300">
            {adminProjects.length} Workspaces
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="cyber-glass p-4 rounded-2xl border border-white/[0.08] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{adminProjects.length}</div>
            <div className="text-[11px] text-slate-400">Total Workspaces</div>
          </div>
        </div>

        <div className="cyber-glass p-4 rounded-2xl border border-white/[0.08] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{totalTasks}</div>
            <div className="text-[11px] text-slate-400">Active Deliverables</div>
          </div>
        </div>

        <div className="cyber-glass p-4 rounded-2xl border border-white/[0.08] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{completedTasks}</div>
            <div className="text-[11px] text-slate-400">Completed Items</div>
          </div>
        </div>
      </div>

      {/* Project Table */}
      <ProjectTable projects={adminProjects} />
    </div>
  );
}
