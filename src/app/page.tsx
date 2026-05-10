'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

const ALL_PROJECTS = [
  { slug: 'elysia',        name: 'Elysia',        location: 'Jijel',                status: 'ongoing' },
  { slug: 'les-3-princes', name: 'Les 3 Princes',  location: 'Dely Brahim, Alger',   status: 'completed' },
  { slug: 'orea',          name: 'Orea',           location: 'Dely Brahim, Alger',   status: 'ongoing' },
  { slug: 'lumalac',       name: 'Lumalac',        location: 'Dely Brahim, Alger',   status: 'ongoing' },
  { slug: 'marmo',         name: 'Marmo',          location: 'Dely Brahim, Alger',   status: 'completed' },
  { slug: 'vertdalya',     name: 'Vert Dalya',     location: 'Dely Brahim, Alger',   status: 'completed' },
];

const STATS = [
  { value: '6',    fr: 'Projets',            ar: 'مشاريع' },
  { value: '163',  fr: 'Unités résidentielles', ar: 'وحدة سكنية' },
  { value: '4',    fr: 'Projets en cours',   ar: 'مشاريع جارية' },
  { value: '2024', fr: 'Année de création',  ar: 'سنة التأسيس' },
];

const SECTIONS = [
  { id: 'hero',     label: 'Accueil' },
  { id: 'stats',    label: 'Chiffres' },
  { id: 'projects', label: 'Projets' },
  { id: 'videos',   label: 'Vidéos' },
  { id: 'about',    label: 'À Propos' },
  { id: 'social',   label: 'Social' },
];

