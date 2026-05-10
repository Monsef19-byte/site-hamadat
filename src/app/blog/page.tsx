'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';

const ARTICLES = [
  {
    id: '1',
    title: "Tendances 2024 dans l'Immobilier Résidentiel",
    titleAr: 'اتجاهات 2024 في العقارات السكنية',
    excerpt: "Découvrez les tendances qui façonnent le marché immobilier algérien en 2024 et comment Hamadat s'y positionne.",
    excerptAr: 'اكتشف الاتجاهات التي تشكل السوق العقاري الجزائري وكيف تتموضع حمادة فيه.',
    category: 'Marché', categoryAr: 'السوق',
    date: '2024-05-01',
  },
  {
    id: '2',
    title: 'Guide: Investir dans le Résidentiel de Prestige',
    titleAr: 'دليل: الاستثمار في العقارات السكنية الفاخرة',
    excerpt: "Tout ce que vous devez savoir avant d'investir dans une résidence de prestige en Algérie.",
    excerptAr: 'كل ما تحتاج لمعرفته قبل الاستثمار في مسكن فاخر بالجزائر.',
    category: 'Guide', categoryAr: 'دليل',
    date: '2024-04-15',
  },
];

export default function BlogPage() {
  const { lang } = useLanguage();

  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero */}
      <section className="page-header" style={{ paddingTop: '160px', paddingBottom: '80px', paddingLeft: '60px', paddingRight: '60px', maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', animation: 'fadeUp 0.7s ease-out both' }}>
          {lang === 'ar' ? 'المدونة' : 'Actualités'}
        </p>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-1.5px', margin: 0, animation: 'fadeUp 0.7s ease-out 0.05s both' }}>
          {lang === 'ar' ? 'مدونتنا' : 'Notre Blog'}
        </h1>
      </section>

      {/* Articles */}
      <section className="page-content" style={{ background: 'var(--bg-card)', padding: '80px 60px 120px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {ARTICLES.map((article, idx) => (
            <article key={article.id} style={{
              borderBottom: '1px solid var(--border)',
              paddingBottom: '64px', marginBottom: '64px',
              animation: `fadeUp 0.7s ease-out ${0.1 + idx * 0.08}s both`,
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateX(10px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
            >
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block', padding: '3px 12px',
                  background: 'rgba(14,116,112,0.1)', color: 'var(--teal)',
                  fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '2px',
                }}>
                  {lang === 'ar' ? article.categoryAr : article.category}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-4)' }}>
                  {new Date(article.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: '300', color: 'var(--text-1)', margin: '0 0 16px', lineHeight: '1.3', letterSpacing: '-0.3px' }}>
                {lang === 'ar' ? article.titleAr : article.title}
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.8', margin: 0, fontWeight: '300' }}>
                {lang === 'ar' ? article.excerptAr : article.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 600px) {
          .page-header { padding-left: 24px !important; padding-right: 24px !important; padding-top: 100px !important; padding-bottom: 40px !important; }
          .page-content { padding-left: 24px !important; padding-right: 24px !important; padding-top: 48px !important; padding-bottom: 60px !important; }
        }
      `}</style>
    </div>
  );
}
