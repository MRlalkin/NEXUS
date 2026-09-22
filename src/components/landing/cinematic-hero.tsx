'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ArrowRight, 
  X, 
  Menu, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Kanban, 
  Users, 
  BarChart3, 
  Command, 
  Globe 
} from 'lucide-react';
import { useTranslation as useLanguage } from '@/context/language-context';

const SOCIAL_PROOF_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
];

export function CinematicHero() {
  const { lang, setLanguage, t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'kanban' | 'command' | 'rbac' | 'analytics'>('kanban');

  // Strict 0.65 playback speed for meditative high-tech smoothness
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  const navLinks = [
    { href: '#features', label: t.nav.features },
    { href: '#how-it-works', label: t.nav.howItWorks },
    { href: '#pricing', label: t.nav.pricing },
    { href: '#security', label: t.nav.security },
    { href: '#faq', label: t.nav.faq },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#090A0F] text-[#F0F6FC]">
      {/* ======================================================== */}
      {/* 1. Edge-to-Edge Glass Navigation Bar                     */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090A0F]/70 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-[1px] shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0D1117] rounded-[15px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              {/* Glowing Ambient Dot */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#090A0F] shadow-[0_0_10px_#3b82f6] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider text-[#F0F6FC] group-hover:text-white transition-colors">
                  NEXUS
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  SaaS
                </span>
              </div>
              <span className="text-[10px] text-[#8B949E] tracking-widest font-mono">
                SPATIAL WORKSPACE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Language Switcher & Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Language Switcher [ RU | EN ] */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#161B22] border border-white/10 shadow-inner">
              <Globe className="w-3.5 h-3.5 text-[#8B949E] ml-1.5 mr-0.5" />
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
                  lang === 'ru'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
                title="Русский язык"
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
                title="English language"
              >
                EN
              </button>
            </div>

            {/* Login Link */}
            <Link
              href="/login"
              className="text-sm font-semibold text-[#8B949E] hover:text-[#F0F6FC] transition-colors px-3 py-2"
            >
              {t.nav.login}
            </Link>

            {/* Pill CTA Button */}
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_28px_rgba(59,130,246,0.55)] transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>{t.nav.getStarted}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="flex items-center p-0.5 rounded-full bg-[#161B22] border border-white/10 text-xs">
              <button
                onClick={() => setLanguage(lang === 'ru' ? 'en' : 'ru')}
                className="px-2 py-0.5 font-bold text-blue-400"
              >
                {lang.toUpperCase()}
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#8B949E] hover:text-[#F0F6FC] bg-white/[0.04] border border-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-[#090A0F]/95 backdrop-blur-2xl px-6 py-6 space-y-4"
            >
              {/* Language Switcher in Mobile Drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-[#8B949E]">Язык интерфейса / Language</span>
                <div className="flex items-center gap-1 p-1 rounded-full bg-[#161B22] border border-white/10">
                  <button
                    onClick={() => setLanguage('ru')}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      lang === 'ru' ? 'bg-blue-600 text-white' : 'text-[#8B949E]'
                    }`}
                  >
                    RU
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      lang === 'en' ? 'bg-blue-600 text-white' : 'text-[#8B949E]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-[#8B949E] hover:text-[#F0F6FC] transition-colors py-1"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-[#F0F6FC] bg-white/[0.04] border border-white/10"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/25"
                >
                  {t.nav.getStarted} →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ======================================================== */}
      {/* 2. Hero Section: Dark Tech/SaaS Loop & Gradient Masks    */}
      {/* ======================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-start overflow-hidden">
        {/* Dark Tech Generative & Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Tech Video Loop */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-graphs-and-data-31913-large.mp4"
              type="video/mp4"
            />
            <source
              src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/abstract_dark_grid_tech.mp4"
              type="video/mp4"
            />
          </video>

          {/* Generative Dark Grid & Futuristic Wave Underlay */}
          <div className="absolute inset-0 bg-[#090A0F]/40 pointer-events-none" />

          {/* High-Tech Perspective Wireframe Mesh */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.25) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.25) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse at 70% 50%, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 70% 50%, black 20%, transparent 70%)',
            }}
          />

          {/* Glowing Electric Blue & Violet Atmospheric Centers */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* ---------------------------------------------------- */}
        {/* Strategic Gradient Masks (Dark UI per specifications)*/}
        {/* ---------------------------------------------------- */}
        {/* 1. Left Mask: Covers left 55% for guaranteed crisp typography */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] z-10 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/95 to-transparent pointer-events-none" />

        {/* 2. Top Mask: Vertical gradient beneath navbar */}
        <div className="absolute top-0 left-0 right-0 h-48 sm:h-64 z-10 bg-gradient-to-b from-[#090A0F] via-[#090A0F]/80 to-transparent pointer-events-none" />

        {/* 3. Bottom Mask: Mirrored transition to section below */}
        <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 z-10 bg-gradient-to-t from-[#090A0F] to-transparent pointer-events-none" />

        {/* ======================================================== */}
        {/* 3. Hero Content Container                                */}
        {/* ======================================================== */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 sm:py-24 w-full">
          <div className="max-w-2xl text-left">
            {/* Category Tag Pill */}
            <motion.div
              key={`badge-${lang}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#161B22]/80 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-ping" />
              <span>{t.hero.badge}</span>
            </motion.div>

            {/* Main Headline H1 */}
            <motion.h1
              key={`title-${lang}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F0F6FC] leading-[1.08]"
            >
              {t.hero.title1}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#93C5FD]">
                {t.hero.title2}
              </span>
            </motion.h1>

            {/* Description Subtitle */}
            <motion.p
              key={`desc-${lang}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="mt-6 text-base sm:text-lg text-[#8B949E] max-w-xl leading-relaxed"
            >
              {t.hero.desc}
            </motion.p>

            {/* Dual CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              {/* Primary CTA */}
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.55)] border border-blue-400/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary CTA: Showreel Modal Trigger */}
              <button
                onClick={() => setShowreelOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-semibold text-[#F0F6FC] bg-[#161B22]/80 hover:bg-[#161B22] border border-white/10 hover:border-white/25 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/40 group"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 fill-blue-400 ml-0.5" />
                </div>
                <span>{t.hero.ctaSecondary}</span>
              </button>
            </motion.div>

            {/* Social Proof Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Avatar Stack */}
              <div className="flex items-center -space-x-2.5">
                {SOCIAL_PROOF_AVATARS.map((avatar, idx) => (
                  <div
                    key={idx}
                    className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#090A0F] shadow-md shadow-black/50"
                  >
                    <Image
                      src={avatar}
                      alt={`Active user ${idx + 1}`}
                      fill
                      sizes="36px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Rating & Copy */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-xs text-[#F0F6FC]">
                  <span>{t.hero.statsTeam}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8B949E]">
                  <span className="flex text-amber-400">★★★★★</span>
                  <span>• {t.hero.statsRating}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. Interactive Showreel & Feature Modal                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showreelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowreelOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl -z-10"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl rounded-3xl bg-[#0D1117] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-left"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F0F6FC]">
                      {t.modal.title}
                    </h3>
                    <p className="text-xs text-[#8B949E]">
                      {t.modal.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowreelOpen(false)}
                  className="p-2 rounded-xl text-[#8B949E] hover:text-[#F0F6FC] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'kanban' as const, title: t.modal.tabs.kanbanTitle, badge: t.modal.tabs.kanbanBadge, icon: Kanban },
                  { id: 'command' as const, title: t.modal.tabs.commandTitle, badge: t.modal.tabs.commandBadge, icon: Command },
                  { id: 'rbac' as const, title: t.modal.tabs.rbacTitle, badge: t.modal.tabs.rbacBadge, icon: Users },
                  { id: 'analytics' as const, title: t.modal.tabs.analyticsTitle, badge: t.modal.tabs.analyticsBadge, icon: BarChart3 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500/40 text-[#F0F6FC] shadow-lg shadow-blue-500/10'
                          : 'bg-[#161B22]/50 border-white/[0.06] text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mb-2 ${
                          isSelected ? 'text-blue-400' : 'text-[#8B949E]'
                        }`}
                      />
                      <div className="text-xs font-semibold block truncate">
                        {tab.title}
                      </div>
                      <span className="text-[10px] text-blue-400 font-mono block mt-0.5">
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Preview Display */}
              <div className="p-6 rounded-2xl bg-[#161B22]/60 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#F0F6FC]">
                    {activeTab === 'kanban' && t.modal.tabs.kanbanTitle}
                    {activeTab === 'command' && t.modal.tabs.commandTitle}
                    {activeTab === 'rbac' && t.modal.tabs.rbacTitle}
                    {activeTab === 'analytics' && t.modal.tabs.analyticsTitle}
                  </h4>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {activeTab === 'kanban' && t.modal.tabs.kanbanBadge}
                    {activeTab === 'command' && t.modal.tabs.commandBadge}
                    {activeTab === 'rbac' && t.modal.tabs.rbacBadge}
                    {activeTab === 'analytics' && t.modal.tabs.analyticsBadge}
                  </span>
                </div>

                <p className="text-sm text-[#8B949E] leading-relaxed">
                  {activeTab === 'kanban' && t.modal.tabs.kanbanDesc}
                  {activeTab === 'command' && t.modal.tabs.commandDesc}
                  {activeTab === 'rbac' && t.modal.tabs.rbacDesc}
                  {activeTab === 'analytics' && t.modal.tabs.analyticsDesc}
                </p>

                {/* Feature Micro-Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/20 p-2.5 rounded-xl border border-white/[0.04]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{t.modal.bullets.b1}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/20 p-2.5 rounded-xl border border-white/[0.04]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{t.modal.bullets.b2}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/20 p-2.5 rounded-xl border border-white/[0.04]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{t.modal.bullets.b3}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/20 p-2.5 rounded-xl border border-white/[0.04]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{t.modal.bullets.b4}</span>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Controls */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#8B949E]">
                  {t.modal.freeNotice}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowreelOpen(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8B949E] hover:text-[#F0F6FC] bg-white/[0.04] border border-white/10"
                  >
                    {t.modal.close}
                  </button>
                  <Link
                    href="/register"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all"
                  >
                    <span>{t.modal.launch}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
