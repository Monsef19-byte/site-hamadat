'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PageLoader() {
  const [phase, setPhase] = useState<'hold' | 'lift' | 'done'>('hold');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('lift'), 1500);
    const t2 = setTimeout(() => setPhase('done'), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#0a0a09',
        transform: phase === 'lift' ? 'translateY(-100%)' : 'translateY(0)',
        transition: phase === 'lift' ? 'transform 1.1s cubic-bezier(0.76,0,0.24,1)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '32px',
      }}
    >
      <div style={{
        opacity: phase === 'lift' ? 0 : 1,
        transform: phase === 'lift' ? 'translateY(-20px)' : 'translateY(0)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        animation: phase === 'hold' ? 'loaderFadeIn 0.8s ease-out 0.3s both' : 'none',
      }}>
        <Image
          src="/images/logo/logo-horizontal-white.png"
          alt="Hamadat"
          width={160}
          height={44}
          style={{ height: '40px', width: 'auto', opacity: 0.9 }}
          priority
        />
      </div>

      {/* Progress bar */}
      <div style={{
        width: '120px', height: '1px',
        background: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        opacity: phase === 'lift' ? 0 : 1,
        transition: 'opacity 0.3s',
      }}>
        <div style={{
          height: '100%',
          background: '#0e7470',
          animation: 'loaderBar 1.3s cubic-bezier(0.22,1,0.36,1) 0.3s both',
        }} />
      </div>

      <style>{`
        @keyframes loaderFadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes loaderBar { from { width:0 } to { width:100% } }
      `}</style>
    </div>
  );
}
