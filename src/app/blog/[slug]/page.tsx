'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';

const ARTICLES = [
  {
    id: 1,
    slug: 'tendances-marche-2024',
    title: "Tendances 2024 dans l'Immobilier Résidentiel",
    titleAr: 'اتجاهات 2024 في العقارات السكنية',
    excerpt: "Découvrez les tendances qui façonnent le marché immobilier algérien en 2024 et comment Hamadat s'y positionne.",
    excerptAr: 'اكتشف الاتجاهات التي تشكل السوق العقاري الجزائري وكيف تتموضع حمادة فيه.',
    content: `Le marché immobilier en Algérie connaît une transformation remarquable. Les résidences de prestige deviennent de plus en plus populaires auprès des investisseurs avisés.

Les tendances principales incluent :

La croissance de la demande pour les espaces modernes et bien équipés, l'augmentation des investissements dans les zones urbaines développées, et la préférence croissante pour les aménagements de luxe combinés aux commodités modernes.

Les développeurs immobiliers comme Hamadat se concentrent sur la création de propriétés qui répondent à ces nouvelles attentes. Nos résidences combinent le design moderne avec les commodités de luxe, offrant un investissement solide pour l'avenir.

L'année 2024 marque un tournant important pour le secteur, avec une augmentation notable des projets de haut standing dans les principales villes du pays.`,
    contentAr: `يشهد سوق العقارات في الجزائر تحولاً ملحوظاً. الأحياء السكنية الفاخرة تصبح أكثر شعبية بين المستثمرين الأذكياء.

تشمل الاتجاهات الرئيسية نمو الطلب على المساحات الحديثة والمجهزة بشكل جيد، وزيادة الاستثمارات في المناطق الحضرية المتقدمة، والأفضلية المتزايدة للمرافق الفاخرة والوسائل الحديثة.

يركز مطورو العقارات مثل حمادات على إنشاء عقارات تلبي هذه التوقعات الجديدة. تجمع منتجاتنا بين التصميم الحديث والمرافق الفاخرة، مما يوفر استثماراً قوياً للمستقبل.`,
    category: 'Marché', categoryAr: 'السوق',
    author: 'Hamadat Team', authorAr: 'فريق حمادات',
    date: '2024-05-01',
    tags: ['marché', 'tendances', 'investissement'],
    tagsAr: ['السوق', 'الاتجاهات', 'الاستثمار'],
  },
  {
    id: 2,
    slug: 'guide-investissement-immobilier',
    title: "Guide Complet : Investir dans l'Immobilier de Prestige",
    titleAr: 'دليل شامل: الاستثمار في العقارات الفاخرة',
    excerpt: "Tout ce que vous devez savoir avant d'investir dans une résidence de prestige.",
    excerptAr: 'كل ما تحتاج معرفته قبل الاستثمار في مسكن فاخر.',
    content: `L'investissement immobilier est l'une des décisions financières les plus importantes que vous puissiez prendre. Ce guide complet vous aidera à naviguer dans le processus.

Étapes clés pour un investissement réussi : définir votre budget et vos objectifs, rechercher les tendances du marché et les zones prometteuses, évaluer les propriétés en fonction de leur potentiel de rentabilité, vérifier les documents légaux et administratifs, et consulter des experts en immobilier.

Les résidences Hamadat offrent des opportunités d'investissement exceptionnelles avec un excellent potentiel de rendement. Nos propriétés sont situées dans des zones stratégiques et construites selon les normes les plus élevées.

Les avantages d'investir avec nous incluent l'excellente localisation, la qualité de construction, les aménagements modernes, et le support client de première classe.`,
    contentAr: `الاستثمار العقاري هو أحد أهم القرارات المالية التي يمكنك اتخاذها. سيساعدك هذا الدليل الشامل على التنقل في العملية.

الخطوات الرئيسية لاستثمار ناجح: تحديد ميزانيتك وأهداف الاستثمار، البحث عن اتجاهات السوق والمناطق الواعدة، تقييم العقارات بناءً على إمكانات الربحية، والتحقق من المستندات القانونية والإدارية.

تقدم منتجات حمادات فرصاً استثمارية استثنائية بإمكانية عائد ممتازة. تقع عقاراتنا في مناطق استراتيجية وتم بناؤها وفقاً لأعلى المعايير.`,
    category: 'Guide', categoryAr: 'دليل',
    author: 'Expert Immobilier', authorAr: 'خبير العقارات',
    date: '2024-04-15',
    tags: ['guide', 'investissement', 'conseils'],
    tagsAr: ['دليل', 'استثمار', 'نصائح'],
  },
  {
    id: 3,
    slug: 'amenites-residences-prestige',
    title: 'Les Aménités Modernes dans les Résidences de Prestige',
    titleAr: 'المرافق الحديثة في المجمعات السكنية الفاخرة',
    excerpt: 'Explorez les équipements haut de gamme qui définissent nos résidences.',
    excerptAr: 'استكشف المرافق الممتازة التي تحدد منتجاتنا السكنية.',
    content: `Les résidences de prestige d'aujourd'hui ne sont pas seulement des espaces à vivre, ce sont des écosystèmes de bien-être et de luxe.

Nos résidences incluent des salles de sport équipées de la dernière technologie, des espaces verts aménagés avec paysagisme professionnel, une sécurité 24/7 avec surveillance vidéo, des salons communautaires et espaces de divertissement, ainsi qu'une connexion Internet haute vitesse et domotique.

Chaque détail est pensé pour offrir un confort maximal et un mode de vie exceptionnel. Nous investissons dans les équipements les plus avancés pour assurer que nos résidents jouissent d'une qualité de vie inégalée.

La résidence de prestige n'est plus un luxe, c'est une nécessité pour ceux qui apprécient le bien-être et le style de vie moderne.`,
    contentAr: `المجمعات السكنية الفاخرة اليوم ليست فقط مساحات للعيش، بل هي نظم بيئية للعافية والفخامة.

تشمل منتجاتنا السكنية صالات رياضية مجهزة بأحدث التكنولوجيا، ومساحات خضراء مع تنسيق حدائق احترافي، وأمان 24/7 مع المراقبة بالفيديو، وصالات مجتمعية ومساحات الترفيه، والإنترنت عالي السرعة والمنزل الذكي.

يتم التفكير في كل التفاصيل لتوفير أقصى درجات الراحة وأسلوب حياة استثنائي.`,
    category: 'Aménités', categoryAr: 'المرافق',
    author: 'Hamadat Team', authorAr: 'فريق حمادات',
    date: '2024-03-10',
    tags: ['aménités', 'luxe', 'équipements'],
    tagsAr: ['مرافق', 'فخامة', 'معدات'],
  },
];

