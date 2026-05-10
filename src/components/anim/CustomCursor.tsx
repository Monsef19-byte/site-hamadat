'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on pointer-fine (non-touch) devices
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let hovering = false;
    let clicking = false;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const onMouseOver = (e: MouseEvent) => {
      hovering = !!(e.target as HTMLElement).closest('a, button, [data-cursor]');
    };

    const onMouseDown = () => { clicking = true; };
    const onMouseUp   = () => { clicking = false; };

    const tick = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%) scale(${clicking ? 0.5 : 1})`;
      }
      if (ringRef.current) {
        const s = hovering ? 2.2 : 1;
        ringRef.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${s})`;
        ringRef.current.style.opacity = hovering ? '0.35' : '0.65';
      }

      raf = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Dot — exact position */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99998,
        width: '7px', height: '7px', borderRadius: '50%',
        background: '#0e7470',
        pointerEvents: 'none',
        willChange: 'transform',
        transition: 'transform 0.08s cubic-bezier(0.22,1,0.36,1)',
      }} />
      {/* Ring — lagging spring */}
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99997,
        width: '38px', height: '38px', borderRadius: '50%',
        border: '1.5px solid rgba(14,116,112,0.65)',
        pointerEvents: 'none',
        willChange: 'transform',
        transition: 'transform 0.08s linear, opacity 0.3s ease, scale 0.5s cubic-bezier(0.22,1,0.36,1)',
      }} />
    </>
  );
}
