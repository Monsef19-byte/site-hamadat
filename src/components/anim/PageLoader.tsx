'use client';
import { useState, useEffect } from 'react';

export default function PageLoader() {
  const [count, setCount]   = useState(0);
  const [phase, setPhase]   = useState<'count'|'lift'|'done'>('count');

  useEffect(() => {
    // Count to 100 over 1.8s
    const start = performance.now();
    const dur   = 700;

    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) requestAnimationFrame(tick);
      else {
        setTimeout(() => setPhase('lift'), 80);
        setTimeout(() => setPhase('done'), 720);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#06080a',
      transform: phase === 'lift' ? 'translateY(-100%)' : 'translateY(0)',
      transition: phase === 'lift' ? 'transform 0.55s cubic-bezier(0.76,0,0.24,1)' : 'none',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 0,
      overflow: 'hidden',
    }}>
      {/* Mesh blobs in loader too */}
      <div style={{ position:'absolute', width:'600px', height:'500px', top:'-15%', left:'-10%', borderRadius:'50%', background:'radial-gradient(circle, rgba(14,116,112,0.25) 0%, transparent 70%)', filter:'blur(80px)', animation:'mblob1 18s ease-in-out infinite' }} />
      <div style={{ position:'absolute', width:'400px', height:'400px', bottom:'-5%', right:'-5%', borderRadius:'50%', background:'radial-gradient(circle, rgba(14,116,112,0.18) 0%, transparent 70%)', filter:'blur(70px)', animation:'mblob2 13s ease-in-out infinite' }} />

      {/* Brand name — big */}
      <div style={{
        fontSize: 'clamp(52px, 8vw, 100px)',
        fontWeight: '200',
        color: '#fff',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        opacity: phase === 'lift' ? 0 : 1,
        transform: phase === 'lift' ? 'translateY(-40px)' : 'translateY(0)',
        transition: 'opacity 0.4s, transform 0.4s',
        marginBottom: '48px',
        animation: 'loaderTitle 1s cubic-bezier(0.22,1,0.36,1) 0.2s both',
      }}>
        HAMADAT
      </div>

      {/* Counter */}
      <div style={{
        position: 'relative', width: 'clamp(200px, 30vw, 400px)',
        opacity: phase === 'lift' ? 0 : 1,
        transition: 'opacity 0.3s',
      }}>
        {/* Track */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }} />
        {/* Progress */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '1px',
          background: 'linear-gradient(90deg, #0e7470, rgba(14,116,112,0.4))',
          width: `${count}%`,
          transition: 'width 0.05s linear',
          boxShadow: '0 0 12px rgba(14,116,112,0.8)',
        }} />
        {/* Number */}
        <div style={{
          marginTop: '16px',
          fontSize: '11px', fontWeight: '700',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '3px',
          textAlign: 'right',
        }}>
          {String(count).padStart(3, '0')}
        </div>
      </div>

    </div>
  );
}
