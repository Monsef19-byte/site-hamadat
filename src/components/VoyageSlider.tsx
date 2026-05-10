'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

// ── Types ────────────────────────────────────────────────────────────────────
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

// ── Math helpers ─────────────────────────────────────────────────────────────
const wrap = (n: number, max: number) => (n + max) % max;
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Per-card tilt state ───────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
export default function VoyageSlider({ slides, onSlideChange }: Props) {
  const count = slides.length;
  const [current, setCurrent] = useState(0);

  // Refs for card inner elements (tilt targets)
  const innerRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const infoRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const tilts        = useRef<TiltState[]>(slides.map(makeTilt));
  const rafIdRef     = useRef<number>(0);
  const sectionRef   = useRef<HTMLElement>(null);
  const wheelCooldown = useRef(false);

  // ── RAF loop — lerp tilt CSS vars on all cards ──────────────────────────
  useEffect(() => {
    const tick = () => {
      tilts.current.forEach((t, i) => {
        t.rotX.cur   = lerp(t.rotX.cur,   t.rotX.tgt,   t.lerpAmt);
        t.rotY.cur   = lerp(t.rotY.cur,   t.rotY.tgt,   t.lerpAmt);
        t.bgPosX.cur = lerp(t.bgPosX.cur, t.bgPosX.tgt, t.lerpAmt);
        t.bgPosY.cur = lerp(t.bgPosY.cur, t.bgPosY.tgt, t.lerpAmt);

        const inner = innerRefs.current[i];
        const info  = infoRefs.current[i];

        if (inner) {
          inner.style.setProperty('--rotX',   t.rotX.cur.toFixed(2)   + 'deg');
          inner.style.setProperty('--rotY',   t.rotY.cur.toFixed(2)   + 'deg');
          inner.style.setProperty('--bgPosX', t.bgPosX.cur.toFixed(2) + '%');
          inner.style.setProperty('--bgPosY', t.bgPosY.cur.toFixed(2) + '%');
        }
        if (info) {
          info.style.setProperty('--rotX',   t.rotX.cur.toFixed(2)   + 'deg');
          info.style.setProperty('--rotY',   t.rotY.cur.toFixed(2)   + 'deg');
          info.style.setProperty('--bgPosX', t.bgPosX.cur.toFixed(2) + '%');
          info.style.setProperty('--bgPosY', t.bgPosY.cur.toFixed(2) + '%');
        }
      });
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, []);

  // ── Scroll wheel support ─────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (wheelCooldown.current) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      setCurrent(c => { const next = wrap(c + dir, count); onSlideChange?.(next); return next; });
      wheelCooldown.current = true;
      setTimeout(() => { wheelCooldown.current = false; }, 750);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [count]);

  // ── Mouse handlers per card ──────────────────────────────────────────────
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

  const advance = (dir: 1 | -1) => setCurrent(c => { const next = wrap(c + dir, count); onSlideChange?.(next); return next; });

  // ── Data attribute per card ──────────────────────────────────────────────
  const getVoy = (i: number): 'current' | 'previous' | 'next' | 'hidden' => {
    if (i === current)               return 'current';
    if (i === wrap(current - 1, count)) return 'previous';
    if (i === wrap(current + 1, count)) return 'next';
    return 'hidden';
  };

  if (!slides.length) return null;

  return (
    <section ref={sectionRef} className="voy-slider">

      {/* ── Slide wrapper (grid, all on same cell) ── */}
      <div className="voy-slides-wrapper">

        {slides.map((slide, i) => {
          const pos = getVoy(i);
          const isCurrent = pos === 'current';

          const cardEl = (
            <div
              className="voy-card"
              data-voy={pos}
              onMouseMove={e => handleMouseMove(i, e)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              <div
                className="voy-card__inner"
                ref={el => { innerRefs.current[i] = el; }}
              >
                {/* Image */}
                <div className="voy-card__img-wrap">
                  <img
                    className="voy-card__img"
                    src={slide.image}
                    alt={slide.title}
                    draggable={false}
                  />
                </div>

                {/* Info overlay */}
                <div
                  className="voy-info"
                  ref={el => { infoRefs.current[i] = el; }}
                  data-voy={pos}
                >
                  <div className="voy-info__inner">
                    <div className="voy-info__text-wrap">
                      <div className="voy-info__text" data-title>
                        <span>{slide.title}</span>
                      </div>
                      <div className="voy-info__text" data-subtitle>
                        <span>{slide.subtitle}</span>
                      </div>
                      {slide.description && (
                        <div className="voy-info__text" data-description>
                          <span>{slide.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <div key={i} className="voy-card-slot" data-voy={pos}>
              {isCurrent && slide.href ? (
                <Link href={slide.href} style={{ textDecoration: 'none', display: 'contents' }}>
                  {cardEl}
                </Link>
              ) : (
                cardEl
              )}
            </div>
          );
        })}
      </div>

      {/* ── Prev / Next buttons ── */}
      <button
        className="voy-btn voy-btn--prev"
        onClick={() => advance(-1)}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        className="voy-btn voy-btn--next"
        onClick={() => advance(1)}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dots indicator ── */}
      <div className="voy-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`voy-dot${i === current ? ' voy-dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
