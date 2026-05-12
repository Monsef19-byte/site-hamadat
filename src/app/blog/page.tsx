'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';

const ARTICLES = [
  {
    id: '1', slug: 'tendances-marche-2024',
    title: "Tendances 2024 dans l'Immobilier Résidentiel",
    titleAr: 'اتجاهات 2024 في العقارات السكنية',
    excerpt: "Découvrez les tendances qui façonnent le marché immobilier algérien en 2024 et comment Hamadat s'y positionne.",
    excerptAr: 'اكتشف الاتجاهات التي تشكل السوق العقاري الجزائري وكيف تتموضع حمادة فيه.',
    category: 'Marché', categoryAr: 'السوق', date: '2024-05-01',
    image: '/images/blog-1.jpg',
  },
  {
    id: '2', slug: 'guide-investissement-immobilier',
    title: 'Guide: Investir dans le Résidentiel de Prestige',
    titleAr: 'دليل: الاستثمار في العقارات السكنية الفاخرة',
    excerpt: "Tout ce que vous devez savoir avant d'investir dans une résidence de prestige en Algérie.",
    excerptAr: 'كل ما تحتاج لمعرفته قبل الاستثمار في مسكن فاخر بالجزائر.',
    category: 'Guide', categoryAr: 'دليل', date: '2024-04-15',
    image: '/images/blog-2.jpg',
  },
  {
    id: '3', slug: 'amenites-residences-prestige',
    title: 'Les Aménités Modernes dans les Résidences de Prestige',
    titleAr: 'المرافق الحديثة في المجمعات السكنية الفاخرة',
    excerpt: 'Explorez les équipements haut de gamme qui définissent nos résidences.',
    excerptAr: 'استكشف المرافق الممتازة التي تحدد منتجاتنا السكنية.',
    category: 'Aménités', categoryAr: 'المرافق', date: '2024-03-10',
    image: '/images/blog-3.jpg',
  },
];

export default function BlogPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    let raf = 0;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.batch('.blog-reveal', {
        onEnter: (els) => {
          gsap.fromTo(els,
            { y: 60, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.1 }
          );
        },
        start: 'top 88%',
        once: true,
      });
    };
    raf = requestAnimationFrame(() => init());
    return () => { cancelAnimationFrame(raf); import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.getAll().forEach(t => t.kill())); };
  }, []);

  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        paddingTop: '160px', paddingBottom: '80px',
        paddingLeft: '60px', paddingRight: '60px',
        maxWidth: '1320px', margin: '0 auto', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)',
          fontSize: 'clamp(100px, 18vw, 240px)', fontWeight: '700',
          color: 'var(--border)', opacity: 0.3, letterSpacing: '-0.04em',
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          BLOG
        </div>
        <p className="eyebrow" style={{ marginBottom: '20px', animation: 'fadeUp 0.7s ease-out both' }}>
          {lang === 'ar' ? 'المدونة' : 'Actualités'}
        </p>
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '200',
          color: 'var(--text-1)', letterSpacing: '-1.5px', margin: 0,
          animation: 'fadeUp 0.7s ease-out 0.05s both',
        }}>
          {lang === 'ar' ? 'مدونتنا' : <>Notre <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Blog</em></>}
        </h1>
      </section>

      {/* Magazine Grid */}
      <section style={{ background: 'var(--bg-card)', padding: '80px 60px 120px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: '1320px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: ARTICLES.length > 0 ? '1fr 1fr' : '1fr',
          gap: '32px',
        }} className="blog-grid">
          {/* Featured (first article — large) */}
          {ARTICLES[0] && (
            <div className="blog-reveal" style={{ gridRow: 'span 2' }}>
              <Link href={`/blog/${ARTICLES[0].slug}`} data-cursor style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div className="blog-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', flex: 1, minHeight: '360px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                    <img src={ARTICLES[0].image} alt="" className="blog-card__img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 14px',
                        background: 'rgba(14,116,112,0.2)', backdropFilter: 'blur(8px)',
                        color: '#2dd4bf', fontSize: '9px', fontWeight: '700',
                        letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '4px',
                        marginBottom: '12px',
                      }}>
                        {lang === 'ar' ? ARTICLES[0].categoryAr : ARTICLES[0].category}
                      </span>
                      <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: '300', color: '#fff', margin: 0, lineHeight: 1.3, letterSpacing: '-0.3px' }}>
                        {lang === 'ar' ? ARTICLES[0].titleAr : ARTICLES[0].title}
                      </h2>
                    </div>
                  </div>
                  <div style={{ padding: '24px', borderRadius: '0 0 16px 16px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8, margin: '0 0 16px', fontWeight: '300' }}>
                      {lang === 'ar' ? ARTICLES[0].excerptAr : ARTICLES[0].excerpt}
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--text-4)' }}>
                      {new Date(ARTICLES[0].date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Smaller articles */}
          {ARTICLES.slice(1).map((article) => (
            <div key={article.id} className="blog-reveal">
              <Link href={`/blog/${article.slug}`} data-cursor style={{ textDecoration: 'none', display: 'block' }}>
                <div className="blog-card">
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                    <img src={article.image} alt="" className="blog-card__img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 12px',
                        background: 'rgba(14,116,112,0.15)', backdropFilter: 'blur(8px)',
                        color: 'var(--teal)', fontSize: '9px', fontWeight: '700',
                        letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '4px',
                      }}>
                        {lang === 'ar' ? article.categoryAr : article.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '400', color: 'var(--text-1)', margin: '0 0 12px', lineHeight: 1.4, letterSpacing: '-0.2px' }}>
                      {lang === 'ar' ? article.titleAr : article.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7, margin: '0 0 16px', fontWeight: '300' }}>
                      {lang === 'ar' ? article.excerptAr : article.excerpt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-4)' }}>
                        {new Date(article.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: '600' }}>
                        {lang === 'ar' ? 'اقرأ المزيد' : 'Lire →'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 768px) { .blog-grid { grid-template-columns: 1fr !important; } .blog-grid > div:first-child { grid-row: span 1 !important; } }
      `}</style>
    </div>
  );
}
