'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';
import { OrbitHero } from './orbit-hero';
import { Card3D } from '@/components/ui/card-3d';
import { 
  Sparkles, 
  Zap, 
  Kanban, 
  Command, 
  Users, 
  BarChart3, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  Check, 
  HelpCircle, 
  Layers 
} from 'lucide-react';

export function LandingSections() {
  const { t } = useTranslation();

  return (
    <>
      {/* ======================================================== */}
      {/* 1. Section: How It Works & Spatial Orbit Architecture    */}
      {/* ======================================================== */}
      <section id="how-it-works" className="relative w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161B22] border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.howItWorks.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#F0F6FC] tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8B949E] leading-relaxed">
            {t.howItWorks.desc}
          </p>
        </div>

        {/* Orbit Component */}
        <div className="w-full">
          <OrbitHero />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. Section: Key Features                                 */}
      {/* ======================================================== */}
      <section id="features" className="relative w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161B22] border border-white/10 text-[#8B949E] text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.features.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] tracking-tight">
            {t.features.title}
          </h2>
          <p className="text-sm text-[#8B949E] mt-3">
            {t.features.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card3D glowColor="rgba(59, 130, 246, 0.2)" className="p-6 bg-[#0D1117]/80 border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2">
              {t.features.card1Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
              {t.features.card1Desc}
            </p>
          </Card3D>

          {/* Feature 2 */}
          <Card3D glowColor="rgba(96, 165, 250, 0.2)" className="p-6 bg-[#0D1117]/80 border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-300 mb-5">
              <Command className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2">
              {t.features.card2Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
              {t.features.card2Desc}
            </p>
          </Card3D>

          {/* Feature 3 */}
          <Card3D glowColor="rgba(59, 130, 246, 0.2)" className="p-6 bg-[#0D1117]/80 border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2">
              {t.features.card3Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
              {t.features.card3Desc}
            </p>
          </Card3D>

          {/* Feature 4 */}
          <Card3D glowColor="rgba(59, 130, 246, 0.2)" className="p-6 bg-[#0D1117]/80 border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2">
              {t.features.card4Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
              {t.features.card4Desc}
            </p>
          </Card3D>

          {/* Feature 5 */}
          <Card3D glowColor="rgba(96, 165, 250, 0.2)" className="p-6 bg-[#0D1117]/80 border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-300 mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2">
              {t.features.card5Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
              {t.features.card5Desc}
            </p>
          </Card3D>

          {/* Feature 6 */}
          <Card3D glowColor="rgba(59, 130, 246, 0.2)" className="p-6 bg-[#0D1117]/80 border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2">
              {t.features.card6Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
              {t.features.card6Desc}
            </p>
          </Card3D>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. Section: Security & Governance                        */}
      {/* ======================================================== */}
      <section id="security" className="relative w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="rounded-3xl bg-gradient-to-b from-[#0D1117] to-[#161B22] border border-white/10 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>{t.security.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F0F6FC] tracking-tight">
              {t.security.title}
            </h2>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              {t.security.desc}
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F0F6FC]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400" />
                <span>{t.security.item1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400" />
                <span>{t.security.item2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400" />
                <span>{t.security.item3}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400" />
                <span>{t.security.item4}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. Section: Transparent Pricing                          */}
      {/* ======================================================== */}
      <section id="pricing" className="relative w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161B22] border border-white/10 text-[#8B949E] text-xs font-semibold mb-4">
            <span>{t.pricing.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] tracking-tight">
            {t.pricing.title}
          </h2>
          <p className="text-sm text-[#8B949E] mt-3">
            {t.pricing.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl bg-[#0D1117] border border-white/10 p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B949E]">
                  {t.pricing.freeSub}
                </span>
                <h3 className="text-2xl font-black text-[#F0F6FC] mt-1">{t.pricing.freeTitle}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#F0F6FC]">{t.pricing.freePrice}</span>
                  <span className="text-xs text-[#8B949E]">{t.pricing.freePeriod}</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-[#8B949E]">
                {t.pricing.freeFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[#F0F6FC]">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-xl text-center text-xs font-semibold text-[#F0F6FC] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
            >
              {t.pricing.freeCta}
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#161B22] to-[#0D1117] border border-blue-500/40 p-8 flex flex-col justify-between shadow-2xl shadow-blue-500/10">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {t.pricing.proBadge}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {t.pricing.proSub}
                </span>
                <h3 className="text-2xl font-black text-[#F0F6FC] mt-1">{t.pricing.proTitle}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#F0F6FC]">{t.pricing.proPrice}</span>
                  <span className="text-xs text-[#8B949E]">{t.pricing.proPeriod}</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-[#8B949E]">
                {t.pricing.proFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[#F0F6FC]">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-xl text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all"
            >
              {t.pricing.proCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. Section: FAQ                                          */}
      {/* ======================================================== */}
      <section id="faq" className="relative w-full max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-white/10 text-xs text-[#8B949E] mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F0F6FC]">
            {t.faq.title}
          </h2>
        </div>

        <div className="space-y-4">
          {t.faq.items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0D1117] border border-white/10 space-y-2"
            >
              <h3 className="text-base font-bold text-[#F0F6FC]">
                {item.q}
              </h3>
              <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. Footer                                                */}
      {/* ======================================================== */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B949E] border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span>&copy; {new Date().getFullYear()} {t.footer.copyright}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>{t.footer.status}</span>
          </span>
          <Link href="/login" className="hover:text-[#F0F6FC] transition-colors">
            {t.footer.login}
          </Link>
          <Link href="/register" className="hover:text-[#F0F6FC] transition-colors">
            {t.footer.register}
          </Link>
        </div>
      </footer>
    </>
  );
}
