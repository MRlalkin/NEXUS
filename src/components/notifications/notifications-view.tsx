'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { markAsRead, deleteNotification } from '@/app/actions/notifications';
import { toast } from 'sonner';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Mail, 
  Layers, 
  ExternalLink, 
  Check, 
  Inbox 
} from 'lucide-react';
import type { NotificationItem } from '@/types/team';

interface NotificationsViewProps {
  initialNotifications: NotificationItem[];
}

export function NotificationsView({ initialNotifications }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [isPending, startTransition] = useTransition();

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    startTransition(async () => {
      const res = await markAsRead(id);
      if (res.success) {
        toast.success('Marked as read.');
      }
    });
  };

  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    startTransition(async () => {
      const res = await markAsRead();
      if (res.success) {
        toast.success('All notifications marked as read.');
      }
    });
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    startTransition(async () => {
      const res = await deleteNotification(id);
      if (res.success) {
        toast.success('Notification removed.');
      }
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'INVITATION':
        return <Mail className="w-5 h-5 text-indigo-400" />;
      case 'TASK':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bell className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-indigo-400" />
            <span>Notification Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stay up to date with project invitations, team activity, and system updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'ALL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'UNREAD'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border border-white/[0.08] space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No notifications</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filter === 'UNREAD'
              ? 'You have caught up with all your unread notifications.'
              : 'You do not have any notifications yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`glass-panel p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.is_read
                  ? 'border-white/[0.05] opacity-75'
                  : 'border-indigo-500/30 bg-[#12161f]/95 shadow-lg shadow-indigo-500/5'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {n.title}
                    </h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[11px] text-slate-500">
                      {new Date(n.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {n.link && (
                      <Link
                        href={n.link}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <span>Open destination</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/[0.04] transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
