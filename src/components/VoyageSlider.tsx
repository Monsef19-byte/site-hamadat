'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface VoyageSlide {
  image: string;
  title: string;
  subtitle: string;
  description?: string;
  href?: string;
}

interface Props {
  slides: VoyageSlide[];
  onSlideChange?: (index: number) => void;
}

// ── Math helpers ───────────────────────────────────────────────────────────────
const wrap = (n: number, max: number) => (n + max) % max;
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Per-slide tilt state ───────────────────────────────────────────────────────
interface TiltState {
  rotX:   { cur: number; tgt: number };
  rotY:   { cur: number; tgt: number };
  bgPosX: { cur: number; tgt: number };
  bgPosY: { cur: number; tgt: number };
  lerpAmt: number;
}

function makeTilt(): TiltState {
  return {
    rotX:   { cur: 0, tgt: 0 },
    rotY:   { cur: 0, tgt: 0 },
    bgPosX: { cur: 0, tgt: 0 },
    bgPosY: { cur: 0, tgt: 0 },
    lerpAmt: 0.06,
  };
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function VoyageSlider({ slides, onSlideChange }: Props) {
  const count = slides.length;
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  // Refs — innerRefs = .slide__inner, infoRefs = .slide-info__inner
  const innerRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const infoRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const tilts        = useRef<TiltState[]>(slides.map(makeTilt));
  const rafIdRef     = useRef<number>(0);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const wheelCooldown = useRef(false);

  // ── RAF loop — lerp CSS vars onto both .slide__inner and .slide-info__inner ──
  useEffect(() => {
    const tick = () => {
      tilts.current.forEach((t, i) => {
        t.rotX.cur   = lerp(t.rotX.cur,   t.rotX.tgt,   t.lerpAmt);
        t.rotY.cur   = lerp(t.rotY.cur,   t.rotY.tgt,   t.lerpAmt);
        t.bgPosX.cur = lerp(t.bgPosX.cur, t.bgPosX.tgt, t.lerpAmt);
        t.bgPosY.cur = lerp(t.bgPosY.cur, t.bgPosY.tgt, t.lerpAmt);

        const inner = innerRefs.current[i];
        const info  = infoRefs.current[i];

        const rx = t.rotX.cur.toFixed(2) + 'deg';
        const ry = t.rotY.cur.toFixed(2) + 'deg';
        const bx = t.bgPosX.cur.toFixed(2) + '%';
        const by = t.bgPosY.cur.toFixed(2) + '%';

        if (inner) {
          inner.style.setProperty('--rotX',   rx);
          inner.style.setProperty('--rotY',   ry);
          inner.style.setProperty('--bgPosX', bx);
          inner.style.setProperty('--bgPosY', by);
        }
        if (info) {
          info.style.setProperty('--rotX',   rx);
          info.style.setProperty('--rotY',   ry);
          info.style.setProperty('--bgPosX', bx);
          info.style.setProperty('--bgPosY', by);
        }
      });
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, []);

  // ── Scroll wheel ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (wheelCooldown.current) return;
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top >= window.innerHeight || rect.bottom <= 0) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      setCurrent(c => { const next = wrap(c + dir, count); onSlideChange?.(next); return next; });
      wheelCooldown.current = true;
      setTimeout(() => { wheelCooldown.current = false; }, 750);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [count]);

  // ── Tilt mouse handlers ────────────────────────────────────────────────────
  const handleMouseMove = useCallback((idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    const t = tilts.current[idx];
    t.lerpAmt = 0.1;
    const el = e.currentTarget as HTMLElement;
    const ox = (e.nativeEvent.offsetX - el.clientWidth  * 0.5) / (Math.PI * 3);
    const oy = -(e.nativeEvent.offsetY - el.clientHeight * 0.5) / (Math.PI * 4);
    t.rotY.tgt   = ox;
    t.rotX.tgt   = oy;
    t.bgPosX.tgt = -ox * 0.3;
    t.bgPosY.tgt =  oy * 0.3;
  }, []);

  const handleMouseLeave = useCallback((idx: number) => {
    const t = tilts.current[idx];
    t.lerpAmt    = 0.06;
    t.rotX.tgt   = 0;
    t.rotY.tgt   = 0;
    t.bgPosX.tgt = 0;
    t.bgPosY.tgt = 0;
  }, []);

  const advance = (dir: 1 | -1) =>
    setCurrent(c => { const next = wrap(c + dir, count); onSlideChange?.(next); return next; });

  const getPos = (i: number) => {
    if (i === current)                    return 'current'  as const;
    if (i === wrap(current - 1, count))   return 'previous' as const;
    if (i === wrap(current + 1, count))   return 'next'     as const;
    return 'hidden' as const;
  };

  if (!slides.length) return null;

  return (
    <div ref={wrapperRef} className="voyage-section">
      <div className="slider">

        {/* ── Prev button ── */}
        <button className="slider--btn slider--btn__prev" onClick={() => advance(-1)} aria-label="Previous slide">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="slides__wrapper">

          {/* ── Cards layer ── */}
          <div className="slides">
            {slides.map((slide, i) => {
              const pos = getPos(i);
              const dataAttrs = {
                ...(pos === 'current'  ? { 'data-current':  '' } : {}),
                ...(pos === 'next'     ? { 'data-next':     '' } : {}),
                ...(pos === 'previous' ? { 'data-previous': '' } : {}),
              };
              return (
                <div
                  key={i}
                  className="slide"
                  {...dataAttrs}
                  onMouseMove={e => handleMouseMove(i, e)}
                  onMouseLeave={() => handleMouseLeave(i)}
                  onClick={pos === 'current' && slide.href ? () => router.push(slide.href!) : undefined}
                  style={pos === 'current' && slide.href ? { cursor: 'pointer' } : undefined}
                >
                  <div className="slide__inner" ref={el => { innerRefs.current[i] = el; }}>
                    <div className="slide--image__wrapper">
                      <img
                        className="slide--image"
                        src={slide.image}
                        alt={slide.title}
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Info layer — same grid cell, z-index above cards ── */}
          <div className="slides--infos">
            {slides.map((slide, i) => {
              const pos = getPos(i);
              const dataAttrs = {
                ...(pos === 'current'  ? { 'data-current':  '' } : {}),
                ...(pos === 'next'     ? { 'data-next':     '' } : {}),
                ...(pos === 'previous' ? { 'data-previous': '' } : {}),
              };
              return (
                <div key={i} className="slide-info" {...dataAttrs}>
                  <div className="slide-info__inner" ref={el => { infoRefs.current[i] = el; }}>
                    <div className="slide-info--text__wrapper">
                      <div data-title className="slide-info--text">
                        <span>{slide.title}</span>
                      </div>
                      <div data-subtitle className="slide-info--text">
                        <span>{slide.subtitle}</span>
                      </div>
                      {slide.description && (
                        <div data-description className="slide-info--text">
                          <span>{slide.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── Next button ── */}
        <button className="slider--btn slider--btn__next" onClick={() => advance(1)} aria-label="Next slide">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

      </div>
    </div>
  );
}
