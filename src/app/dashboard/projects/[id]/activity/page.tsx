import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Activity, Clock } from 'lucide-react';

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: logs } = await supabase
    .from('activity_logs')
    .select(`
      id, action, metadata, created_at,
      user:user_id(full_name, username)
    `)
    .eq('project_id', id)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="h-full w-full p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-400" />
          Project Activity Log
        </h2>

        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
          {logs?.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No activity logs found for this project.
            </div>
          ) : (
            <div className="space-y-6">
              {logs?.map((log: any, index: number) => (
                <div key={log.id} className="flex gap-4 relative">
                  {/* Timeline line */}
                  {index !== logs.length - 1 && (
                    <div className="absolute top-8 left-4 w-px h-[calc(100%+1rem)] bg-white/[0.08]" />
                  )}
                  
                  <div className="w-8 h-8 rounded-full bg-black/40 border border-white/[0.08] flex items-center justify-center flex-shrink-0 z-10">
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  
                  <div className="flex-1 pb-2">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-white">{log.user?.full_name || log.user?.username || 'System'}</span>
                      {' '}
                      {log.action.replace('_', ' ').toLowerCase()}
                      {' '}
                      {log.metadata?.title && <span className="font-semibold text-white">"{log.metadata.title}"</span>}
                      {log.metadata?.email && <span className="text-indigo-400">{log.metadata.email}</span>}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
