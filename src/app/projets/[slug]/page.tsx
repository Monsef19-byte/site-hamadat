'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealBlock from '@/components/anim/RevealBlock';
import PosterReel from '@/components/anim/PosterReel';
import { useTilt } from '@/lib/use-tilt';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

const OSM_JIJEL      = 'https://www.openstreetmap.org/export/embed.html?bbox=5.5%2C36.65%2C6.05%2C37.0&layer=mapnik&marker=36.8206%2C5.7667';
const OSM_DELY       = 'https://www.openstreetmap.org/export/embed.html?bbox=2.88%2C36.69%2C3.11%2C36.80&layer=mapnik&marker=36.7397%2C2.9943';

const PROJECTS: Record<string, {
  name_fr: string; name_ar: string;
  location: string; status: 'ongoing' | 'completed';
  total_units: number; typology: string;
  description_fr: string; description_ar: string;
  thumbnail: string; gallery: string[];
  available?: string; delivery?: string;
  defaultMap: string;
}> = {
  elysia: {
    name_fr: 'Elysia', name_ar: 'إليسيا',
    location: 'Jijel', status: 'ongoing',
    total_units: 56, typology: 'F3 (96 m² — 110 m²)',
    description_fr: "Implantée à Jijel, la résidence Elysia est un projet en cours développé par Hamadat Promotion Immobilière, proposant 56 logements de type F3 aux surfaces optimisées (96 m² et 110 m²). Pensée pour offrir un équilibre entre espace, luminosité et confort, Elysia s'inscrit dans une dynamique urbaine attractive.",
    description_ar: "في جيجل، تقدم إليسيا 56 وحدة سكنية من نوع F3 بمساحات 96 و110 م²، توازن بين الفضاء والإضاءة والراحة.",
    thumbnail: '/residences/elysia/vue-001-1.jpg',
    defaultMap: OSM_JIJEL,
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
    defaultMap: OSM_DELY,
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
    defaultMap: OSM_DELY,
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
    defaultMap: OSM_DELY,
    gallery: ['/residences/lumalac/lumalac-1.png', '/residences/lumalac/lumalac-02.png'],
  },
  marmo: {
    name_fr: 'Marmo', name_ar: 'مارمو',
    location: 'Dely Brahim, Alger', status: 'completed',
    total_units: 8, typology: '6 × F3 — 2 × Duplex F6',
    description_fr: "Le projet Marmo est une résidence livrée offrant un cadre de vie moderne et fonctionnel à Dely Brahim. Composée de 8 logements incluant des F3 et des duplex F6, cette promotion se distingue par son architecture équilibrée et son confort au quotidien.",
    description_ar: "مارمو مجمع سكني مسلم في دالي إبراهيم يضم 8 وحدات بين F3 ودوبلكس F6.",
    thumbnail: '/residences/marmo/1.jpg',
    defaultMap: OSM_DELY,
    gallery: ['/residences/marmo/1.jpg', '/residences/marmo/2.jpg', '/residences/marmo/3.jpg'],
  },
  vertdalya: {
    name_fr: 'Vert Dalya', name_ar: 'فيرت داليا',
    location: 'Dely Brahim, Alger', status: 'completed',
    total_units: 10, typology: 'Loft 270 m²',
    description_fr: "Vertdalya, réalisée par Hamadat Promotion Immobilière, est une résidence finalisée composée de 10 lofts spacieux de 270 m². Située à Dely Brahim, cette promotion se distingue par ses volumes généreux et son concept architectural moderne.",
    description_ar: "فيرت داليا مجمع مكتمل في دالي إبراهيم يضم 10 شقق من نوع لوفت بمساحة 270 م².",
    thumbnail: '/residences/vertdalya/vrtdalya.png',
    defaultMap: OSM_DELY,
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

function GalleryCard({ src, active, onClick }: { src: string; active: boolean; onClick: () => void }) {
  const { innerRef, onMouseMove, onMouseLeave } = useTilt();
  return (
    <button
      onClick={onClick}
      style={{ display: 'block', width: '100%', aspectRatio: '4/3', border: 'none', padding: 0, cursor: 'zoom-in', borderRadius: '10px', overflow: 'hidden', outline: active ? '2px solid #0e7470' : 'none', outlineOffset: '2px' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div ref={innerRef} style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: 'rotateX(var(--rotX,0deg)) rotateY(var(--rotY,0deg))' }}>
        <img src={src} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transform: 'scale(1.15) translate3d(var(--bgPosX,0%),var(--bgPosY,0%),0)',
          transition: 'transform 0.4s ease',
        }} />
      </div>
    </button>
  );
}

