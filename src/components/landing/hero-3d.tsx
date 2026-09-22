'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for Spline to prevent SSR hydration mismatches
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <Procedural3DCanvas />,
});

/**
 * Procedural interactive 3D particle and geometric wireframe canvas
 * Serves as a high-performance 60 FPS interactive visual scene
 */
function Procedural3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', onResize);

    // 3D Nodes representing an interactive rotating hyper-spatial mesh
    const nodeCount = 45;
    const nodes: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 500,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angleX += 0.002;
      angleY += 0.003;

      const fov = 400;
      const projected = nodes.map((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (Math.abs(node.x) > 260) node.vx *= -1;
        if (Math.abs(node.y) > 220) node.vy *= -1;
        if (Math.abs(node.z) > 260) node.vz *= -1;

        // Rotate around Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;

        // Rotate around X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX;

        const distance = z2 + 600;
        const scale = fov / Math.max(distance, 1);
        const x2D = x1 * scale + width / 2;
        const y2D = y2 * scale + height / 2;

        return { x: x2D, y: y2D, scale, z: z2 };
      });

      // Draw wireframe connecting lines
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing nodes
      projected.forEach((p) => {
        const radius = Math.max(1, p.scale * 2.2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.85)';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

export function Hero3D() {
  const [useSpline, setUseSpline] = useState(false);

  return (
    <div className="relative w-full overflow-hidden pt-12 pb-24 lg:py-20 flex flex-col items-center">
      {/* Background Spatial Ambience */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-cyan-500/10 blur-[140px] rounded-full -z-10" />

      {/* Cyber Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full cyber-glass text-indigo-300 text-xs font-semibold mb-8 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
        </span>
        <span className="tracking-wide">DEEP SPATIAL 3.0 &bull; ENTERPRISE WORKSPACE</span>
      </motion.div>

      {/* Hero Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-center tracking-tight text-white max-w-5xl leading-[1.1] px-4"
      >
        Next-Generation SaaS for{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
          Spatial Project Intelligence
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-6 text-sm sm:text-lg text-slate-400 text-center max-w-2xl px-6 leading-relaxed"
      >
        Coordinate high-impact teams with interactive 3D Kanban boards, role-based governance, and frictionless drag-and-drop velocity.
      </motion.p>

      {/* Neon Trail CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-20"
      >
        {/* Primary CTA with Neon Trail */}
        <Link
          href="/register"
          className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <span className="relative z-10">Начать бесплатно</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300 -z-10" />
        </Link>

        {/* Secondary Glass CTA */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-slate-200 cyber-glass hover:border-white/25 hover:scale-[1.02] transition-all duration-200"
        >
          <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
          <span>Посмотреть демо</span>
        </Link>
      </motion.div>

      {/* Interactive 3D Visual Stage with Floating Widgets */}
      <div className="relative w-full max-w-5xl h-[480px] sm:h-[560px] mt-12 mx-auto px-4 flex items-center justify-center">
        {/* 3D Scene Viewport */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/[0.08] cyber-glass shadow-2xl shadow-indigo-500/10">
          <Suspense fallback={<Procedural3DCanvas />}>
            {useSpline ? (
              <Spline
                scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                onError={() => setUseSpline(false)}
              />
            ) : (
              <Procedural3DCanvas />
            )}
          </Suspense>
        </div>

        {/* Floating Glass Statistic Widget 1 (Top Left) */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 left-4 sm:left-8 cyber-glass p-4 rounded-2xl border border-white/10 shadow-2xl z-20 max-w-[210px] hidden sm:block pointer-events-none"
        >
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Zap className="w-4 h-4" />
            <span>Velocity Index</span>
          </div>
          <div className="text-2xl font-black text-white">99.4%</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <span>+14.2% faster turnaround</span>
          </div>
        </motion.div>

        {/* Floating Glass Statistic Widget 2 (Top Right) */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-10 right-4 sm:right-8 cyber-glass p-4 rounded-2xl border border-white/10 shadow-2xl z-20 max-w-[210px] hidden sm:block pointer-events-none"
        >
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <Activity className="w-4 h-4" />
            <span>Live Workspace Sync</span>
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <span>60 FPS Spatial</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Optimistic drag-and-drop
          </div>
        </motion.div>

        {/* Floating Glass Statistic Widget 3 (Bottom Center / Left) */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute -bottom-5 left-12 cyber-glass p-3.5 rounded-2xl border border-white/10 shadow-2xl z-20 hidden md:flex items-center gap-3 pointer-events-none"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Role-Based Governance</div>
            <div className="text-[10px] text-slate-400">Supabase SSR Security Active</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
