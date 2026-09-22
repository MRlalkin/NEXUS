import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

export const metadata = {
  title: 'Notifications | NEXUS',
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            Notifications
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stay updated on your projects and team activities.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded-lg text-sm transition-colors border border-white/[0.05]">
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/[0.08] divide-y divide-white/[0.05]">
        {notifications?.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">All caught up!</h3>
            <p className="text-slate-400 text-sm mt-1">You have no new notifications.</p>
          </div>
        ) : (
          notifications?.map((notif: any) => (
            <div key={notif.id} className={`p-5 flex items-start justify-between group transition-colors ${notif.is_read ? 'opacity-60' : 'bg-indigo-500/[0.02] hover:bg-indigo-500/[0.04]'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.is_read ? 'bg-transparent' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]'}`} />
                <div>
                  <h4 className="font-bold text-white text-sm">{notif.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{notif.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <button className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