export default function ProjectDetailPage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const params = useParams();
  const slug = params?.slug as string;
  const project = PROJECTS[slug];
  const mapEmbed = config.residences[slug]?.mapEmbed || project?.defaultMap;

  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Lines reveal
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll<HTMLElement>('.line-inner').forEach((el, i) => {
          setTimeout(() => el.classList.add('lv'), i * 80);
        });
        obs.unobserve(e.target);
      }
    }, { threshold: 0.1 });
    document.querySelectorAll('.lines-observe').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Image mask reveal
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).classList.add('iv');
        obs.unobserve(e.target);
      }
    }, { threshold: 0.08 });
    document.querySelectorAll('.img-mask').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

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

      {/* Hero image + poster reel */}
      <div style={{ position: 'relative', height: '72vh', minHeight: '480px', overflow: 'hidden' }}>
        {gallery.map((src, i) => (
          <img key={i} src={src} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: i === activeImg ? 1 : 0, transition: 'opacity 0.7s ease',
          }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.65) 100%)' }} />

        {/* Poster reel — right side */}
        <div style={{
          position: 'absolute', top: '50%', right: '48px',
          transform: 'translateY(-50%)',
          opacity: 0.72,
          animation: 'fadeSlideUp 0.9s ease-out 0.5s both',
          display: 'flex', gap: '10px',
        }}>
          <PosterReel images={gallery} containerHeight={420} width={110} />
          {gallery.length > 3 && (
            <PosterReel images={[...gallery].reverse()} containerHeight={420} width={110} />
          )}
        </div>

        <div style={{ position: 'absolute', bottom: '48px', left: '60px' }}>
          <p className="eyebrow" style={{ marginBottom: '12px', animation: 'fadeSlideUp 0.7s ease-out 0.1s both', letterSpacing: '5px' }}>
            {project.location}
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 7vw, 96px)', fontWeight: '200', color: '#fff', letterSpacing: '-2px', margin: 0, lineHeight: 0.95, animation: 'fadeSlideUp 0.8s ease-out 0.2s both' }}>
            {lang === 'ar' ? project.name_ar : project.name_fr}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="detail-content" style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 60px 120px' }}>
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr minmax(300px, 360px)', gap: '80px', alignItems: 'start' }}>

          {/* Left: description + gallery grid */}
          <div>
            <RevealBlock delay={0}>
              <Link href="/projets" data-cursor style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none', marginBottom: '40px',
                letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'color 0.2s',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}
              >
                ← {lang === 'ar' ? 'جميع المشاريع' : 'Tous les projets'}
              </Link>
            </RevealBlock>

            <div className="lines-observe" style={{ marginBottom: '28px' }}>
              <div style={{ overflow: 'hidden' }}>
                <h2 className="line-inner" style={{ fontSize: '30px', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
                  {lang === 'ar' ? 'عن المشروع' : 'À Propos du Projet'}
                </h2>
              </div>
            </div>

            <RevealBlock delay={0.1}>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: '1.95', fontWeight: '300', marginBottom: '64px' }}>
                {lang === 'ar' ? project.description_ar : project.description_fr}
              </p>
            </RevealBlock>

            {/* Gallery grid */}
            {gallery.length > 1 && (
              <RevealBlock delay={0.2}>
                <h3 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
                  {lang === 'ar' ? 'معرض الصور' : 'Galerie'}{' '}
                  <span style={{ color: 'var(--text-4)', fontWeight: '400', letterSpacing: '0', textTransform: 'none' }}>({gallery.length})</span>
                </h3>
                <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                  {gallery.map((src, idx) => (
                    <GalleryCard
                      key={idx}
                      src={src}
                      active={idx === activeImg}
                      onClick={() => { setActiveImg(idx); setLightboxOpen(true); }}
                    />
                  ))}
                </div>
              </RevealBlock>
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

        {/* ── MAP SECTION ── */}
        {mapEmbed && (
          <div style={{ marginTop: '80px', borderTop: '1px solid var(--border)', paddingTop: '64px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
              {lang === 'ar' ? 'الموقع الجغرافي' : 'Localisation'}
            </p>
            <h3 style={{ fontSize: '22px', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.3px', marginBottom: '28px' }}>
              {lang === 'ar' ? project.name_ar : project.name_fr} — {project.location}
            </h3>
            <div className="map-frame" style={{ position: 'relative', width: '100%', height: '440px', borderRadius: '8px', overflow: 'hidden', background: 'var(--border)' }}>
              <iframe
                src={mapEmbed}
                title={`Localisation — ${project.name_fr}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        )}

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
