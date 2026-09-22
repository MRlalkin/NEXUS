import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/settings/profile-form';

export const metadata = {
  title: 'Profile Settings | NEXUS',
  description: 'Manage your identity, personal bio, and avatar.',
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/settings/profile');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, bio, avatar_url, email')
    .eq('id', user.id)
    .single();

  return (
    <ProfileForm
      initialProfile={{
        fullName: profile?.full_name || '',
        username: profile?.username || '',
        email: user.email || '',
        bio: profile?.bio || '',
        avatarUrl: profile?.avatar_url || '',
      }}
    />
  );
}
