'use client';
import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: import('lenis').default | null = null;

    (async () => {
      const { default: Lenis } = await import('lenis');
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });

      function raf(time: number) {
        lenis!.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    })();

    return () => { lenis?.destroy(); };
  }, []);

  return null;
}
