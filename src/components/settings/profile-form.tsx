'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { updateProfile } from '@/app/actions/profile';
import { toast } from 'sonner';
import { 
  User, 
  AtSign, 
  Mail, 
  FileText, 
  Loader2, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

interface ProfileFormProps {
  initialProfile: {
    fullName: string;
    username: string;
    email: string;
    bio: string;
    avatarUrl: string;
  };
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [username, setUsername] = useState(initialProfile.username);
  const [bio, setBio] = useState(initialProfile.bio);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl);

  const currentAvatar =
    avatarUrl ||
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(username || 'user')}`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('username', username);
    formData.append('bio', bio);
    formData.append('avatarUrl', avatarUrl);

    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success(res.message || 'Profile updated successfully!');
      } else {
        toast.error(res.error || 'Failed to update profile.');
      }
    });
  };

  const handleRandomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}`;
    setAvatarUrl(newAvatar);
    toast.info('New avatar generated! Click Save to apply.');
  };

  return (
    <div className="cyber-glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-transparent" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/[0.06]">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-indigo-500/40 bg-slate-800 flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <Image
              src={currentAvatar}
              alt="Avatar preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Profile Photo</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Procedurally generated digital avatar linked to your unique workspace handle.
            </p>
            <button
              type="button"
              onClick={handleRandomizeAvatar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Randomize Avatar</span>
            </button>
          </div>
        </div>

        {/* Name & Username Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Workspace Handle *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="alex_mercer"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Email Address (Read-only) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Account Email (Immutable)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              readOnly
              disabled
              value={initialProfile.email}
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm opacity-60 cursor-not-allowed text-slate-400"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            About You / Bio
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full-stack engineer building high-velocity spatial systems..."
              className="glass-input w-full p-3 rounded-xl text-sm resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
