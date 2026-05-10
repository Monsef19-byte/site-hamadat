'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealBlock from '@/components/anim/RevealBlock';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

const STATS = [
  { value: 6,    label_fr: 'Projets',               label_ar: 'مشاريع' },
  { value: 163,  label_fr: 'Unités résidentielles',  label_ar: 'وحدة سكنية' },
  { value: 4,    label_fr: 'Projets en cours',       label_ar: 'مشاريع جارية' },
  { value: 2024, label_fr: 'Année de création',      label_ar: 'سنة التأسيس' },
];

function ytId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\s#]+)/);
  return m ? m[1] : '';
}
function ytEmbed(url: string) { const id = ytId(url); return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white` : ''; }
function ytThumb(url: string) { const id = ytId(url); return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''; }

// Animated counter — counts up when visible
function AnimCounter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const step = 16;
        const steps = duration / step;
        let i = 0;
        const t = setInterval(() => {
          i++;
          const progress = 1 - Math.pow(1 - i / steps, 3); // easeOutCubic
          setVal(Math.round(progress * target));
          if (i >= steps) clearInterval(t);
        }, step);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{val}</span>;
}

// Social icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
  </svg>
);

export default function HomePage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const heroRef   = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);

  const heroSrc = config.homeMedia[0]?.src || '/residences/elysia.jpg';
  const videos  = [...(config.videos ?? [])].sort((a, b) => a.order - b.order);
  const activeVideo = videos[activeVideoIdx] ?? videos[0];

  const residences = config.residenceList ?? [];

  // Hero parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!heroImgRef.current) return;
      const y = window.scrollY;
      heroImgRef.current.style.transform = `translateY(${y * 0.35}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Line reveal helper (observes elements with class .lines-observe)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll<HTMLElement>('.line-inner').forEach((el, i) => {
          setTimeout(() => el.classList.add('lv'), i * 90);
        });
        obs.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    document.querySelectorAll('.lines-observe').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Image mask reveal
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('iv');
        obs.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    document.querySelectorAll('.img-mask, .label-reveal, .hr-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const socialLinks = [
    { icon: <InstagramIcon />, url: config.social.instagram, label: 'Instagram' },
    { icon: <FacebookIcon />,  url: config.social.facebook,  label: 'Facebook' },
    { icon: <LinkedInIcon />,  url: config.social.linkedin,  label: 'LinkedIn' },
    { icon: <YouTubeIcon />,   url: config.social.youtube,   label: 'YouTube' },
  ].filter(s => s.url);

  return (
    <div style={{ background: 'var(--bg-page)', overflowX: 'hidden' }}>
      <Navbar />

      {/* ══════════════════════════════════════
          HERO — full screen with parallax
      ══════════════════════════════════════ */}
      <section ref={heroRef} style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>

        {/* Parallax image */}
        <img
          ref={heroImgRef}
          src={heroSrc}
          alt="Hamadat Hero"
          className="parallax-img"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '115%',
            objectFit: 'cover', objectPosition: 'center',
            top: '-7.5%',
            display: 'block',
          }}
        />

        {/* Gradient veil */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.62) 100%)',
        }} />

        {/* Text — fades in after loader */}
        <div style={{ position: 'absolute', bottom: '80px', left: '60px', maxWidth: '680px', zIndex: 10 }}>
          <p className="hero-sub" style={{
            fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.65)',
            letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '28px',
          }}>
            {lang === 'ar' ? 'حمادة للترقية العقارية' : 'Hamadat Promotion Immobilière'}
          </p>

          <div style={{ overflow: 'hidden', marginBottom: '4px' }}>
            <h1 className="hero-line-1" style={{
              fontSize: 'clamp(44px, 6.5vw, 88px)',
              fontWeight: '300', color: '#fff',
              lineHeight: '1.05', letterSpacing: '-1.5px', margin: 0,
            }}>
              {lang === 'ar' ? 'حيث يتحقق' : 'La où le rêve'}
            </h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '36px' }}>
            <h1 className="hero-line-2" style={{
              fontSize: 'clamp(44px, 6.5vw, 88px)',
              fontWeight: '300', color: 'rgba(255,255,255,0.65)',
              fontStyle: 'italic',
              lineHeight: '1.05', letterSpacing: '-1.5px', margin: 0,
            }}>
              {lang === 'ar' ? 'حلمك السكني.' : 'prend toit.'}
            </h1>
          </div>

          <div className="hero-cta" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/projets" data-cursor style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#0e7470', color: '#fff',
              padding: '15px 36px', borderRadius: '4px',
              fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px',
              textDecoration: 'none', textTransform: 'uppercase',
              transition: 'background 0.3s ease, transform 0.3s ease',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#0a5450';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#0e7470';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {lang === 'ar' ? 'استكشف مشاريعنا' : 'Découvrir nos projets'}
              <span style={{ fontSize: '18px', fontWeight: '300' }}>→</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll" style={{
          position: 'absolute', bottom: '36px', right: '60px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        }}>
          <span style={{
            fontSize: '9px', color: 'rgba(255,255,255,0.45)',
            letterSpacing: '3px', textTransform: 'uppercase',
            writingMode: 'vertical-lr',
          }}>Scroll</span>
          <div style={{
            width: '1px', height: '56px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
            animation: 'scrollBounce 2.2s ease-in-out infinite',
          }} />
        </div>

        {/* Project count — bottom left corner line */}
        <div style={{
          position: 'absolute', bottom: '36px', left: '60px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{ width: '32px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>
            {residences.length || 6} {lang === 'ar' ? 'مشاريع' : 'projets'}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — animated counters
      ══════════════════════════════════════ */}
      <section style={{ background: 'var(--bg-page)', padding: '120px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <RevealBlock delay={0}>
            <span className="label-reveal" style={{
              display: 'block',
              fontSize: '10px', fontWeight: '700', color: 'var(--teal)',
              letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '72px',
            }}>
              {lang === 'ar' ? 'أرقامنا' : 'En Chiffres'}
            </span>
          </RevealBlock>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="stats-grid">
            {STATS.map((s, i) => (
              <RevealBlock key={i} delay={i * 0.12} y={32}>
                <div style={{
                  borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                  paddingLeft: i > 0 ? '52px' : '0',
                  paddingRight: '52px',
                }}>
                  <div style={{
                    fontSize: 'clamp(52px, 5.5vw, 84px)',
                    fontWeight: '200', color: 'var(--text-1)',
                    lineHeight: '1', letterSpacing: '-3px',
                    marginBottom: '14px',
                  }}>
                    <AnimCounter target={s.value} />
                  </div>
                  <p style={{
                    fontSize: '13px', color: 'var(--text-3)',
                    fontWeight: '500', margin: 0, letterSpacing: '0.3px',
                  }}>
                    {lang === 'ar' ? s.label_ar : s.label_fr}
                  </p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROJECTS GRID
      ══════════════════════════════════════ */}
      <section style={{ background: 'var(--bg-card)', padding: '120px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
            <div className="lines-observe">
              <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
                <span className="line-inner label-reveal" style={{
                  display: 'block',
                  fontSize: '10px', fontWeight: '700', color: 'var(--teal)',
                  letterSpacing: '6px', textTransform: 'uppercase',
                }}>
                  {lang === 'ar' ? 'مشاريعنا' : 'Nos Projets'}
                </span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h2 className="line-inner" style={{
                  fontSize: 'clamp(28px, 3.5vw, 52px)',
                  fontWeight: '300', color: 'var(--text-1)',
                  letterSpacing: '-1px', margin: 0, lineHeight: '1.1',
                }}>
                  {lang === 'ar' ? 'مجمعات سكنية فاخرة' : 'Résidences de prestige'}
                </h2>
              </div>
            </div>

            <RevealBlock delay={0.3} y={20}>
              <Link href="/projets" data-cursor style={{
                fontSize: '12px', fontWeight: '600', color: 'var(--teal)',
                textDecoration: 'none', letterSpacing: '1px',
                display: 'flex', alignItems: 'center', gap: '8px',
                whiteSpace: 'nowrap', textTransform: 'uppercase',
                borderBottom: '1px solid var(--teal)', paddingBottom: '2px',
                transition: 'opacity 0.3s',
              }}>
                {lang === 'ar' ? 'عرض الكل' : 'Voir tous'} →
              </Link>
            </RevealBlock>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px' }}>
            {residences.map((r, i) => {
              const gs = config.residences[r.slug]?.gridSize ?? 3;
              const thumb = config.residences[r.slug]?.thumbnail || `/residences/${r.slug}.jpg`;

              return (
                <RevealBlock
                  key={r.id}
                  delay={i * 0.08}
                  y={40}
                  style={{ gridColumn: `span ${gs}` }}
                >
                  <Link
                    href={`/projets/${r.slug}`}
                    data-cursor
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div
                      className="card-hover"
                      style={{
                        position: 'relative', height: '280px',
                        overflow: 'hidden', borderRadius: '4px',
                        background: 'var(--border)',
                      }}
                    >
                      {/* Image with zoom on hover */}
                      <img
                        src={thumb}
                        alt={r.name_fr}
                        style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%', objectFit: 'cover',
                          transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
                          display: 'block',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.07)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />

                      {/* Hover overlay */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(14,116,112,0.12)',
                        opacity: 0, transition: 'opacity 0.4s ease',
                      }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                      />

                      <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                        <h3 style={{ fontSize: gs >= 4 ? '22px' : '16px', fontWeight: '400', color: '#fff', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
                          {lang === 'ar' ? r.name_ar : r.name_fr}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{r.location}</p>
                      </div>

                      <div style={{
                        position: 'absolute', top: '14px', left: '14px',
                        background: r.status === 'completed' ? 'rgba(16,185,129,0.9)' : r.status === 'sold' ? 'rgba(99,102,241,0.9)' : 'rgba(14,116,112,0.9)',
                        color: '#fff', padding: '4px 10px',
                        fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '2px',
                      }}>
                        {r.status === 'completed' ? (lang === 'ar' ? 'منجز' : 'Livré') : r.status === 'sold' ? (lang === 'ar' ? 'مباع' : 'Vendu') : (lang === 'ar' ? 'جارٍ' : 'En cours')}
                      </div>
                    </div>
                  </Link>
                </RevealBlock>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VIDEOS
      ══════════════════════════════════════ */}
      {videos.length > 0 && (
        <section style={{ background: 'var(--bg-page)', padding: '120px 60px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            <div className="lines-observe" style={{ marginBottom: '56px' }}>
              <div style={{ overflow: 'hidden', marginBottom: '12px' }}>
                <span className="line-inner" style={{
                  display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--teal)',
                  letterSpacing: '4px', textTransform: 'uppercase',
                }}>
                  {lang === 'ar' ? 'إنجازاتنا' : 'Nos Réalisations'}
                </span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h2 className="line-inner" style={{
                  fontSize: 'clamp(28px, 3.5vw, 52px)',
                  fontWeight: '300', color: 'var(--text-1)',
                  letterSpacing: '-1px', margin: 0,
                }}>
                  {lang === 'ar' ? 'مشاريعنا بالفيديو' : 'Projets en Vidéo'}
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }} className="video-layout">

              <RevealBlock delay={0.1} y={48}>
                <div style={{
                  position: 'relative', width: '100%', paddingTop: '56.25%',
                  borderRadius: '6px', overflow: 'hidden', background: '#000',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
                }}>
                  {activeVideo && (
                    <iframe
                      key={activeVideo.id}
                      src={ytEmbed(activeVideo.url)}
                      title={activeVideo.label}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                {activeVideo && (
                  <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-1)', marginTop: '16px', marginBottom: 0 }}>
                    {activeVideo.label}
                  </p>
                )}
              </RevealBlock>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {videos.map((v, idx) => {
                  const active = idx === activeVideoIdx;
                  return (
                    <RevealBlock key={v.id} delay={0.15 + idx * 0.07} y={24}>
                      <button onClick={() => setActiveVideoIdx(idx)} data-cursor style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: active ? 'var(--bg-card)' : 'transparent',
                        border: 'none',
                        borderLeft: active ? '3px solid var(--teal)' : '3px solid transparent',
                        borderRadius: '0 6px 6px 0',
                        padding: '10px 12px 10px 14px',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        transition: 'all 0.25s ease',
                        boxShadow: active ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                      }}>
                        <div style={{ position: 'relative', width: '90px', height: '58px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: 'var(--border)' }}>
                          <img src={ytThumb(v.url)} alt={v.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          <div style={{ position: 'absolute', inset: 0, background: active ? 'rgba(14,116,112,0.45)' : 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #0e7470', marginLeft: '2px' }} />
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: active ? '600' : '400', color: active ? 'var(--teal)' : 'var(--text-2)', lineHeight: '1.4', transition: 'color 0.2s' }}>
                          {v.label}
                        </span>
                      </button>
                    </RevealBlock>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          ABOUT — image + text side by side
      ══════════════════════════════════════ */}
      <section style={{ background: 'var(--bg-page)', padding: '140px 60px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '96px', alignItems: 'center' }} className="about-grid">

          {/* Text */}
          <div>
            <RevealBlock delay={0} y={32}>
              <span style={{
                display: 'block',
                fontSize: '10px', fontWeight: '700', color: 'var(--teal)',
                letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '28px',
              }}>
                {lang === 'ar' ? 'من نحن' : 'À Propos'}
              </span>
            </RevealBlock>

            <div className="lines-observe" style={{ marginBottom: '28px' }}>
              <div style={{ overflow: 'hidden' }}>
                <h2 className="line-inner" style={{
                  fontSize: 'clamp(28px, 3vw, 46px)',
                  fontWeight: '300', color: 'var(--text-1)',
                  letterSpacing: '-0.8px', margin: 0, lineHeight: '1.2',
                }}>
                  {lang === 'ar' ? 'رؤية واضحة،' : 'Une vision claire,'}
                </h2>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h2 className="line-inner" style={{
                  fontSize: 'clamp(28px, 3vw, 46px)',
                  fontWeight: '300', color: 'var(--text-3)',
                  fontStyle: 'italic',
                  letterSpacing: '-0.8px', margin: 0, lineHeight: '1.2',
                }}>
                  {lang === 'ar' ? 'جودة لا تُضاهى' : 'une qualité irréprochable'}
                </h2>
              </div>
            </div>

            <RevealBlock delay={0.2} y={24}>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: '1.9', fontWeight: '300', marginBottom: '40px' }}>
                {lang === 'ar'
                  ? (config.apropos.story_ar || 'تأسست حمادة برؤية واضحة: تقديم مشاريع سكنية فاخرة تجمع بين الجودة العالية والتصاميم المعاصرة في أفضل مواقع الجزائر.')
                  : (config.apropos.story_fr || "Hamadat a été fondée avec une vision précise : offrir des résidences de prestige alliant qualité exceptionnelle et architecture contemporaine dans les meilleurs emplacements d'Algérie.")}
              </p>
              <Link href="/apropos" data-cursor style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                fontSize: '12px', fontWeight: '600', color: 'var(--teal)',
                textDecoration: 'none', letterSpacing: '1.5px', textTransform: 'uppercase',
                borderBottom: '1px solid var(--teal)', paddingBottom: '3px',
                transition: 'opacity 0.3s, letter-spacing 0.5s',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.letterSpacing = '2.5px'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.letterSpacing = '1.5px'; }}
              >
                {lang === 'ar' ? 'اقرأ المزيد' : 'En savoir plus'} →
              </Link>
            </RevealBlock>
          </div>

          {/* Image with mask reveal */}
          <RevealBlock delay={0.15} y={0}>
            <div style={{
              position: 'relative', height: '500px',
              borderRadius: '4px', overflow: 'hidden', background: 'var(--border)',
            }}>
              <img
                src={config.aboutImage || '/residences/les-3-princes/vue-2.jpg'}
                alt="À Propos Hamadat"
                className="img-mask"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Decorative line */}
              <div style={{
                position: 'absolute', bottom: '-20px', left: '24px',
                width: '1px', height: '64px',
                background: 'var(--teal)',
              }} />
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOCIAL CTA — dark footer strip
      ══════════════════════════════════════ */}
      <section style={{
        background: 'var(--bg-footer)',
        padding: '100px 60px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background subtle lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 80px)',
        }} />

        <RevealBlock delay={0} y={32}>
          <span style={{
            display: 'block',
            fontSize: '10px', fontWeight: '700', color: 'var(--teal)',
            letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px',
          }}>
            {lang === 'ar' ? 'تابعونا' : 'Suivez-nous'}
          </span>
        </RevealBlock>

        <div className="lines-observe" style={{ marginBottom: '56px' }}>
          <div style={{ overflow: 'hidden' }}>
            <h2 className="line-inner" style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: '300', color: '#fff',
              letterSpacing: '-1.5px', margin: 0,
            }}>
              {lang === 'ar' ? 'ابقوا على تواصل' : 'Restez connectés'}
            </h2>
          </div>
        </div>

        {socialLinks.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', position: 'relative' }}>
            {socialLinks.map(({ icon, url, label }, i) => (
              <RevealBlock key={label} delay={i * 0.07} y={20}>
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} data-cursor style={{
                  width: '54px', height: '54px', borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', textDecoration: 'none',
                  transition: 'background 0.3s ease, border-color 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(14,116,112,0.3)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,116,112,0.6)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {icon}
                </a>
              </RevealBlock>
            ))}
          </div>
        ) : (
          <RevealBlock delay={0.2} y={20}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
              {lang === 'ar' ? 'الروابط قابلة للضبط في لوحة الإدارة' : "Liens configurables dans l'administration"}
            </p>
          </RevealBlock>
        )}
      </section>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .video-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </div>
  );
}
