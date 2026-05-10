'use client';

import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';

export default function GetToKnowUs() {
  const { lang } = useLanguage();

  const values = [
    {
      emoji: '🎯',
      title: lang === 'ar' ? 'التركيز على الجودة' : 'Focus sur la Qualité',
      description: lang === 'ar'
        ? 'نحن نلتزم بأعلى معايير البناء والتصميم في كل مشروع'
        : 'Nous nous engageons aux normes les plus élevées de construction et de conception'
    },
    {
      emoji: '❤️',
      title: lang === 'ar' ? 'رعاية العملاء' : 'Soin du Client',
      description: lang === 'ar'
        ? 'خدمة العملاء الاستثنائية هي أساس أعمالنا'
        : 'Un service client exceptionnel est le fondement de notre activité'
    },
    {
      emoji: '⚡',
      title: lang === 'ar' ? 'الابتكار' : 'Innovation',
      description: lang === 'ar'
        ? 'نحن نستمر في الابتكار والتحسين لتلبية احتياجات السوق المتغيرة'
        : 'Nous continuons à innover et à améliorer pour répondre aux besoins changeants du marché'
    },
    {
      emoji: '♻️',
      title: lang === 'ar' ? 'الاستدامة' : 'Durabilité',
      description: lang === 'ar'
        ? 'نحن نبني مع مراعاة البيئة والأجيال القادمة'
        : 'Nous construisons en pensant à l\'environnement et aux générations futures'
    }
  ];

  const team = [
    {
      name: 'Dr. Karim Hamadat',
      nameAr: 'د. كريم حمادات',
      role: 'Fondateur & PDG',
      roleAr: 'المؤسس والرئيس التنفيذي',
      bio: 'Visionnaire avec 25 ans d\'expérience dans l\'immobilier',
      bioAr: 'قائد رؤية مع 25 سنة من الخبرة في العقارات',
      image: '/images/team-1.jpg'
    },
    {
      name: 'Aïssatou Benbrahim',
      nameAr: 'عائشة بن براهيم',
      role: 'Directrice Générale',
      roleAr: 'المديرة العامة',
      bio: 'Spécialiste en gestion de projet et stratégie commerciale',
      bioAr: 'متخصصة في إدارة المشاريع والاستراتيجية التجارية',
      image: '/images/team-2.jpg'
    },
    {
      name: 'Farah Hammadi',
      nameAr: 'فرح حمادي',
      role: 'Directrice Architecte',
      roleAr: 'مديرة العمارة',
      bio: 'Architecte primée, lauréate de plusieurs prix de design',
      bioAr: 'معماري حاصل على جوائز عديدة في التصميم',
      image: '/images/team-3.jpg'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className={`text-center mb-20 ${lang === 'ar' ? '' : ''}`}>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white mb-6 tracking-tight">
            {lang === 'ar' ? 'تعرف علينا' : 'Qui sommes-nous'}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light">
            {lang === 'ar'
              ? 'حمادات للتطوير العقاري هي شركة رائدة في قطاع الإسكان الفاخر بالجزائر، متخصصة في بناء مجمعات سكنية عالية الجودة تجمع بين التصميم الحديث والتكنولوجيا المتقدمة.'
              : 'Hamadat Promotion Immobilière est une entreprise leader dans le secteur du logement de prestige en Algérie, spécialisée dans la construction de complexes résidentiels de haute qualité qui allient design moderne et technologie avancée.'}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Mission */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300">
            <div className="text-5xl mb-5">🎯</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">
              {lang === 'ar' ? 'مهمتنا' : 'Notre Mission'}
            </h3>
            <p className={`text-gray-700 dark:text-gray-300 leading-relaxed font-light ${lang === 'ar' ? 'text-right' : ''}`}>
              {lang === 'ar'
                ? 'توفير منازل فاخرة وآمنة تعكس الذوق والطموح. نسعى إلى تحويل أحلام عملائنا إلى واقع من خلال مشاريع معمارية متميزة وخدمات عملاء استثنائية. كل مشروع نقوم به هو استثمار في جودة الحياة والمستقبل المستدام.'
                : 'Fournir des maisons de prestige sûres et de qualité qui reflètent le goût et les ambitions. Nous cherchons à transformer les rêves de nos clients en réalité à travers des projets architecturaux distinctifs et un service client exceptionnel. Chaque projet que nous entreprendrons est un investissement dans la qualité de vie et un avenir durable.'}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300">
            <div className="text-5xl mb-5">💫</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">
              {lang === 'ar' ? 'رؤيتنا' : 'Notre Vision'}
            </h3>
            <p className={`text-gray-700 dark:text-gray-300 leading-relaxed font-light ${lang === 'ar' ? 'text-right' : ''}`}>
              {lang === 'ar'
                ? 'أن نصبح الخيار الأول للمستثمرين والعائلات الباحثة عن الفخامة والجودة والاستدامة. نطمح إلى إعادة تعريف معايير الإسكان الفاخر في الجزائر من خلال الابتكار المستمر والالتزام بالتميز في كل جوانب أعمالنا.'
                : 'Être le premier choix pour les investisseurs et les familles à la recherche du luxe, de la qualité et de la durabilité. Nous aspirons à redéfinir les normes du logement de prestige en Algérie par l\'innovation continue et l\'engagement envers l\'excellence dans tous les aspects de nos activités.'}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <h3 className={`text-4xl font-semibold text-gray-900 dark:text-white mb-14 ${lang === 'ar' ? 'text-right' : ''} tracking-tight`}>
            {lang === 'ar' ? 'قيمنا الأساسية' : 'Nos Valeurs Fondamentales'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-7 text-center border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300">
                <div className="flex justify-center mb-4 text-6xl">
                  {value.emoji}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h4>
                <p className={`text-sm text-gray-700 dark:text-gray-300 font-light leading-relaxed ${lang === 'ar' ? 'text-right' : ''}`}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24 py-16 border-t border-b border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              15+
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {lang === 'ar' ? 'سنة من الخبرة' : 'Ans d\'expérience'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              50+
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {lang === 'ar' ? 'مشروع مكتمل' : 'Projets Complétés'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              5000+
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {lang === 'ar' ? 'عميل سعيد' : 'Clients Satisfaits'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              100%
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {lang === 'ar' ? 'رضا العملاء' : 'Satisfaction Client'}
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h3 className={`text-4xl font-semibold text-gray-900 dark:text-white mb-14 ${lang === 'ar' ? 'text-right' : ''} tracking-tight`}>
            {lang === 'ar' ? 'فريقنا القيادي' : 'Notre Équipe Dirigeante'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300">
                <div className="relative h-72 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={member.image}
                    alt={lang === 'ar' ? member.nameAr : member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-7">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {lang === 'ar' ? member.nameAr : member.name}
                  </h4>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                    {lang === 'ar' ? member.roleAr : member.role}
                  </p>
                  <p className={`text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-light ${lang === 'ar' ? 'text-right' : ''}`}>
                    {lang === 'ar' ? member.bioAr : member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
