'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';

const PROJECTS: Record<string, {
  name_fr: string; name_ar: string;
  location: string; status: 'ongoing' | 'completed';
  total_units: number; typology: string;
  description_fr: string; description_ar: string;
  thumbnail: string; gallery: string[];
  available?: string; delivery?: string;
}> = {
  elysia: {
    name_fr: 'Elysia', name_ar: 'إليسيا',
    location: 'Jijel', status: 'ongoing',
    total_units: 56, typology: 'F3 (96 m² — 110 m²)',
    description_fr: "Implantée à Jijel, la résidence Elysia est un projet en cours développé par Hamadat Promotion Immobilière, proposant 56 logements de type F3 aux surfaces optimisées (96 m² et 110 m²). Pensée pour offrir un équilibre entre espace, luminosité et confort, Elysia s'inscrit dans une dynamique urbaine attractive.",
    description_ar: "في جيجل، تقدم إليسيا 56 وحدة سكنية من نوع F3 بمساحات 96 و110 م²، توازن بين الفضاء والإضاءة والراحة.",
    thumbnail: '/residences/elysia/vue-001-1.jpg',
    gallery: [
      '/residences/elysia/vue-001-1.jpg',
      '/residences/elysia/vue-001-n-1.jpg',
      '/residences/elysia/vue-002-n-1.jpg',
      '/residences/elysia/vue-0025-1.jpg',
      '/residences/elysia/vue-02.jpg',
      '/residences/elysia/vue-03.jpg',
      '/residences/elysia/vue-a-1.jpg',
      '/residences/elysia/vue-c-1.jpg',
      '/residences/elysia/vue-nuit-1.jpg',
      '/residences/elysia/vue-nuit-2.jpg',
      '/residences/elysia/vue-nuit-3.jpg',
      '/residences/elysia/vue-jour-1.jpg',
      '/residences/elysia/vue-jour-2.jpg',
      '/residences/elysia/vue-jour-3.jpg',
    ],
  },
  'les-3-princes': {
    name_fr: 'Les 3 Princes', name_ar: 'الثلاث أمراء',
    location: 'Dely Brahim, Alger', status: 'completed',
    total_units: 43, typology: 'F3 à F6 — Simplex & Duplex',
    description_fr: "La résidence Les 3 Princes, réalisée par Hamadat Promotion Immobilière, est un projet achevé comprenant 43 appartements allant du F3 au F6, en configurations simplex et duplex. Située à Dely Brahim, cette promotion se distingue par la diversité de ses logements et la qualité de son aménagement.",
    description_ar: "مجمع مكتمل في دالي إبراهيم يضم 43 شقة من F3 إلى F6 بتصاميم سيمبلكس ودوبلكس.",
    thumbnail: '/residences/les-3-princes/vue-2.jpg',
    gallery: [
      '/residences/les-3-princes/vue-2.jpg',
      '/residences/les-3-princes/vue-3.jpg',
      '/residences/les-3-princes/vue-4.jpg',
      '/residences/les-3-princes/vue-5.jpg',
      '/residences/les-3-princes/vue-drone.jpg',
      '/residences/les-3-princes/vue-2-1.jpg',
    ],
  },
  orea: {
    name_fr: 'Orea', name_ar: 'أوريا',
    location: 'Dely Brahim, Alger', status: 'ongoing',
    total_units: 38, typology: 'F3 à F6',
    description_fr: "Orea est un projet en cours signé Hamadat Promotion Immobilière, proposant 38 appartements allant du F3 au F6. Avec une livraison prévue dans les 24 mois, cette résidence offre des opportunités d'acquisition avec des unités encore disponibles.",
    description_ar: "أوريا مشروع جارٍ يضم 38 شقة من F3 إلى F6، مع تسليم متوقع خلال 24 شهراً.",
    thumbnail: '/residences/orea/b1.jpg',
    available: '2 F3, 1 F4', delivery: '24 mois',
    gallery: [
      '/residences/orea/b1.jpg', '/residences/orea/B3.jpg', '/residences/orea/b4.jpg',
      '/residences/orea/b5.jpg', '/residences/orea/b7.jpg', '/residences/orea/B16.jpg',
      '/residences/orea/b17.jpg', '/residences/orea/b18.jpg', '/residences/orea/b20.jpg',
    ],
  },
  lumalac: {
    name_fr: 'Lumalac', name_ar: 'لوملاك',
    location: 'Dely Brahim, Alger', status: 'ongoing',
    total_units: 8, typology: '6 × F3 — 2 × Triplex F7',
    description_fr: "Située à Dely Brahim, la résidence Lumalac est un projet en cours de réalisation qui promet un cadre de vie contemporain et raffiné. Composée de 8 logements, dont des F3 et des triplex F7, cette promotion allie espaces généreux et conception moderne.",
    description_ar: "لوملاك مشروع حديث في دالي إبراهيم يضم 8 وحدات بين F3 وتريبلكس F7.",
    thumbnail: '/residences/lumalac/lumalac-1.png',
    gallery: ['/residences/lumalac/lumalac-1.png', '/residences/lumalac/lumalac-02.png'],
  },
  marmo: {
    name_fr: 'Marmo', name_ar: 'مارمو',
    location: 'Dely Brahim, Alger', status: 'completed',
    total_units: 8, typology: '6 × F3 — 2 × Duplex F6',
    description_fr: "Le projet Marmo est une résidence livrée offrant un cadre de vie moderne et fonctionnel à Dely Brahim. Composée de 8 logements incluant des F3 et des duplex F6, cette promotion se distingue par son architecture équilibrée et son confort au quotidien.",
    description_ar: "مارمو مجمع سكني مسلم في دالي إبراهيم يضم 8 وحدات بين F3 ودوبلكس F6.",
    thumbnail: '/residences/marmo/1.jpg',
    gallery: ['/residences/marmo/1.jpg', '/residences/marmo/2.jpg', '/residences/marmo/3.jpg'],
  },
  vertdalya: {
    name_fr: 'Vert Dalya', name_ar: 'فيرت داليا',
    location: 'Dely Brahim, Alger', status: 'completed',
    total_units: 10, typology: 'Loft 270 m²',
    description_fr: "Vertdalya, réalisée par Hamadat Promotion Immobilière, est une résidence finalisée composée de 10 lofts spacieux de 270 m². Située à Dely Brahim, cette promotion se distingue par ses volumes généreux et son concept architectural moderne.",
    description_ar: "فيرت داليا مجمع مكتمل في دالي إبراهيم يضم 10 شقق من نوع لوفت بمساحة 270 م².",
    thumbnail: '/residences/vertdalya/vrtdalya.png',
    available: 'Disponible',
    gallery: ['/residences/vertdalya/vrtdalya.png', '/residences/vertdalya/Remove_the_rectengle_in_the_top_right__2k_delpmaspu.png'],
  },
};

