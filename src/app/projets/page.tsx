'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealBlock from '@/components/anim/RevealBlock';
import { useLanguage } from '@/lib/language-context';

interface Residence {
  slug: string; name_fr: string; name_ar: string;
  location: string; status: string; total_units: number;
  typology: string; thumb: string; available?: string;
}

const RESIDENCES: Residence[] = [
  { slug: 'elysia',        name_fr: 'Elysia',        name_ar: 'إليسيا',        location: 'Jijel',              status: 'ongoing',   total_units: 56,  typology: 'F3 — 96 m² à 110 m²',       thumb: '/residences/elysia/vue-001-1.jpg' },
  { slug: 'les-3-princes', name_fr: 'Les 3 Princes',  name_ar: 'الثلاث أمراء', location: 'Dely Brahim, Alger', status: 'completed', total_units: 43,  typology: 'F3 à F6 — Simplex & Duplex', thumb: '/residences/les-3-princes/vue-2.jpg' },
  { slug: 'orea',          name_fr: 'Orea',           name_ar: 'أوريا',         location: 'Dely Brahim, Alger', status: 'ongoing',   total_units: 38,  typology: 'F3 à F6',                    thumb: '/residences/orea/b1.jpg', available: '2 F3, 1 F4' },
  { slug: 'lumalac',       name_fr: 'Lumalac',        name_ar: 'لوملاك',        location: 'Dely Brahim, Alger', status: 'ongoing',   total_units: 8,   typology: '6 × F3 — 2 × Triplex F7',   thumb: '/residences/lumalac/lumalac-1.png' },
  { slug: 'marmo',         name_fr: 'Marmo',          name_ar: 'مارمو',         location: 'Dely Brahim, Alger', status: 'completed', total_units: 8,   typology: '6 × F3 — 2 × Duplex F6',    thumb: '/residences/marmo/1.jpg' },
  { slug: 'vertdalya',     name_fr: 'Vert Dalya',     name_ar: 'فيرت داليا',    location: 'Dely Brahim, Alger', status: 'completed', total_units: 10,  typology: 'Loft 270 m²',                thumb: '/residences/vertdalya/vrtdalya.png', available: 'Disponible' },
];

const FILTERS = [
  { value: '',          fr: 'Tous',     ar: 'الكل' },
  { value: 'ongoing',   fr: 'En Cours', ar: 'جارية' },
  { value: 'completed', fr: 'Livrés',   ar: 'منجزة' },
];

function ProjectCard({ r, lang, idx }: { r: Residence; lang: string; idx: number }) {
  const [hov, setHov] = useState(false);

  return (
    <RevealBlock delay={0.08 * idx} y={52}>
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
          overflow: 'hidden', borderRadius: '4px',
          background: 'var(--border)',
          boxShadow: hov ? '0 28px 64px rgba(0,0,0,0.18)' : '0 4px 20px rgba(0,0,0,0.07)',
          transition: 'box-shadow 0.5s cubic-bezier(0.22,1,0.36,1)',
          transform: hov ? 'translateY(-6px)' : 'translateY(0)',
          transitionProperty: 'box-shadow, transform',
          transitionDuration: '0.5s',
          transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
          marginBottom: '20px',
        }}>
          <img src={r.thumb} alt={r.name_fr} style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
            transform: hov ? 'scale(1.07)' : 'scale(1)',
          }} />

          {/* Dark overlay on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.18)',
            opacity: hov ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }} />

          {/* Status badge */}
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: r.status === 'completed' ? 'rgba(16,185,129,0.92)' : 'rgba(14,116,112,0.92)',
            color: '#fff', padding: '4px 12px',
            fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '2px',
          }}>
            {r.status === 'completed' ? (lang === 'ar' ? 'منجز' : 'Livré') : (lang === 'ar' ? 'جارٍ' : 'En Cours')}
          </div>

          {r.available && (
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px',
              background: 'rgba(14,116,112,0.9)',
              color: '#fff', padding: '4px 12px',
              fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', borderRadius: '2px',
            }}>
              {lang === 'ar' ? 'متاح' : r.available}
            </div>
          )}

          {/* Arrow icon on hover */}
          <div style={{
            position: 'absolute', bottom: '16px', right: '16px',
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hov ? 1 : 0,
            transform: hov ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(8px)',
            transition: 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)',
            fontSize: '16px', color: '#0e7470',
          }}>
            →
          </div>
        </div>

        {/* Card text */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{
            fontSize: '21px', fontWeight: '400',
            color: 'var(--text-1)', margin: 0, letterSpacing: '-0.3px',
            transition: 'color 0.3s',
            ...(hov ? { color: 'var(--teal)' } : {}),
          }}>
            {lang === 'ar' ? r.name_ar : r.name_fr}
          </h3>
          <span style={{ fontSize: '13px', color: 'var(--text-4)', marginTop: '4px' }}>
            {r.total_units} {lang === 'ar' ? 'وحدة' : 'unités'}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: '0 0 10px' }}>{r.location}</p>
        <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0 0' }} />
        <p style={{ fontSize: '11px', color: 'var(--text-4)', margin: '10px 0 0', letterSpacing: '0.3px' }}>
          {r.typology}
        </p>
      </Link>
    </RevealBlock>
  );
}

