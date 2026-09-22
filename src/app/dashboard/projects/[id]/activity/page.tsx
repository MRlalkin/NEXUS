import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, PlusCircle, CheckCircle2, ArrowRightLeft, User, Flag, Clock } from 'lucide-react';

interface ProjectActivityPageProps {
  params: { id: string };
}

export default async function ProjectActivityPage({ params }: ProjectActivityPageProps) {
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

  // Fetch activity logs
  const { data: logs, error } = await supabase
    .from('activity_logs')
    .select('*, user:profiles!user_id(full_name, avatar_url)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Activity logs fetch error:', error);
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATED_TASK':
        return <PlusCircle className="w-4 h-4 text-emerald-400" />;
      case 'UPDATED_TASK_STATUS':
      case 'MOVED_TASK':
        return <ArrowRightLeft className="w-4 h-4 text-blue-400" />;
      case 'ADDED_COMMENT':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'UPDATED_TASK_DETAILS':
        return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActionText = (log: any) => {
    switch (log.action) {
      case 'CREATED_TASK':
        return <span>created task <strong className="text-white">{log.metadata?.title || 'Unknown'}</strong></span>;
      case 'UPDATED_TASK_STATUS':
      case 'MOVED_TASK':
        return <span>moved a task to <strong className="text-white">{log.metadata?.newStatus || log.metadata?.new_status}</strong></span>;
      case 'ADDED_COMMENT':
        return <span>added a comment to a task</span>;
      case 'UPDATED_TASK_DETAILS':
        return <span>updated task details</span>;
      default:
        return <span>performed an action</span>;
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8 px-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Project Activity</h1>
          <p className="text-sm text-slate-400">Timeline of recent changes and updates</p>
        </div>

        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
          <Link
            href={`/dashboard/projects/${projectId}/board`}
            className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors font-medium text-sm"
          >
            Board
          </Link>
          <Link
            href={`/dashboard/projects/${projectId}/activity`}
            className="px-4 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 font-medium text-sm"
          >
            Activity
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-12">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          
          {(!logs || logs.length === 0) && (
            <div className="text-center py-12 text-slate-500">
              No activity recorded yet.
            </div>
          )}

          {logs?.map((log: any) => (
            <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0d1117] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                {log.user?.avatar_url ? (
                  <img src={log.user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-slate-400" />
                )}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/5 rounded-lg">
                      {getActionIcon(log.action)}
                    </div>
                    <span className="font-semibold text-slate-200 text-sm">
                      {log.user?.full_name || 'System User'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium bg-white/5 px-2 py-1 rounded-full">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-slate-400 pl-10">
                  {getActionText(log)}
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
