
"use client";
import React, { useEffect, useRef } from 'react';

const AnimatedCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      if (trail) {
        trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
      }
      requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', moveCursor);
    animateTrail();
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      <div
        ref={trailRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(80, 120, 255, 0.15)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'multiply',
          transition: 'background 0.2s',
        }}
      />
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f8cff 60%, #ffb86c 100%)',
          boxShadow: '0 0 8px 2px #4f8cff55',
          pointerEvents: 'none',
          zIndex: 10000,
          mixBlendMode: 'exclusion',
          transition: 'background 0.2s',
        }}
      />
    </>
  );
};

export default AnimatedCursor;