const ALL = [
  { slug: 'elysia',        name: 'Elysia',       thumb: '/residences/elysia/vue-001-1.jpg' },
  { slug: 'les-3-princes', name: 'Les 3 Princes', thumb: '/residences/les-3-princes/vue-2.jpg' },
  { slug: 'orea',          name: 'Orea',          thumb: '/residences/orea/b1.jpg' },
  { slug: 'lumalac',       name: 'Lumalac',       thumb: '/residences/lumalac/lumalac-1.png' },
  { slug: 'marmo',         name: 'Marmo',         thumb: '/residences/marmo/1.jpg' },
  { slug: 'vertdalya',     name: 'Vert Dalya',    thumb: '/residences/vertdalya/vrtdalya.png' },
];

export default function ProjectDetailPage() {
  const { lang } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const project = PROJECTS[slug];

  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-3)', marginBottom: '16px' }}>Projet introuvable.</p>
          <Link href="/projets" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>← Tous les projets</Link>
        </div>
      </div>
    );
  }

  const gallery = project.gallery;
  const heroSrc = gallery[activeImg] || project.thumbnail;

  const specs = [
    { label: lang === 'ar' ? 'المشروع'     : 'Projet',       value: lang === 'ar' ? project.name_ar : project.name_fr },
    { label: lang === 'ar' ? 'الموقع'       : 'Localisation', value: project.location },
    { label: lang === 'ar' ? 'الحالة'       : 'Statut',       value: project.status === 'completed' ? (lang === 'ar' ? 'منجز' : 'Livré') : (lang === 'ar' ? 'جارٍ' : 'En Cours') },
    { label: lang === 'ar' ? 'عدد الوحدات' : "Nb d'unités",  value: String(project.total_units) },
    { label: lang === 'ar' ? 'النوع'        : 'Typologies',   value: project.typology },
    ...(project.available ? [{ label: lang === 'ar' ? 'متاح' : 'Disponible', value: project.available }] : []),
    ...(project.delivery  ? [{ label: lang === 'ar' ? 'التسليم' : 'Livraison', value: project.delivery }] : []),
  ];

  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero — full bleed */}
      <section style={{ position: 'relative', height: '70vh', minHeight: '480px', marginTop: '72px', overflow: 'hidden' }}>
        <img src={heroSrc} alt={project.name_fr} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.65) 100%)' }} />

        {/* Title bottom-left */}
        <div style={{ position: 'absolute', bottom: '48px', left: '60px', zIndex: 10 }}>
          <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
            {project.location}
          </span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '300', color: '#fff', letterSpacing: '-1px', margin: 0 }}>
            {lang === 'ar' ? project.name_ar : project.name_fr}
          </h1>
        </div>

        {/* Status badge top-right */}
        <div style={{
          position: 'absolute', top: '28px', right: '36px',
          background: project.status === 'completed' ? 'rgba(16,185,129,0.9)' : 'rgba(14,116,112,0.9)',
          color: '#fff', padding: '6px 18px',
          fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '2px',
        }}>
          {project.status === 'completed' ? (lang === 'ar' ? 'منجز' : 'Livré') : (lang === 'ar' ? 'جارٍ' : 'En Cours')}
        </div>
      </section>

      {/* Thumbnail strip */}
      {gallery.length > 1 && (
        <div style={{ background: 'var(--bg-dark)', padding: '12px 60px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '6px', maxWidth: '1280px', margin: '0 auto' }}>
            {gallery.map((src, idx) => (
              <button key={idx} onClick={() => setActiveImg(idx)} style={{
                flexShrink: 0, width: '88px', height: '60px',
                border: activeImg === idx ? '2px solid var(--teal)' : '2px solid transparent',
                borderRadius: '3px', overflow: 'hidden',
                background: '#333', padding: 0, cursor: 'pointer',
                transition: 'border-color 0.2s',
                opacity: activeImg === idx ? 1 : 0.5,
              }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 60px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(300px, 360px)', gap: '80px', alignItems: 'start' }}>

          {/* Left: description + gallery grid */}
          <div>
            <Link href="/projets" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none', marginBottom: '36px',
              letterSpacing: '0.3px', transition: 'color 0.2s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}
            >
              ← {lang === 'ar' ? 'جميع المشاريع' : 'Tous les projets'}
            </Link>

            <h2 style={{ fontSize: '26px', fontWeight: '300', color: 'var(--text-1)', marginBottom: '20px', letterSpacing: '-0.3px' }}>
              {lang === 'ar' ? 'عن المشروع' : 'À Propos du Projet'}
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: '1.9', fontWeight: '300', marginBottom: '64px' }}>
              {lang === 'ar' ? project.description_ar : project.description_fr}
            </p>

            {/* Gallery grid */}
            {gallery.length > 1 && (
              <>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-1)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
                  {lang === 'ar' ? 'معرض الصور' : 'Galerie'} <span style={{ color: 'var(--text-4)', fontWeight: '400', fontSize: '13px', textTransform: 'none', letterSpacing: '0' }}>({gallery.length})</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                  {gallery.map((src, idx) => (
                    <button key={idx} onClick={() => { setActiveImg(idx); setLightboxOpen(true); }}
                      style={{
                        display: 'block', width: '100%', aspectRatio: '4/3',
                        border: 'none', padding: 0, cursor: 'zoom-in',
                        overflow: 'hidden', borderRadius: '4px', background: 'var(--border)',
                      }}
                    >
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: spec card */}
          <div style={{ position: 'sticky', top: '96px' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <div style={{ background: 'linear-gradient(135deg, #0e7470 0%, #0a5450 100%)', padding: '28px 32px' }}>
                <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? 'معلومات المشروع' : 'Fiche Technique'}
                </h3>
              </div>
              <div style={{ padding: '28px 32px' }}>
                {specs.map((item) => (
                  <div key={item.label} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px' }}>
                    <p style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', margin: '0 0 4px' }}>{item.label}</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: '500', margin: 0 }}>{item.value}</p>
                  </div>
                ))}
                <Link href="/contact" style={{
                  display: 'block', textAlign: 'center',
                  padding: '14px', marginTop: '12px',
                  background: 'var(--teal)', color: '#fff',
                  textDecoration: 'none', borderRadius: '4px',
                  fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px',
                  transition: 'background 0.25s ease',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--teal-dk)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--teal)'; }}
                >
                  {lang === 'ar' ? 'استفسر الآن →' : 'Nous Contacter →'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Other projects */}
        <div style={{ marginTop: '100px', borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '32px' }}>
            {lang === 'ar' ? 'مشاريع أخرى' : 'Autres Projets'}
          </h3>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
            {ALL.filter(p => p.slug !== slug).map(p => (
              <Link key={p.slug} href={`/projets/${p.slug}`} style={{
                flexShrink: 0, textDecoration: 'none', color: 'inherit',
                transition: 'transform 0.3s ease',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '210px', height: '140px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px', background: 'var(--border)' }}>
                  <img src={p.thumb} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-1)', margin: 0 }}>{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.94)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'zoom-out',
        }}>
          <button onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg - 1 + gallery.length) % gallery.length); }}
            style={{ position: 'absolute', left: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '30px', width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ‹
          </button>
          <div style={{ width: '80vw', height: '80vh', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={gallery[activeImg]} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
          <button onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg + 1) % gallery.length); }}
            style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '30px', width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ›
          </button>
          <button onClick={() => setLightboxOpen(false)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white', fontSize: '18px', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
          <p style={{ position: 'absolute', bottom: '24px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '1px' }}>
            {activeImg + 1} / {gallery.length}
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
