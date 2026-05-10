'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const dur = 2000, step = 16, steps = dur / step;
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
const YT = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>;

// Card start positions — each flies from a unique place
const FLY_FROM = [
  { x: -700, y: -300, r: -22, s: 0.4 },
  { x:  600, y: -400, r:  18, s: 0.45 },
  { x: -500, y:  400, r:  25, s: 0.5 },
  { x:  800, y:  200, r: -20, s: 0.4 },
  { x: -300, y: -600, r:  15, s: 0.45 },
  { x:  400, y:  500, r: -28, s: 0.5 },
];

export default function HomePage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();

  const heroRef    = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<HTMLDivElement[]>([]);
  const pinRef     = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLElement>(null);

  const [videoIdx, setVideoIdx] = useState(0);

  const heroSrc   = config.homeMedia[0]?.src || '/residences/elysia/vue-001-1.jpg';
  const videos    = [...(config.videos ?? [])].sort((a, b) => a.order - b.order);
  const residences = config.residenceList ?? [];

  // ── GSAP setup ───────────────────────────────────────────────
  useEffect(() => {
    if (residences.length === 0) return;   // wait for config to load

    let gsap: typeof import('gsap').gsap;
    let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
    let cleanupFns: (() => void)[] = [];

    // rAF ensures the DOM is fully painted before GSAP runs
    const raf = requestAnimationFrame(async () => {
      const g = await import('gsap');
      const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger');
      gsap  = g.gsap;
      ScrollTrigger = ST;
      gsap.registerPlugin(ScrollTrigger);
      // ── 1. Title character split ──────────────────────────────
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll<HTMLElement>('.char');
        gsap.fromTo(chars, {
          y: 80, opacity: 0, skewY: 6, rotateX: -40,
        }, {
          y: 0, opacity: 1, skewY: 0, rotateX: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.055,
          delay: 2.1,
        });
      }

      // ── 2. Hero parallax on scroll ───────────────────────────
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          y: '35%',
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // ── 3. Flying cards ─────────────────────────────────────
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length > 0 && pinRef.current) {
        // Set initial state
        cards.forEach((card, i) => {
          const f = FLY_FROM[i % FLY_FROM.length];
          gsap.set(card, { x: f.x, y: f.y, rotation: f.r, scale: f.s, opacity: 0 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            pin: true,
            start: 'top top',
            end: `+=${cards.length * 280}`,
            scrub: 1.5,
            anticipatePin: 1,
          },
        });

        cards.forEach((card, i) => {
          tl.to(card, {
            x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
          }, i * 0.15);
          // Slight settle bounce
          tl.to(card, { y: -6, duration: 0.15, ease: 'power2.out' }, i * 0.15 + 0.65);
          tl.to(card, { y: 0, duration: 0.25, ease: 'power2.inOut' }, i * 0.15 + 0.8);
        });

        cleanupFns.push(() => tl.kill());
      }

      // ── 4. Stats section scroll-triggered reveal ─────────────
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.querySelectorAll('.stat-item'), {
          y: 60, opacity: 0, scale: 0.9,
        }, {
          y: 0, opacity: 1, scale: 1,
          duration: 1, ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 70%',
          },
        });
      }

      // ── 5. Section reveal for all .gsap-reveal elements ──────
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.fromTo(el, {
          y: 56, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
          },
        });
      });

      // ── 6. Horizontal line draws ──────────────────────────────
      gsap.utils.toArray<HTMLElement>('.line-draw').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 1.4, ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 88%' } });
      });

      // ── 7. Big text parallax ──────────────────────────────────
      gsap.utils.toArray<HTMLElement>('.parallax-text').forEach((el) => {
        const depth = parseFloat(el.dataset.depth || '0.3');
        gsap.to(el, {
          y: `${depth * 100}%`,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, scrub: true, start: 'top bottom', end: 'bottom top' },
        });
      });

      cleanupFns.push(() => ScrollTrigger.getAll().forEach(t => t.kill()));
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanupFns.forEach(fn => fn());
    };
  }, [residences.length]);

  // ── Mouse parallax on hero ────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      document.querySelectorAll<HTMLElement>('.hero-float').forEach((el) => {
        const d = parseFloat(el.dataset.depth || '0.5');
        el.style.transform = `translate(${cx * d * 18}px, ${cy * d * 14}px)`;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const STATS = [
    { val: residences.length || 6,   suf: '',  fr: 'Projets',               ar: 'مشاريع' },
    { val: 163,                       suf: '',  fr: 'Unités résidentielles',  ar: 'وحدة سكنية' },
    { val: residences.filter(r => r.status === 'ongoing').length || 4, suf: '', fr: 'En cours', ar: 'جارية' },
    { val: 2024,                      suf: '',  fr: 'Fondée en',              ar: 'تأسست عام' },
  ];

  const socialLinks = [
    { icon: <IG />, url: config.social.instagram, label: 'Instagram' },
    { icon: <FB />, url: config.social.facebook,  label: 'Facebook' },
    { icon: <LI />, url: config.social.linkedin,  label: 'LinkedIn' },
    { icon: <YT />, url: config.social.youtube,   label: 'YouTube' },
  ].filter(s => s.url);

  return (
    <div style={{ background: 'transparent', color: '#fff', overflowX: 'hidden', position: 'relative', zIndex: 1 }}>
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          HERO — full screen
      ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ position: 'relative', height: '100vh', minHeight: '640px', overflow: 'hidden' }}>

        {/* Parallax image */}
        <img ref={heroImgRef} src={heroSrc} alt="Hamadat"
          style={{ position:'absolute', inset:0, width:'100%', height:'120%', objectFit:'cover', top:'-10%', willChange:'transform' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(6,8,10,0.3) 0%, rgba(6,8,10,0.78) 100%)' }} />

        {/* Floating blur cards in hero bg */}
        {residences.slice(0,3).map((r, i) => {
          const depths = [0.8, 0.4, 0.6];
          const positions = [
            { top: '15%', right: '8%' },
            { top: '55%', right: '22%' },
            { top: '25%', left: '5%' },
          ];
          const thumb = config.residences[r.slug]?.thumbnail || `/residences/${r.slug}.jpg`;
          return (
            <div key={r.id} className="hero-float"
              data-depth={depths[i]}
              style={{
                position:'absolute', ...positions[i],
                width: i === 0 ? '200px' : '150px',
                height: i === 0 ? '130px' : '100px',
                borderRadius:'8px', overflow:'hidden',
                opacity: 0.18, filter:'blur(2px) saturate(0.6)',
                transition:'transform 0.8s cubic-bezier(0.22,1,0.36,1)',
                pointerEvents:'none',
                zIndex: 2,
              }}
            >
              <img src={thumb} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          );
        })}

        {/* TITLE */}
        <div style={{ position:'absolute', bottom:'100px', left:'60px', zIndex:10, perspective:'800px' }}>
          <p style={{
            fontSize:'10px', fontWeight:'700', color:'rgba(14,116,112,0.9)',
            letterSpacing:'5px', textTransform:'uppercase', marginBottom:'24px',
            animation:'fadeSlideUp 1s ease-out 2s both',
          }}>
            {lang === 'ar' ? 'حمادة للترقية العقارية' : 'Hamadat Promotion Immobilière'}
          </p>

          {/* Character split title */}
          <div ref={titleRef} style={{ overflow:'hidden', marginBottom:'0px' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0', lineHeight:'0.9' }}>
              {'HAMADAT'.split('').map((ch, i) => (
                <span key={i} className="char" style={{
                  display:'inline-block',
                  fontSize:'clamp(80px, 14vw, 180px)',
                  fontWeight:'200',
                  color: i < 3 ? '#fff' : 'rgba(14,116,112,0.85)',
                  letterSpacing:'-0.04em',
                  opacity:0,
                }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <div style={{ overflow:'hidden', marginTop:'16px' }}>
            <p style={{
              fontSize:'clamp(16px, 2vw, 26px)',
              fontWeight:'300', color:'rgba(255,255,255,0.5)',
              fontStyle:'italic', letterSpacing:'0.05em', margin:0,
              animation:'fadeSlideUp 1s ease-out 3.3s both',
            }}>
              {lang === 'ar' ? 'حيث يتحقق حلمك السكني.' : 'La où le rêve prend toit.'}
            </p>
          </div>

          <div style={{ display:'flex', gap:'16px', marginTop:'40px', animation:'fadeSlideUp 0.9s ease-out 3.5s both' }}>
            <Link href="/projets" data-cursor style={{
              display:'inline-flex', alignItems:'center', gap:'10px',
              background:'linear-gradient(135deg, #0e7470 0%, #0a5450 100%)',
              color:'#fff', padding:'15px 36px', borderRadius:'4px',
              fontSize:'11px', fontWeight:'700', letterSpacing:'2.5px',
              textDecoration:'none', textTransform:'uppercase',
              transition:'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              boxShadow:'0 8px 32px rgba(14,116,112,0.4)',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform='translateY(-3px) scale(1.03)';
                (e.currentTarget as HTMLElement).style.boxShadow='0 16px 48px rgba(14,116,112,0.55)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform='none';
                (e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(14,116,112,0.4)';
              }}
            >
              {lang === 'ar' ? 'اكتشف مشاريعنا' : 'Découvrir'}
              <span style={{ fontSize:'20px', lineHeight:1, fontWeight:'300' }}>→</span>
            </Link>
          </div>
        </div>

        {/* Scroll line */}
        <div style={{ position:'absolute', bottom:'40px', right:'56px', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', animation:'fadeSlideUp 0.8s ease-out 4s both' }}>
          <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)', letterSpacing:'3px', textTransform:'uppercase', writingMode:'vertical-lr' }}>scroll</span>
          <div style={{ width:'1px', height:'64px', background:'linear-gradient(to bottom, rgba(14,116,112,0.8), transparent)', animation:'scrollPulse 2s ease-in-out infinite' }} />
        </div>

        {/* Project count */}
        <div style={{ position:'absolute', bottom:'44px', left:'60px', display:'flex', alignItems:'center', gap:'12px', animation:'fadeSlideUp 0.8s ease-out 3.8s both' }}>
          <div style={{ width:'40px', height:'1px', background:'rgba(14,116,112,0.5)' }} />
          <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)', letterSpacing:'3px' }}>
            0{residences.length || 6} {lang === 'ar' ? 'مشاريع' : 'projets'}
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FLYING CARDS — pinned scroll section
      ═══════════════════════════════════════════════════════ */}
      <div ref={pinRef} style={{ background:'transparent', minHeight:'100vh', position:'relative', overflow:'hidden' }}>

        {/* Section label */}
        <div style={{ position:'absolute', top:'60px', left:'60px', zIndex:20 }}>
          <p className="gsap-reveal" style={{ fontSize:'10px', fontWeight:'700', color:'rgba(14,116,112,0.9)', letterSpacing:'5px', textTransform:'uppercase', margin:0 }}>
            {lang === 'ar' ? 'مشاريعنا' : 'Nos Résidences'}
          </p>
        </div>
        <div style={{ position:'absolute', top:'52px', right:'60px', zIndex:20 }}>
          <Link href="/projets" className="gsap-reveal" data-cursor style={{
            fontSize:'10px', fontWeight:'700', color:'rgba(255,255,255,0.4)',
            letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none',
            transition:'color 0.3s',
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#0e7470';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)';}}
          >
            {lang === 'ar' ? 'عرض الكل' : 'Voir tous'} →
          </Link>
        </div>

        {/* The grid of flying cards */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(3, 1fr)',
          gap:'16px',
          padding:'120px 60px 80px',
          maxWidth:'1320px',
          margin:'0 auto',
          minHeight:'100vh',
          alignContent:'center',
        }}>
          {(residences.length > 0 ? residences : [
            {id:'1',slug:'elysia',name_fr:'Elysia',name_ar:'إليسيا',location:'Jijel',status:'ongoing',units:56,typology:'F3',description_fr:'',description_ar:''},
            {id:'2',slug:'les-3-princes',name_fr:'Les 3 Princes',name_ar:'الثلاث أمراء',location:'Dely Brahim, Alger',status:'completed',units:43,typology:'F3–F6',description_fr:'',description_ar:''},
            {id:'3',slug:'orea',name_fr:'Orea',name_ar:'أوريا',location:'Dely Brahim, Alger',status:'ongoing',units:38,typology:'F3–F6',description_fr:'',description_ar:''},
            {id:'4',slug:'lumalac',name_fr:'Lumalac',name_ar:'لوملاك',location:'Dely Brahim, Alger',status:'ongoing',units:8,typology:'F3+Triplex',description_fr:'',description_ar:''},
            {id:'5',slug:'marmo',name_fr:'Marmo',name_ar:'مارمو',location:'Dely Brahim, Alger',status:'completed',units:8,typology:'F3+Duplex',description_fr:'',description_ar:''},
            {id:'6',slug:'vertdalya',name_fr:'Vert Dalya',name_ar:'فيرت داليا',location:'Dely Brahim, Alger',status:'completed',units:10,typology:'Loft 270m²',description_fr:'',description_ar:''},
          ] as typeof residences).slice(0, 6).map((r, i) => {
            const thumb = config.residences[r.slug]?.thumbnail || `/residences/${r.slug}/vue-001-1.jpg`;
            const isLarge = i === 0 || i === 5;
            return (
              <div
                key={r.id}
                ref={el => { if (el) cardsRef.current[i] = el; }}
                style={{
                  gridColumn: isLarge ? 'span 2' : 'span 1',
                  willChange:'transform',
                }}
              >
                <Link href={`/projets/${r.slug}`} data-cursor style={{ textDecoration:'none', color:'inherit', display:'block' }}>
                  <div style={{
                    position:'relative',
                    height: isLarge ? '400px' : '280px',
                    borderRadius:'12px',
                    overflow:'hidden',
                    background:'#111',
                    boxShadow:'0 24px 80px rgba(0,0,0,0.6)',
                    border:'1px solid rgba(255,255,255,0.06)',
                    transition:'box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                  }}
                    onMouseEnter={e=>{
                      (e.currentTarget as HTMLElement).style.transform='translateY(-8px) scale(1.01)';
                      (e.currentTarget as HTMLElement).style.boxShadow='0 40px 100px rgba(14,116,112,0.25)';
                      const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement;
                      if (img) img.style.transform='scale(1.08)';
                    }}
                    onMouseLeave={e=>{
                      (e.currentTarget as HTMLElement).style.transform='none';
                      (e.currentTarget as HTMLElement).style.boxShadow='0 24px 80px rgba(0,0,0,0.6)';
                      const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement;
                      if (img) img.style.transform='scale(1)';
                    }}
                  >
                    <img src={thumb} alt={r.name_fr} style={{
                      width:'100%', height:'100%', objectFit:'cover', display:'block',
                      transition:'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
                    }} />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(6,8,10,0.85) 0%, transparent 55%)' }} />
                    {/* Teal glow on hover */}
                    <div style={{
                      position:'absolute', inset:0,
                      background:'radial-gradient(ellipse at center, rgba(14,116,112,0.2) 0%, transparent 70%)',
                      opacity:0, transition:'opacity 0.4s',
                    }} />
                    <div style={{ position:'absolute', bottom:'20px', left:'22px', right:'22px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                        <div>
                          <h3 style={{ fontSize: isLarge ? '28px' : '20px', fontWeight:'300', color:'#fff', margin:'0 0 4px', letterSpacing:'-0.5px' }}>
                            {lang === 'ar' ? r.name_ar : r.name_fr}
                          </h3>
                          <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', margin:0, letterSpacing:'1px' }}>{r.location}</p>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <span style={{
                            display:'inline-block',
                            padding:'4px 10px',
                            background: r.status === 'completed' ? 'rgba(16,185,129,0.2)' : r.status === 'sold' ? 'rgba(99,102,241,0.2)' : 'rgba(14,116,112,0.25)',
                            border: `1px solid ${r.status === 'completed' ? 'rgba(16,185,129,0.4)' : r.status === 'sold' ? 'rgba(99,102,241,0.4)' : 'rgba(14,116,112,0.4)'}`,
                            color: r.status === 'completed' ? '#4ade80' : r.status === 'sold' ? '#a5b4fc' : '#2dd4bf',
                            fontSize:'9px', fontWeight:'700', letterSpacing:'1.5px', textTransform:'uppercase', borderRadius:'3px',
                          }}>
                            {r.status === 'completed' ? (lang === 'ar' ? 'منجز' : 'Livré') : r.status === 'sold' ? (lang === 'ar' ? 'مباع' : 'Vendu') : (lang === 'ar' ? 'جارٍ' : 'En cours')}
                          </span>
                          <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', margin:'6px 0 0', letterSpacing:'0.5px' }}>{r.units} unités</p>
                        </div>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div style={{
                      position:'absolute', top:'18px', right:'18px',
                      width:'36px', height:'36px', borderRadius:'50%',
                      border:'1px solid rgba(255,255,255,0.15)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'14px', color:'rgba(255,255,255,0.5)',
                      transition:'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                      background:'rgba(255,255,255,0.05)',
                    }}>↗</div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          STATS — full width dark
      ═══════════════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ padding:'140px 60px', position:'relative', overflow:'hidden' }}>

        {/* Giant background text */}
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          fontSize:'clamp(120px, 20vw, 260px)',
          fontWeight:'900',
          color:'rgba(14,116,112,0.04)',
          whiteSpace:'nowrap',
          letterSpacing:'-0.05em',
          userSelect:'none', pointerEvents:'none',
          zIndex:0,
        }}>
          HAMADAT
        </div>

        <div style={{ maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:1 }}>
          <div className="line-draw" style={{ height:'1px', background:'rgba(14,116,112,0.35)', marginBottom:'80px' }} />

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item" style={{
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                paddingLeft: i > 0 ? '48px' : 0,
                paddingRight:'48px',
              }}>
                <div style={{
                  fontSize:'clamp(64px, 7vw, 100px)',
                  fontWeight:'100',
                  color:'#fff',
                  lineHeight:1,
                  letterSpacing:'-0.04em',
                  marginBottom:'12px',
                  fontVariantNumeric:'tabular-nums',
                }}>
                  <Counter target={s.val} suffix={s.suf} />
                </div>
                <p style={{ fontSize:'12px', color:'rgba(14,116,112,0.8)', fontWeight:'600', margin:0, letterSpacing:'2px', textTransform:'uppercase' }}>
                  {lang === 'ar' ? s.ar : s.fr}
                </p>
              </div>
            ))}
          </div>

          <div className="line-draw" style={{ height:'1px', background:'rgba(14,116,112,0.35)', marginTop:'80px' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT — large split
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding:'120px 60px', position:'relative', overflow:'hidden' }}>
        <div style={{ maxWidth:'1320px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center' }} className="about-grid">

          {/* Image side */}
          <div className="gsap-reveal" style={{ position:'relative' }}>
            <div style={{ position:'relative', height:'580px', borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' }}>
              <img
                src={config.aboutImage || '/residences/les-3-princes/vue-2.jpg'}
                alt="À Propos"
                className="parallax-text"
                data-depth="0.15"
                style={{ width:'100%', height:'115%', objectFit:'cover', display:'block', top:'-7.5%', position:'absolute', willChange:'transform' }}
              />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(14,116,112,0.15) 0%, transparent 60%)' }} />
            </div>
            {/* Decorative teal accent */}
            <div style={{
              position:'absolute', bottom:'-24px', left:'-24px',
              width:'120px', height:'120px', borderRadius:'50%',
              background:'radial-gradient(circle, rgba(14,116,112,0.5) 0%, transparent 70%)',
              filter:'blur(20px)',
              animation:'mblob2 8s ease-in-out infinite',
            }} />
          </div>

          {/* Text side */}
          <div>
            <p className="gsap-reveal" style={{ fontSize:'10px', fontWeight:'700', color:'rgba(14,116,112,0.9)', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'32px' }}>
              {lang === 'ar' ? 'من نحن' : 'À Propos'}
            </p>
            <h2 className="gsap-reveal" style={{
              fontSize:'clamp(32px, 4vw, 58px)',
              fontWeight:'200',
              color:'#fff',
              letterSpacing:'-1px',
              lineHeight:1.15,
              marginBottom:'32px',
            }}>
              {lang === 'ar'
                ? <><span>رؤية واضحة،</span><br /><em style={{ color:'rgba(14,116,112,0.8)', fontStyle:'italic' }}>جودة لا تُضاهى</em></>
                : <><span>Une vision claire,</span><br /><em style={{ color:'rgba(14,116,112,0.8)', fontStyle:'italic' }}>une qualité irréprochable</em></>
              }
            </h2>
            <p className="gsap-reveal" style={{ fontSize:'16px', color:'rgba(255,255,255,0.5)', lineHeight:1.9, fontWeight:'300', marginBottom:'44px' }}>
              {lang === 'ar'
                ? (config.apropos.story_ar || 'تأسست حمادة برؤية واضحة: تقديم مشاريع سكنية فاخرة تجمع بين الجودة العالية والتصاميم المعاصرة في أفضل مواقع الجزائر.')
                : (config.apropos.story_fr || "Hamadat a été fondée avec une vision précise : offrir des résidences de prestige alliant qualité exceptionnelle et architecture contemporaine dans les meilleurs emplacements d'Algérie.")}
            </p>
            <Link href="/apropos" className="gsap-reveal" data-cursor style={{
              display:'inline-flex', alignItems:'center', gap:'12px',
              fontSize:'11px', fontWeight:'700', color:'rgba(14,116,112,0.9)',
              letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none',
              borderBottom:'1px solid rgba(14,116,112,0.4)', paddingBottom:'4px',
              transition:'all 0.4s ease',
            }}
              onMouseEnter={e=>{
                (e.currentTarget as HTMLElement).style.letterSpacing='5px';
                (e.currentTarget as HTMLElement).style.borderBottomColor='#0e7470';
              }}
              onMouseLeave={e=>{
                (e.currentTarget as HTMLElement).style.letterSpacing='3px';
                (e.currentTarget as HTMLElement).style.borderBottomColor='rgba(14,116,112,0.4)';
              }}
            >
              {lang === 'ar' ? 'اقرأ أكثر' : 'En savoir plus'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          VIDEOS
      ═══════════════════════════════════════════════════════ */}
      {videos.length > 0 && (
        <section style={{ padding:'100px 60px 120px', position:'relative' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <p className="gsap-reveal" style={{ fontSize:'10px', fontWeight:'700', color:'rgba(14,116,112,0.9)', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'20px' }}>
              {lang === 'ar' ? 'إنجازاتنا' : 'Nos Réalisations'}
            </p>
            <h2 className="gsap-reveal" style={{ fontSize:'clamp(28px, 4vw, 52px)', fontWeight:'200', color:'#fff', letterSpacing:'-1px', marginBottom:'56px' }}>
              {lang === 'ar' ? 'مشاريعنا بالفيديو' : 'Projets en Vidéo'}
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'20px' }} className="video-layout">
              <div className="gsap-reveal">
                <div style={{ position:'relative', width:'100%', paddingTop:'56.25%', borderRadius:'12px', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  {videos[videoIdx] && (
                    <iframe key={videos[videoIdx].id} src={ytEmbed(videos[videoIdx].url)} title={videos[videoIdx].label}
                      style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  )}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {videos.map((v, i) => (
                  <div key={v.id} className="gsap-reveal">
                    <button onClick={() => setVideoIdx(i)} data-cursor style={{
                      display:'flex', gap:'12px', alignItems:'center',
                      background: i === videoIdx ? 'rgba(14,116,112,0.15)' : 'transparent',
                      border:'none',
                      borderLeft: i === videoIdx ? '2px solid #0e7470' : '2px solid transparent',
                      padding:'10px 12px 10px 14px', borderRadius:'0 8px 8px 0',
                      cursor:'pointer', width:'100%', textAlign:'left',
                      transition:'all 0.25s ease',
                    }}>
                      <div style={{ position:'relative', width:'80px', height:'52px', borderRadius:'4px', overflow:'hidden', flexShrink:0 }}>
                        <img src={ytThumb(v.url)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <div style={{ width:0, height:0, borderTop:'5px solid transparent', borderBottom:'5px solid transparent', borderLeft:'8px solid rgba(255,255,255,0.9)', marginLeft:'2px' }} />
                        </div>
                      </div>
                      <span style={{ fontSize:'12px', color: i === videoIdx ? '#2dd4bf' : 'rgba(255,255,255,0.45)', lineHeight:1.4, fontWeight: i === videoIdx ? '600' : '400', transition:'color 0.2s' }}>
                        {v.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SOCIAL CTA — full width dark with mesh
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding:'120px 60px', textAlign:'center', position:'relative', overflow:'hidden', borderTop:'1px solid rgba(14,116,112,0.15)' }}>
        {/* Extra teal glow blob */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'500px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(14,116,112,0.2) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

        <p className="gsap-reveal" style={{ fontSize:'10px', fontWeight:'700', color:'rgba(14,116,112,0.9)', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'24px' }}>
          {lang === 'ar' ? 'تابعونا' : 'Suivez-nous'}
        </p>
        <h2 className="gsap-reveal" style={{ fontSize:'clamp(36px, 6vw, 80px)', fontWeight:'200', color:'#fff', letterSpacing:'-1.5px', marginBottom:'60px' }}>
          {lang === 'ar' ? 'ابقوا على تواصل' : 'Restez connectés'}
        </h2>

        {socialLinks.length > 0 ? (
          <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap', position:'relative' }}>
            {socialLinks.map(({ icon, url, label }, i) => (
              <div key={label} className="gsap-reveal" style={{ ['--delay' as string]: `${i * 0.06}s` }}>
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} data-cursor style={{
                  width:'52px', height:'52px', borderRadius:'50%',
                  border:'1px solid rgba(14,116,112,0.3)',
                  background:'rgba(14,116,112,0.08)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'rgba(255,255,255,0.6)', textDecoration:'none',
                  transition:'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                }}
                  onMouseEnter={e=>{
                    (e.currentTarget as HTMLElement).style.transform='translateY(-8px) scale(1.15)';
                    (e.currentTarget as HTMLElement).style.background='rgba(14,116,112,0.3)';
                    (e.currentTarget as HTMLElement).style.borderColor='rgba(14,116,112,0.7)';
                    (e.currentTarget as HTMLElement).style.boxShadow='0 12px 32px rgba(14,116,112,0.4)';
                    (e.currentTarget as HTMLElement).style.color='#fff';
                  }}
                  onMouseLeave={e=>{
                    (e.currentTarget as HTMLElement).style.transform='none';
                    (e.currentTarget as HTMLElement).style.background='rgba(14,116,112,0.08)';
                    (e.currentTarget as HTMLElement).style.borderColor='rgba(14,116,112,0.3)';
                    (e.currentTarget as HTMLElement).style.boxShadow='none';
                    (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.6)';
                  }}
                >
                  {icon}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="gsap-reveal" style={{ fontSize:'13px', color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>
            {lang === 'ar' ? 'روابط التواصل الاجتماعي قابلة للضبط' : "Réseaux sociaux configurables dans l'administration"}
          </p>
        )}
      </section>

      <Footer />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity:1; transform:scaleY(1); }
          50%      { opacity:0.4; transform:scaleY(0.7); }
        }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns:1fr !important; }
          .video-layout { grid-template-columns:1fr !important; }
        }
        @media (max-width: 600px) {
          .about-grid { gap:40px !important; }
        }
      `}</style>
    </div>
  );
}
