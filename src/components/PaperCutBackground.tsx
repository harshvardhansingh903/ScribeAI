import React from "react";

const PaperCutBackground: React.FC = () => (
  <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
    <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Yellow base layer */}
      <path d="M0,0 L1440,0 L1440,900 Q900,800 0,900 Z" fill="url(#yellowGradient)" />
      {/* Navy blue deepest layer */}
      <path d="M0,900 Q400,700 900,850 Q1300,950 1440,900 L1440,0 L0,0 Z" fill="url(#navy1)" filter="url(#shadow1)" />
      {/* Navy blue mid layer */}
      <path d="M0,900 Q500,750 1100,800 Q1300,850 1440,900 L1440,0 L0,0 Z" fill="url(#navy2)" filter="url(#shadow2)" />
      {/* Navy blue top layer */}
      <path d="M0,900 Q600,800 1200,850 Q1400,900 1440,900 L1440,0 L0,0 Z" fill="url(#navy3)" filter="url(#shadow3)" />
      <defs>
        <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <linearGradient id="navy1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a52" />
          <stop offset="100%" stopColor="#24476a" />
        </linearGradient>
        <linearGradient id="navy2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#24476a" />
          <stop offset="100%" stopColor="#2e537a" />
        </linearGradient>
        <linearGradient id="navy3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e537a" />
          <stop offset="100%" stopColor="#3a5c8a" />
        </linearGradient>
        <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#1a3a52" floodOpacity="0.18" />
        </filter>
        <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1a3a52" floodOpacity="0.14" />
        </filter>
        <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1a3a52" floodOpacity="0.10" />
        </filter>
      </defs>
    </svg>
  </div>
);

export default PaperCutBackground;
