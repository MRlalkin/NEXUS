import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SecurityForm } from '@/components/settings/security-form';

export const metadata = {
  title: 'Security & Access | NEXUS',
  description: 'Manage password, credentials, and active device sessions.',
};

export default async function SecuritySettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/settings/security');
  }

  return <SecurityForm />;
}
