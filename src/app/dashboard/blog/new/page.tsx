'use client';

import { useLanguage } from '@/lib/language-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBlogArticlePage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    titleFr: '',
    titleAr: '',
    slugFr: '',
    excerptFr: '',
    excerptAr: '',
    contentFr: '',
    contentAr: '',
    category: 'Marché',
    categoryAr: 'السوق',
    author: 'Hamadat Team',
    authorAr: 'فريق حمادات',
    featured: false,
    status: 'draft',
    image: null as File | null,
    tags: '',
    tagsAr: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In Phase 5, this will send to Supabase
    console.log('Form Data:', formData);

    setIsSubmitting(false);
    router.push('/dashboard');
  };

  const categories = [
    { fr: 'Marché', ar: 'السوق' },
    { fr: 'Guide', ar: 'دليل' },
    { fr: 'Aménités', ar: 'المرافق' },
    { fr: 'Conseils', ar: 'نصائح' },
    { fr: 'Actualités', ar: 'أخبار' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors"
        >
          <span>←</span>
          {lang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Retour au Dashboard'}
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {lang === 'ar' ? 'مقالة جديدة' : 'Nouvel Article'}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8">
          {/* French Section */}
          <div className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {lang === 'ar' ? 'المحتوى الفرنسي' : 'Contenu Français'}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'ar' ? 'العنوان الفرنسي' : 'Titre en français'}
                </label>
                <input
                  type="text"
                  name="titleFr"
                  value={formData.titleFr}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder={lang === 'ar' ? 'أدخل العنوان' : 'Entrez le titre'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'ar' ? 'الرابط' : 'Slug'}
                </label>
                <input
                  type="text"
                  name="slugFr"
                  value={formData.slugFr}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="url-friendly-slug"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {lang === 'ar' ? 'الخلاصة (الفرنسية)' : 'Extrait en français'}
              </label>
              <textarea
                name="excerptFr"
                value={formData.excerptFr}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder={lang === 'ar' ? 'الخلاصة القصيرة' : 'Courte description'}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {lang === 'ar' ? 'المحتوى (الفرنسي)' : 'Contenu en français'}
              </label>
              <textarea
                name="contentFr"
                value={formData.contentFr}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder={lang === 'ar' ? 'محتوى المقالة الكامل' : 'Contenu complet de l\'article'}
              />
            </div>
          </div>

          {/* Arabic Section */}
          <div className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-right">
              {lang === 'ar' ? 'المحتوى العربي' : 'Contenu Arabe'}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  {lang === 'ar' ? 'العنوان العربي' : 'Titre en arabe'}
                </label>
                <input
                  type="text"
                  name="titleAr"
                  value={formData.titleAr}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-right"
                  placeholder={lang === 'ar' ? 'العنوان بالعربية' : 'Titre en arabe'}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                {lang === 'ar' ? 'الخلاصة (العربية)' : 'Extrait en arabe'}
              </label>
              <textarea
                name="excerptAr"
                value={formData.excerptAr}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-right"
                placeholder={lang === 'ar' ? 'خلاصة قصيرة بالعربية' : 'Description courte en arabe'}
                dir="rtl"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                {lang === 'ar' ? 'المحتوى (العربي)' : 'Contenu en arabe'}
              </label>
              <textarea
                name="contentAr"
                value={formData.contentAr}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-right"
                placeholder={lang === 'ar' ? 'المحتوى الكامل بالعربية' : 'Contenu complet en arabe'}
                dir="rtl"
              />
            </div>
          </div>

          {/* Metadata Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              {lang === 'ar' ? 'معلومات المقالة' : 'Informations de l\'article'}
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'ar' ? 'الفئة' : 'Catégorie'}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat.fr} value={cat.fr}>
                      {cat.fr}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'ar' ? 'الكاتب' : 'Auteur'}
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'ar' ? 'الصورة المميزة' : 'Image en vedette'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                {formData.image && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {lang === 'ar' ? `الملف: ${formData.image.name}` : `Fichier: ${formData.image.name}`}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'ar' ? 'الحالة' : 'Statut'}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  <option value="draft">{lang === 'ar' ? 'مسودة' : 'Brouillon'}</option>
                  <option value="published">{lang === 'ar' ? 'منشورة' : 'Publiée'}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {lang === 'ar' ? 'تحديد كمقالة مميزة' : 'Marquer comme article en vedette'}
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              {lang === 'ar' ? 'إلغاء' : 'Annuler'}
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? (lang === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...')
                : (lang === 'ar' ? 'نشر المقالة' : 'Publier l\'article')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
