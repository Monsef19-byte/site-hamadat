'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    <Link
      href={`/projets/${r.slug}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', animation: `fadeUp 0.6s ease-out ${0.05 * idx}s both` }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        position: 'relative', aspectRatio: '4/3',
        overflow: 'hidden', borderRadius: '6px',
        background: 'var(--border)',
        boxShadow: hov ? '0 24px 56px rgba(0,0,0,0.14)' : '0 4px 16px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.35s ease',
        marginBottom: '20px',
      }}>
        <img src={r.thumb} alt={r.name_fr} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          transform: hov ? 'scale(1.06)' : 'scale(1)',
        }} />
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
            background: 'rgba(14,116,112,0.88)', backdropFilter: 'blur(4px)',
            color: '#fff', padding: '4px 12px',
            fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', borderRadius: '2px',
          }}>
            {lang === 'ar' ? 'متاح' : r.available}
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(14,116,112,0.08)',
          opacity: hov ? 1 : 0, transition: 'opacity 0.35s ease',
        }} />
      </div>
      <h3 style={{ fontSize: '22px', fontWeight: '400', color: 'var(--text-1)', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
        {lang === 'ar' ? r.name_ar : r.name_fr}
      </h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0 }}>{r.location}</p>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0 }}>
          {r.total_units} {lang === 'ar' ? 'وحدة' : 'unités'}
        </p>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-4)', margin: '8px 0 0', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
        {r.typology}
      </p>
    </Link>
  );
}

export default function ProjectsPage() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState('');
  const filtered = filter ? RESIDENCES.filter(r => r.status === filter) : RESIDENCES;

  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Header */}
      <section className="page-header" style={{ paddingTop: '160px', paddingBottom: '64px', paddingLeft: '60px', paddingRight: '60px', maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', animation: 'fadeUp 0.7s ease-out both' }}>
          {lang === 'ar' ? 'مجمعاتنا السكنية' : 'Portfolio'}
        </p>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-1.5px', margin: '0 0 40px', animation: 'fadeUp 0.7s ease-out 0.05s both' }}>
          {lang === 'ar' ? 'مشاريعنا' : 'Nos Projets'}
        </h1>
        <div style={{ display: 'flex', gap: '8px', animation: 'fadeUp 0.7s ease-out 0.1s both' }}>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} style={{
              padding: '8px 24px',
              background: filter === f.value ? 'var(--teal)' : 'transparent',
              color: filter === f.value ? '#fff' : 'var(--text-2)',
              border: filter === f.value ? '1px solid var(--teal)' : '1px solid var(--border)',
              borderRadius: '40px', fontSize: '12px', fontWeight: '600',
              cursor: 'pointer', letterSpacing: '0.3px', transition: 'all 0.2s ease',
            }}>
              {lang === 'ar' ? f.ar : f.fr}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="page-content" style={{ background: 'var(--bg-card)', padding: '60px 60px 120px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {filtered.length > 0 ? (
            <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
              {filtered.map((r, idx) => <ProjectCard key={r.slug} r={r} lang={lang} idx={idx} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '80px 0', fontSize: '15px' }}>
              {lang === 'ar' ? 'لا توجد مشاريع مطابقة' : 'Aucun projet ne correspond.'}
            </p>
          )}
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 600px) {
          .page-header { padding-left: 24px !important; padding-right: 24px !important; padding-top: 100px !important; }
          .page-content { padding-left: 24px !important; padding-right: 24px !important; padding-bottom: 60px !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
