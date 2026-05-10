'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSiteConfig } from '@/lib/site-config-context';

const ARTICLES: Record<string, { title: string; titleAr: string; excerpt: string; excerptAr: string; category: string; published: boolean }> = {
  '1': { title: "Tendances 2024 dans l'Immobilier Résidentiel", titleAr: 'اتجاهات 2024 في العقارات السكنية', excerpt: "Découvrez les tendances qui façonnent le marché immobilier algérien en 2024.", excerptAr: 'اكتشف الاتجاهات التي تشكل السوق العقاري الجزائري.', category: 'Marché', published: true },
  '2': { title: 'Guide: Investir dans le Résidentiel de Prestige', titleAr: 'دليل: الاستثمار في العقارات السكنية الفاخرة', excerpt: "Tout ce que vous devez savoir avant d'investir.", excerptAr: 'كل ما تحتاج لمعرفته قبل الاستثمار.', category: 'Guide', published: true },
};

const CATEGORIES = ['Marché', 'Guide', 'Actualité', 'Conseil', 'Projet'];

const field: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  border: '1px solid var(--border)', borderRadius: '4px',
  fontSize: '14px', color: 'var(--text-1)', background: 'var(--input-bg)',
  boxSizing: 'border-box', fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s',
};

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { config, updateConfig } = useSiteConfig();

  const base = ARTICLES[id] ?? ARTICLES['1'];
  const [form, setForm] = useState(base);
  const [focused, setFocused] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const existingCover = config.blog[id]?.coverImage ?? '';
  const [coverImage, setCoverImage] = useState(existingCover);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      blog: { ...config.blog, [id]: { coverImage } },
    });
    setSaved(true);
    setTimeout(() => router.push('/admin/blog'), 1200);
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    ...field,
    borderColor: focused === name ? '#0e7470' : 'var(--border)',
    boxShadow: focused === name ? '0 0 0 3px rgba(14,116,112,0.08)' : 'none',
  });

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
      {children}
    </label>
  );

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', padding: '40px 48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <Link href="/admin/blog" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          ← Retour au blog
        </Link>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#0e7470', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration · Blog
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
          Modifier l'article
        </h1>
      </div>

      {saved && (
        <div style={{ background: 'rgba(14,116,112,0.08)', border: '1px solid rgba(14,116,112,0.25)', borderRadius: '4px', padding: '14px 20px', marginBottom: '28px', fontSize: '14px', color: '#0e7470', fontWeight: '500' }}>
          ✓ Article mis à jour. Redirection…
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Cover image card */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', marginTop: 0 }}>
                Image de couverture
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <Label>URL de l'image</Label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  onFocus={() => setFocused('coverImage')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('coverImage')}
                  placeholder="/blog/article-cover.jpg"
                />
              </div>
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Aperçu couverture"
                  style={{ width: '320px', height: '180px', objectFit: 'cover', borderRadius: '4px', display: 'block', background: 'var(--border)' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
                />
              ) : (
                <div style={{ width: '320px', height: '180px', background: 'var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-4)' }}>Aucune image</span>
                </div>
              )}
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', marginTop: 0 }}>Français</h3>
              <div style={{ marginBottom: '16px' }}>
                <Label>Titre</Label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} onFocus={() => setFocused('title')} onBlur={() => setFocused(null)} style={inputStyle('title')} />
              </div>
              <div>
                <Label>Extrait</Label>
                <textarea required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} onFocus={() => setFocused('excerpt')} onBlur={() => setFocused(null)} style={{ ...inputStyle('excerpt'), minHeight: '100px', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', marginTop: 0 }}>عربي</h3>
              <div style={{ marginBottom: '16px' }} dir="rtl">
                <Label>العنوان</Label>
                <input type="text" value={form.titleAr} onChange={e => setForm({ ...form, titleAr: e.target.value })} onFocus={() => setFocused('titleAr')} onBlur={() => setFocused(null)} style={{ ...inputStyle('titleAr'), textAlign: 'right' }} />
              </div>
              <div dir="rtl">
                <Label>ملخص</Label>
                <textarea value={form.excerptAr} onChange={e => setForm({ ...form, excerptAr: e.target.value })} onFocus={() => setFocused('excerptAr')} onBlur={() => setFocused(null)} style={{ ...inputStyle('excerptAr'), minHeight: '80px', resize: 'vertical', textAlign: 'right' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', marginTop: 0 }}>Publication</h3>
              <div style={{ marginBottom: '16px' }}>
                <Label>Statut</Label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#0e7470', cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-1)' }}>{form.published ? 'Publié' : 'Brouillon'}</span>
                </label>
              </div>
              <div>
                <Label>Catégorie</Label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} onFocus={() => setFocused('category')} onBlur={() => setFocused(null)} style={inputStyle('category')}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#0e7470', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase', transition: 'background 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}>
              Enregistrer
            </button>
            <Link href="/admin/blog" style={{ display: 'block', textAlign: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px', color: 'var(--text-3)', textDecoration: 'none' }}>
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
