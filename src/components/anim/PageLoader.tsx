'use client';
import { useState, useEffect, useRef } from 'react';

export default function PageLoader() {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'count' | 'hold' | 'split' | 'done'>('count');
  const lettersRef = useRef<HTMLDivElement>(null);
  const [isAr, setIsAr] = useState(false);

  useEffect(() => {
    const lang = document.documentElement.lang || localStorage.getItem('hamadat-lang') || 'fr';
    setIsAr(lang === 'ar');
  }, []);

  useEffect(() => {
    const start = performance.now();
    const dur = 900;

    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(eased * 100));
      if (t < 1) requestAnimationFrame(tick);
      else {
        setTimeout(() => setPhase('hold'), 100);
        setTimeout(() => setPhase('split'), 500);
        setTimeout(() => setPhase('done'), 1200);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  if (phase === 'done') return null;

  const letters = isAr ? ['حمادات'] : 'HAMADAT'.split('');
  const isSplit = phase === 'split';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Top half */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: '#06080a',
        transform: isSplit ? 'translateY(-100%)' : 'translateY(0)',
        transition: isSplit ? 'transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        zIndex: 2,
      }} />

      {/* Bottom half */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
        background: '#06080a',
        transform: isSplit ? 'translateY(100%)' : 'translateY(0)',
        transition: isSplit ? 'transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        zIndex: 2,
      }} />

      {/* Content layer */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 0,
        opacity: isSplit ? 0 : 1,
        transform: isSplit ? 'scale(1.1)' : 'scale(1)',
        transition: 'opacity 0.3s ease, transform 0.5s ease',
      }}>
        {/* Ambient blobs */}
        <div style={{
          position: 'absolute', width: '500px', height: '400px',
          top: '-200px', left: '-250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,116,112,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'mblob1 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '300px',
          bottom: '-150px', right: '-200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,116,112,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'mblob2 13s ease-in-out infinite',
        }} />

        {/* Brand letters */}
        <div ref={lettersRef} style={{
          display: 'flex', gap: isAr ? '0' : '0.04em',
          marginBottom: '48px', perspective: '600px',
          overflow: 'hidden',
          direction: isAr ? 'rtl' : 'ltr',
        }}>
          {isAr ? (
            <span style={{
              display: 'inline-block',
              fontSize: 'clamp(52px, 9vw, 100px)',
              fontWeight: '700',
              fontFamily: 'var(--font-arabic)',
              color: '#fff',
              animation: 'loaderLetterReveal 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s both',
            }}>
              حمادات
            </span>
          ) : (
            letters.map((ch, i) => (
              <span key={i} style={{
                display: 'inline-block',
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: '200',
                color: i < 3 ? '#fff' : 'rgba(14,116,112,0.8)',
                letterSpacing: '0.12em',
                animation: `loaderLetterReveal 0.6s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.06}s both`,
              }}>
                {ch}
              </span>
            ))
          )}
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: isAr ? '13px' : '11px', fontWeight: '400',
          fontFamily: isAr ? 'var(--font-arabic)' : undefined,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: isAr ? '2px' : '6px', textTransform: 'uppercase',
          marginBottom: '56px',
          animation: 'loaderLetterReveal 0.5s ease 0.8s both',
        }}>
          {isAr ? 'ترقية عقارية فاخرة' : 'Promotion Immobilière'}
        </p>

        {/* Progress bar */}
        <div style={{
          position: 'relative',
          width: 'clamp(180px, 25vw, 320px)',
        }}>
          <div style={{
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            width: '100%',
            borderRadius: '1px',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0,
            height: '1px',
            background: 'linear-gradient(90deg, var(--teal, #0e7470), rgba(14,116,112,0.3))',
            width: `${count}%`,
            transition: 'width 0.05s linear',
            boxShadow: '0 0 16px rgba(14,116,112,0.6)',
            borderRadius: '1px',
          }} />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '14px',
          }}>
            <span style={{
              fontSize: '9px', fontWeight: '600',
              color: 'rgba(255,255,255,0.15)',
              letterSpacing: '3px',
              fontFamily: isAr ? 'var(--font-arabic)' : undefined,
            }}>
              {isAr ? 'جاري التحميل' : 'LOADING'}
            </span>
            <span style={{
              fontSize: '11px', fontWeight: '700',
              color: 'rgba(14,116,112,0.7)',
              letterSpacing: '2px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {String(count).padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
