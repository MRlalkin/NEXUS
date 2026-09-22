import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { Shield, Users, Kanban, TrendingUp, Ban, CheckCircle2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: 'Admin Dashboard | NEXUS',
};

async function toggleBanUser(formData: FormData) {
  'use server';
  const userId = formData.get('user_id') as string;
  const isBanned = formData.get('is_banned') === 'true';
  
  await supabaseAdmin
    .from('profiles')
    .update({ is_banned: !isBanned })
    .eq('id', userId);
    
  revalidatePath('/admin');
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch metrics
  const { count: totalUsers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
  const { count: proUsers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'PRO');
  const { count: totalProjects } = await supabaseAdmin.from('projects').select('*', { count: 'exact', head: true });
  
  // Dummy active users & revenue since we don't track session lengths in DB yet
  const activeUsers = Math.floor((totalUsers || 0) * 0.7);
  const revenue = (proUsers || 0) * 15; // Assuming PRO is $15/mo

  // Fetch users for table
  const { data: users } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, username, email, role, subscription_tier, is_banned, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
          <Shield className="w-6 h-6 text-indigo-400" />
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-400">System overview and user management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-400' },
          { label: 'Active Users', value: activeUsers, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'PRO Users', value: proUsers, icon: TrendingUp, color: 'text-amber-400' },
          { label: 'Total Projects', value: totalProjects, icon: Kanban, color: 'text-indigo-400' },
          { label: 'Monthly Revenue', value: `$${revenue}`, icon: TrendingUp, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <span className="text-2xl font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-4 border-b border-white/[0.05]">
          <h2 className="text-lg font-bold text-white">User Management</h2>
        </div>
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/[0.02] border-b border-white/[0.05] text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role / Tier</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {users?.map((u) => (
              <tr key={u.id} className={`hover:bg-white/[0.02] transition-colors ${u.is_banned ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{u.full_name || u.username}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border 
                      ${u.role === 'ADMIN' ? 'text-amber-400 border-amber-400/20 bg-amber-400/10' : 'text-slate-400 border-slate-400/20 bg-slate-400/10'}`}>
                      {u.role}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border 
                      ${u.subscription_tier === 'PRO' ? 'text-indigo-400 border-indigo-400/20 bg-indigo-400/10' : 'text-slate-400 border-slate-400/20 bg-slate-400/10'}`}>
                      {u.subscription_tier}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {u.id !== user.id && (
                    <form action={toggleBanUser}>
                      <input type="hidden" name="user_id" value={u.id} />
                      <input type="hidden" name="is_banned" value={u.is_banned ? 'true' : 'false'} />
                      <button 
                        type="submit"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ml-auto border
                        ${u.is_banned 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'}`}
                      >
                        {u.is_banned ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        {u.is_banned ? 'Unban User' : 'Ban User'}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
