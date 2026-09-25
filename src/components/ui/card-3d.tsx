'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  enableSpotlight?: boolean;
}

export function Card3D({
  children,
  className,
  glowColor = 'rgba(99, 102, 241, 0.18)',
  maxTilt = 15,
  enableSpotlight = true,
  ...props
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth tilt motion
  const springConfig = { damping: 20, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map normalized mouse coordinates to rotation degrees
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Spotlight position coordinates in pixels
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Normalize between -0.5 and 0.5
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);

    spotX.set(clientX);
    spotY.set(clientY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const spotlightBackground = useTransform(
    [spotX, spotY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${glowColor}, transparent 75%)`
  );

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 w-full"
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={cn(
          'cyber-glass relative rounded-2xl overflow-hidden transition-shadow duration-300',
          className
        )}
      >
        {/* Dynamic Cursor Spotlight Effect */}
        {enableSpotlight && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              background: spotlightBackground,
            }}
          />
        )}

        {/* Card Content with 3D Parallax Depth */}
        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Child wrapper to give specific inner elements higher 3D elevation
 */
export function Card3DItem({
  children,
  depth = 40,
  className,
  ...props
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
      }}
      className={cn('transition-transform duration-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}
