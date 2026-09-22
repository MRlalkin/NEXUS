'use client';

import React, { useRef, useState, useEffect } from 'react';

interface Floating3DCardProps {
  children: React.ReactNode;
  className?: string;
}

export function Floating3DCard({ children, className = '' }: Floating3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Don't tilt on touch devices usually by checking if pointer-events is mouse, but
      // simple hover state with event listeners is fine for desktop.
      if (!cardRef.current || !isHovered) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate rotation based on mouse position relative to center
      const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 12; // Max 12 deg
      const rotateX = -((mouseY - centerY) / (rect.height / 2)) * 12; // Max 12 deg

      setRotation({ x: rotateX, y: rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.02 : 1})`,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
      }}
    >
      {children}
    </div>
  );
}
