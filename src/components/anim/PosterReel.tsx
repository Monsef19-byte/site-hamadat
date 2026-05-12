'use client';
import { useRef, useEffect } from 'react';

const POSTER_H = 190;
const POSTER_GAP = 14;
const SPEED = 0.55; // px per frame

interface Props {
  images: string[];
  containerHeight?: number;
  width?: number;
}

export default function PosterReel({ images, containerHeight = 420, width = 130 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (images.length < 2) return;
    const container = containerRef.current;
    if (!container) return;

    // Build enough repeated copies to fill at least 2× the container height
    const step = POSTER_H + POSTER_GAP;
    posRef.current = images.map((_, i) => i * step);

    const items = container.querySelectorAll<HTMLDivElement>('.pr-item');

    const tick = () => {
      for (let i = 0; i < items.length; i++) {
        posRef.current[i] -= SPEED;
        // When bottom edge exits the top → teleport below the last item
        if (posRef.current[i] + POSTER_H < 0) {
          posRef.current[i] = Math.max(...posRef.current) + step;
        }
        (items[i] as HTMLElement).style.transform = `translateY(${posRef.current[i]}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [images]);

  // Duplicate images so there's always content on screen
  const doubled = [...images, ...images];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        height: containerHeight,
        overflow: 'hidden',
      }}
    >
      {doubled.map((src, i) => (
        <div
          key={i}
          className="pr-item"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: POSTER_H,
            transform: `translateY(${i * (POSTER_H + POSTER_GAP)}px)`,
            borderRadius: '8px',
            overflow: 'hidden',
            willChange: 'transform',
          }}
        >
          <img
            src={src}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      ))}
      {/* top + bottom fade masks */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(6,8,10,0.6) 0%, transparent 20%, transparent 80%, rgba(6,8,10,0.6) 100%)',
        zIndex: 1,
      }} />
    </div>
  );
}
