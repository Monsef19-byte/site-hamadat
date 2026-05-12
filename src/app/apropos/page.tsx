'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

const VALUES = [
  { icon: '◆', fr: 'Qualité', ar: 'الجودة', descFr: 'Les plus hauts standards dans chaque détail de construction.', descAr: 'نهتم بأعلى معايير الجودة في كل تفصيل.' },
  { icon: '◇', fr: 'Innovation', ar: 'الابتكار', descFr: 'Des conceptions modernes adaptées aux attentes contemporaines.', descAr: 'تصاميم عصرية ومبتكرة تلبي التوقعات الحديثة.' },
  { icon: '○', fr: 'Durabilité', ar: 'الاستدامة', descFr: "Un engagement fort envers l'environnement et les générations futures.", descAr: 'التزام قوي تجاه البيئة والأجيال القادمة.' },
  { icon: '△', fr: 'Confiance', ar: 'الثقة', descFr: 'Une relation transparente et durable avec chacun de nos clients.', descAr: 'علاقة شفافة ومستدامة مع كل عملائنا.' },
];

const STATS = [
  { value: '6', fr: 'Projets', ar: 'مشاريع' },
  { value: '163', fr: 'Unités résidentielles', ar: 'وحدة سكنية' },
  { value: '4', fr: 'En cours', ar: 'جارية' },
  { value: '2024', fr: 'Depuis', ar: 'منذ' },
];

export default function AboutPage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const storyFr = config.apropos.story_fr || "Hamadat a été créée avec une vision claire : fournir des projets résidentiels de prestige qui allient la qualité exceptionnelle et les conceptions contemporaines aux meilleurs emplacements d'Algérie.";
  const storyAr = config.apropos.story_ar || 'تأسست حمادة برؤية واضحة: تقديم مشاريع سكنية فاخرة تجمع بين الجودة العالية والتصاميم المعاصرة في أفضل مواقع الجزائر.';

  useEffect(() => {
    let raf = 0;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.batch('.ap-reveal', {
        onEnter: (els) => {
          gsap.fromTo(els,
            { y: 50, opacity: 0, filter: 'blur(4px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', stagger: 0.08 }
          );
        },
        start: 'top 88%',
        once: true,
      });

      gsap.utils.toArray<HTMLElement>('.ap-line').forEach(el => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 1.2, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
        );
      });
    };
    raf = requestAnimationFrame(() => init());
    return () => {
      cancelAnimationFrame(raf);
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.getAll().forEach(t => t.kill()));
    };
  }, []);

  return (
    <div ref={pageRef} style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        paddingTop: '160px', paddingBottom: '80px',
        paddingLeft: '60px', paddingRight: '60px',
        maxWidth: '1320px', margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)',
          fontSize: 'clamp(100px, 18vw, 240px)', fontWeight: '700',
          color: 'var(--border)', opacity: 0.3, letterSpacing: '-0.04em',
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          HAMADAT
        </div>
        <p className="eyebrow" style={{ marginBottom: '20px', animation: 'fadeUp 0.7s ease-out both' }}>
          {lang === 'ar' ? 'من نحن' : 'Notre Histoire'}
        </p>
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '200',
          color: 'var(--text-1)', letterSpacing: '-1.5px', margin: 0,
          animation: 'fadeUp 0.7s ease-out 0.05s both',
        }}>
          {lang === 'ar' ? 'عن حمادة' : <>À Propos de <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Hamadat</em></>}
        </h1>
      </section>

      {/* Story + Stats */}
      <section style={{ background: 'var(--bg-card)', padding: '100px 60px', borderTop: '1px solid var(--border)' }}>
        <div className="two-col-grid" style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '100px', alignItems: 'start' }}>
          <div>
            <h2 className="ap-reveal" style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-0.5px', marginBottom: '32px', lineHeight: 1.2 }}>
              {lang === 'ar' ? 'قصتنا' : <>Notre <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Histoire</em></>}
            </h2>
            <div className="ap-line" style={{ height: '2px', background: 'linear-gradient(90deg, var(--teal), transparent)', marginBottom: '32px', maxWidth: '120px' }} />
            <p className="ap-reveal" style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: '2', fontWeight: '300', marginBottom: '24px' }}>
              {lang === 'ar' ? storyAr : storyFr}
            </p>
            <p className="ap-reveal" style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: '2', fontWeight: '300' }}>
              {lang === 'ar'
                ? 'اليوم، نفخر بمحفظة من 6 مشاريع تضم 163 وحدة سكنية في الجزائر وجيجل.'
                : "Aujourd'hui, nous proposons un portefeuille de 6 projets comprenant 163 unités résidentielles, tous situés à Alger et à Jijel."}
            </p>
          </div>

          <div className="stats-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            {STATS.map((s, i) => (
              <div key={i} className="ap-reveal" style={{
                padding: '40px 32px',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.4s ease',
                cursor: 'default',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(14,116,112,0.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ fontSize: 'clamp(40px, 4vw, 64px)', fontWeight: '100', color: 'var(--teal)', lineHeight: 1, letterSpacing: '-2px', marginBottom: '10px' }}>
                  {s.value}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-4)', margin: 0, fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? s.ar : s.fr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '120px 60px', background: 'var(--bg-page)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <p className="ap-reveal" style={{ fontSize: '10px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}>
            {lang === 'ar' ? 'قيمنا' : 'Nos Valeurs'}
          </p>
          <h2 className="ap-reveal" style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-0.5px', marginBottom: '64px' }}>
            {lang === 'ar' ? 'ما يميزنا' : <>Ce qui nous <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>définit</em></>}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2px' }}>
            {VALUES.map((v, idx) => (
              <div key={idx} className="ap-reveal"
                onMouseEnter={() => setHovIdx(idx)}
                onMouseLeave={() => setHovIdx(null)}
                style={{
                  padding: '48px 40px',
                  background: hovIdx === idx ? 'var(--teal)' : 'var(--bg-card)',
                  transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                  cursor: 'default',
                  borderRadius: '2px',
                  transform: hovIdx === idx ? 'translateY(-4px)' : 'none',
                  boxShadow: hovIdx === idx ? '0 24px 64px rgba(14,116,112,0.25)' : 'none',
                }}
              >
                <div style={{
                  fontSize: '28px', color: hovIdx === idx ? 'rgba(255,255,255,0.3)' : 'var(--teal)',
                  marginBottom: '24px', lineHeight: 1,
                  transition: 'color 0.4s ease',
                }}>
                  {v.icon}
                </div>
                <div style={{
                  fontSize: '32px', fontWeight: '100', color: hovIdx === idx ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                  marginBottom: '16px', lineHeight: 1,
                  transition: 'color 0.4s ease',
                }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 style={{
                  fontSize: '20px', fontWeight: '600',
                  color: hovIdx === idx ? '#fff' : 'var(--text-1)',
                  marginBottom: '12px', margin: '0 0 12px',
                  transition: 'color 0.4s ease',
                }}>
                  {lang === 'ar' ? v.ar : v.fr}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: hovIdx === idx ? 'rgba(255,255,255,0.7)' : 'var(--text-3)',
                  margin: 0, lineHeight: '1.8',
                  transition: 'color 0.4s ease',
                }}>
                  {lang === 'ar' ? v.descAr : v.descFr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 600px) {
          .two-col-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .stats-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
