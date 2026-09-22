'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface CreateProjectResponse {
  success: boolean;
  error?: string;
  message?: string;
  project?: {
    id: string;
    name: string;
    color: string;
  };
}

export async function createProject(formData: FormData): Promise<CreateProjectResponse> {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const color = (formData.get('color') as string) || '#3b82f6';
  const deadline = (formData.get('due_date') as string)?.trim() || (formData.get('deadline') as string)?.trim();

  if (!name) {
    return { success: false, error: 'Project name is required.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Пользователь не авторизован' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profile?.subscription_tier === 'FREE') {
      const { count, error: countError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('is_archived', false);

      if (countError) {
        return { success: false, error: 'Ошибка при проверке лимита проектов' };
      }

      if (count !== null && count >= 2) {
        return { 
          success: false, 
          error: 'LIMIT_REACHED', 
          message: 'Вы достигли лимита в 2 проекта на тарифе FREE. Обновитесь до PRO для снятия ограничений.' 
        };
      }
    }

    const { data: project, error: projError } = await supabase
      .from('projects')
      .insert({
        name,
        description: description || null,
        color: color || '#3b82f6',
        deadline: deadline || null,
        owner_id: user.id,
      })
      .select()
      .single();

    if (projError || !project) {
      return { success: false, error: projError?.message || 'Ошибка создания проекта' };
    }

    const { error: memberError } = await supabase
      .from('project_members')
      .upsert({
        project_id: project.id,
        user_id: user.id,
        role: 'OWNER'
      }, { onConflict: 'project_id,user_id' });

    if (memberError) {
      console.error('Ошибка добавления пользователя в project_members', memberError);
    }

    await supabase.from('activity_logs').insert({
      project_id: project.id,
      user_id: user.id,
      action: 'CREATED_PROJECT',
      entity_type: 'PROJECT',
      entity_id: project.id
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');

    return { success: true, project };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create project.';
    return { success: false, error: message };
  }
}
