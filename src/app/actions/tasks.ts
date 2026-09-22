'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { TaskStatus, TaskPriority, TaskItem } from '@/types/kanban';

export interface TaskActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Create a new task
 */
export async function createTask(formData: FormData): Promise<TaskActionResponse<TaskItem>> {
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const priority = (formData.get('priority') as TaskPriority) || 'MEDIUM';
  const deadline = formData.get('deadline') as string;
  const assigneeId = formData.get('assigneeId') as string;
  const projectId = formData.get('projectId') as string;

  if (!title || !projectId) {
    return { success: false, error: 'Task title and project are required.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    // Calculate next order_index in 'TODO' column
    const { data: latestTask } = await supabaseAdmin
      .from('tasks')
      .select('order_index')
      .eq('project_id', projectId)
      .eq('status', 'TODO')
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const nextOrderIndex = (latestTask?.order_index ?? -1) + 1;

    // Insert task
    const { data: newTask, error: insertError } = await supabaseAdmin
      .from('tasks')
      .insert({
        title,
        description: description || null,
        status: 'TODO',
        priority,
        order_index: nextOrderIndex,
        project_id: projectId,
        assignee_id: assigneeId || null,
        creator_id: user.id,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      })
      .select('*, assignee:profiles!assignee_id(id, full_name, username, avatar_url, email)')
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // Record activity log
    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'CREATED_TASK',
      metadata: {
        task_id: newTask.id,
        title: newTask.title,
        priority: newTask.priority,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/board`);
    return { success: true, data: newTask as TaskItem };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create task.';
    return { success: false, error: message };
  }
}

/**
 * Update task status and order_index when dragged across columns
 */
export async function updateTaskStatusAndOrder({
  taskId,
  projectId,
  newStatus,
  newOrderIndex,
  updatedTasks,
}: {
  taskId: string;
  projectId: string;
  newStatus: TaskStatus;
  newOrderIndex: number;
  updatedTasks?: { id: string; status: TaskStatus; order_index: number }[];
}): Promise<TaskActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    if (updatedTasks && updatedTasks.length > 0) {
      // Batch update updated tasks
      await Promise.all(
        updatedTasks.map((t) =>
          supabaseAdmin
            .from('tasks')
            .update({
              status: t.status,
              order_index: t.order_index,
              updated_at: new Date().toISOString(),
            })
            .eq('id', t.id)
            .eq('project_id', projectId)
        )
      );
    } else {
      await supabaseAdmin
        .from('tasks')
        .update({
          status: newStatus,
          order_index: newOrderIndex,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('project_id', projectId);
    }

    // Record activity log
    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'MOVED_TASK',
      metadata: {
        task_id: taskId,
        new_status: newStatus,
        new_order_index: newOrderIndex,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/board`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update task order.';
    return { success: false, error: message };
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string, projectId: string): Promise<TaskActionResponse> {
  if (!taskId || !projectId) {
    return { success: false, error: 'Task ID and Project ID are required.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('project_id', projectId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Record activity log
    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'DELETED_TASK',
      metadata: {
        task_id: taskId,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/board`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete task.';
    return { success: false, error: message };
  }
}

/**
 * Update task details (title, description, priority, deadline, assignee)
 */
export async function updateTaskDetails(
  taskId: string,
  projectId: string,
  data: Partial<TaskItem>
): Promise<TaskActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { error } = await supabaseAdmin
      .from('tasks')
      .update({
        title: data.title,
        description: data.description,
        priority: data.priority,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        assignee_id: data.assignee_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('project_id', projectId);

    if (error) {
      return { success: false, error: error.message };
    }

    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'UPDATED_TASK_DETAILS',
      metadata: { task_id: taskId },
    });

    revalidatePath(`/dashboard/projects/${projectId}/board`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update task details.';
    return { success: false, error: message };
  }
}

/**
 * Add a comment to a task
 */
export async function addComment({
  taskId,
  content,
  projectId,
}: {
  taskId: string;
  content: string;
  projectId: string;
}): Promise<TaskActionResponse> {
  if (!content.trim()) {
    return { success: false, error: 'Comment cannot be empty.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { data: comment, error } = await supabaseAdmin
      .from('task_comments')
      .insert({
        task_id: taskId,
        author_id: user.id,
        content: content.trim(),
      })
      .select('*, author:profiles!author_id(id, full_name, avatar_url, username)')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'ADDED_COMMENT',
      metadata: { task_id: taskId, comment_id: comment.id },
    });

    revalidatePath(`/dashboard/projects/${projectId}/board`);
    return { success: true, data: comment };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add comment.';
    return { success: false, error: message };
  }
}

/**
 * Delete a comment from a task
 */
export async function deleteComment(commentId: string, projectId: string): Promise<TaskActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { data: comment, error: fetchError } = await supabaseAdmin
      .from('task_comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    // Role check
    const { data: member } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    const isAuthor = comment.author_id === user.id;
    const isPrivileged = member?.role === 'OWNER' || member?.role === 'ADMIN';

    if (!isAuthor && !isPrivileged) {
      return { success: false, error: 'Forbidden: You can only delete your own comments.' };
    }

    const { error: deleteError } = await supabaseAdmin
      .from('task_comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath(`/dashboard/projects/${projectId}/board`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete comment.';
    return { success: false, error: message };
  }
}