export default function BlogDetailPage() {
  const { lang } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const article = ARTICLES.find(a => a.slug === slug);
  const others = ARTICLES.filter(a => a.slug !== slug).slice(0, 2);

  if (!article) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '180px 60px 120px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: 'var(--text-1)', marginBottom: '24px' }}>
            {lang === 'ar' ? 'المقالة غير موجودة' : 'Article non trouvé'}
          </h1>
          <Link href="/blog" style={{ color: 'var(--teal)', textDecoration: 'none', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>
            ← {lang === 'ar' ? 'العودة إلى المدونة' : 'Retour au blog'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--text-1)' }}>
      <Navbar />

      {/* Hero header */}
      <section style={{ paddingTop: '140px', paddingBottom: '60px', paddingLeft: '60px', paddingRight: '60px', maxWidth: '1000px', margin: '0 auto' }} className="blog-header">
        <Link href="/blog" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: 'var(--teal)', textDecoration: 'none',
          fontSize: '10px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase',
          marginBottom: '48px', transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          ← {lang === 'ar' ? 'العودة إلى المدونة' : 'Retour au blog'}
        </Link>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', alignItems: 'center' }}>
          <span style={{
            padding: '4px 14px', background: 'rgba(14,116,112,0.12)',
            color: 'var(--teal)', fontSize: '10px', fontWeight: '700',
            letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '2px',
            border: '1px solid rgba(14,116,112,0.25)',
          }}>
            {lang === 'ar' ? article.categoryAr : article.category}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            {new Date(article.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-1.5px', margin: '0 0 24px', lineHeight: '1.1' }}>
          {lang === 'ar' ? article.titleAr : article.title}
        </h1>
        <p style={{ fontSize: 'clamp(15px, 1.6vw, 20px)', color: 'var(--text-2)', fontWeight: '300', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
          {lang === 'ar' ? article.excerptAr : article.excerpt}
        </p>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(14,116,112,0.5) 0%, rgba(14,116,112,0.1) 50%, transparent 100%)', maxWidth: '1000px', margin: '0 auto 64px', padding: '0 60px' }} className="blog-divider" />

      {/* Article body */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', paddingLeft: '60px', paddingRight: '60px', paddingBottom: '120px' }} className="blog-body">
        <div style={{ maxWidth: '680px' }}>
          {(lang === 'ar' ? article.contentAr : article.content).split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontSize: '16px', color: 'var(--text-2)', lineHeight: '1.9',
              fontWeight: '300', marginBottom: '32px',
              direction: lang === 'ar' ? 'rtl' : 'ltr',
            }}>
              {para}
            </p>
          ))}

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '48px', borderTop: '1px solid var(--border)' }}>
            {(lang === 'ar' ? article.tagsAr : article.tags).map(tag => (
              <span key={tag} style={{
                padding: '5px 14px',
                background: 'rgba(14,116,112,0.06)',
                border: '1px solid rgba(14,116,112,0.18)',
                color: 'var(--teal)',
                fontSize: '10px', fontWeight: '600',
                letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '2px',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Author */}
          <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0e7470, #0a5450)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#fff', fontWeight: '600', flexShrink: 0 }}>
              H
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-1)' }}>
                {lang === 'ar' ? article.authorAr : article.author}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                Hamadat Promotion Immobilière
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {others.length > 0 && (
        <section style={{ background: 'var(--bg-card)', padding: '80px 60px 100px', borderTop: '1px solid var(--border)' }} className="blog-related">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>
              {lang === 'ar' ? 'مقالات ذات صلة' : 'Articles Connexes'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
              {others.map(rel => (
                <Link key={rel.id} href={`/blog/${rel.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '32px', border: '1px solid var(--border)', borderRadius: '8px',
                    background: 'var(--bg-page)',
                    transition: 'border-color 0.3s, transform 0.3s',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(14,116,112,0.4)'; el.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'none'; }}
                  >
                    <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      {lang === 'ar' ? rel.categoryAr : rel.category}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: '300', color: 'var(--text-1)', margin: '12px 0 10px', lineHeight: '1.35', letterSpacing: '-0.3px' }}>
                      {lang === 'ar' ? rel.titleAr : rel.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0, lineHeight: '1.7', fontWeight: '300' }}>
                      {lang === 'ar' ? rel.excerptAr : rel.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        @media (max-width: 600px) {
          .blog-header, .blog-body, .blog-related { padding-left: 24px !important; padding-right: 24px !important; }
          .blog-header { padding-top: 100px !important; }
          .blog-divider { padding: 0 24px !important; }
        }
      `}</style>
    </div>
  );
}