// ── YouTube helpers ──────────────────────────────────────────
function ytId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\s#]+)/);
  return m ? m[1] : '';
}
function ytEmbed(url: string) { const id = ytId(url); return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white` : ''; }
function ytThumb(url: string) { const id = ytId(url); return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''; }

// Uniform card height — width only is determined by gridSize span
const GRID_CARD_HEIGHT = 260;

// ── Social SVG pictograms — clean geometric outlines ──────────
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
  const [activeSection, setActiveSection] = useState('hero');
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const heroSrc = config.homeMedia[0]?.src || '/residences/elysia.jpg';

  const videos = [...(config.videos ?? [])].sort((a, b) => a.order - b.order);
  const activeVideo = videos[activeVideoIdx] ?? videos[0];

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: <InstagramIcon />, url: config.social.instagram, label: 'Instagram' },
    { icon: <FacebookIcon />,  url: config.social.facebook,  label: 'Facebook' },
    { icon: <LinkedInIcon />,  url: config.social.linkedin,  label: 'LinkedIn' },
    { icon: <YouTubeIcon />,   url: config.social.youtube,   label: 'YouTube' },
  ].filter(s => s.url);

  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Scroll nav dots */}
      <div className="scroll-dots" style={{
        position: 'fixed', right: '28px', top: '50%', transform: 'translateY(-50%)',
        zIndex: 500, display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            title={label}
            aria-label={label}
            style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: activeSection === id ? 'var(--teal)' : 'var(--border)',
              border: activeSection === id ? '2px solid var(--teal)' : '2px solid transparent',
              cursor: 'pointer', padding: 0, transition: 'all 0.25s ease',
              outline: 'none',
            }}
          />
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="hero" style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>
        <img
          src={heroSrc}
          alt="Hamadat — Hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
        }} />

        <div className="hero-content" style={{
          position: 'absolute', bottom: '72px', left: '60px',
          maxWidth: '640px', zIndex: 10,
          animation: 'fadeUp 1s ease-out 0.2s both',
        }}>
          <p style={{
            fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.7)',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px',
          }}>
            {lang === 'ar' ? 'حمادة للترقية العقارية' : 'Hamadat Promotion Immobilière'}
          </p>
          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 80px)',
            fontWeight: '300', color: '#fff',
            lineHeight: '1.1', letterSpacing: '-1px',
            marginBottom: '28px',
          }}>
            {lang === 'ar'
              ? <><span>حيث يتحقق</span><br /><span>حلمك السكني</span></>
              : <><span>La où le rêve</span><br /><span>prend toit.</span></>}
          </h1>
          <Link href="/projets" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: '#0e7470', color: '#fff',
            padding: '14px 32px', borderRadius: '4px',
            fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px',
            textDecoration: 'none', textTransform: 'uppercase',
            transition: 'background 0.25s ease',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}
          >
            {lang === 'ar' ? 'استكشف مشاريعنا' : 'Découvrir nos projets'}
            <span style={{ fontSize: '16px' }}>→</span>
          </Link>
        </div>

        <div className="hero-scroll-ind" style={{
          position: 'absolute', bottom: '32px', right: '60px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          animation: 'bounce 2s infinite',
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', writingMode: 'vertical-lr' }}>Scroll</span>
          <div style={{ width: '1px', height: '48px', background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="page-section" style={{ background: 'var(--bg-page)', padding: '100px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            fontSize: '11px', fontWeight: '700', color: 'var(--teal)',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '64px',
          }}>
            {lang === 'ar' ? 'أرقامنا' : 'En Chiffres'}
          </p>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0' }}>
            {STATS.map((s, i) => (
              <div key={i} className={i > 0 ? 'stat-item stat-item-border' : 'stat-item'} style={{
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                paddingLeft: i > 0 ? '48px' : '0',
                paddingRight: '48px',
              }}>
                <div style={{
                  fontSize: 'clamp(56px, 6vw, 88px)',
                  fontWeight: '200', color: 'var(--text-3)',
                  lineHeight: '1', letterSpacing: '-3px',
                  marginBottom: '12px',
                }}>
                  {s.value}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: '500', margin: 0, letterSpacing: '0.3px' }}>
                  {lang === 'ar' ? s.ar : s.fr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section id="projects" className="page-section projects-section" style={{ background: 'var(--bg-card)', padding: '100px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="projects-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>
                {lang === 'ar' ? 'مشاريعنا' : 'Nos Projets'}
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
                {lang === 'ar' ? 'مجمعات سكنية فاخرة' : 'Résidences de prestige'}
              </h2>
            </div>
            <Link href="/projets" style={{
              fontSize: '13px', fontWeight: '600', color: 'var(--teal)',
              textDecoration: 'none', letterSpacing: '0.3px',
              display: 'flex', alignItems: 'center', gap: '6px',
              whiteSpace: 'nowrap',
            }}>
              {lang === 'ar' ? 'عرض الكل ←' : 'Voir tous →'}
            </Link>
          </div>

          {/* Dynamic 6-col grid — dense packing, uniform height */}
          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoFlow: 'row dense', gap: '12px' }}>
            {ALL_PROJECTS.map((p) => {
              const gs = config.residences[p.slug]?.gridSize ?? 3;
              const thumb = config.residences[p.slug]?.thumbnail || `/residences/${p.slug}.jpg`;
              const h = GRID_CARD_HEIGHT;
              return (
                <Link
                  key={p.slug}
                  href={`/projets/${p.slug}`}
                  className="project-card"
                  style={{
                    gridColumn: `span ${gs}`,
                    textDecoration: 'none', color: 'inherit', display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement;
                    if (img) img.style.transform = 'scale(1.04)';
                  }}
                  onMouseLeave={(e) => {
                    const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement;
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ position: 'relative', height: `${h}px`, overflow: 'hidden', borderRadius: '6px', background: 'var(--border)' }}>
                    <img
                      src={thumb}
                      alt={p.name}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                      <h3 style={{ fontSize: gs >= 4 ? '20px' : '15px', fontWeight: '500', color: '#fff', margin: '0 0 3px' }}>{p.name}</h3>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{p.location}</p>
                    </div>
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: p.status === 'completed' ? 'rgba(16,185,129,0.9)' : 'rgba(14,116,112,0.9)',
                      color: '#fff', padding: '3px 8px',
                      fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                      borderRadius: '2px',
                    }}>
                      {p.status === 'completed' ? (lang === 'ar' ? 'منجز' : 'Livré') : (lang === 'ar' ? 'جارٍ' : 'En cours')}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VIDEOS ── */}
      {videos.length > 0 && (
        <section id="videos" className="page-section" style={{ background: 'var(--bg-page)', padding: '100px 60px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: '48px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>
                {lang === 'ar' ? 'إنجازاتنا' : 'Nos Réalisations'}
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
                {lang === 'ar' ? 'مشاريعنا بالفيديو' : 'Projets en Vidéo'}
              </h2>
            </div>

            {/* Layout: big player + sidebar thumbnails */}
            <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

              {/* Active player */}
              <div>
                <div style={{
                  position: 'relative', width: '100%', paddingTop: '56.25%',
                  borderRadius: '8px', overflow: 'hidden', background: '#000',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                }}>
                  {activeVideo && (
                    <iframe
                      key={activeVideo.id}
                      src={ytEmbed(activeVideo.url)}
                      title={activeVideo.label}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
                {activeVideo && (
                  <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-1)', marginTop: '16px', marginBottom: 0 }}>
                    {activeVideo.label}
                  </p>
                )}
              </div>

              {/* Thumbnail sidebar */}
              <div className="video-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {videos.map((v, idx) => {
                  const isActive = idx === activeVideoIdx;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setActiveVideoIdx(idx)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: isActive ? 'var(--bg-card)' : 'transparent',
                        border: 'none',
                        borderLeft: isActive ? '3px solid var(--teal)' : '3px solid transparent',
                        borderRadius: '0 6px 6px 0',
                        padding: '10px 12px 10px 14px',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                      }}
                      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
                      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        position: 'relative', width: '90px', height: '56px',
                        borderRadius: '4px', overflow: 'hidden', flexShrink: 0,
                        background: 'var(--border)',
                      }}>
                        <img
                          src={ytThumb(v.url)}
                          alt={v.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {/* Play icon overlay */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: isActive ? 'rgba(14,116,112,0.45)' : 'rgba(0,0,0,0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}>
                          <div style={{
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #0e7470', marginLeft: '2px' }} />
                          </div>
                        </div>
                      </div>

                      {/* Label */}
                      <span style={{
                        fontSize: '13px', fontWeight: isActive ? '600' : '400',
                        color: isActive ? 'var(--teal)' : 'var(--text-2)',
                        lineHeight: '1.4', transition: 'color 0.2s',
                      }}>
                        {v.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT STRIP ── */}
      <section id="about" className="page-section" style={{ background: 'var(--bg-page)', padding: '100px 60px' }}>
        <div className="about-grid" style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px' }}>
              {lang === 'ar' ? 'من نحن' : 'À Propos'}
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', marginBottom: '24px', lineHeight: '1.25' }}>
              {lang === 'ar' ? 'رؤية واضحة، جودة لا تُضاهى' : 'Une vision claire, une qualité irréprochable'}
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: '1.85', fontWeight: '300', marginBottom: '36px' }}>
              {lang === 'ar'
                ? (config.apropos.story_ar || 'تأسست حمادة برؤية واضحة: تقديم مشاريع سكنية فاخرة تجمع بين الجودة العالية والتصاميم المعاصرة في أفضل مواقع الجزائر.')
                : (config.apropos.story_fr || "Hamadat a été fondée avec une vision précise : offrir des résidences de prestige alliant qualité exceptionnelle et architecture contemporaine dans les meilleurs emplacements d'Algérie.")}
            </p>
            <Link href="/apropos" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', fontWeight: '600', color: 'var(--teal)',
              textDecoration: 'none', letterSpacing: '0.3px',
              borderBottom: '1px solid var(--teal)', paddingBottom: '2px',
            }}>
              {lang === 'ar' ? 'اقرأ المزيد ←' : 'En savoir plus →'}
            </Link>
          </div>
          <div className="about-img" style={{ position: 'relative', height: '460px', borderRadius: '6px', overflow: 'hidden', background: 'var(--border)' }}>
            <img src={config.aboutImage || '/residences/les-3-princes/vue-2.jpg'} alt="À Propos" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── SOCIAL CTA ── */}
      <section id="social" className="social-section" style={{
        background: 'var(--bg-footer)',
        padding: '80px 60px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
          {lang === 'ar' ? 'تابعونا' : 'Suivez-nous'}
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '300', color: '#fff', letterSpacing: '-0.5px', marginBottom: '48px' }}>
          {lang === 'ar' ? 'ابقوا على تواصل' : 'Restez connectés'}
        </h2>

        {socialLinks.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {socialLinks.map(({ icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', textDecoration: 'none',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
              >
                {icon}
              </a>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
            {lang === 'ar' ? 'الروابط قابلة للضبط في لوحة الإدارة' : 'Liens configurables dans l\'administration'}
          </p>
        )}
      </section>

      <Footer />

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        @media (max-width: 860px) {
          .video-grid { grid-template-columns: 1fr !important; }
          .video-sidebar { flex-direction: row !important; overflow-x: auto; gap: 10px !important; }
        }
        @media (max-width: 600px) {
          .scroll-dots { display: none !important; }
          .hero-content { left: 24px !important; right: 24px !important; bottom: 48px !important; max-width: 100% !important; }
          .hero-scroll-ind { display: none !important; }
          .page-section { padding-left: 24px !important; padding-right: 24px !important; padding-top: 60px !important; padding-bottom: 60px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .stat-item-border { border-left: none !important; padding-left: 0 !important; }
          .stat-item { padding-right: 0 !important; }
          .projects-section { padding-top: 60px !important; padding-bottom: 60px !important; }
          .projects-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .project-card { grid-column: span 1 !important; }
          .video-grid { grid-template-columns: 1fr !important; }
          .video-sidebar { flex-direction: row !important; overflow-x: auto !important; gap: 10px !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .about-img { height: 280px !important; }
          .social-section { padding-left: 24px !important; padding-right: 24px !important; padding-top: 60px !important; padding-bottom: 60px !important; }
        }
      `}</style>
    </div>
  );
}
