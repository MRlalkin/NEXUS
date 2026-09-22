'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { TaskItem, TaskStatus } from '@/types/kanban';
import { TeamMemberItem } from '@/types/team';
import { KanbanColumn } from './kanban-column';
import { updateTaskStatusAndOrder } from '@/app/actions/tasks';
import { toast } from 'sonner';
import { TaskModal } from './task-modal';
import { useTranslation } from '@/context/language-context';

interface KanbanBoardProps {
  initialTasks: TaskItem[];
  projectId: string;
  teamMembers: TeamMemberItem[];
  currentUserId: string;
}

const COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export function KanbanBoard({ initialTasks, projectId, teamMembers, currentUserId }: KanbanBoardProps) {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    const prevTasks = [...tasks];
    
    // Find the task being moved
    const movedTask = tasks.find((t) => t.id === draggableId);
    if (!movedTask) return;

    // Separate tasks by columns
    const destTasks = tasks
      .filter((t) => t.status === destStatus && t.id !== draggableId)
      .sort((a, b) => a.order_index - b.order_index);

    // Insert into destination at destination.index
    destTasks.splice(destination.index, 0, {
      ...movedTask,
      status: destStatus,
    });

    // Re-assign order_index for destination tasks
    const updatedDestTasks = destTasks.map((t, index) => ({
      ...t,
      order_index: index,
    }));

    // Build the new total task state
    const newTasksMap = new Map<string, TaskItem>();
    tasks.forEach((t) => newTasksMap.set(t.id, t));

    updatedDestTasks.forEach((t) => newTasksMap.set(t.id, t));

    // Re-order remaining source tasks if moved across different columns
    if (sourceStatus !== destStatus) {
      const remainingSourceTasks = tasks
        .filter((t) => t.status === sourceStatus && t.id !== draggableId)
        .sort((a, b) => a.order_index - b.order_index)
        .map((t, index) => ({ ...t, order_index: index }));

      remainingSourceTasks.forEach((t) => newTasksMap.set(t.id, t));
    }

    const optimisticTaskList = Array.from(newTasksMap.values());
    
    // Optimistic UI Update
    setTasks(optimisticTaskList);

    // Sync to backend via Server Action
    startTransition(async () => {
      const payloadTasks = updatedDestTasks.map((t) => ({
        id: t.id,
        status: t.status,
        order_index: t.order_index,
      }));

      const res = await updateTaskStatusAndOrder({
        taskId: draggableId,
        projectId,
        newStatus: destStatus,
        newOrderIndex: destination.index,
        updatedTasks: payloadTasks,
      });

      if (!res.success) {
        setTasks(prevTasks);
        toast.error(res.error || 'Failed to update task order.');
      }
    });
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.order_index - b.order_index);
  };

  return (
    <div className="h-full flex flex-col w-full select-none">
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start px-2 min-w-max">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                onTaskClick={setSelectedTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          projectId={projectId}
          teamMembers={teamMembers}
          currentUserId={currentUserId}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
