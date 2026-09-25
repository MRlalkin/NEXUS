'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  requireVerificationText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  requireVerificationText,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [verificationInput, setVerificationInput] = React.useState('');

  const isVerificationValid = requireVerificationText 
    ? verificationInput === requireVerificationText 
    : true;

  const handleConfirm = async () => {
    if (!isVerificationValid) return;
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setVerificationInput('');
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0" />
        <Dialog.Content className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 animate-in fade-in-0 zoom-in-95 rounded-2xl shadow-2xl bg-[#0D111A]/95 backdrop-blur-2xl border ${isDestructive ? 'border-red-500/20' : 'border-white/10'}`}>
          <div className="flex flex-col gap-2">
            <Dialog.Title className="text-lg font-bold text-white flex items-center gap-2">
              {isDestructive && <AlertTriangle className="w-5 h-5 text-red-500" />}
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-slate-400">
              {description}
            </Dialog.Description>
          </div>

          {requireVerificationText && (
            <div className="mt-4">
              <label className="block text-xs text-slate-400 mb-2">
                Please type <span className="font-mono text-white bg-white/10 px-1 py-0.5 rounded select-all">{requireVerificationText}</span> to confirm.
              </label>
              <input
                type="text"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder={requireVerificationText}
              />
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !isVerificationValid}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg ${
                isDestructive 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 shadow-red-500/20 disabled:opacity-50 disabled:hover:bg-red-500/10' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/25 disabled:opacity-50'
              }`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
