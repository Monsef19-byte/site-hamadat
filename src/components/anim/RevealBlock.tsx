'use client';
import { useRef, useEffect, ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  from?: 'up' | 'left' | 'right';
  className?: string;
  style?: CSSProperties;
}

export default function RevealBlock({
  children,
  delay = 0,
  from = 'up',
  className = '',
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let st: { kill?: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Keep hidden until trigger fires
      gsap.set(el, { opacity: 0 });

      st = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const isPortrait = window.matchMedia('(orientation: portrait)').matches;

          // Portrait: always slide up. Landscape: use the `from` direction.
          const xFrom = isPortrait
            ? 0
            : from === 'left'
              ? -72
              : from === 'right'
                ? 72
                : 0;
          const yFrom = isPortrait ? 60 : from === 'up' ? 56 : 0;

          gsap.fromTo(
            el,
            { opacity: 0, x: xFrom, y: yFrom },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.75,
              delay,
              ease: 'power3.out',
            }
          );
        },
      });
    };

    const raf = requestAnimationFrame(() => init());
    return () => {
      cancelAnimationFrame(raf);
      st?.kill?.();
    };
  }, [delay, from]);

  return (
    <div
      ref={ref}
      className={`rb-init-hidden${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </div>
  );
}
