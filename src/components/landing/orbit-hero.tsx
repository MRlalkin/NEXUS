'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  GitPullRequest, 
  Sparkles, 
  Activity, 
  Flame, 
  Cpu, 
  ArrowUpRight, 
  ShieldCheck 
} from 'lucide-react';

interface OrbitHeroProps {
  className?: string;
}

export function OrbitHero({ className }: OrbitHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation & Parallax States
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Mouse tilt offsets
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });

  // Continuous 60 FPS smooth rotation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // When hovering over a card, rotate very slowly (0.05x), otherwise smooth standard orbit speed (~7 deg/sec)
      const speed = isHovered ? 2.5 : 7.0;
      setRotation((prev) => (prev + speed * delta) % 360);

      // Smooth interpolation for mouse parallax tilt
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.08;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.08;
      setMouseTilt({ x: currentTilt.current.x, y: currentTilt.current.y });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  // Mouse move handler for container parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    targetTilt.current = {
      x: -y * 18, // rotateX
      y: x * 24,  // rotateY
    };
  };

  const handleMouseLeave = () => {
    targetTilt.current = { x: 0, y: 0 };
    setIsHovered(false);
    setHoveredIndex(null);
  };

  const orbitRadius = 370; // 3D cylinder orbit radius in px

  // 6 Real Mini-Widgets distributed evenly (every 60 degrees)
  const screens = [
    // 1. Task Card: Deploy API
    {
      id: 'task-deploy',
      angle: 0,
      render: (isCardHovered: boolean) => (
        <div
          className={`p-4 rounded-2xl w-[260px] h-[155px] flex flex-col justify-between transition-all duration-300 ${
            isCardHovered
              ? 'border-amber-400/70 shadow-2xl shadow-amber-500/25 bg-[#0f1422]/90'
              : 'border-amber-500/30 bg-[#0d111d]/75 shadow-lg shadow-amber-500/10'
          } border backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-orange-400 to-transparent" />
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                TASK #108
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>DONE</span>
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Deploy Edge API &amp; Redis
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Production migration completed
            </p>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/[0.06] pt-2">
            <span className="text-amber-400 font-medium">Sprint 42</span>
            <span>2 mins ago</span>
          </div>
        </div>
      ),
    },

    // 2. Sprint Velocity Chart
    {
      id: 'sprint-chart',
      angle: 60,
      render: (isCardHovered: boolean) => (
        <div
          className={`p-4 rounded-2xl w-[260px] h-[155px] flex flex-col justify-between transition-all duration-300 ${
            isCardHovered
              ? 'border-indigo-400/70 shadow-2xl shadow-indigo-500/25 bg-[#0f1422]/90'
              : 'border-indigo-500/30 bg-[#0d111d]/75 shadow-lg shadow-indigo-500/10'
          } border backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-400 to-transparent" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Velocity Velocity
              </span>
              <div className="text-lg font-black text-white flex items-center gap-1.5">
                <span>94.8 SP</span>
                <span className="text-[11px] text-emerald-400 font-semibold">+24%</span>
              </div>
            </div>
            <div className="p-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          {/* Mini Sparkline SVG curve */}
          <div className="w-full h-12 relative my-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 35 Q 30 20, 60 28 T 120 15 T 160 8 L 200 4 L 200 40 L 0 40 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 0 35 Q 30 20, 60 28 T 120 15 T 160 8 L 200 4"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Team Efficiency</span>
            <span className="text-indigo-300 font-semibold">Optimal</span>
          </div>
        </div>
      ),
    },

    // 3. Member Activity: Anna reviewed PR
    {
      id: 'activity-review',
      angle: 120,
      render: (isCardHovered: boolean) => (
        <div
          className={`p-4 rounded-2xl w-[260px] h-[155px] flex flex-col justify-between transition-all duration-300 ${
            isCardHovered
              ? 'border-cyan-400/70 shadow-2xl shadow-cyan-500/25 bg-[#0f1422]/90'
              : 'border-cyan-500/30 bg-[#0d111d]/75 shadow-lg shadow-cyan-500/10'
          } border backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-cyan-500/20 border border-cyan-400/40 flex-shrink-0">
              <Image
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Anna"
                alt="Anna"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-white truncate">Anna Vance</h5>
              <span className="text-[10px] text-cyan-400 font-medium">Lead Architect</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
            <GitPullRequest className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-200 truncate">
              Approved PR #142 (Auth Core)
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/[0.05] pt-1.5">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>CI Checks Passed</span>
            </span>
            <span>Just now</span>
          </div>
        </div>
      ),
    },

    // 4. Pricing Badge: NEXUS PRO $9/mo
    {
      id: 'pricing-badge',
      angle: 180,
      render: (isCardHovered: boolean) => (
        <div
          className={`p-4 rounded-2xl w-[260px] h-[155px] flex flex-col justify-between transition-all duration-300 ${
            isCardHovered
              ? 'border-violet-400/70 shadow-2xl shadow-violet-500/25 bg-[#0f1422]/90'
              : 'border-violet-500/30 bg-[#0d111d]/75 shadow-lg shadow-violet-500/10'
          } border backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-violet-600 text-white">
              NEXUS PRO
            </span>
            <span className="flex items-center gap-0.5 text-amber-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>POPULAR</span>
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">$9</span>
              <span className="text-xs text-slate-400">/ user / mo</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Unlimited 3D Boards &bull; RBAC Governance
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-violet-300 pt-2 border-t border-white/[0.06]">
            <span>Active Subscription</span>
            <span className="text-emerald-400">Verified &bull; Stripe</span>
          </div>
        </div>
      ),
    },

    // 5. Progress Indicator: 84%
    {
      id: 'progress-core',
      angle: 240,
      render: (isCardHovered: boolean) => (
        <div
          className={`p-4 rounded-2xl w-[260px] h-[155px] flex flex-col justify-between transition-all duration-300 ${
            isCardHovered
              ? 'border-emerald-400/70 shadow-2xl shadow-emerald-500/25 bg-[#0f1422]/90'
              : 'border-emerald-500/30 bg-[#0d111d]/75 shadow-lg shadow-emerald-500/10'
          } border backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Q3 Sprint Milestone
            </span>
            <span className="text-xs font-bold text-emerald-400">84%</span>
          </div>

          <div className="my-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white mb-1.5">
              <span>Core Engine Release</span>
              <span className="text-[11px] text-slate-400">21/25 Tasks</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-sm shadow-emerald-500/50"
                style={{ width: '84%' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/[0.05] pt-1.5">
            <span>Target: Oct 1</span>
            <span className="text-emerald-400 font-medium">On Track</span>
          </div>
        </div>
      ),
    },

    // 6. SLA & Health Metric: 12ms Latency
    {
      id: 'health-sla',
      angle: 300,
      render: (isCardHovered: boolean) => (
        <div
          className={`p-4 rounded-2xl w-[260px] h-[155px] flex flex-col justify-between transition-all duration-300 ${
            isCardHovered
              ? 'border-blue-400/70 shadow-2xl shadow-blue-500/25 bg-[#0f1422]/90'
              : 'border-blue-500/30 bg-[#0d111d]/75 shadow-lg shadow-blue-500/10'
          } border backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-cyan-400 to-transparent" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Cluster Health
              </span>
            </div>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="my-1 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-black text-white">12ms</div>
              <div className="text-[10px] text-slate-400">Global Edge Latency</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-cyan-300">99.99%</div>
              <div className="text-[10px] text-slate-400">Uptime SLA</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/[0.05] pt-1.5">
            <span>24 Nodes Operational</span>
            <span className="text-emerald-400">Zero Anomalies</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-5xl h-[560px] sm:h-[640px] mx-auto flex items-center justify-center select-none ${className || ''}`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D Orbit Carousel Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* ======================================================== */}
        {/* LAYER 1: Central Core Focus (System Health & Sprint Velocity Widget) */}
        {/* ======================================================== */}
        <div
          className="absolute z-10 flex items-center justify-center pointer-events-auto cursor-pointer group"
          style={{
            transform: 'translateZ(0px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Radial Ambient Energy Halos (Keep for depth) */}
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

          {/* SaaS Widget Container */}
          <div className="relative w-72 sm:w-80 bg-[#0f141f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl hover:border-blue-500/30 transition-all">
            
            {/* 1. Заголовок и статус */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Sprint Velocity & AI Copilot</h3>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  LIVE WORKSPACE
                </span>
              </div>
            </div>

            {/* 2. Метрики */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Блок 1 */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-zinc-400 font-medium mb-1">Завершено задач</div>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-xl font-bold text-white leading-none">88%</span>
                  <span className="text-[10px] text-emerald-400 font-semibold mb-0.5">+14%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] w-[88%]" />
                </div>
              </div>
              {/* Блок 2 */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
                <div className="text-[10px] text-zinc-400 font-medium mb-1">PostgreSQL & RLS</div>
                <div className="flex items-center gap-2 mt-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Secured 100%</span>
                </div>
              </div>
            </div>

            {/* 3. Интерактивный мини-график активности (Sparkline) */}
            <div className="w-full h-12 mb-4 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="neon-blue-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 35 Q 20 15, 40 25 T 80 15 T 120 28 T 160 10 L 200 18 L 200 40 L 0 40 Z"
                  fill="url(#neon-blue-grad)"
                />
                <path
                  d="M 0 35 Q 20 15, 40 25 T 80 15 T 120 28 T 160 10 L 200 18"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_5px_rgba(96,165,250,0.6)]"
                />
              </svg>
            </div>

            {/* 4. Плашка быстрого действия */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 flex items-center justify-between hover:bg-blue-500/15 transition-colors cursor-pointer group/btn">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚡</span>
                <span className="text-xs font-medium text-blue-100">AI распределил 4 задачи по приоритетам</span>
              </div>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest group-hover/btn:text-blue-300">Автоматизировано</span>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* LAYER 2: Orbiting 3D Glass Screens Carousel              */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {screens.map((screen, index) => {
            const isCardHovered = hoveredIndex === index;

            // Calculate card angle relative to camera view to adjust depth & opacity
            const netAngle = ((rotation + screen.angle) % 360 + 360) % 360;
            // Front is ~0 or ~360 deg, Back is ~180 deg
            const isBackside = netAngle > 95 && netAngle < 265;
            const opacity = isBackside ? 0.35 : 1;

            return (
              <div
                key={screen.id}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setHoveredIndex(index);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredIndex(null);
                }}
                className="absolute flex items-center justify-center pointer-events-auto cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${screen.angle}deg) translateZ(${
                    isCardHovered ? orbitRadius + 45 : orbitRadius
                  }px) scale(${isCardHovered ? 1.08 : 1})`,
                  opacity,
                  transition: 'transform 0.25s ease-out, opacity 0.3s ease-out',
                  zIndex: isBackside ? 1 : 20,
                }}
              >
                {screen.render(isCardHovered)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
