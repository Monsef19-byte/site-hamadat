'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

const VALUES = [
  { fr: 'Qualité',    ar: 'الجودة',     descFr: 'Les plus hauts standards dans chaque détail de construction.', descAr: 'نهتم بأعلى معايير الجودة في كل تفصيل.' },
  { fr: 'Innovation', ar: 'الابتكار',   descFr: 'Des conceptions modernes adaptées aux attentes contemporaines.', descAr: 'تصاميم عصرية ومبتكرة تلبي التوقعات الحديثة.' },
  { fr: 'Durabilité', ar: 'الاستدامة', descFr: "Un engagement fort envers l'environnement et les générations futures.", descAr: 'التزام قوي تجاه البيئة والأجيال القادمة.' },
  { fr: 'Confiance',  ar: 'الثقة',      descFr: 'Une relation transparente et durable avec chacun de nos clients.', descAr: 'علاقة شفافة ومستدامة مع كل عملائنا.' },
];

const STATS = [
  { value: '6',    fr: 'Projets',              ar: 'مشاريع' },
  { value: '163',  fr: 'Unités résidentielles', ar: 'وحدة سكنية' },
  { value: '4',    fr: 'En cours',              ar: 'جارية' },
  { value: '2024', fr: 'Depuis',                ar: 'منذ' },
];

export default function AboutPage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const [hovIdx, setHovIdx] = useState<number | null>(null);

  const storyFr = config.apropos.story_fr || "Hamadat a été créée avec une vision claire : fournir des projets résidentiels de prestige qui allient la qualité exceptionnelle et les conceptions contemporaines aux meilleurs emplacements d'Algérie.";
  const storyAr = config.apropos.story_ar || 'تأسست حمادة برؤية واضحة: تقديم مشاريع سكنية فاخرة تجمع بين الجودة العالية والتصاميم المعاصرة في أفضل مواقع الجزائر.';

  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero */}
      <section className="page-header" style={{ paddingTop: '160px', paddingBottom: '80px', paddingLeft: '60px', paddingRight: '60px', maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', animation: 'fadeUp 0.7s ease-out both' }}>
          {lang === 'ar' ? 'من نحن' : 'Notre Histoire'}
        </p>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-1.5px', margin: 0, animation: 'fadeUp 0.7s ease-out 0.05s both' }}>
          {lang === 'ar' ? 'عن حمادة' : 'À Propos de Hamadat'}
        </h1>
      </section>

      {/* Story */}
      <section className="page-section" style={{ background: 'var(--bg-card)', padding: '80px 60px' }}>
        <div className="two-col-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', marginBottom: '28px' }}>
              {lang === 'ar' ? 'قصتنا' : 'Notre Histoire'}
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: '1.9', fontWeight: '300', marginBottom: '24px' }}>
              {lang === 'ar' ? storyAr : storyFr}
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: '1.9', fontWeight: '300' }}>
              {lang === 'ar'
                ? 'اليوم، نفخر بمحفظة من 6 مشاريع تضم 163 وحدة سكنية في الجزائر وجيجل.'
                : "Aujourd'hui, nous proposons un portefeuille de 6 projets comprenant 163 unités résidentielles, tous situés à Alger et à Jijel."}
            </p>
          </div>

          {/* Stats column */}
          <div className="stats-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '32px',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 'clamp(40px, 4vw, 60px)', fontWeight: '200', color: 'var(--text-3)', lineHeight: 1, letterSpacing: '-2px', marginBottom: '8px' }}>
                  {s.value}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-4)', margin: 0, fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? s.ar : s.fr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="page-section" style={{ padding: '100px 60px', background: 'var(--bg-page)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
            {lang === 'ar' ? 'قيمنا' : 'Nos Valeurs'}
          </p>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', marginBottom: '56px' }}>
            {lang === 'ar' ? 'ما يميزنا' : 'Ce qui nous définit'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px' }}>
            {VALUES.map((v, idx) => (
              <div key={idx}
                onMouseEnter={() => setHovIdx(idx)}
                onMouseLeave={() => setHovIdx(null)}
                style={{
                  padding: '40px 36px',
                  background: hovIdx === idx ? '#0e7470' : 'var(--bg-card)',
                  transition: 'background 0.3s ease',
                  cursor: 'default',
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: '200', color: hovIdx === idx ? 'rgba(255,255,255,0.3)' : 'var(--border)', marginBottom: '20px', lineHeight: 1 }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: hovIdx === idx ? '#fff' : 'var(--text-1)', marginBottom: '12px', margin: '0 0 12px' }}>
                  {lang === 'ar' ? v.ar : v.fr}
                </h3>
                <p style={{ fontSize: '14px', color: hovIdx === idx ? 'rgba(255,255,255,0.75)' : 'var(--text-3)', margin: 0, lineHeight: '1.7' }}>
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
          .page-header { padding-left: 24px !important; padding-right: 24px !important; padding-top: 100px !important; padding-bottom: 40px !important; }
          .page-section { padding-left: 24px !important; padding-right: 24px !important; padding-top: 60px !important; padding-bottom: 60px !important; }
          .two-col-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .stats-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
