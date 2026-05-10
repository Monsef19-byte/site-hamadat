'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import Image from 'next/image';

// Mock blog articles data
const articles = [
  {
    id: 1,
    title: 'Les Tendances du Marché Immobilier 2024',
    titleAr: 'اتجاهات سوق العقارات لعام 2024',
    slug: 'tendances-marche-2024',
    excerpt: 'Découvrez les principales tendances qui façonnent le marché immobilier algérien.',
    excerptAr: 'اكتشف الاتجاهات الرئيسية التي تشكل سوق العقارات الجزائري.',
    content: `Le marché immobilier en Algérie connaît une transformation remarquable. Les résidences de prestige deviennent de plus en plus populaires auprès des investisseurs avisés.

Les tendances principales incluent :

1. La croissance de la demande pour les espaces modernes et bien équipés
2. L'augmentation des investissements dans les zones urbaines développées
3. La préférence croissante pour les aménagements de luxe et les commodités modernes
4. L'importance accrue de la durabilité et de l'efficacité énergétique

Les développeurs immobiliers comme Hamadat se concentrent sur la création de propriétés qui répondent à ces nouvelles attentes. Nos résidences combinent le design moderne avec les commodités de luxe, offrant un investissement solide pour l'avenir.

L'année 2024 marque un tournant important pour le secteur, avec une augmentation notable des projets de haut standing dans les principales villes du pays.`,
    contentAr: `يشهد سوق العقارات في الجزائر تحولاً ملحوظاً. الأحياء السكنية الفاخرة تصبح أكثر شعبية بين المستثمرين الأذكياء.

تشمل الاتجاهات الرئيسية:

1. نمو الطلب على المساحات الحديثة والمجهزة بشكل جيد
2. زيادة الاستثمارات في المناطق الحضرية المتقدمة
3. الأفضلية المتزايدة للمرافق الفاخرة والوسائل الحديثة
4. أهمية الاستدامة والكفاءة الطاقية المتزايدة

يركز مطورو العقارات مثل حمادات على إنشاء عقارات تلبي هذه التوقعات الجديدة. تجمع منتجاتنا بين التصميم الحديث والمرافق الفاخرة، مما يوفر استثماراً قوياً للمستقبل.

يشير عام 2024 إلى نقطة تحول مهمة للقطاع، مع زيادة ملحوظة في مشاريع الشقق الراقية في المدن الرئيسية للبلاد.`,
    image: '/images/blog-1.jpg',
    category: 'Marché',
    categoryAr: 'السوق',
    author: 'Hamadat Team',
    authorAr: 'فريق حمادات',
    published_at: '2024-01-15',
    updated_at: '2024-01-15',
    featured: true,
    tags: ['marché', 'tendances', 'investissement'],
    tagsAr: ['السوق', 'الاتجاهات', 'الاستثمار']
  },
  {
    id: 2,
    title: 'Guide Complet: Investir dans l\'Immobilier de Prestige',
    titleAr: 'دليل شامل: الاستثمار في العقارات الفاخرة',
    slug: 'guide-investissement-immobilier',
    excerpt: 'Tout ce que vous devez savoir avant d\'investir dans une résidence de prestige.',
    excerptAr: 'كل ما تحتاج معرفته قبل الاستثمار في مسكن فاخر.',
    content: `L'investissement immobilier est l'une des décisions financières les plus importantes que vous puissiez prendre. Ce guide complet vous aidera à naviguer dans le processus.

Étapes clés pour un investissement réussi:

1. Définir votre budget et vos objectifs d'investissement
2. Rechercher les tendances du marché et les zones prometteuses
3. Évaluer les propriétés en fonction de leur potentiel de rentabilité
4. Vérifier les documents légaux et administratifs
5. Consulter des experts en immobilier

Les résidences Hamadat offrent des opportunités d'investissement exceptionnelles avec un excellent potentiel de rendement. Nos propriétés sont situées dans des zones stratégiques et construites selon les normes les plus élevées.

Les avantages d'investir avec nous incluent l'excellente localisation, la qualité de construction, les aménagements modernes, et le support client de première classe.`,
    contentAr: `الاستثمار العقاري هو أحد أهم القرارات المالية التي يمكنك اتخاذها. سيساعدك هذا الدليل الشامل على التنقل في العملية.

الخطوات الرئيسية لاستثمار ناجح:

1. تحديد ميزانيتك وأهداف الاستثمار
2. البحث عن اتجاهات السوق والمناطق الواعدة
3. تقييم العقارات بناءً على إمكانات الربحية
4. التحقق من المستندات القانونية والإدارية
5. استشارة الخبراء في العقارات

تقدم منتجات حمادات فرصاً استثمارية استثنائية بإمكانية عائد ممتازة. تقع عقاراتنا في مناطق استراتيجية وتم بناؤها وفقاً لأعلى المعايير.

تشمل مزايا الاستثمار معنا الموقع الممتاز وجودة البناء والمرافق الحديثة والدعم العملاء من الدرجة الأولى.`,
    image: '/images/blog-2.jpg',
    category: 'Guide',
    categoryAr: 'دليل',
    author: 'Expert Immobilier',
    authorAr: 'خبير العقارات',
    published_at: '2024-02-20',
    updated_at: '2024-02-20',
    featured: false,
    tags: ['guide', 'investissement', 'conseils'],
    tagsAr: ['دليل', 'استثمار', 'نصائح']
  },
  {
    id: 3,
    title: 'Les Aménités Modernes dans les Résidences de Prestige',
    titleAr: 'المرافق الحديثة في المجمعات السكنية الفاخرة',
    slug: 'amenites-residences-prestige',
    excerpt: 'Explorez les équipements haut de gamme qui définissent nos résidences.',
    excerptAr: 'استكشف المرافق الممتازة التي تحدد منتجاتنا السكنية.',
    content: `Les résidences de prestige d'aujourd'hui ne sont pas seulement des espaces à vivre, ce sont des écosystèmes de bien-être et de luxe.

Nos résidences incluent:

- Salles de sport équipées de la dernière technologie
- Piscines olympiques avec zones de détente
- Espaces verts aménagés avec paysagisme professionnel
- Sécurité 24/7 avec surveillance vidéo
- Salons communautaires et espaces de divertissement
- Parking sécurisé et réseau de charge pour véhicules électriques
- Concierge personnel et services de conciergerie
- Connexion Internet haute vitesse et domotique

Chaque détail est pensé pour offrir un confort maximal et un mode de vie exceptionnel. Nous investissons dans les équipements les plus avancés pour assurer que nos résidents jouissent d'une qualité de vie inégalée.

La résidence de prestige n'est plus un luxe, c'est une nécessité pour ceux qui apprécient le bien-être et le style de vie moderne.`,
    contentAr: `المجمعات السكنية الفاخرة اليوم ليست فقط مساحات للعيش، بل هي نظم بيئية للعافية والفخامة.

تشمل منتجاتنا السكنية:

- صالات رياضية مجهزة بأحدث التكنولوجيا
- حمامات سباحة أولمبية مع مناطق الاسترخاء
- مساحات خضراء مع تنسيق حدائق احترافي
- أمان 24/7 مع المراقبة بالفيديو
- صالات مجتمعية ومساحات الترفيه
- مواقف سيارات آمنة وشبكات شحن المركبات الكهربائية
- خدمة الكونسيرج الشخصية وخدمات الفندق
- الإنترنت عالي السرعة والمنزل الذكي

يتم التفكير في كل التفاصيل لتوفير أقصى درجات الراحة وأسلوب حياة استثنائي. نستثمر في أحدث المعدات لضمان استمتاع السكان بنوعية حياة لا مثيل لها.

المسكن الفاخر لم يعد ترفاً، بل ضرورة لمن يقدرون العافية وأسلوب الحياة الحديث.`,
    image: '/images/blog-3.jpg',
    category: 'Aménités',
    categoryAr: 'المرافق',
    author: 'Hamadat Team',
    authorAr: 'فريق حمادات',
    published_at: '2024-03-10',
    updated_at: '2024-03-10',
    featured: false,
    tags: ['aménités', 'luxe', 'équipements'],
    tagsAr: ['مرافق', 'فخامة', 'معدات']
  }
];

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { lang } = useLanguage();
  const article = articles.find(a => a.slug === params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8"
          >
            <span>←</span>
            {lang === 'ar' ? 'العودة إلى المدونة' : 'Retour au blog'}
          </Link>
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === 'ar' ? 'المقالة غير موجودة' : 'Article non trouvé'}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const displayTitle = lang === 'ar' ? article.titleAr : article.title;
  const displayContent = lang === 'ar' ? article.contentAr : article.content;
  const displayAuthor = lang === 'ar' ? article.authorAr : article.author;
  const displayCategory = lang === 'ar' ? article.categoryAr : article.category;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors"
        >
          <span>←</span>
          {lang === 'ar' ? 'العودة إلى المدونة' : 'Retour au blog'}
        </Link>

        {/* Article Header */}
        <article className="mb-12">
          {/* Featured Image */}
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.image}
              alt={displayTitle}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Title and Meta */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                {displayCategory}
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <time dateTime={article.published_at}>
                    {new Date(article.published_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <span>{displayAuthor}</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {displayTitle}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300">
              {lang === 'ar' ? article.excerptAr : article.excerpt}
            </p>
          </div>

          {/* Article Content */}
          <div className={`prose prose-lg dark:prose-invert max-w-none mb-8 ${lang === 'ar' ? 'text-right' : ''}`}>
            {displayContent.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className={`text-gray-700 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap ${lang === 'ar' ? 'text-right' : ''}`}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            {lang === 'ar' ? article.tagsAr.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            )) : article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Related Articles Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-8 ${lang === 'ar' ? 'text-right' : ''}`}>
            {lang === 'ar' ? 'مقالات ذات صلة' : 'Articles Connexes'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles
              .filter(a => a.id !== article.id)
              .slice(0, 2)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/blog/${relatedArticle.slug}`}
                  className="group glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={relatedArticle.image}
                      alt={lang === 'ar' ? relatedArticle.titleAr : relatedArticle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs font-medium mb-2">
                      {lang === 'ar' ? relatedArticle.categoryAr : relatedArticle.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {lang === 'ar' ? relatedArticle.titleAr : relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {lang === 'ar' ? relatedArticle.excerptAr : relatedArticle.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
