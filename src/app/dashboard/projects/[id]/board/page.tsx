import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { TaskItem } from '@/types/kanban';
import { TeamMemberItem } from '@/types/team';

interface ProjectBoardPageProps {
  params: { id: string };
}

export default async function ProjectBoardPage({ params }: ProjectBoardPageProps) {
  const projectId = params.id;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect('/login');

  // Verify access
  const { data: member } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', userData.user.id)
    .single();

  if (!member) notFound();

  // Fetch tasks
  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select('*, assignee:profiles!assignee_id(id, full_name, avatar_url, email)')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true });

  if (tasksError) {
    console.error('Tasks fetch error:', tasksError);
  }

  const tasks: TaskItem[] = tasksData || [];

  // Fetch team members
  const { data: membersData } = await supabase
    .from('project_members')
    .select('user_id, role, profiles(full_name, username, avatar_url)')
    .eq('project_id', projectId);

  const teamMembers: TeamMemberItem[] = (membersData || []).map((m: any) => ({
    userId: m.user_id,
    fullName: m.profiles?.full_name || 'Unknown',
    username: m.profiles?.username || '',
    email: '',
    avatarUrl: m.profiles?.avatar_url || '',
    projects: [],
    highestRole: m.role,
    isOnline: false,
  }));

  // Ensure tasks have comment counts (we could do a join, but for simplicity we simulate or leave at 0 if not joined)
  // In a real app we'd query task_comments and group by task_id.
  const { data: commentsCount } = await supabase
    .from('task_comments')
    .select('task_id');

  const commentCounts = (commentsCount || []).reduce((acc: any, curr: any) => {
    acc[curr.task_id] = (acc[curr.task_id] || 0) + 1;
    return acc;
  }, {});

  const processedTasks = tasks.map((t) => ({
    ...t,
    comment_count: commentCounts[t.id] || 0,
  }));

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 px-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Task Board</h1>
          <p className="text-sm text-slate-400">Manage project tasks and workflows</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <Link
              href={`/dashboard/projects/${projectId}/board`}
              className="px-4 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 font-medium text-sm"
            >
              Board
            </Link>
            <Link
              href={`/dashboard/projects/${projectId}/activity`}
              className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors font-medium text-sm"
            >
              Activity
            </Link>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/25">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {/* Glow behind board */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <KanbanBoard
          initialTasks={processedTasks}
          projectId={projectId}
          teamMembers={teamMembers}
          currentUserId={userData.user.id}
        />
      </div>
    </div>
  );
}
