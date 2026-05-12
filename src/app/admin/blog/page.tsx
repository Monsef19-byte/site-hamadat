'use client';

import { useState } from 'react';
import Link from 'next/link';

const INITIAL_ARTICLES = [
  { id: '1', title: "Tendances 2024 dans l'Immobilier Résidentiel", titleAr: 'اتجاهات 2024 في العقارات السكنية', category: 'Marché', date: '2024-05-01', published: true },
  { id: '2', title: 'Guide: Investir dans le Résidentiel de Prestige', titleAr: 'دليل: الاستثمار في العقارات السكنية الفاخرة', category: 'Guide', date: '2024-04-15', published: true },
];

export default function AdminBlogPage() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cet article ?')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div style={{ padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
            Gestion du Blog
          </h1>
          <Link href="/admin/blog/new" style={{
            background: '#0e7470', color: '#fff',
            padding: '10px 24px', borderRadius: '8px',
            fontSize: '12px', fontWeight: '600', textDecoration: 'none',
            letterSpacing: '0.5px',
          }}>
            + Nouvel Article
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <div className="dash-glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Titre', 'Catégorie', 'Date', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-4)', fontSize: '14px' }}>
                  Aucun article. <Link href="/admin/blog/new" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>Créer le premier →</Link>
                </td>
              </tr>
            ) : articles.map((a) => (
              <tr key={a.id} className="dash-table-row" style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-1)', margin: '0 0 4px' }}>{a.title}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: 0, direction: 'rtl', textAlign: 'right' }}>{a.titleAr}</p>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '4px',
                    fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                    background: 'rgba(14,116,112,0.12)', color: '#0e7470',
                  }}>
                    {a.category}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-3)' }}>
                  {new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '4px',
                    fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                    background: a.published ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.15)',
                    color: a.published ? '#059669' : '#9ca3af',
                  }}>
                    {a.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '16px' }}>
                  <Link href={`/admin/blog/${a.id}/edit`} style={{ fontSize: '12px', color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>
                    Modifier
                  </Link>
                  <button onClick={() => handleDelete(a.id)} style={{
                    fontSize: '12px', color: '#dc2626', background: 'none', border: 'none',
                    cursor: 'pointer', fontWeight: '600', padding: 0,
                  }}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
