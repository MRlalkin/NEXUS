import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { User } from 'lucide-react';
import { ProfileForm } from '@/components/settings/profile-form';

export const metadata = {
  title: 'Profile Settings | NEXUS',
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const initialProfile = {
    fullName: profile?.full_name || '',
    username: profile?.username || '',
    email: user.email || '',
    bio: profile?.bio || '',
    avatarUrl: profile?.avatar_url || '',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <User className="w-5 h-5 text-indigo-400" />
          Profile Settings
        </h2>
        <p className="text-sm text-slate-400">Update your personal information and public profile.</p>
      </div>

      <ProfileForm initialProfile={initialProfile} />
    </div>
  );
}
