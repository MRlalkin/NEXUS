import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, UserPlus, Mail, ShieldAlert } from 'lucide-react';
import { InviteMemberForm } from '@/components/projects/invite-member-form';

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: members } = await supabase
    .from('project_members')
    .select(`
      role, joined_at,
      profile:user_id(id, full_name, username, email)
    `)
    .eq('project_id', id)
    .order('joined_at', { ascending: true });

  const { data: currentUserMember } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .single();

  const canInvite = currentUserMember?.role === 'OWNER' || currentUserMember?.role === 'ADMIN';

  return (
    <div className="h-full w-full p-6 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Project Members
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-white/[0.05] px-3 py-1 rounded-full">
              {members?.length || 0} Total
            </span>
          </div>

          <div className="glass-panel rounded-2xl border border-white/[0.08] divide-y divide-white/[0.05]">
            {members?.map((m: any) => (
              <div key={m.profile.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                    {m.profile.full_name?.charAt(0) || m.profile.username?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{m.profile.full_name || m.profile.username}</h4>
                    <p className="text-xs text-slate-500">{m.profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border 
                    ${m.role === 'OWNER' ? 'text-rose-400 border-rose-400/20 bg-rose-400/10' : 
                      m.role === 'ADMIN' ? 'text-amber-400 border-amber-400/20 bg-amber-400/10' : 
                      'text-blue-400 border-blue-400/20 bg-blue-400/10'}`}>
                    {m.role}
                  </span>
                  {/* Action menu could go here */}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="glass-panel rounded-2xl border border-white/[0.08] p-6 sticky top-0">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              Invite Member
            </h3>
            
            {!canInvite ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <p>You need to be an OWNER or ADMIN to invite new members to this project.</p>
              </div>
            ) : (
              <InviteMemberForm projectId={id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