export default function ProjectsPage() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState('');

  const filtered = filter ? RESIDENCES.filter(r => r.status === filter) : RESIDENCES;

  // Lines reveal
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll<HTMLElement>('.line-inner').forEach((el, i) => {
          setTimeout(() => el.classList.add('lv'), i * 90);
        });
        obs.unobserve(e.target);
      }
    }, { threshold: 0.1 });
    document.querySelectorAll('.lines-observe').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: 'var(--bg-page)', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── Header ── */}
      <section style={{ paddingTop: '180px', paddingBottom: '80px', paddingLeft: '60px', paddingRight: '60px', maxWidth: '1280px', margin: '0 auto' }}>

        <RevealBlock delay={0} y={24}>
          <span style={{
            display: 'block',
            fontSize: '10px', fontWeight: '700', color: 'var(--teal)',
            letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px',
          }}>
            {lang === 'ar' ? 'مجمعاتنا السكنية' : 'Portfolio'}
          </span>
        </RevealBlock>

        <div className="lines-observe" style={{ marginBottom: '52px' }}>
          <div style={{ overflow: 'hidden' }}>
            <h1 className="line-inner" style={{
              fontSize: 'clamp(44px, 7vw, 88px)',
              fontWeight: '300', color: 'var(--text-1)',
              letterSpacing: '-2px', margin: 0, lineHeight: '1.0',
            }}>
              {lang === 'ar' ? 'مشاريعنا' : 'Nos Projets'}
            </h1>
          </div>
        </div>

        {/* Filters */}
        <RevealBlock delay={0.2} y={20}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)} data-cursor style={{
                padding: '9px 28px',
                background: filter === f.value ? 'var(--teal)' : 'transparent',
                color: filter === f.value ? '#fff' : 'var(--text-2)',
                border: filter === f.value ? '1px solid var(--teal)' : '1px solid var(--border)',
                borderRadius: '40px', fontSize: '11px', fontWeight: '700',
                cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase',
                transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
              }}
                onMouseEnter={(e) => { if (filter !== f.value) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; } }}
                onMouseLeave={(e) => { if (filter !== f.value) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; } }}
              >
                {lang === 'ar' ? f.ar : f.fr}
              </button>
            ))}
          </div>
        </RevealBlock>
      </section>

      {/* ── Grid ── */}
      <section style={{ background: 'var(--bg-card)', padding: '80px 60px 140px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '48px 32px' }} className="proj-grid">
              {filtered.map((r, idx) => <ProjectCard key={r.slug} r={r} lang={lang} idx={idx} />)}
            </div>
          ) : (
            <RevealBlock delay={0} y={24}>
              <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '80px 0', fontSize: '15px' }}>
                {lang === 'ar' ? 'لا توجد مشاريع مطابقة' : 'Aucun projet ne correspond.'}
              </p>
            </RevealBlock>
          )}
        </div>
      </section>

      <Footer />
      <style>{`
        @media (max-width: 600px) {
          .proj-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
