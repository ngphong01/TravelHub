import React from 'react';
import { Link } from 'react-router-dom';

interface TravelHubLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
}

export default function TravelHubLogo({
  variant = 'light',
  size = 'md',
  showText = true,
  showTagline = true,
  className = '',
  asLink = false,
}: TravelHubLogoProps) {
  // Size metrics
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-xl', tagline: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-2xl', tagline: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', tagline: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', tagline: 'text-sm' },
  };

  const { icon: iconSize, text: textSize, tagline: taglineSize } = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Vector Logo Icon (Supersonic Jet + Globe Orbit + Pinpoint) */}
      <div className={`relative ${iconSize} flex-shrink-0 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Linear & Radial Gradients */}
            <linearGradient id="th-orbit" x1="10" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="60%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            <linearGradient id="th-pin" x1="20" y1="40" x2="80" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>

            <linearGradient id="th-wing-cyan" x1="25" y1="20" x2="65" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            <linearGradient id="th-wing-gold" x1="45" y1="15" x2="85" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="th-pin-bottom" x1="35" y1="70" x2="65" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            
            <filter id="th-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Orbit Loop (Vòng quỹ đạo địa cầu) */}
          <ellipse
            cx="50"
            cy="48"
            rx="36"
            ry="24"
            transform="rotate(-25 50 48)"
            stroke="url(#th-orbit)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="180 30"
            opacity="0.95"
          />

          {/* 2. Location Pin Body (Khung tọa độ du lịch) */}
          <path
            d="M 50 94 C 36 78 22 62 22 46 C 22 28 34.5 15 50 15 C 65.5 15 78 28 78 46 C 78 62 64 78 50 94 Z"
            fill="none"
            stroke="url(#th-pin)"
            strokeWidth="5.5"
            strokeLinejoin="round"
          />

          {/* 3. Golden Pin Apex Accent */}
          <path
            d="M 50 94 L 38 78 L 50 72 L 62 78 Z"
            fill="url(#th-pin-bottom)"
            opacity="0.9"
          />

          {/* 4. Supersonic Paper Airplane (Cánh én / Máy bay lướt vòng cung) */}
          {/* Left Wing (Cyan-Blue facet) */}
          <path
            d="M 78 18 L 28 42 L 50 56 Z"
            fill="url(#th-wing-cyan)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
          {/* Right Wing (Golden Amber facet) */}
          <path
            d="M 78 18 L 50 56 L 68 50 Z"
            fill="url(#th-wing-gold)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
          {/* Center Keel/Fold */}
          <path
            d="M 78 18 L 50 56 L 46 64 L 43 51 Z"
            fill="#0369A1"
            opacity="0.9"
          />

          {/* Jet Stream Speed Swoosh */}
          <path
            d="M 20 62 C 26 50 36 46 44 48"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span
              className={`font-black ${textSize} ${
                variant === 'light' ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
            >
              Travel
            </span>
            <span
              className={`font-black ${textSize} text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500`}
            >
              Hub
            </span>
          </div>
          {showTagline && (
            <span
              className={`font-semibold tracking-wider uppercase mt-1 ${taglineSize} ${
                variant === 'light' ? 'text-blue-200/90' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Sàn du lịch trực tuyến
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
