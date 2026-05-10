'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'cover' | 'reveal'>('cover');

  useEffect(() => {
    // On every route change: curtain jumps in, then lifts
    setPhase('cover');
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('reveal'));
    });
    return () => cancelAnimationFrame(t);
  }, [pathname]);

  return (
    <>
      {children}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          background: '#06080a',
          pointerEvents: 'none',
          transform: phase === 'reveal' ? 'translateY(-100%)' : 'translateY(0)',
          transition: phase === 'reveal'
            ? 'transform 0.55s cubic-bezier(0.76,0,0.24,1)'
            : 'none',
        }}
      />
    </>
  );
}
