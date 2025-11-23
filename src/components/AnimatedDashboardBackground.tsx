import React from 'react';

// Pure CSS animated background: layered gradients + floating particles + subtle parallax SVG waves.
const AnimatedDashboardBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_32%,rgba(255,200,150,0.35),transparent_65%)]" />
      {/* Adaptive animated gradient updated to teal + orange + pastel */}
      <div
        className="absolute inset-0 animate-gradientMotion opacity-95"
        style={{
          background:
            'linear-gradient(125deg, var(--gradient-start,#ccfbf1), var(--gradient-mid,#0d9488), var(--gradient-accent,#f59e0b), var(--gradient-end,#f3e8ff))',
          backgroundSize: '340% 340%'
        }}
      />
      {/* Parallax wave SVG */}
      <svg className="absolute bottom-0 left-0 w-full h-[180px] animate-slowFloat" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path fill="#172554" fillOpacity="0.7" d="M0,96L60,112C120,128,240,160,360,186.7C480,213,600,235,720,213.3C840,192,960,128,1080,117.3C1200,107,1320,149,1380,170.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        <path fill="#1e3a8a" fillOpacity="0.5" d="M0,64L48,69.3C96,75,192,85,288,122.7C384,160,480,224,576,234.7C672,245,768,203,864,181.3C960,160,1056,160,1152,144C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
      {/* Floating particles (responsive & reduced-motion aware) */}
      <div className="pointer-events-none select-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-cyan-300/30 blur-sm animate-float will-change-transform"
            style={{
              width: Math.random() * 10 + 6 + 'px',
              height: Math.random() * 10 + 6 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: (Math.random() * 5).toFixed(2) + 's',
              animationDuration: (Math.random() * 10 + 10).toFixed(2) + 's'
            }}
          />
        ))}
      </div>
      {/* Overlay subtle noise pattern */}
      <div className="absolute inset-0 opacity-[0.10] mix-blend-overlay bg-[linear-gradient(0deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:14px_14px]" />
      <style>{`
        @keyframes gradientMotion { 0% {background-position: 0% 50%;} 50% {background-position: 100% 50%;} 100% {background-position: 0% 50%;} }
        @keyframes float { 0% { transform: translateY(0) translateX(0); opacity: 0.45;} 50% { transform: translateY(-38px) translateX(12px); opacity: 0.9;} 100% { transform: translateY(0) translateX(0); opacity: 0.45;} }
        @keyframes slowFloat { 0% { transform: translateY(0);} 50% { transform: translateY(14px);} 100% { transform: translateY(0);} }
        .animate-gradientMotion { animation: gradientMotion 24s ease-in-out infinite; }
        .animate-float { animation: float 16s ease-in-out infinite; }
        .animate-slowFloat { animation: slowFloat 22s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-gradientMotion, .animate-float, .animate-slowFloat { animation: none !important; }
        }
        @media (max-width: 640px) {
          .animate-float { animation-duration: 22s; }
        }
        :root.dark {
          --gradient-start: #0f2d2e;
          --gradient-mid: #0d9488;
          --gradient-accent: #f59e0b;
          --gradient-end: #312244;
        }
      `}</style>
    </div>
  );
};

export default AnimatedDashboardBackground;
