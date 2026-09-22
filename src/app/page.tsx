import { SpatialHero } from '@/components/landing/spatial-hero';
import { LandingSections } from '@/components/landing/landing-sections';

export const metadata = {
  title: 'NEXUS — Spatial Cyber-Glass SaaS Platform',
  description: 'Your projects. One powerful workspace. Modern spatial project and team management with 3D interfaces and real-time collaboration.',
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#06080D] text-[#F0F6FC] flex flex-col justify-between overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-200">
      {/* Subtle background ambient glows */}
      <div className="pointer-events-none fixed top-0 left-0 w-[550px] h-[550px] bg-blue-600/5 blur-[160px] rounded-full -z-10" />
      <div className="pointer-events-none fixed top-1/3 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[180px] rounded-full -z-10" />
      <div className="pointer-events-none fixed bottom-0 left-1/4 w-[700px] h-[400px] bg-blue-500/5 blur-[180px] rounded-full -z-10" />

      {/* 1. Spatial Hero with 3D Cyber-Glass Workspace */}
      <SpatialHero />

      {/* 2. Fully Translated Landing Sections (How it works, Features, Security, Pricing, FAQ, Footer) */}
      <LandingSections />
    </div>
  );
}
