'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTilt } from '@/lib/use-tilt';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

function ytId(url: string) { const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\s#]+)/); return m ? m[1] : ''; }
function ytEmbed(url: string) { const id = ytId(url); return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white` : ''; }
function ytThumb(url: string) { const id = ytId(url); return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''; }

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const dur = 2200, step = 16, steps = dur / step;
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

const HERO_SLIDES = [
  { image: '/residences/elysia/vue-001-1.jpg', tag_fr: 'Elysia — Jijel', tag_ar: 'إليسيا — جيجل', sub_fr: "L'excellence résidentielle au bord de la Méditerranée", sub_ar: 'تميز سكني على ضفاف المتوسط' },
  { image: '/residences/les-3-princes/vue-drone.jpg', tag_fr: 'Les 3 Princes — Dely Brahim', tag_ar: 'الثلاث أمراء — دالي إبراهيم', sub_fr: "L'art de bâtir à la hauteur de vos ambitions", sub_ar: 'فن البناء على مستوى طموحاتك' },
  { image: '/residences/orea/b1.jpg', tag_fr: 'Orea — Dely Brahim', tag_ar: 'أوريا — دالي إبراهيم', sub_fr: 'Chaque projet, un engagement indéfectible', sub_ar: 'كل مشروع التزام لا يتزعزع' },
  { image: '/residences/vertdalya/vrtdalya.png', tag_fr: 'Vert Dalya — Dely Brahim', tag_ar: 'فيرت داليا — دالي إبراهيم', sub_fr: "Où l'élégance architecturale rencontre le confort", sub_ar: 'حيث تلتقي الأناقة المعمارية بالراحة' },
];

function ResidenceCard({ r, thumb, lang }: {
  r: { slug: string; name_fr: string; name_ar: string; location: string; status: string; units: number; typology?: string };
  thumb: string; lang: string;
}) {
  const { innerRef, onMouseMove, onMouseLeave } = useTilt();
  const [hov, setHov] = useState(false);
  return (
    <a href={`/projets/${r.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="h-scroll-card"
        style={{ perspective: '800px' }}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => { onMouseLeave(); setHov(false); }}
      >
        <div ref={innerRef} style={{ transformStyle: 'preserve-3d', transform: 'rotateX(var(--rotX,0deg)) rotateY(var(--rotY,0deg))' }}>
          <div style={{
            position: 'relative', aspectRatio: '3/4', overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: hov ? '0 40px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(14,116,112,0.3)' : '0 16px 48px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <img src={thumb} alt={r.name_fr} style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hov ? 'scale(1.08) translate3d(var(--bgPosX,0%),var(--bgPosY,0%),0)' : 'scale(1.15) translate3d(var(--bgPosX,0%),var(--bgPosY,0%),0)',
              filter: hov ? 'brightness(0.9)' : 'brightness(0.65)',
              transition: 'filter 0.6s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,8,10,0.75) 0%, transparent 50%)' }} />
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
            <div style={{
              position: 'absolute', bottom: '20px', left: '20px', right: '20px',
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: '300', color: '#fff', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
                {lang === 'ar' ? r.name_ar : r.name_fr}
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{r.location}</p>
            </div>
            {/* Hover arrow */}
            <div style={{
              position: 'absolute', bottom: '20px', right: '20px',
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(14,116,112,0.8)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: hov ? 1 : 0,
              transform: hov ? 'scale(1) rotate(-45deg)' : 'scale(0.5) rotate(0deg)',
              transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
              fontSize: '18px', color: '#fff',
            }}>→</div>
          </div>
        </div>
      </div>
    </a>
  );
}

const IG = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none"/></svg>;
const FB = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const LI = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const YT = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>;

export default function HomePage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const heroTiltRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const hScrollTrackRef = useRef<HTMLDivElement>(null);
  const heroTilt = useRef({ rotX: 0, rotY: 0, tgtX: 0, tgtY: 0, raf: 0 });

  const [videoIdx, setVideoIdx] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFading, setHeroFading] = useState(false);

  const videos = [...(config.videos ?? [])].sort((a, b) => a.order - b.order);
  const residences = config.residenceList ?? [];
  const fallbackResidences = [
    { id: '1', slug: 'elysia', name_fr: 'Elysia', name_ar: 'إليسيا', location: 'Jijel', status: 'ongoing', units: 56, typology: 'F3', description_fr: '', description_ar: '' },
    { id: '2', slug: 'les-3-princes', name_fr: 'Les 3 Princes', name_ar: 'الثلاث أمراء', location: 'Dely Brahim, Alger', status: 'completed', units: 43, typology: 'F3–F6', description_fr: '', description_ar: '' },
    { id: '3', slug: 'orea', name_fr: 'Orea', name_ar: 'أوريا', location: 'Dely Brahim, Alger', status: 'ongoing', units: 38, typology: 'F3–F6', description_fr: '', description_ar: '' },
    { id: '4', slug: 'lumalac', name_fr: 'Lumalac', name_ar: 'لوملاك', location: 'Dely Brahim, Alger', status: 'ongoing', units: 8, typology: 'F3+Triplex', description_fr: '', description_ar: '' },
    { id: '5', slug: 'marmo', name_fr: 'Marmo', name_ar: 'مارمو', location: 'Dely Brahim, Alger', status: 'completed', units: 8, typology: 'F3+Duplex', description_fr: '', description_ar: '' },
    { id: '6', slug: 'vertdalya', name_fr: 'Vert Dalya', name_ar: 'فيرت داليا', location: 'Dely Brahim, Alger', status: 'completed', units: 10, typology: 'Loft 270m²', description_fr: '', description_ar: '' },
  ] as typeof residences;
  const displayResidences = residences.length > 0 ? residences : fallbackResidences;

  // Hero auto-rotate
  useEffect(() => {
    const t = setInterval(() => {
      setHeroFading(true);
      setTimeout(() => { setHeroIdx(i => (i + 1) % HERO_SLIDES.length); setHeroFading(false); }, 600);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Hero 3D tilt
  useEffect(() => {
    const el = heroTiltRef.current;
    if (!el) return;
    const s = heroTilt.current;
    const tick = () => {
      s.rotX += (s.tgtX - s.rotX) * 0.04;
      s.rotY += (s.tgtY - s.rotY) * 0.04;
      el.style.transform = `rotateX(${s.rotX.toFixed(3)}deg) rotateY(${s.rotY.toFixed(3)}deg)`;
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const onHeroMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    heroTilt.current.tgtY = ((e.clientX - r.left - r.width / 2) / r.width) * 5;
    heroTilt.current.tgtX = -((e.clientY - r.top - r.height / 2) / r.height) * 3;
  };
  const onHeroLeave = () => { heroTilt.current.tgtX = 0; heroTilt.current.tgtY = 0; };

  // GSAP animations
  useEffect(() => {
    let raf = 0;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Hero chars
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll<HTMLElement>('.char');
        if (chars.length) {
          gsap.fromTo(chars,
            { y: 100, opacity: 0, rotateX: -60, filter: 'blur(8px)' },
            { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', stagger: 0.03, delay: 1.2 }
          );
        }
      }

      // Horizontal scroll
      if (hScrollRef.current && hScrollTrackRef.current) {
        const track = hScrollTrackRef.current;
        const isRTL = document.documentElement.dir === 'rtl';
        const totalWidth = track.scrollWidth - window.innerWidth + 200;
        if (totalWidth > 0) {
          if (isRTL) {
            // RTL: start cards from the right side, scroll toward left
            gsap.set(track, { x: -totalWidth });
            gsap.to(track, {
              x: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: hScrollRef.current,
                start: 'top top',
                end: `+=${totalWidth}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            });
          } else {
            gsap.to(track, {
              x: -totalWidth,
              ease: 'none',
              scrollTrigger: {
                trigger: hScrollRef.current,
                start: 'top top',
                end: `+=${totalWidth}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            });
          }
        }
      }

      // Scroll reveals
      ScrollTrigger.batch('.gsap-reveal', {
        onEnter: (els) => {
          gsap.fromTo(els,
            { y: 60, opacity: 0, filter: 'blur(4px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out', stagger: 0.08 }
          );
        },
        start: 'top 88%',
        once: true,
      });

      // Line draws
      gsap.utils.toArray<HTMLElement>('.line-draw').forEach(el => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 1.2, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
        );
      });

      // Stats
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.querySelectorAll('.stat-item'),
          { y: 60, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.1,
            scrollTrigger: { trigger: statsRef.current, start: 'top 78%', once: true } }
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
    { val: displayResidences.length, fr: 'Projets', ar: 'مشاريع' },
    { val: 163, fr: 'Unités résidentielles', ar: 'وحدة سكنية' },
    { val: displayResidences.filter(r => r.status === 'ongoing').length || 4, fr: 'En cours', ar: 'جارية' },
    { val: 2024, fr: 'Fondée en', ar: 'تأسست عام' },
  ];

  const socialLinks = [
    { icon: <IG />, url: config.social.instagram, label: 'Instagram' },
    { icon: <FB />, url: config.social.facebook, label: 'Facebook' },
    { icon: <LI />, url: config.social.linkedin, label: 'LinkedIn' },
    { icon: <YT />, url: config.social.youtube, label: 'YouTube' },
  ].filter(s => s.url);

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--text-1)', overflowX: 'hidden', position: 'relative', zIndex: 1 }}>
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section
        onMouseMove={onHeroMove}
        onMouseLeave={onHeroLeave}
        style={{ position: 'relative', height: '100vh', minHeight: '600px', background: '#06080a', perspective: '1200px' }}
      >
        <div className="hero-card">
          <div ref={heroTiltRef} style={{ position: 'absolute', inset: '-4%', transformStyle: 'preserve-3d', willChange: 'transform' }}>
            <video autoPlay muted loop playsInline key={config.heroVideo || '/hero.mp4'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src={config.heroVideo || '/hero.mp4'} type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,8,10,0.05) 0%, rgba(6,8,10,0.5) 60%, rgba(6,8,10,0.92) 100%)' }} />
          </div>

          {/* Floating particles — seeded positions to avoid hydration mismatch */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {[
              { w:3.2,h:4.1,bg:0.35,l:12,t:72,dur:14,del:2,px:20,py:-180},
              { w:2.5,h:2.8,bg:0.28,l:35,t:80,dur:11,del:5,px:-30,py:-200},
              { w:4.1,h:3.5,bg:0.45,l:58,t:65,dur:18,del:1,px:40,py:-160},
              { w:2.2,h:2.9,bg:0.32,l:78,t:88,dur:9,del:7,px:-15,py:-220},
              { w:3.8,h:4.5,bg:0.40,l:22,t:90,dur:16,del:3,px:35,py:-190},
              { w:2.7,h:3.0,bg:0.25,l:90,t:70,dur:12,del:6,px:-25,py:-170},
              { w:3.5,h:2.3,bg:0.38,l:45,t:85,dur:15,del:0,px:10,py:-210},
              { w:4.3,h:3.8,bg:0.50,l:5,t:75,dur:19,del:4,px:-35,py:-240},
              { w:2.0,h:2.5,bg:0.30,l:68,t:92,dur:10,del:2,px:25,py:-150},
              { w:3.0,h:3.3,bg:0.42,l:50,t:78,dur:13,del:7,px:-20,py:-195},
              { w:2.8,h:4.0,bg:0.33,l:15,t:82,dur:17,del:1,px:30,py:-230},
              { w:3.6,h:2.7,bg:0.36,l:82,t:68,dur:20,del:5,px:-40,py:-175},
              { w:4.0,h:3.2,bg:0.48,l:38,t:95,dur:8,del:3,px:15,py:-185},
              { w:2.3,h:3.6,bg:0.27,l:62,t:73,dur:14,del:6,px:-10,py:-205},
              { w:3.3,h:2.4,bg:0.44,l:28,t:87,dur:11,del:0,px:38,py:-215},
            ].map((p, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: `${p.w}px`, height: `${p.h}px`,
                borderRadius: '50%',
                background: `rgba(14,116,112,${p.bg})`,
                left: `${p.l}%`, top: `${p.t}%`,
                animation: `particleFloat ${p.dur}s linear ${p.del}s infinite`,
                ['--px' as string]: `${p.px}px`,
                ['--py' as string]: `${p.py}px`,
              }} />
            ))}
          </div>

          {/* Hero content */}
          <div style={{ position: 'absolute', bottom: '80px', left: '60px', right: '60px', zIndex: 10 }}>
            <p style={{
              fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)',
              letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '24px',
              opacity: heroFading ? 0 : 1,
              transform: heroFading ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}>
              {lang === 'ar' ? HERO_SLIDES[heroIdx].tag_ar : HERO_SLIDES[heroIdx].tag_fr}
            </p>

            <div ref={titleRef} style={{ overflow: 'visible', marginBottom: '8px', perspective: '800px' }}>
              {lang === 'ar' ? (
                /* Arabic: split by WORDS to preserve ligatures */
                <div style={{ display: 'flex', flexWrap: 'wrap', lineHeight: 1.15, direction: 'rtl', gap: '0 16px' }}>
                  {(config.heroTitle_ar || 'حمادات').split(/\s+/).map((word, i) => (
                    <span key={i} className="char" style={{
                      display: 'inline-block',
                      fontSize: 'clamp(56px, 10vw, 130px)',
                      fontFamily: 'var(--font-arabic)',
                      fontWeight: '700',
                      color: '#fff',
                      opacity: 0,
                      transformStyle: 'preserve-3d',
                    }}>
                      {word}
                    </span>
                  ))}
                </div>
              ) : (
                /* French/Latin: split by CHARACTERS for Tahu animation */
                <div style={{ display: 'flex', flexWrap: 'wrap', lineHeight: 1.05 }}>
                  {(config.heroTitle || 'Hamadat').split('').map((ch, i) => (
                    <span key={i} className="char" style={{
                      display: 'inline-block',
                      fontSize: 'clamp(64px, 11vw, 148px)',
                      fontFamily: "'Tahu', cursive",
                      fontWeight: '400',
                      color: '#fff',
                      letterSpacing: '-0.02em',
                      opacity: 0,
                      transformStyle: 'preserve-3d',
                    }}>
                      {ch}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p style={{
              fontSize: 'clamp(13px, 1.4vw, 20px)', fontWeight: '300',
              color: 'rgba(255,255,255,0.4)', fontStyle: 'italic',
              marginTop: '16px', marginBottom: '40px', maxWidth: '600px',
              opacity: heroFading ? 0 : 1,
              transform: heroFading ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}>
              {lang === 'ar' ? HERO_SLIDES[heroIdx].sub_ar : HERO_SLIDES[heroIdx].sub_fr}
            </p>

            <div style={{ display: 'flex', gap: '16px', animation: 'fadeSlideUp 0.9s ease-out 3s both' }}>
              <Link href="/projets" data-cursor className="btn-shine" style={{
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                background: 'linear-gradient(135deg, #0e7470 0%, #0a5450 100%)',
                color: '#fff', padding: '15px 36px', borderRadius: '6px',
                fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px',
                textDecoration: 'none', textTransform: 'uppercase',
                transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                boxShadow: '0 8px 32px rgba(14,116,112,0.4)',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 20px 56px rgba(14,116,112,0.55)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 8px 32px rgba(14,116,112,0.4)'; }}
              >
                {lang === 'ar' ? 'اكتشف مشاريعنا' : 'Découvrir nos projets'} <span style={{ fontSize: '16px', transition: 'transform 0.3s' }}>→</span>
              </Link>
            </div>
          </div>

          {/* Slide indicators */}
          <div style={{ position: 'absolute', bottom: '40px', right: '60px', display: 'flex', gap: '8px', zIndex: 10, animation: 'fadeSlideUp 0.8s ease-out 3.5s both' }}>
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => { setHeroFading(true); setTimeout(() => { setHeroIdx(i); setHeroFading(false); }, 400); }} data-cursor style={{
                width: i === heroIdx ? '32px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: i === heroIdx ? '#0e7470' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
              }} />
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            animation: 'fadeSlideUp 0.8s ease-out 3.8s both', zIndex: 10,
          }}>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '3px', textTransform: 'uppercase' }}>scroll</span>
            <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, rgba(14,116,112,0.7), transparent)', animation: 'scrollPulse 2.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══ 2. HORIZONTAL SCROLL RESIDENCES ═══ */}
      <section ref={hScrollRef} className="h-scroll-section" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '40px 60px 24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div className="gsap-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0' }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '14px' }}>
                {lang === 'ar' ? 'مشاريعنا' : 'Nos Résidences'}
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 54px)', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-1px', margin: 0, lineHeight: 1.1 }}>
                {lang === 'ar' ? <>{`اكتشف `}<em style={{ color: 'rgba(14,116,112,0.7)', fontStyle: 'italic' }}>مجمعاتنا</em></> : <>{`Découvrez nos `}<em style={{ color: 'rgba(14,116,112,0.7)', fontStyle: 'italic' }}>résidences</em></>}
              </h2>
            </div>
            <Link href="/projets" data-cursor style={{
              fontSize: '10px', fontWeight: '700', color: 'var(--text-4)',
              letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
              transition: 'all 0.4s ease', paddingBottom: '4px',
              borderBottom: '1px solid var(--border)',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#0e7470'; el.style.borderBottomColor = '#0e7470'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = ''; el.style.borderBottomColor = ''; }}
            >
              {lang === 'ar' ? 'عرض الكل' : 'Voir tous'} →
            </Link>
          </div>
        </div>

        <div ref={hScrollTrackRef} className="h-scroll-track" style={{ paddingLeft: '60px', paddingRight: '60px', flex: 1, alignItems: 'center' }}>
          {displayResidences.map((r) => (
            <ResidenceCard key={r.slug} r={r} thumb={config.residences[r.slug]?.thumbnail || `/residences/${r.slug}/vue-001-1.jpg`} lang={lang} />
          ))}
        </div>
      </section>

      {/* ═══ 3. STATS ═══ */}
      <section ref={statsRef} style={{ padding: '140px 60px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="line-draw" style={{ height: '1px', background: 'linear-gradient(90deg, rgba(14,116,112,0.4), transparent)', marginBottom: '80px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item" style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '16px', padding: '40px 32px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                cursor: 'default',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(14,116,112,0.2)'; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 20px 60px rgba(14,116,112,0.08)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = ''; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
              >
                <div style={{
                  fontSize: 'clamp(44px, 5.5vw, 80px)', fontWeight: '100',
                  color: 'var(--text-1)', lineHeight: 1, letterSpacing: '-0.04em',
                  marginBottom: '14px', fontVariantNumeric: 'tabular-nums',
                }}>
                  <Counter target={s.val} />
                </div>
                <p style={{ fontSize: '10px', color: 'rgba(14,116,112,0.7)', fontWeight: '700', margin: 0, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? s.ar : s.fr}
                </p>
              </div>
            ))}
          </div>
          <div className="line-draw" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(14,116,112,0.4))', marginTop: '80px' }} />
        </div>
      </section>

      {/* ═══ 4. ABOUT ═══ */}
      <section style={{ padding: '120px 60px', position: 'relative' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'stretch' }} className="about-grid">
          <div className="gsap-reveal" style={{
            position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '560px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          }}>
            <img src={config.aboutImage || '/residences/les-3-princes/vue-2.jpg'} alt="À Propos" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 8s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(14,116,112,0.12) 0%, transparent 60%)' }} />
          </div>

          <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}>
            <p className="gsap-reveal" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '28px' }}>
              {lang === 'ar' ? 'من نحن' : 'À Propos'}
            </p>
            <h2 className="gsap-reveal" style={{ fontSize: 'clamp(26px, 3.2vw, 48px)', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-1px', lineHeight: 1.2, marginBottom: '28px' }}>
              {lang === 'ar'
                ? <><span>رؤية واضحة،</span><br /><em style={{ color: 'rgba(14,116,112,0.7)', fontStyle: 'italic' }}>جودة لا تُضاهى</em></>
                : <><span>Une vision claire,</span><br /><em style={{ color: 'rgba(14,116,112,0.7)', fontStyle: 'italic' }}>une qualité irréprochable</em></>
              }
            </h2>
            <p className="gsap-reveal" style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.9, fontWeight: '300', marginBottom: '48px' }}>
              {lang === 'ar'
                ? (config.apropos.story_ar || 'تأسست حمادة برؤية واضحة: تقديم مشاريع سكنية فاخرة تجمع بين الجودة العالية والتصاميم المعاصرة في أفضل مواقع الجزائر.')
                : (config.apropos.story_fr || "Hamadat a été fondée avec une vision précise : offrir des résidences de prestige alliant qualité exceptionnelle et architecture contemporaine dans les meilleurs emplacements d'Algérie.")}
            </p>
            <Link href="/apropos" className="gsap-reveal" data-cursor style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              fontSize: '11px', fontWeight: '700', color: 'rgba(14,116,112,0.9)',
              letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
              borderBottom: '1px solid rgba(14,116,112,0.3)', paddingBottom: '6px',
              transition: 'all 0.4s ease', alignSelf: 'flex-start',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.letterSpacing = '5px'; el.style.borderBottomColor = '#0e7470'; el.style.color = '#0e7470'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.letterSpacing = '3px'; el.style.borderBottomColor = 'rgba(14,116,112,0.3)'; el.style.color = 'rgba(14,116,112,0.9)'; }}
            >
              {lang === 'ar' ? 'اقرأ أكثر' : 'En savoir plus'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 5. VIDEOS ═══ */}
      {videos.length > 0 && (
        <section style={{ padding: '100px 60px 120px', position: 'relative' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p className="gsap-reveal" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '16px' }}>
              {lang === 'ar' ? 'إنجازاتنا' : 'Nos Réalisations'}
            </p>
            <h2 className="gsap-reveal" style={{ fontSize: 'clamp(26px, 3.5vw, 48px)', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-1px', marginBottom: '48px' }}>
              {lang === 'ar' ? 'مشاريعنا بالفيديو' : <>{`Projets en `}<em style={{ color: 'rgba(14,116,112,0.7)', fontStyle: 'italic' }}>Vidéo</em></>}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }} className="video-layout">
              <div className="gsap-reveal">
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}>
                  {videos[videoIdx] && (
                    <iframe key={videos[videoIdx].id} src={ytEmbed(videos[videoIdx].url)} title={videos[videoIdx].label}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {videos.map((v, i) => (
                  <button key={v.id} onClick={() => setVideoIdx(i)} data-cursor style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    background: i === videoIdx ? 'rgba(14,116,112,0.12)' : 'transparent',
                    border: 'none', borderLeft: i === videoIdx ? '2px solid #0e7470' : '2px solid transparent',
                    padding: '10px 12px 10px 14px', borderRadius: '0 10px 10px 0',
                    cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.3s ease',
                  }}>
                    <div style={{ position: 'relative', width: '80px', height: '52px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={ytThumb(v.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid rgba(255,255,255,0.9)', marginLeft: '2px' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: i === videoIdx ? '#0e7470' : 'var(--text-3)', lineHeight: 1.4, fontWeight: i === videoIdx ? '600' : '400', transition: 'color 0.2s' }}>
                      {v.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 6. SOCIAL ═══ */}
      <section style={{ padding: '140px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border)' }}>
        <p className="gsap-reveal" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(14,116,112,0.9)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '20px' }}>
          {lang === 'ar' ? 'تابعونا' : 'Suivez-nous'}
        </p>
        <h2 className="gsap-reveal" style={{ fontSize: 'clamp(32px, 5.5vw, 72px)', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-1.5px', marginBottom: '56px' }}>
          {lang === 'ar' ? 'ابقوا على تواصل' : <>{`Restez `}<em style={{ color: 'rgba(14,116,112,0.6)', fontStyle: 'italic' }}>connectés</em></>}
        </h2>
        {socialLinks.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {socialLinks.map(({ icon, url, label }) => (
              <div key={label} className="gsap-reveal">
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} data-cursor style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  border: '1px solid rgba(14,116,112,0.2)',
                  background: 'rgba(14,116,112,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-3)', textDecoration: 'none',
                  transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-8px) scale(1.15)'; el.style.background = 'rgba(14,116,112,0.25)'; el.style.borderColor = 'rgba(14,116,112,0.5)'; el.style.boxShadow = '0 16px 40px rgba(14,116,112,0.3)'; el.style.color = '#fff'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.background = 'rgba(14,116,112,0.06)'; el.style.borderColor = 'rgba(14,116,112,0.2)'; el.style.boxShadow = 'none'; el.style.color = ''; }}
                >
                  {icon}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="gsap-reveal" style={{ fontSize: '13px', color: 'var(--text-4)', fontStyle: 'italic' }}>
            {lang === 'ar' ? 'روابط التواصل الاجتماعي قابلة للضبط' : "Réseaux sociaux configurables dans l'administration"}
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
