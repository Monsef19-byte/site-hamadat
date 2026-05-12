'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealBlock from '@/components/anim/RevealBlock';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';
import { useTilt } from '@/lib/use-tilt';

const FILTERS = [
  { value: '', fr: 'Tous', ar: 'الكل' },
  { value: 'ongoing', fr: 'En Cours', ar: 'جارية' },
  { value: 'completed', fr: 'Livrés', ar: 'منجزة' },
];

function ProjectCard({ r, thumb, lang, cardRef }: {
  r: { slug: string; name_fr: string; name_ar: string; location: string; status: string; units: number; typology?: string; available?: string };
  thumb: string; lang: string;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const { innerRef, onMouseMove, onMouseLeave } = useTilt();
  const [hov, setHov] = useState(false);

  return (
    <div ref={cardRef}>
      <Link href={`/projets/${r.slug}`} data-cursor style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div
          style={{ perspective: '800px' }}
          onMouseMove={onMouseMove}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => { onMouseLeave(); setHov(false); }}
        >
          <div ref={innerRef} style={{ transformStyle: 'preserve-3d', transform: 'rotateX(var(--rotX,0deg)) rotateY(var(--rotY,0deg))' }}>
            <div style={{
              position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '14px',
              background: 'var(--bg-elevated)', marginBottom: '20px',
              boxShadow: hov ? '0 44px 88px rgba(0,0,0,0.8),0 0 0 1px rgba(14,116,112,0.25)' : '0 16px 48px rgba(0,0,0,0.5)',
              transition: 'box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}>
              <img src={thumb} alt={r.name_fr} style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transform: hov ? 'scale(1.06) translate3d(var(--bgPosX,0%),var(--bgPosY,0%),0)' : 'scale(1.15) translate3d(var(--bgPosX,0%),var(--bgPosY,0%),0)',
                filter: hov ? 'brightness(0.88)' : 'brightness(0.65)',
                transition: 'filter 0.6s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,8,10,0.72) 0%,transparent 50%)' }} />

              {/* Status badge */}
              <div style={{
                position: 'absolute', top: '16px', left: '16px',
                background: r.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(14,116,112,0.15)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${r.status === 'completed' ? 'rgba(16,185,129,0.4)' : 'rgba(14,116,112,0.4)'}`,
                color: r.status === 'completed' ? '#10b981' : '#14b8b0',
                padding: '5px 14px', fontSize: '9px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '4px',
              }}>
                {r.status === 'completed' ? (lang === 'ar' ? 'منجز' : 'Livré') : (lang === 'ar' ? 'جارٍ' : 'En Cours')}
              </div>

              {r.available && (
                <div style={{
                  position: 'absolute', bottom: '16px', left: '16px',
                  background: 'rgba(14,116,112,0.85)', backdropFilter: 'blur(8px)',
                  color: '#fff', padding: '5px 14px', fontSize: '10px', fontWeight: '600', borderRadius: '4px',
                }}>
                  {lang === 'ar' ? 'متاح' : r.available}
                </div>
              )}

              {/* Arrow */}
              <div style={{
                position: 'absolute', bottom: '16px', right: '16px',
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(14,116,112,0.8)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: hov ? 1 : 0,
                transform: hov ? 'scale(1) rotate(-45deg)' : 'scale(0.5)',
                transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                fontSize: '18px', color: '#fff',
              }}>→</div>
            </div>

            <div style={{ padding: '0 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '300', color: hov ? '#14b8b0' : 'var(--text-1)', margin: 0, letterSpacing: '-0.3px', transition: 'color 0.3s' }}>
                  {lang === 'ar' ? r.name_ar : r.name_fr}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-4)', marginTop: '5px' }}>
                  {r.units} {lang === 'ar' ? 'وحدة' : 'unités'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: '0 0 12px' }}>{r.location}</p>
              <div style={{ height: '1px', background: 'var(--border)' }} />
              {r.typology && <p style={{ fontSize: '11px', color: 'var(--text-4)', margin: '10px 0 0' }}>{r.typology}</p>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ProjectsPage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const [filter, setFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const residences = config.residenceList ?? [];
  const filtered = filter ? residences.filter(r => r.status === filter) : residences;

  const handleFilter = (val: string) => {
    setActiveFilter(val);
    setTimeout(() => setFilter(val), 50);
  };

  useEffect(() => {
    if (filtered.length === 0) return;
    let ctx: { revert?: () => void } = {};
    let raf = 0;

    const init = async () => {
      const g = await import('gsap');
      const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger');
      const gsap = g.gsap;
      gsap.registerPlugin(ST);

      ctx = gsap.context(() => {
        const titleEl = titleRef.current;
        if (titleEl) {
          const chars = titleEl.querySelectorAll<HTMLElement>('.proj-char');
          if (chars.length) {
            gsap.fromTo(chars, {
              y: 80, opacity: 0, skewY: 6, rotateX: -40,
            }, {
              y: 0, opacity: 1, skewY: 0, rotateX: 0,
              duration: 0.65, ease: 'expo.out', stagger: 0.022, delay: 0.1,
            });
          }
        }

        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        if (cards.length > 0) {
          cards.forEach((card, i) => {
            gsap.set(card, { opacity: 0, y: 60, scale: 0.95 });
            ST.create({
              trigger: card,
              start: 'top 92%',
              once: true,
              onEnter: () => {
                gsap.to(card, {
                  opacity: 1, y: 0, scale: 1,
                  duration: 0.8, delay: (i % 3) * 0.08,
                  ease: 'expo.out',
                });
              },
            });
          });
        }

        ST.batch('.proj-gsap-reveal', {
          onEnter: (els) => {
            gsap.fromTo(els, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.12 });
          },
          start: 'top 88%',
          once: true,
        });

        const filterBar = document.querySelector<HTMLElement>('.filter-line');
        if (filterBar) {
          gsap.fromTo(filterBar, { scaleX: 0, transformOrigin: 'left' }, {
            scaleX: 1, duration: 1.4, ease: 'expo.out', delay: 0.6,
            scrollTrigger: { trigger: filterBar, start: 'top 90%', once: true },
          });
        }
      });
    };

    raf = requestAnimationFrame(() => init());
    return () => { cancelAnimationFrame(raf); ctx.revert?.(); };
  }, [filtered.length]);

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, filtered.length);
  }, [filtered.length]);

  const title = lang === 'ar' ? 'مشاريعنا' : 'NOS PROJETS';

  return (
    <div style={{ background: 'var(--bg-page)', overflowX: 'hidden', color: 'var(--text-1)' }}>
      <Navbar />

      {/* Hero */}
      <section className="proj-page-section" style={{
        paddingTop: '160px', paddingBottom: '80px',
        paddingLeft: '60px', paddingRight: '60px',
        maxWidth: '1400px', margin: '0 auto', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)',
          fontSize: 'clamp(100px, 18vw, 260px)', fontWeight: '700',
          color: 'var(--border)', opacity: 0.3, letterSpacing: '-0.04em',
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          PORTFOLIO
        </div>

        <div className="proj-gsap-reveal" style={{ marginBottom: '20px' }}>
          <span className="eyebrow" style={{ letterSpacing: '5px' }}>
            {lang === 'ar' ? 'مجمعاتنا السكنية' : 'Portfolio — Hamadat Résidences'}
          </span>
        </div>

        <div ref={titleRef} style={{ perspective: '1000px', marginBottom: '48px', overflow: 'hidden' }}>
          <h1 style={{
            fontSize: 'clamp(52px, 9vw, 120px)', fontWeight: '200',
            color: 'var(--text-1)', letterSpacing: lang === 'ar' ? '0' : '-3px', margin: 0, lineHeight: lang === 'ar' ? '1.1' : '0.95',
            display: 'flex', flexWrap: 'wrap', gap: lang === 'ar' ? '0 16px' : '0 2px',
            direction: lang === 'ar' ? 'rtl' : 'ltr',
          }}>
            {lang === 'ar'
              ? title.split(/\s+/).map((word, i) => (
                  <span key={i} className="proj-char" style={{
                    display: 'inline-block',
                    opacity: 0, transformStyle: 'preserve-3d',
                  }}>
                    {word}
                  </span>
                ))
              : title.split('').map((ch, i) => (
                  <span key={i} className="proj-char" style={{
                    display: 'inline-block',
                    whiteSpace: ch === ' ' ? 'pre' : 'normal',
                    opacity: 0, transformStyle: 'preserve-3d',
                  }}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))
            }
          </h1>
        </div>

        {/* Filters */}
        <div className="proj-gsap-reveal" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => handleFilter(f.value)} data-cursor style={{
              padding: '11px 32px',
              background: activeFilter === f.value ? '#0e7470' : 'rgba(255,255,255,0.03)',
              color: activeFilter === f.value ? '#fff' : 'var(--text-3)',
              border: activeFilter === f.value ? '1px solid #0e7470' : '1px solid var(--border)',
              borderRadius: '40px', fontSize: '10px', fontWeight: '700',
              cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase',
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              backdropFilter: 'blur(8px)',
            }}>
              {lang === 'ar' ? f.ar : f.fr}
            </button>
          ))}
        </div>

        <div className="filter-line" style={{
          height: '1px',
          background: 'linear-gradient(90deg, rgba(14,116,112,0.5) 0%, var(--border) 60%, transparent 100%)',
        }} />
      </section>

      {/* Cards grid */}
      {filtered.length > 0 ? (
        <section style={{ paddingBottom: '120px' }}>
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
                thumb={config.residences[r.slug]?.thumbnail || '/images/placeholder-residence.svg'}
                lang={lang}
                cardRef={(el) => { cardsRef.current[idx] = el; }}
              />
            ))}
          </div>
        </section>
      ) : (
        <section style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RevealBlock delay={0}>
            <p style={{ textAlign: 'center', color: 'var(--text-4)', fontSize: '15px' }}>
              {lang === 'ar' ? 'لا توجد مشاريع مطابقة' : 'Aucun projet ne correspond.'}
            </p>
          </RevealBlock>
        </section>
      )}

      <Footer />
    </div>
  );
}
