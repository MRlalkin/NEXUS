'use client';

import { useState, useTransition } from 'react';
import { Save, Trash2, AlertTriangle } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLanguage } from '@/context/language-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
// Note: assuming a deleteProject action exists or we can just call an API / supabase here
import { createClient } from '@/lib/supabase/client';

interface ProjectSettingsProps {
  project: {
    id: string;
    name: string;
    description: string | null;
  };
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    // In a real app you might use a server action here, but we will use supabase client for now 
    // unless there is a deleteProject action available. Let's try calling a generic API or supabase directly.
    const { error } = await supabase.from('projects').delete().eq('id', project.id);
    
    setIsDeleting(false);
    
    if (error) {
      toast.error(t.toasts?.error || 'Error deleting project');
    } else {
      toast.success(t.toasts?.success || 'Project deleted');
      setIsConfirmOpen(false);
      router.push('/dashboard/projects');
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Project Name
            </label>
            <input
              defaultValue={project.name}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              defaultValue={project.description || ''}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 transition-all text-sm resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end border-t border-white/[0.05]">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5">
        <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" />
          Danger Zone
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Deleting a project is irreversible. All tasks, comments, and files will be permanently deleted.
        </p>
        <button 
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-rose-500/25"
        >
          <Trash2 className="w-4 h-4" />
          Delete Project
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title={t.common?.delete || 'Delete Project'}
        description={t.common?.deleteConfirm || 'Are you sure you want to delete this project? This action cannot be undone.'}
        confirmText={t.common?.delete || 'Delete Project'}
        cancelText={t.common?.cancel || 'Cancel'}
        isDestructive={true}
        requireVerificationText={project.name}
      />
    </div>
  );
}
