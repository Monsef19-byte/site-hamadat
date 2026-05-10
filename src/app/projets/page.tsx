'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealBlock from '@/components/anim/RevealBlock';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

const FILTERS = [
  { value: '',          fr: 'Tous',     ar: 'الكل' },
  { value: 'ongoing',   fr: 'En Cours', ar: 'جارية' },
  { value: 'completed', fr: 'Livrés',   ar: 'منجزة' },
];

// Each card flies from a unique off-screen position
const FLY_FROM = [
  { x: -900, y: -200, r: -18, s: 0.35 },
  { x:  800, y: -350, r:  20, s: 0.40 },
  { x: -600, y:  450, r:  22, s: 0.45 },
  { x:  750, y:  300, r: -25, s: 0.38 },
  { x: -400, y: -500, r:  14, s: 0.42 },
  { x:  500, y:  550, r: -30, s: 0.40 },
];

function ProjectCard({ r, thumb, lang, cardRef }: {
  r: { slug: string; name_fr: string; name_ar: string; location: string; status: string; units: number; typology?: string; available?: string };
  thumb: string;
  lang: string;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div ref={cardRef}>
      <Link
        href={`/projets/${r.slug}`}
        data-cursor
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Image */}
        <div style={{
          position: 'relative', aspectRatio: '4/3',
          overflow: 'hidden', borderRadius: '6px',
          background: 'rgba(255,255,255,0.04)',
          boxShadow: hov ? '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(14,116,112,0.3)' : '0 16px 48px rgba(0,0,0,0.6)',
          transform: hov ? 'translateY(-10px) scale(1.01)' : 'translateY(0) scale(1)',
          transitionProperty: 'box-shadow, transform',
          transitionDuration: '0.6s',
          transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
          marginBottom: '20px',
        }}>
          <img src={thumb} alt={r.name_fr} style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transition: 'transform 1s cubic-bezier(0.16,1,0.3,1)',
            transform: hov ? 'scale(1.08)' : 'scale(1)',
          }} />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(6,8,10,0.7) 0%, transparent 50%)',
          }} />

          {/* Hover teal glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(14,116,112,0.12)',
            opacity: hov ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }} />

          {/* Status badge */}
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: r.status === 'completed'
              ? 'rgba(16,185,129,0.15)'
              : 'rgba(14,116,112,0.15)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${r.status === 'completed' ? 'rgba(16,185,129,0.4)' : 'rgba(14,116,112,0.4)'}`,
            color: r.status === 'completed' ? '#10b981' : '#14b8b0',
            padding: '5px 14px',
            fontSize: '9px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '3px',
          }}>
            {r.status === 'completed' ? (lang === 'ar' ? 'منجز' : 'Livré') : (lang === 'ar' ? 'جارٍ' : 'En Cours')}
          </div>

          {r.available && (
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px',
              background: 'rgba(14,116,112,0.85)',
              backdropFilter: 'blur(8px)',
              color: '#fff', padding: '5px 14px',
              fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', borderRadius: '3px',
            }}>
              {lang === 'ar' ? 'متاح' : r.available}
            </div>
          )}

          {/* Arrow circle */}
          <div style={{
            position: 'absolute', bottom: '16px', right: '16px',
            width: '42px', height: '42px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hov ? 1 : 0,
            transform: hov ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(10px)',
            transition: 'opacity 0.35s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            fontSize: '18px', color: '#0e7470',
          }}>
            →
          </div>
        </div>

        {/* Card text */}
        <div style={{ padding: '0 4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h3 style={{
              fontSize: '22px', fontWeight: '300',
              color: hov ? '#14b8b0' : 'rgba(255,255,255,0.9)',
              margin: 0, letterSpacing: '-0.3px',
              transition: 'color 0.3s',
            }}>
              {lang === 'ar' ? r.name_ar : r.name_fr}
            </h3>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '5px', letterSpacing: '0.5px' }}>
              {r.units} {lang === 'ar' ? 'وحدة' : 'unités'}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 12px', letterSpacing: '0.5px' }}>
            {r.location}
          </p>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          {r.typology && (
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', margin: '10px 0 0', letterSpacing: '0.3px' }}>
              {r.typology}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function ProjectsPage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const [filter, setFilter] = useState('');

  const titleRef   = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);

  const residences = config.residenceList ?? [];
  const filtered = filter ? residences.filter(r => r.status === filter) : residences;

  // ── GSAP flying cards ───────────────────────────────────────
  useEffect(() => {
    if (filtered.length === 0) return;   // wait for config

    let ctx: { revert?: () => void } = {};
    let raf = 0;

    const init = async () => {
      const g = await import('gsap');
      const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger');
      const gsap = g.gsap;
      gsap.registerPlugin(ST);

      ctx = gsap.context(() => {
        // 1. Title character split
        const titleEl = titleRef.current;
        if (titleEl) {
          const chars = titleEl.querySelectorAll<HTMLElement>('.proj-char');
          if (chars.length) {
            gsap.fromTo(chars, {
              y: 80, opacity: 0, skewY: 6, rotateX: -40,
            }, {
              y: 0, opacity: 1, skewY: 0, rotateX: 0,
              duration: 0.65,
              ease: 'expo.out',
              stagger: 0.022,
              delay: 0.1,
            });
          }
        }

        // 2. Flying cards
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        if (!pinRef.current || cards.length === 0) return;

        // Set all cards to their starting fly-from positions
        cards.forEach((card, i) => {
          const from = FLY_FROM[i % FLY_FROM.length];
          gsap.set(card, {
            x: from.x, y: from.y,
            rotation: from.r,
            scale: from.s,
            opacity: 0,
            transformOrigin: '50% 50%',
          });
        });

        // Pin section + scrub each card flying in
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            pin: true,
            start: 'top top',
            end: `+=${cards.length * 400}`,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        cards.forEach((card) => {
          tl.to(card, {
            x: 0, y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'expo.out',
          }, '>-0.5');
        });

        // 3. General gsap-reveals
        ST.batch('.proj-gsap-reveal', {
          onEnter: (els) => {
            gsap.fromTo(els, {
              opacity: 0, y: 48,
            }, {
              opacity: 1, y: 0,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.12,
            });
          },
          start: 'top 88%',
          once: true,
        });

        // 4. Filter bar line draw
        const filterBar = document.querySelector<HTMLElement>('.filter-line');
        if (filterBar) {
          gsap.fromTo(filterBar, { scaleX: 0, transformOrigin: 'left' }, {
            scaleX: 1,
            duration: 1.4,
            ease: 'expo.out',
            delay: 0.6,
            scrollTrigger: { trigger: filterBar, start: 'top 90%', once: true },
          });
        }
      });
    };

    raf = requestAnimationFrame(() => init());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert?.();
    };
  }, [filtered.length]);

  // re-init when filter changes — reset card refs
  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, filtered.length);
  }, [filtered.length]);

  const title = lang === 'ar' ? 'مشاريعنا' : 'NOS PROJETS';

  return (
    <div style={{ background: '#06080a', overflowX: 'hidden', color: 'rgba(255,255,255,0.85)' }}>
      <Navbar />

      {/* ── Hero header ──────────────────────────────────── */}
      <section className="proj-page-section" style={{
        paddingTop: '160px', paddingBottom: '80px',
        paddingLeft: '60px', paddingRight: '60px',
        maxWidth: '1400px', margin: '0 auto',
        position: 'relative',
      }}>

        {/* Background label */}
        <div style={{
          position: 'absolute', top: '80px', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(100px, 18vw, 260px)',
          fontWeight: '700', color: 'rgba(255,255,255,0.025)',
          letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          PORTFOLIO
        </div>

        <div className="proj-gsap-reveal" style={{ marginBottom: '20px' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '10px', fontWeight: '700', color: '#0e7470',
            letterSpacing: '5px', textTransform: 'uppercase',
          }}>
            {lang === 'ar' ? 'مجمعاتنا السكنية' : 'Portfolio — Hamadat Résidences'}
          </span>
        </div>

        {/* Title with character split */}
        <div
          ref={titleRef}
          style={{
            perspective: '1000px',
            marginBottom: '48px',
            overflow: 'hidden',
          }}
        >
          <h1 style={{
            fontSize: 'clamp(52px, 9vw, 120px)',
            fontWeight: '200',
            color: '#fff',
            letterSpacing: '-3px',
            margin: 0,
            lineHeight: '0.95',
            display: 'flex', flexWrap: 'wrap', gap: '0 2px',
          }}>
            {title.split('').map((ch, i) => (
              <span key={i} className="proj-char" style={{
                display: 'inline-block',
                whiteSpace: ch === ' ' ? 'pre' : 'normal',
                opacity: 0,
              }}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </h1>
        </div>

        {/* Filters */}
        <div className="proj-gsap-reveal" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} data-cursor style={{
              padding: '10px 32px',
              background: filter === f.value ? '#0e7470' : 'rgba(255,255,255,0.04)',
              color: filter === f.value ? '#fff' : 'rgba(255,255,255,0.5)',
              border: filter === f.value ? '1px solid #0e7470' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '40px', fontSize: '10px', fontWeight: '700',
              cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase',
              transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
              backdropFilter: 'blur(8px)',
            }}>
              {lang === 'ar' ? f.ar : f.fr}
            </button>
          ))}
        </div>

        {/* Divider line */}
        <div className="filter-line" style={{
          height: '1px',
          background: 'linear-gradient(90deg, rgba(14,116,112,0.6) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
        }} />
      </section>

      {/* ── Flying cards pin section ──────────────────── */}
      {filtered.length > 0 ? (
        <section ref={pinRef} style={{ minHeight: '100vh', paddingBottom: '120px' }}>
          <div style={{
            maxWidth: '1400px', margin: '0 auto',
            padding: '0 60px 80px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '56px 40px',
          }} className="proj-cards-grid">
            {filtered.map((r, idx) => (
              <ProjectCard
                key={r.slug}
                r={r}
                thumb={config.residences[r.slug]?.thumbnail ?? ''}
                lang={lang}
                cardRef={(el) => { cardsRef.current[idx] = el; }}
              />
            ))}
          </div>
        </section>
      ) : (
        <section style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RevealBlock delay={0} y={24}>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '15px' }}>
              {lang === 'ar' ? 'لا توجد مشاريع مطابقة' : 'Aucun projet ne correspond.'}
            </p>
          </RevealBlock>
        </section>
      )}

      <Footer />

    </div>
  );
}
