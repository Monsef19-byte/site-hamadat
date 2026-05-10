'use client';

import { useLanguage } from '@/lib/language-context';
import { useState } from 'react';
import Link from 'next/link';

interface BlogArticle {
  id: number;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  published_at: string;
  featured: boolean;
  status: 'draft' | 'published';
}

const mockArticles: BlogArticle[] = [
  {
    id: 1,
    title: 'Les Tendances du Marché Immobilier 2024',
    titleAr: 'اتجاهات سوق العقارات لعام 2024',
    category: 'Marché',
    categoryAr: 'السوق',
    published_at: '2024-01-15',
    featured: true,
    status: 'published'
  },
  {
    id: 2,
    title: 'Guide Complet: Investir dans l\'Immobilier de Prestige',
    titleAr: 'دليل شامل: الاستثمار في العقارات الفاخرة',
    category: 'Guide',
    categoryAr: 'دليل',
    published_at: '2024-02-20',
    featured: false,
    status: 'published'
  },
  {
    id: 3,
    title: 'Les Aménités Modernes dans les Résidences de Prestige',
    titleAr: 'المرافق الحديثة في المجمعات السكنية الفاخرة',
    category: 'Aménités',
    categoryAr: 'المرافق',
    published_at: '2024-03-10',
    featured: false,
    status: 'published'
  }
];

export default function DashboardPage() {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState<BlogArticle[]>(mockArticles);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const filteredArticles = articles.filter(article =>
    filterStatus === 'all' ? true : article.status === filterStatus
  );

  const toggleFeatured = (id: number) => {
    setArticles(articles.map(article =>
      article.id === id ? { ...article, featured: !article.featured } : article
    ));
  };

  const deleteArticle = (id: number) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {lang === 'ar' ? 'إدارة مقالات المدونة والمحتوى' : 'Gérez vos articles de blog et contenu'}
            </p>
          </div>
          <Link
            href="/dashboard/blog/new"
            className="btn btn-primary inline-flex items-center gap-2 mt-4 md:mt-0"
          >
            <span>➕</span>
            {lang === 'ar' ? 'مقالة جديدة' : 'Nouvel Article'}
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                filterStatus === 'all'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'Tous'}
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                filterStatus === 'published'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {lang === 'ar' ? 'منشورة' : 'Publiées'}
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                filterStatus === 'draft'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {lang === 'ar' ? 'مسودات' : 'Brouillons'}
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
          {filteredArticles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {lang === 'ar' ? 'العنوان' : 'Titre'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {lang === 'ar' ? 'الفئة' : 'Catégorie'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {lang === 'ar' ? 'التاريخ' : 'Date'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {lang === 'ar' ? 'الحالة' : 'Statut'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className={lang === 'ar' ? 'text-right' : ''}>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {lang === 'ar' ? article.titleAr : article.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {lang === 'ar' ? article.categoryAr : article.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(article.published_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {article.status === 'published'
                            ? (lang === 'ar' ? 'منشورة' : 'Publiée')
                            : (lang === 'ar' ? 'مسودة' : 'Brouillon')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFeatured(article.id)}
                            title={lang === 'ar' ? 'تحديد كمميزة' : 'Marquer comme vedette'}
                            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-lg ${
                              article.featured
                                ? 'text-yellow-500'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                          >
                            {article.featured ? '⭐' : '☆'}
                          </button>
                          <Link
                            href={`/dashboard/blog/${article.id}/edit`}
                            className="p-2 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-lg"
                            title={lang === 'ar' ? 'تعديل' : 'Éditer'}
                          >
                            ✏️
                          </Link>
                          <Link
                            href={`/blog/${article.id}`}
                            className="p-2 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-lg"
                            title={lang === 'ar' ? 'عرض' : 'Afficher'}
                          >
                            👁️
                          </Link>
                          <button
                            onClick={() => deleteArticle(article.id)}
                            className="p-2 rounded text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-lg"
                            title={lang === 'ar' ? 'حذف' : 'Supprimer'}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {lang === 'ar' ? 'لا توجد مقالات حالياً' : 'Aucun article pour le moment'}
              </p>
              <Link href="/dashboard/blog/new" className="btn btn-primary inline-flex items-center gap-2">
                <span>➕</span>
                {lang === 'ar' ? 'إنشاء مقالة جديدة' : 'Créer un nouvel article'}
              </Link>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {lang === 'ar' ? 'إجمالي المقالات' : 'Total Articles'}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {articles.length}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {lang === 'ar' ? 'منشورة' : 'Publiées'}
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {articles.filter(a => a.status === 'published').length}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {lang === 'ar' ? 'مميزة' : 'En vedette'}
            </p>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {articles.filter(a => a.featured).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
