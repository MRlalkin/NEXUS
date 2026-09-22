import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserActionsDropdown } from '@/components/admin/user-actions-dropdown';
import { Search, Shield, Star, Ban } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'User Management | NEXUS Admin',
};

interface AdminUsersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!currentUserProfile || currentUserProfile.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Parse search params
  const { q } = await searchParams;
  const searchQuery = typeof q === 'string' ? q.toLowerCase() : '';

  // Fetch all users
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !users) {
    return (
      <div className="p-8 text-center text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20">
        Failed to load users: {error?.message}
      </div>
    );
  }

  // Client-side filtering simulation (in a real app with large data, this would be a server-side text search)
  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const searchString = `${u.full_name} ${u.email} ${u.username}`.toLowerCase();
    return searchString.includes(searchQuery);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
            User Management
          </h1>
          <p className="text-sm text-slate-400">
            Manage roles, subscriptions, and platform access for all NEXUS users.
          </p>
        </div>

        {/* Search Bar */}
        <form className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search users..."
            className="w-full sm:w-64 bg-[#0d1117] border border-white/[0.08] rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
          />
        </form>
      </div>

      <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                    No users found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-sm">
                          {u.full_name?.charAt(0).toUpperCase() || u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link href={`/admin/users/${u.id}`} className="font-semibold text-white text-sm hover:text-indigo-400 transition-colors">
                            {u.full_name || 'Anonymous User'}
                          </Link>
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span>{u.email}</span>
                            {u.username && (
                              <>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-500">@{u.username}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      {u.subscription_tier === 'PRO' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          <Star className="w-3 h-3" /> PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/20 text-slate-300 border border-slate-500/30">
                          FREE
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {u.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400">
                          <Shield className="w-4 h-4" /> ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                          USER
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {u.is_banned ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <Ban className="w-3 h-3" /> BANNED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <UserActionsDropdown 
                        userId={u.id} 
                        currentRole={u.role as 'USER' | 'ADMIN'} 
                        isBanned={u.is_banned} 
                        currentUserId={user.id} 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
