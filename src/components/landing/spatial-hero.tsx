/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, Activity, Play, CheckCircle2, Circle } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { InteractiveGridCanvas } from './interactive-grid-canvas';
import { Floating3DCard } from './floating-3d-card';
import Link from 'next/link';

export function SpatialHero() {
  const { t: typedT } = useLanguage();
  const t = typedT as any;
  const [taskStatus, setTaskStatus] = useState<'progress' | 'done'>('progress');

  const handleTaskClick = () => {
    setTaskStatus(taskStatus === 'progress' ? 'done' : 'progress');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#06080D]">
      {/* 3D Kinetic Background */}
      <InteractiveGridCanvas />
      
      {/* Ambient Radial Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-28 lg:pt-0">
        
        {/* Left Column: Typography & CTAs */}
        <div className="flex flex-col items-start text-left space-y-8">
          
          {/* Top Bar: Nav/Logo & Language Switcher */}
          <nav className="absolute top-8 left-6 lg:left-8 right-6 lg:right-8 flex justify-between items-center w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] max-w-7xl mx-auto z-50 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-40 animate-pulse" />
                <Zap className="w-4 h-4 text-blue-400 relative z-10" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">NEXUS</span>
            </div>

            <div className="flex items-center gap-6 pointer-events-auto">
              <LanguageToggle />
              <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden sm:block cursor-pointer">
                {t.nav.login}
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-400 text-xs font-medium uppercase tracking-wider relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
            <span className="relative z-10">{t.hero.badge}</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="block text-[#F0F6FC]">{t.hero.title1}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F0F6FC] via-[#60A5FA] to-[#3B82F6]">
              {t.hero.title2}
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
            {t.hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
            <Link 
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out -translate-x-[150%]" />
              <span className="relative z-10">{t.hero.ctaPrimary}</span>
            </Link>
            
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900/50 hover:bg-zinc-800/80 backdrop-blur-md border border-white/10 hover:border-white/20 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
              <Play className="w-4 h-4 text-blue-400" />
              {t.hero.ctaSecondary}
            </button>
          </div>

          <div className="flex items-center gap-6 pt-8 border-t border-white/5 w-full">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">500+</span>
              <span className="text-xs text-zinc-500">{t.hero.statsTeam}</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">3x</span>
              <span className="text-xs text-zinc-500">{t.hero.statsRating}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Spatial Canvas */}
        <div className="relative w-full h-[600px] hidden lg:block">
          <Floating3DCard className="w-full h-full flex items-center justify-center">
            
            {/* Base Layer: Kanban Board */}
            <div 
              className="absolute w-[500px] h-[400px] bg-[#0D1117]/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6 flex gap-4"
              style={{ transform: 'translateZ(0px)' }}
            >
              {/* Columns */}
              {['TODO', 'IN PROGRESS', 'DONE'].map((col, idx) => (
                <div key={col} className="flex-1 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-zinc-500 tracking-wider flex items-center justify-between">
                    {col}
                    <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-zinc-400">{idx === 1 ? 1 : 0}</span>
                  </div>
                  {/* Empty slots for visual structure */}
                  <div className="w-full h-20 rounded-lg border border-white/5 bg-white/[0.02]" />
                  {idx === 0 && <div className="w-full h-24 rounded-lg border border-white/5 bg-white/[0.02]" />}
                </div>
              ))}
            </div>

            {/* Floating Layer 1: Interactive Task Card (Z: 40px) */}
            <div 
              onClick={handleTaskClick}
              className="absolute left-[25%] top-[35%] w-[280px] bg-[#161B22] border border-blue-500/30 rounded-xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer hover:border-blue-400/50 hover:bg-[#1C2128] transition-all duration-300 group z-20"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${taskStatus === 'done' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse'}`} />
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    {taskStatus === 'done' ? t.hero.demoTaskDone : t.hero.demoTaskStatus}
                  </span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/10 z-10" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border border-white/10 z-0" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-white mb-2 leading-tight">
                {t.hero.demoTaskTitle}
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${taskStatus === 'done' ? 'bg-green-500 w-full' : 'bg-blue-500 w-[45%]'}`}
                  />
                </div>
                <div className="relative w-4 h-4">
                  <CheckCircle2 className={`absolute inset-0 w-4 h-4 text-green-500 transition-all duration-300 ${taskStatus === 'done' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                  <Circle className={`absolute inset-0 w-4 h-4 text-blue-500 transition-all duration-300 ${taskStatus === 'done' ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`} />
                </div>
              </div>
            </div>

            {/* Floating Layer 2: Analytics Widget (Z: 70px) */}
            <div 
              className="absolute -right-4 top-1/4 w-[180px] bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[0_30px_50px_rgba(0,0,0,0.5)] z-30 flex flex-col gap-2"
              style={{ transform: 'translateZ(70px)' }}
            >
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{t.hero.demoVelocity}</span>
                <Activity className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white flex items-end gap-2">
                +42%
                <span className="text-[10px] text-emerald-400 mb-1">vs last week</span>
              </div>
              {/* Mini Sparkline SVG */}
              <svg className="w-full h-8 mt-1 overflow-visible" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="neon-green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(52, 211, 153, 0.4)" />
                    <stop offset="100%" stopColor="rgba(52, 211, 153, 0)" />
                  </linearGradient>
                </defs>
                <path d="M0,30 L0,20 Q10,25 20,15 T40,10 T60,18 T80,5 L100,2 L100,30 Z" fill="url(#neon-green)" />
                <path d="M0,20 Q10,25 20,15 T40,10 T60,18 T80,5 L100,2" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
              </svg>
            </div>

            {/* Floating Layer 3: Team Badge (Z: 90px) */}
            <div 
              className="absolute left-10 bottom-1/4 bg-[#0D1117]/90 backdrop-blur-md border border-white/10 rounded-full py-2 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-40 flex items-center gap-3"
              style={{ transform: 'translateZ(90px)' }}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  AL
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0D1117] shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Alex Lead</span>
                <span className="text-[10px] text-zinc-500">Online</span>
              </div>
            </div>

          </Floating3DCard>
        </div>
      </div>
    </div>
  );
}
