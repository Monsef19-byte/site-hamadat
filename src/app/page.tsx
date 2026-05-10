'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VoyageSlider from '@/components/VoyageSlider';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

// ─── YouTube helpers ─────────────────────────────────────────
function ytId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\s#]+)/);
  return m ? m[1] : '';
}
function ytEmbed(url: string) { const id = ytId(url); return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white` : ''; }
function ytThumb(url: string) { const id = ytId(url); return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''; }

// ─── Stat counter ────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref  = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const dur = 1800, step = 16, steps = dur / step;
        let i = 0;
        const t = setInterval(() => {
          i++;
          setVal(Math.round((1 - Math.pow(1 - i / steps, 4)) * target));
          if (i >= steps) clearInterval(t);
        }, step);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Social icons ─────────────────────────────────────────────
const IG = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none"/></svg>;
const FB = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const LI = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const YT  = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>;

// ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();

  const heroRef      = useRef<HTMLElement>(null);
  const heroTiltRef  = useRef<HTMLDivElement>(null);
  const heroImgRef   = useRef<HTMLImageElement>(null);
  const titleRef     = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLElement>(null);

  // Hero tilt (pure RAF, no React state)
  const heroTilt = useRef({ rotX: 0, rotY: 0, tgtX: 0, tgtY: 0, raf: 0 });

  const [videoIdx, setVideoIdx] = useState(0);

  const heroSrc  = config.homeMedia[0]?.src || '/residences/elysia/vue-001-1.jpg';
  const videos   = [...(config.videos ?? [])].sort((a, b) => a.order - b.order);
  const residences = config.residenceList ?? [];

  const fallbackResidences = [
    { id: '1', slug: 'elysia',        name_fr: 'Elysia',        name_ar: 'إليسيا',        location: 'Jijel',                status: 'ongoing',   units: 56, typology: 'F3',         description_fr: '', description_ar: '' },
    { id: '2', slug: 'les-3-princes', name_fr: 'Les 3 Princes', name_ar: 'الثلاث أمراء',   location: 'Dely Brahim, Alger',   status: 'completed', units: 43, typology: 'F3–F6',      description_fr: '', description_ar: '' },
    { id: '3', slug: 'orea',          name_fr: 'Orea',          name_ar: 'أوريا',           location: 'Dely Brahim, Alger',   status: 'ongoing',   units: 38, typology: 'F3–F6',      description_fr: '', description_ar: '' },
    { id: '4', slug: 'lumalac',       name_fr: 'Lumalac',       name_ar: 'لوملاك',          location: 'Dely Brahim, Alger',   status: 'ongoing',   units: 8,  typology: 'F3+Triplex', description_fr: '', description_ar: '' },
    { id: '5', slug: 'marmo',         name_fr: 'Marmo',         name_ar: 'مارمو',           location: 'Dely Brahim, Alger',   status: 'completed', units: 8,  typology: 'F3+Duplex',  description_fr: '', description_ar: '' },
    { id: '6', slug: 'vertdalya',     name_fr: 'Vert Dalya',    name_ar: 'فيرت داليا',      location: 'Dely Brahim, Alger',   status: 'completed', units: 10, typology: 'Loft 270m²', description_fr: '', description_ar: '' },
  ] as typeof residences;

  const displayResidences = residences.length > 0 ? residences : fallbackResidences;

  // Build VoyageSlider slides from residences
  const voyageSlides = displayResidences.map(r => ({
    image:       config.residences[r.slug]?.thumbnail || `/residences/${r.slug}/vue-001-1.jpg`,
    title:       lang === 'ar' ? r.name_ar : r.name_fr,
    subtitle:    r.location,
    description: r.typology,
    href:        `/projets/${r.slug}`,
  }));

  // ── Hero 3D tilt ──────────────────────────────────────────────
  useEffect(() => {
    const el = heroTiltRef.current;
    if (!el) return;
    const s = heroTilt.current;
    const tick = () => {
      s.rotX += (s.tgtX - s.rotX) * 0.05;
      s.rotY += (s.tgtY - s.rotY) * 0.05;
      el.style.transform = `rotateX(${s.rotX.toFixed(3)}deg) rotateY(${s.rotY.toFixed(3)}deg)`;
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const onHeroMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    heroTilt.current.tgtY =  ((e.clientX - r.left - r.width  / 2) / r.width)  * 6;
    heroTilt.current.tgtX = -((e.clientY - r.top  - r.height / 2) / r.height) * 4;
  };
  const onHeroLeave = () => { heroTilt.current.tgtX = 0; heroTilt.current.tgtY = 0; };

  // ── GSAP — title only, no pinning ───────────────────────────
  useEffect(() => {
    let raf = 0;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // 1. Hero title chars
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll<HTMLElement>('.char');
        if (chars.length) {
          gsap.fromTo(chars,
            { y: 80, opacity: 0, skewY: 5 },
            { y: 0, opacity: 1, skewY: 0, duration: 0.7, ease: 'power4.out', stagger: 0.022, delay: 1.0 }
          );
        }
      }

      // 2. Hero image parallax (light — no scrub, just a translate on scroll)
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          y: '25%',
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      // 3. Simple fade-up reveals (no pin, no scrub)
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach(el => {
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
        );
      });

      // 4. Line draws
      gsap.utils.toArray<HTMLElement>('.line-draw').forEach(el => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 0.8, ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
        );
      });

      // 5. Stats
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.querySelectorAll('.stat-item'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: statsRef.current, start: 'top 72%', once: true } }
        );
      }
    };

    raf = requestAnimationFrame(() => init());
    return () => {
      cancelAnimationFrame(raf);
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.getAll().forEach(t => t.kill()));
    };
  }, []);

  const STATS = [
    { val: displayResidences.length,                                              fr: 'Projets',               ar: 'مشاريع'     },
    { val: 163,                                                                   fr: 'Unités résidentielles', ar: 'وحدة سكنية' },
    { val: displayResidences.filter(r => r.status === 'ongoing').length || 4,    fr: 'En cours',              ar: 'جارية'      },
    { val: 2024,                                                                  fr: 'Fondée en',             ar: 'تأسست عام'  },
  ];

  const socialLinks = [
    { icon: <IG />, url: config.social.instagram, label: 'Instagram' },
    { icon: <FB />, url: config.social.facebook,  label: 'Facebook'  },
    { icon: <LI />, url: config.social.linkedin,  label: 'LinkedIn'  },
    { icon: <YT />, url: config.social.youtube,   label: 'YouTube'   },
  ].filter(s => s.url);

  return (
    <div style={{ background: 'transparent', color: '#fff', overflowX: 'hidden', position: 'relative', zIndex: 1 }}>
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMove}
        onMouseLeave={onHeroLeave}
        style={{ position: 'relative', height: '100vh', minHeight: '560px', overflow: 'hidden', perspective: '1200px' }}
      >
        {/* Tilt + Ken Burns wrapper */}
        <div ref={heroTiltRef} style={{ position: 'absolute', inset: '-4%', transformStyle: 'preserve-3d', willChange: 'transform' }}>
          <img
            ref={heroImgRef}
            src={heroSrc}
            alt="Hamadat"
            className="hero-bg-zoom"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,8,10,0.15) 0%, rgba(6,8,10,0.80) 100%)' }} />
        </div>

        {/* Title */}
        <div style={{ position: 'absolute', bottom: '80px', left: '60px', zIndex: 10 }}>
          <p style={{
            fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)',
            letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '20px',
            animation: 'fadeSlideUp 0.9s ease-out 2s both',
          }}>
            {lang === 'ar' ? 'حمادة للترقية العقارية' : 'Hamadat Promotion Immobilière'}
          </p>

          <div ref={titleRef} style={{ overflow: 'hidden', marginBottom: '0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', lineHeight: 0.9 }}>
              {'HAMADAT'.split('').map((ch, i) => (
                <span key={i} className="char" style={{
                  display: 'inline-block',
                  fontSize: 'clamp(72px, 13vw, 170px)',
                  fontWeight: '200',
                  color: i < 3 ? '#fff' : 'rgba(14,116,112,0.85)',
                  letterSpacing: '-0.04em',
                  opacity: 0,
                }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 24px)', fontWeight: '300',
            color: 'rgba(255,255,255,0.45)', fontStyle: 'italic',
            marginTop: '16px', marginBottom: '36px',
            animation: 'fadeSlideUp 0.9s ease-out 3.0s both',
          }}>
            {lang === 'ar' ? 'حيث يتحقق حلمك السكني.' : 'La où le rêve prend toit.'}
          </p>

          <div style={{ display: 'flex', gap: '16px', animation: 'fadeSlideUp 0.9s ease-out 3.2s both' }}>
            <Link href="/projets" data-cursor style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'linear-gradient(135deg, #0e7470 0%, #0a5450 100%)',
              color: '#fff', padding: '14px 34px', borderRadius: '4px',
              fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px',
              textDecoration: 'none', textTransform: 'uppercase',
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              boxShadow: '0 8px 32px rgba(14,116,112,0.4)',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 16px 48px rgba(14,116,112,0.55)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 8px 32px rgba(14,116,112,0.4)'; }}
            >
              {lang === 'ar' ? 'اكتشف مشاريعنا' : 'Découvrir'} →
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', right: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'fadeSlideUp 0.8s ease-out 3.8s both' }}>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', textTransform: 'uppercase', writingMode: 'vertical-lr' }}>scroll</span>
          <div style={{ width: '1px', height: '56px', background: 'linear-gradient(to bottom, rgba(14,116,112,0.8), transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. RESIDENCES — VoyageSlider
      ═══════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 2 }}>
        {/* Section header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '80px 60px 0',
        }}>
          <div>
            <p className="gsap-reveal" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '10px' }}>
              {lang === 'ar' ? 'مشاريعنا' : 'Nos Résidences'}
            </p>
            <h2 className="gsap-reveal" style={{ fontSize: 'clamp(28px, 4vw, 54px)', fontWeight: '200', color: '#fff', letterSpacing: '-1px', margin: 0 }}>
              {lang === 'ar' ? 'اكتشف مجمعاتنا السكنية' : 'Découvrez nos résidences'}
            </h2>
          </div>
          <Link href="/projets" className="gsap-reveal" data-cursor style={{
            fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)',
            letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'color 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0e7470'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
          >
            {lang === 'ar' ? 'عرض الكل' : 'Voir tous'} →
          </Link>
        </div>

        {voyageSlides.length > 0 && (
          <VoyageSlider slides={voyageSlides} />
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. STATS
      ═══════════════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ padding: '120px 60px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="line-draw" style={{ height: '1px', background: 'rgba(14,116,112,0.3)', marginBottom: '80px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item" style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '36px 32px',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  fontSize: 'clamp(44px, 5.5vw, 80px)', fontWeight: '100',
                  color: '#fff', lineHeight: 1, letterSpacing: '-0.04em',
                  marginBottom: '12px', fontVariantNumeric: 'tabular-nums',
                }}>
                  <Counter target={s.val} />
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(14,116,112,0.8)', fontWeight: '600', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? s.ar : s.fr}
                </p>
              </div>
            ))}
          </div>

          <div className="line-draw" style={{ height: '1px', background: 'rgba(14,116,112,0.3)', marginTop: '80px' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. ABOUT
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '120px 60px', position: 'relative' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'stretch' }} className="about-grid">

          <div className="gsap-reveal" style={{
            position: 'relative', borderRadius: '12px', overflow: 'hidden',
            height: '520px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <img
              src={config.aboutImage || '/residences/les-3-princes/vue-2.jpg'}
              alt="À Propos"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(14,116,112,0.15) 0%, transparent 60%)' }} />
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '48px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}>
            <p className="gsap-reveal" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '28px' }}>
              {lang === 'ar' ? 'من نحن' : 'À Propos'}
            </p>
            <h2 className="gsap-reveal" style={{ fontSize: 'clamp(26px, 3.2vw, 48px)', fontWeight: '200', color: '#fff', letterSpacing: '-1px', lineHeight: 1.2, marginBottom: '28px' }}>
              {lang === 'ar'
                ? <><span>رؤية واضحة،</span><br /><em style={{ color: 'rgba(14,116,112,0.8)', fontStyle: 'italic' }}>جودة لا تُضاهى</em></>
                : <><span>Une vision claire,</span><br /><em style={{ color: 'rgba(14,116,112,0.8)', fontStyle: 'italic' }}>une qualité irréprochable</em></>
              }
            </h2>
            <p className="gsap-reveal" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, fontWeight: '300', marginBottom: '40px' }}>
              {lang === 'ar'
                ? (config.apropos.story_ar || 'تأسست حمادة برؤية واضحة: تقديم مشاريع سكنية فاخرة تجمع بين الجودة العالية والتصاميم المعاصرة في أفضل مواقع الجزائر.')
                : (config.apropos.story_fr || "Hamadat a été fondée avec une vision précise : offrir des résidences de prestige alliant qualité exceptionnelle et architecture contemporaine dans les meilleurs emplacements d'Algérie.")}
            </p>
            <Link href="/apropos" className="gsap-reveal" data-cursor style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              fontSize: '11px', fontWeight: '700', color: 'rgba(14,116,112,0.9)',
              letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
              borderBottom: '1px solid rgba(14,116,112,0.4)', paddingBottom: '4px',
              transition: 'all 0.4s ease', alignSelf: 'flex-start',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.letterSpacing = '5px'; el.style.borderBottomColor = '#0e7470'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.letterSpacing = '3px'; el.style.borderBottomColor = 'rgba(14,116,112,0.4)'; }}
            >
              {lang === 'ar' ? 'اقرأ أكثر' : 'En savoir plus'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. VIDEOS
      ═══════════════════════════════════════════════════════ */}
      {videos.length > 0 && (
        <section style={{ padding: '100px 60px 120px', position: 'relative' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p className="gsap-reveal" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '16px' }}>
              {lang === 'ar' ? 'إنجازاتنا' : 'Nos Réalisations'}
            </p>
            <h2 className="gsap-reveal" style={{ fontSize: 'clamp(26px, 3.5vw, 48px)', fontWeight: '200', color: '#fff', letterSpacing: '-1px', marginBottom: '48px' }}>
              {lang === 'ar' ? 'مشاريعنا بالفيديو' : 'Projets en Vidéo'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }} className="video-layout">
              <div className="gsap-reveal">
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {videos[videoIdx] && (
                    <iframe
                      key={videos[videoIdx].id}
                      src={ytEmbed(videos[videoIdx].url)}
                      title={videos[videoIdx].label}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {videos.map((v, i) => (
                  <button key={v.id} onClick={() => setVideoIdx(i)} data-cursor style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    background: i === videoIdx ? 'rgba(14,116,112,0.15)' : 'transparent',
                    border: 'none',
                    borderLeft: i === videoIdx ? '2px solid #0e7470' : '2px solid transparent',
                    padding: '10px 12px 10px 14px', borderRadius: '0 8px 8px 0',
                    cursor: 'pointer', width: '100%', textAlign: 'left',
                    transition: 'all 0.25s ease',
                  }}>
                    <div style={{ position: 'relative', width: '80px', height: '52px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={ytThumb(v.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid rgba(255,255,255,0.9)', marginLeft: '2px' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: i === videoIdx ? '#2dd4bf' : 'rgba(255,255,255,0.45)', lineHeight: 1.4, fontWeight: i === videoIdx ? '600' : '400', transition: 'color 0.2s' }}>
                      {v.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          6. SOCIAL
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '120px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(14,116,112,0.12)' }}>
        <p className="gsap-reveal" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '20px' }}>
          {lang === 'ar' ? 'تابعونا' : 'Suivez-nous'}
        </p>
        <h2 className="gsap-reveal" style={{ fontSize: 'clamp(32px, 5.5vw, 72px)', fontWeight: '200', color: '#fff', letterSpacing: '-1.5px', marginBottom: '56px' }}>
          {lang === 'ar' ? 'ابقوا على تواصل' : 'Restez connectés'}
        </h2>

        {socialLinks.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {socialLinks.map(({ icon, url, label }) => (
              <div key={label} className="gsap-reveal">
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} data-cursor style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  border: '1px solid rgba(14,116,112,0.3)',
                  background: 'rgba(14,116,112,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                  transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-8px) scale(1.15)'; el.style.background = 'rgba(14,116,112,0.3)'; el.style.borderColor = 'rgba(14,116,112,0.7)'; el.style.boxShadow = '0 12px 32px rgba(14,116,112,0.4)'; el.style.color = '#fff'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.background = 'rgba(14,116,112,0.08)'; el.style.borderColor = 'rgba(14,116,112,0.3)'; el.style.boxShadow = 'none'; el.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  {icon}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="gsap-reveal" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>
            {lang === 'ar' ? 'روابط التواصل الاجتماعي قابلة للضبط' : "Réseaux sociaux configurables dans l'administration"}
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
