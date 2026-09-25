'use client';

import { useState, useTransition } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateTaskStatus, createTask, deleteTask } from '@/app/actions/kanban';
import { Plus, MoreVertical, Trash2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/language-context';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  order_index: number;
  assignee?: {
    id: string;
    full_name: string;
    username: string;
  } | null;
}

const COLUMNS_CONFIG: { id: Status; color: string }[] = [
  { id: 'TODO', color: 'bg-slate-500' },
  { id: 'IN_PROGRESS', color: 'bg-blue-500' },
  { id: 'REVIEW', color: 'bg-amber-500' },
  { id: 'DONE', color: 'bg-green-500' },
];

const PRIORITY_COLORS = {
  LOW: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  MEDIUM: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  HIGH: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  URGENT: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

export function KanbanBoard({ projectId, initialTasks }: { projectId: string; initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isPending, startTransition] = useTransition();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { t } = useLanguage();

  const getColumnTitle = (id: Status) => {
    switch (id) {
      case 'TODO': return t.board.todo;
      case 'IN_PROGRESS': return t.board.inProgress;
      case 'REVIEW': return t.board.review;
      case 'DONE': return t.board.done;
      default: return id;
    }
  };

  const getPriorityLabel = (p: Priority) => {
    switch (p) {
      case 'LOW': return t.board.priorityLow;
      case 'MEDIUM': return t.board.priorityMedium;
      case 'HIGH': return t.board.priorityHigh;
      case 'URGENT': return t.board.priorityUrgent;
      default: return p;
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceStatus = source.droppableId as Status;
    const destStatus = destination.droppableId as Status;

    // Optimistic update
    const newTasks = Array.from(tasks);
    const draggedTaskIndex = newTasks.findIndex(t => t.id === draggableId);
    if (draggedTaskIndex === -1) return;
    
    const draggedTask = newTasks[draggedTaskIndex];
    
    // Remove from source array visually
    newTasks.splice(draggedTaskIndex, 1);
    
    // Find where to insert
    const destTasks = newTasks.filter(t => t.status === destStatus).sort((a, b) => a.order_index - b.order_index);
    destTasks.splice(destination.index, 0, draggedTask);

    // Reorder dest tasks visually
    destTasks.forEach((t, i) => {
      const idx = newTasks.findIndex(nt => nt.id === t.id);
      if (idx !== -1) {
        newTasks[idx] = { ...newTasks[idx], status: destStatus, order_index: i };
      }
    });

    // Add dragged task back
    draggedTask.status = destStatus;
    draggedTask.order_index = destination.index;
    newTasks.push(draggedTask);

    setTasks(newTasks);

    // Server update
    startTransition(async () => {
      const res = await updateTaskStatus(draggableId, destStatus, destination.index);
      if (!res.success) {
        toast.error(t.toasts.error + ': ' + res.error);
        setTasks(initialTasks); // Rollback on error
      }
    });
  };

  const handleCreateTask = (status: Status) => {
    const title = window.prompt(t.board.taskTitlePlaceholder);
    if (!title) return;

    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('title', title);
    formData.append('status', status);

    startTransition(async () => {
      const res = await createTask(formData);
      if (res.success && res.task) {
        toast.success(t.toasts.success);
        setTasks([...tasks, res.task as Task]);
      } else {
        toast.error(t.toasts.error + ': ' + res.error);
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    const taskId = taskToDelete;
    
    // Optimistic
    setTasks(tasks.filter(t => t.id !== taskId));
    
    startTransition(async () => {
      const res = await deleteTask(taskId);
      if (!res.success) {
        toast.error(t.toasts.error + ': ' + res.error);
        setTasks(initialTasks);
      }
    });
  };

  return (
    <>
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden pb-4 gap-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent h-full">
        <DragDropContext onDragEnd={handleDragEnd}>
        {COLUMNS_CONFIG.map(column => (
          <div key={column.id} className="flex flex-col w-[280px] sm:w-[320px] shrink-0 snap-center h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-bold text-slate-200">{getColumnTitle(column.id)}</h3>
                <span className="text-xs font-semibold text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              <button 
                onClick={() => handleCreateTask(column.id)}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors"
                title={t.board.addTask}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto rounded-2xl bg-black/20 border border-white/[0.05] p-3 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-indigo-500/5 border-indigo-500/20' : ''
                  }`}
                >
                  <div className="space-y-3 min-h-[150px]">
                    {tasks
                      .filter(t => t.status === column.id)
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-[#12161f] border rounded-xl p-4 cursor-grab active:cursor-grabbing transition-shadow ${
                                snapshot.isDragging 
                                  ? 'shadow-2xl shadow-black/50 border-indigo-500/50 scale-[1.02]' 
                                  : 'border-white/[0.08] hover:border-indigo-500/30 shadow-lg'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-sm font-semibold text-white leading-snug">{task.title}</h4>
                                <div className="relative group/menu">
                                  <button className="text-slate-500 hover:text-white p-0.5">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  <div className="absolute right-0 top-full mt-1 hidden group-hover/menu:block bg-[#161c28] border border-white/10 rounded-lg shadow-xl z-10 w-28 py-1">
                                    <button 
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3 h-3" /> {t.common.delete}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {task.description && (
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                              )}
                              
                              <div className="flex items-center justify-between mt-4">
                                <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${PRIORITY_COLORS[task.priority]}`}>
                                  {getPriorityLabel(task.priority)}
                                </div>
                                {task.assignee && (
                                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-bold" title={task.assignee.full_name}>
                                    {task.assignee.full_name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>

    <ConfirmDialog
      isOpen={!!taskToDelete}
      onClose={() => setTaskToDelete(null)}
      onConfirm={confirmDeleteTask}
      title={t.common.delete}
      description={t.common.deleteConfirm}
      confirmText={t.common.delete}
      cancelText={t.common.cancel}
      isDestructive={true}
    />
    </>
  );
}
