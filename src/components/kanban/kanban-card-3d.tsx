'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Calendar, Trash2, AlertCircle, Clock, Zap } from 'lucide-react';
import type { TaskItem, TaskPriority } from '@/types/kanban';

interface KanbanCard3DProps {
  task: TaskItem;
  isDragging?: boolean;
  onDelete?: (taskId: string) => void;
}

export function KanbanCard3D({ task, isDragging = false, onDelete }: KanbanCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseX.set(clientX / rect.width - 0.5);
    mouseY.set(clientY / rect.height - 0.5);
    spotX.set(clientX);
    spotY.set(clientY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Volumetric neon lighting and glow styling based on priority
  const getPriorityTheme = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
        return {
          glowClass: isHovered ? 'glow-crimson' : 'border-rose-500/25',
          spotlightColor: 'rgba(239, 68, 68, 0.28)',
          badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: <AlertCircle className="w-3 h-3 text-rose-400" />,
          topGlowLine: 'from-rose-500/80 via-red-500/60 to-transparent',
        };
      case 'HIGH':
        return {
          glowClass: isHovered ? 'glow-amber' : 'border-amber-500/25',
          spotlightColor: 'rgba(245, 158, 11, 0.25)',
          badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <Zap className="w-3 h-3 text-amber-400" />,
          topGlowLine: 'from-amber-500/80 via-orange-500/60 to-transparent',
        };
      case 'MEDIUM':
        return {
          glowClass: isHovered ? 'glow-indigo' : 'border-indigo-500/25',
          spotlightColor: 'rgba(99, 102, 241, 0.25)',
          badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          icon: <Clock className="w-3 h-3 text-indigo-400" />,
          topGlowLine: 'from-indigo-500/80 via-violet-500/60 to-transparent',
        };
      case 'LOW':
      default:
        return {
          glowClass: isHovered ? 'glow-cyan' : 'border-cyan-500/20',
          spotlightColor: 'rgba(6, 182, 212, 0.22)',
          badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          icon: <Clock className="w-3 h-3 text-cyan-400" />,
          topGlowLine: 'from-cyan-500/80 via-blue-500/60 to-transparent',
        };
    }
  };

  const theme = getPriorityTheme(task.priority);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isDragging && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 w-full select-none"
    >
      <motion.div
        style={{
          rotateX: isDragging ? 0 : rotateX,
          rotateY: isDragging ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isDragging ? 1.05 : isHovered ? 1.02 : 1,
          z: isDragging ? 50 : isHovered ? 25 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`cyber-glass rounded-2xl p-4 transition-all duration-300 relative overflow-hidden ${
          theme.glowClass
        } ${isDragging ? 'shadow-2xl shadow-indigo-500/20 ring-1 ring-indigo-400/50' : ''}`}
      >
        {/* Accent Edge Glow Top Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${theme.topGlowLine} opacity-80`}
        />

        {/* Dynamic Cursor Spotlight */}
        {!isDragging && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-200 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              background: useTransform(
                [spotX, spotY],
                ([x, y]) =>
                  `radial-gradient(280px circle at ${x}px ${y}px, ${theme.spotlightColor}, transparent 80%)`
              ),
            }}
          />
        )}

        {/* Card Header: Priority & Delete Action */}
        <div
          style={{ transform: isHovered ? 'translateZ(20px)' : 'none' }}
          className="flex items-center justify-between gap-2 mb-2.5 transition-transform duration-200"
        >
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${theme.badgeClass}`}
          >
            {theme.icon}
            <span>{task.priority}</span>
          </span>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Task Title & Description */}
        <div
          style={{ transform: isHovered ? 'translateZ(15px)' : 'none' }}
          className="space-y-1 transition-transform duration-200"
        >
          <h4 className="text-sm font-semibold text-white tracking-wide leading-snug line-clamp-2">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Card Footer: Deadline & Assignee */}
        <div
          style={{ transform: isHovered ? 'translateZ(25px)' : 'none' }}
          className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2 text-xs transition-transform duration-200"
        >
          {/* Deadline */}
          {task.deadline ? (
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {new Date(task.deadline).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-600">No deadline</span>
          )}

          {/* Assignee Avatar */}
          {task.assignee ? (
            <div
              className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20 bg-slate-800"
              title={`Assigned to ${task.assignee.full_name}`}
            >
              <Image
                src={
                  task.assignee.avatar_url ||
                  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
                    task.assignee.username || task.assignee.full_name
                  )}`
                }
                alt={task.assignee.full_name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div
              className="w-6 h-6 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[10px] text-slate-500"
              title="Unassigned"
            >
              -
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
