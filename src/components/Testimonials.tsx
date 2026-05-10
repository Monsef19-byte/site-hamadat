'use client';

import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  content: string;
  contentAr: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ahmed Ben Khalifa',
    nameAr: 'أحمد بن خليفة',
    role: 'Propriétaire',
    roleAr: 'صاحب عقار',
    content: 'L\'expérience avec Hamadat a été extraordinaire. La qualité de construction est impeccable et le service client est exceptionnellement attentif. Je recommande vivement leurs résidences à quiconque cherche une propriété de prestige.',
    contentAr: 'كانت التجربة مع حمادات استثنائية. جودة البناء لا تشوبها شائبة والخدمة الموضوعة للعملاء ممتازة للغاية. أوصي بشدة بمنتجاتهم السكنية لمن يبحث عن عقار فاخر.',
    image: '/images/testimonial-1.jpg',
    rating: 5
  },
  {
    id: 2,
    name: 'Fatima Mahraoui',
    nameAr: 'فاطمة مهراوي',
    role: 'Investisseuse',
    roleAr: 'مستثمرة',
    content: 'Excellent rendement sur mon investissement. Les résidences Hamadat se trouvent dans des emplacements stratégiques avec une excellente réception du marché. Très satisfait de mon choix.',
    contentAr: 'عائد ممتاز على استثماري. تقع منتجات حمادات في مواقع استراتيجية مع استقبال ممتاز في السوق. راضٍ جداً عن اختياري.',
    image: '/images/testimonial-2.jpg',
    rating: 5
  },
  {
    id: 3,
    name: 'Mohamed Benali',
    nameAr: 'محمد بن علي',
    role: 'Résident',
    roleAr: 'ساكن',
    content: 'Les aménités sont de classe mondiale. Les espaces verts, les installations sportives et la sécurité 24/7 font de cette résidence un véritable oasis urbain. Vraiment impressionnant!',
    contentAr: 'المرافق من الدرجة الأولى عالمياً. المساحات الخضراء والمرافق الرياضية والأمان 24/7 تجعل هذا المسكن واحة حضرية حقيقية. مثير للإعجاب حقاً!',
    image: '/images/testimonial-3.jpg',
    rating: 5
  },
  {
    id: 4,
    name: 'Leila Hadj',
    nameAr: 'ليلى حاج',
    role: 'Agent Immobilier',
    roleAr: 'وسيط عقاري',
    content: 'J\'ai travaillé avec plusieurs promoteurs, mais Hamadat se distingue par son professionnalisme et son engagement envers la qualité. Leurs projets se vendent rapidement, ce qui parle de leur réputation.',
    contentAr: 'عملت مع عدة مطورين، لكن حمادات تتميز بمهنيتها والتزامها بالجودة. مشاريعهم تُباع بسرعة، وهذا يدل على سمعتهم الممتازة.',
    image: '/images/testimonial-4.jpg',
    rating: 5
  }
];

export default function Testimonials() {
  const { lang } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-primary-700 to-primary-600 dark:from-silver-300 dark:to-primary-400 bg-clip-text text-transparent">
            {lang === 'ar' ? 'ما يقول عملاؤنا' : 'Ce que disent nos clients'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'استمع إلى قصص عملائنا الراضين عن تجاربهم مع حمادات'
              : 'Écoutez les histoires de nos clients satisfaits et leur expérience avec Hamadat'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 dark:shadow-lg dark:shadow-primary-900/10"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-xl">⭐</span>
                ))}
              </div>

              {/* Content */}
              <p className={`text-gray-700 dark:text-gray-300 mb-6 leading-relaxed ${lang === 'ar' ? 'text-right' : ''}`}>
                "{lang === 'ar' ? testimonial.contentAr : testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={lang === 'ar' ? testimonial.nameAr : testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={lang === 'ar' ? 'text-right' : ''}>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {lang === 'ar' ? testimonial.nameAr : testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? testimonial.roleAr : testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg font-medium">
            {lang === 'ar'
              ? 'هل أنت مهتم بالاستثمار معنا؟ تواصل مع فريقنا اليوم'
              : 'Intéressé par l\'investissement avec nous? Contactez notre équipe aujourd\'hui'}
          </p>
          <button className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl dark:shadow-lg dark:shadow-primary-600/30">
            {lang === 'ar' ? 'احصل على استشارة مجانية' : 'Obtenir une consultation gratuite'}
          </button>
        </div>
      </div>
    </section>
  );
}
