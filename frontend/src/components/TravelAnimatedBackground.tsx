import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * TravelAnimatedBackground
 * Built following `modern-web-guidance` best practices:
 * - `efficient-background-processing`: Pauses RAF loop when off-screen (IntersectionObserver / content-visibility) and when tab is inactive (document.visibilitychange).
 * - `prefers-reduced-motion`: Respects accessibility preferences.
 * - Multi-layer travel aesthetic: Ambient aurora gradient mesh + interactive canvas particles + subtle drifting travel planes & stars.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  color: string;
}

interface TravelDrifter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  type: 'plane' | 'star' | 'compass';
  alpha: number;
}

interface TravelAnimatedBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant';
  showDrifters?: boolean;
}

export default function TravelAnimatedBackground({
  className = '',
  intensity = 'vibrant',
  showDrifters = true,
}: TravelAnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(true);

  // Mouse position for gentle parallax interaction
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check accessibility reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Track mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = x * 30; // max 30px shift
    mouseRef.current.targetY = y * 30;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let drifters: TravelDrifter[] = [];

    const colors = [
      'rgba(6, 182, 212, ',   // cyan-500
      'rgba(20, 184, 166, ',  // teal-500
      'rgba(56, 189, 248, ',  // sky-400
      'rgba(245, 158, 11, ',  // amber-500 (sunset accent)
      'rgba(147, 197, 253, ', // blue-300
    ];

    const resize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 14000), 70);

      for (let i = 0; i < count; i++) {
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.6 + 0.2,
          pulseSpeed: Math.random() * 0.02 + 0.008,
          color: colorBase,
        });
      }

      if (showDrifters) {
        drifters = [];
        const drifterCount = Math.max(3, Math.min(6, Math.floor(width / 300)));
        for (let j = 0; j < drifterCount; j++) {
          const typeChoice: 'plane' | 'star' | 'compass' =
            j % 3 === 0 ? 'plane' : j % 3 === 1 ? 'star' : 'compass';
          drifters.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0.25 + Math.random() * 0.35,
            vy: (Math.random() - 0.5) * 0.15,
            size: typeChoice === 'plane' ? 14 : 10,
            angle: Math.random() * Math.PI * 2,
            type: typeChoice,
            alpha: 0.35 + Math.random() * 0.35,
          });
        }
      }
    };

    // Draw miniature paper plane silhouette
    const drawPlane = (x: number, y: number, size: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(0.35); // Slight upward tilt
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(-size, -size * 0.5);
      ctx.lineTo(-size * 0.4, 0);
      ctx.lineTo(-size, size * 0.5);
      ctx.closePath();
      ctx.fill();

      // Wing crease
      ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, 0);
      ctx.lineTo(size, 0);
      ctx.stroke();

      ctx.restore();
    };

    // Draw 4-point twinkling wanderlust star
    const drawStar = (x: number, y: number, size: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        ctx.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Draw miniature travel compass rose
    const drawCompass = (x: number, y: number, size: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.7})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.stroke();

      // North needle
      ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.2);
      ctx.lineTo(size * 0.35, 0);
      ctx.lineTo(0, size * 0.2);
      ctx.lineTo(-size * 0.35, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Animation Loop
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (!isRunningRef.current) return;

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth lerp mouse parallax offset
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      const maxDistance = 95;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.18;
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(
              particles[i].x + mouseRef.current.x * 0.2,
              particles[i].y + mouseRef.current.y * 0.2
            );
            ctx.lineTo(
              particles[j].x + mouseRef.current.x * 0.2,
              particles[j].y + mouseRef.current.y * 0.2
            );
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * 60 * delta;
        p.y += p.vy * 60 * delta;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(currentTime * p.pulseSpeed) * 0.005;
        p.alpha = Math.max(0.15, Math.min(0.75, p.alpha));

        const renderX = p.x + mouseRef.current.x * 0.35;
        const renderY = p.y + mouseRef.current.y * 0.35;

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and update travel drifters
      if (showDrifters) {
        for (let k = 0; k < drifters.length; k++) {
          const d = drifters[k];
          d.x += d.vx * 60 * delta;
          d.y += d.vy * 60 * delta;

          if (d.x > width + 40) {
            d.x = -40;
            d.y = Math.random() * height;
          }
          if (d.y < -20) d.y = height + 20;
          if (d.y > height + 20) d.y = -20;

          const renderX = d.x + mouseRef.current.x * 0.6;
          const renderY = d.y + mouseRef.current.y * 0.6;

          if (d.type === 'plane') {
            drawPlane(renderX, renderY, d.size, d.alpha);
          } else if (d.type === 'star') {
            drawStar(renderX, renderY, d.size, d.alpha);
          } else {
            drawCompass(renderX, renderY, d.size, d.alpha);
          }
        }
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    // ⚡ SKILL GUIDANCE: efficient-background-processing
    // Pause animation when the browser tab is hidden or element is scrolled off-screen
    const startSimulation = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        lastTime = performance.now();
        animFrameId.current = requestAnimationFrame(loop);
      }
    };

    const stopSimulation = () => {
      isRunningRef.current = false;
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
    };

    // 1. Tab visibility listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSimulation();
      } else {
        startSimulation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 2. IntersectionObserver listener (viewport visibility)
    let observer: IntersectionObserver | null = null;
    if (containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startSimulation();
            } else {
              stopSimulation();
            }
          });
        },
        { threshold: 0.05, rootMargin: '100px' }
      );
      observer.observe(containerRef.current);
    }

    // 3. contentvisibilityautostatechange event listener (from skill guide)
    const containerElem = containerRef.current;
    const handleContentVisibilityState = (event: any) => {
      if (event.skipped) {
        stopSimulation();
      } else {
        startSimulation();
      }
    };

    if (containerElem) {
      containerElem.addEventListener('contentvisibilityautostatechange', handleContentVisibilityState);
    }

    // Initial resize & start
    resize();
    window.addEventListener('resize', resize, { passive: true });
    startSimulation();

    return () => {
      stopSimulation();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer && containerElem) {
        observer.unobserve(containerElem);
        observer.disconnect();
      }
      if (containerElem) {
        containerElem.removeEventListener('contentvisibilityautostatechange', handleContentVisibilityState);
      }
    };
  }, [prefersReducedMotion, intensity, showDrifters]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto none auto 800px',
      }}
    >
      {/* Dynamic Aurora Gradient Mesh Layer */}
      <div className="absolute inset-0 opacity-70 dark:opacity-85 mix-blend-screen transition-opacity duration-700">
        {/* Orb 1: Cyan / Emerald Lagoon */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr from-cyan-400/30 via-teal-500/20 to-transparent blur-[120px] dark:from-cyan-600/25 dark:via-teal-600/15 animate-float-slow"
          style={{ animationDuration: '24s' }}
        />

        {/* Orb 2: Sunset Coral / Amber Ray */}
        <div
          className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-amber-400/25 via-pink-500/20 to-transparent blur-[130px] dark:from-indigo-600/25 dark:via-purple-600/20 animate-float-slow"
          style={{ animationDuration: '28s', animationDelay: '-8s' }}
        />

        {/* Orb 3: Deep Ocean Sky */}
        <div
          className="absolute -bottom-[20%] left-[25%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-t from-blue-500/25 via-sky-400/20 to-transparent blur-[140px] dark:from-sky-700/25 dark:via-cyan-800/15 animate-float-slow"
          style={{ animationDuration: '32s', animationDelay: '-16s' }}
        />
      </div>

      {/* Gentle Floating Grid Texture for Depth */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Interactive HTML5 Canvas Layer for Constellations & Travel Particles */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
      )}
    </div>
  );
}
