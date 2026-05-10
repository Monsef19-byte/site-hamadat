'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSiteConfig } from '@/lib/site-config-context';

const STATUTS = ['En cours', 'Livré', 'Vendu'];

const fieldBase: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  border: '1px solid var(--border)', borderRadius: '4px',
  fontSize: '14px', color: 'var(--text-1)', background: 'var(--input-bg)',
  boxSizing: 'border-box', fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
};

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
    {children}{required && <span style={{ color: '#0e7470', marginLeft: '3px' }}>*</span>}
  </label>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
    {children}
  </h2>
);

export default function EditResidencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { config, updateConfig } = useSiteConfig();

  const entry = (config.residenceList ?? []).find(r => r.id === id);
  const slug   = entry?.slug ?? id;
  const cfgRes = config.residences[slug];

  const statusLabel = entry?.status === 'completed' ? 'Livré' : entry?.status === 'sold' ? 'Vendu' : 'En cours';

  const [form, setForm] = useState({
    name_fr: entry?.name_fr ?? '',
    name_ar: entry?.name_ar ?? '',
    location: entry?.location ?? '',
    status: statusLabel,
    total_units: String(entry?.units ?? ''),
    typology: entry?.typology ?? '',
    description_fr: entry?.description_fr ?? '',
    description_ar: entry?.description_ar ?? '',
    available: entry?.available ?? '',
    delivery: entry?.delivery ?? '',
    featuredOnHome: entry?.featuredOnHome ?? false,
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [thumbnail, setThumbnail] = useState(cfgRes?.thumbnail ?? '');
  const [gridSize, setGridSize]   = useState<number>(cfgRes?.gridSize ?? 3);
  const [mapEmbed, setMapEmbed]   = useState(cfgRes?.mapEmbed ?? '');

  // Re-sync form when config loads from localStorage after mount
  useEffect(() => {
    const e = (config.residenceList ?? []).find(r => r.id === id);
    if (!e) return;
    const label = e.status === 'completed' ? 'Livré' : e.status === 'sold' ? 'Vendu' : 'En cours';
    setForm({
      name_fr: e.name_fr, name_ar: e.name_ar, location: e.location,
      status: label, total_units: String(e.units), typology: e.typology,
      description_fr: e.description_fr, description_ar: e.description_ar,
      available: e.available ?? '', delivery: e.delivery ?? '',
      featuredOnHome: e.featuredOnHome ?? false,
    });
    const cr = config.residences[e.slug];
    if (cr?.thumbnail) setThumbnail(cr.thumbnail);
    if (cr?.gridSize)  setGridSize(cr.gridSize);
    setMapEmbed(cr?.mapEmbed ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, config.residenceList]);

  const f = (name: string): React.CSSProperties => ({
    ...fieldBase,
    borderColor: focused === name ? '#0e7470' : 'var(--border)',
    boxShadow: focused === name ? '0 0 0 3px rgba(14,116,112,0.08)' : 'none',
  });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEntry: import('@/lib/site-config-context').ResidenceEntry = {
      id, slug,
      name_fr: form.name_fr.trim(),
      name_ar: form.name_ar.trim(),
      location: form.location.trim(),
      status: (form.status === 'Livré' ? 'completed' : form.status === 'Vendu' ? 'sold' : 'ongoing') as 'ongoing' | 'completed' | 'sold',
      units: parseInt(form.total_units) || 0,
      typology: form.typology.trim(),
      description_fr: form.description_fr.trim(),
      description_ar: form.description_ar.trim(),
      available: form.available.trim(),
      delivery: form.delivery.trim(),
      featuredOnHome: form.featuredOnHome,
    };
    updateConfig({
      residenceList: (config.residenceList ?? []).map(r => r.id === id ? updatedEntry : r),
      residences: { ...config.residences, [slug]: { ...cfgRes, thumbnail, gridSize: gridSize as 2|3|4|5|6, mapEmbed: mapEmbed.trim() } },
    });
    setSaved(true);
    setTimeout(() => router.push('/admin/residences'), 1200);
  };

  const handleDelete = () => {
    if (confirm(`Supprimer "${form.name_fr}" définitivement ?`)) {
      updateConfig({ residenceList: (config.residenceList ?? []).filter(r => r.id !== id) });
      router.push('/admin/residences');
    }
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <Link href="/admin/residences" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          ← Retour aux résidences
        </Link>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#0e7470', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration · Résidences
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
          {form.name_fr || 'Modifier la résidence'}
        </h1>
      </div>

      {saved && (
        <div style={{ background: 'rgba(14,116,112,0.08)', border: '1px solid rgba(14,116,112,0.25)', borderRadius: '4px', padding: '14px 20px', marginBottom: '28px', fontSize: '14px', color: '#0e7470', fontWeight: '500' }}>
          ✓ Résidence mise à jour. Redirection…
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Photo principale */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Photo principale</SectionTitle>
              <div style={{ marginBottom: '16px' }}>
                <img
                  src={thumbnail}
                  alt="Aperçu"
                  style={{ width: '320px', height: '200px', objectFit: 'cover', borderRadius: '4px', display: 'block', background: 'var(--border)' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
                />
              </div>
              <Label>URL de l'image</Label>
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                onFocus={() => setFocused('thumbnail')}
                onBlur={() => setFocused(null)}
                style={f('thumbnail')}
                placeholder="/residences/elysia.jpg"
              />
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Identité du projet</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <Label required>Nom (Français)</Label>
                  <input name="name_fr" type="text" value={form.name_fr} onChange={set} required
                    onFocus={() => setFocused('name_fr')} onBlur={() => setFocused(null)} style={f('name_fr')} />
                </div>
                <div>
                  <Label required>Nom (Arabe)</Label>
                  <input name="name_ar" type="text" value={form.name_ar} onChange={set} required dir="rtl"
                    onFocus={() => setFocused('name_ar')} onBlur={() => setFocused(null)}
                    style={{ ...f('name_ar'), textAlign: 'right' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Label required>Localisation</Label>
                  <input name="location" type="text" value={form.location} onChange={set} required
                    onFocus={() => setFocused('location')} onBlur={() => setFocused(null)} style={f('location')} />
                </div>
                <div>
                  <Label required>Typologies</Label>
                  <input name="typology" type="text" value={form.typology} onChange={set} required
                    onFocus={() => setFocused('typology')} onBlur={() => setFocused(null)} style={f('typology')} />
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Descriptions</SectionTitle>
              <div style={{ marginBottom: '16px' }}>
                <Label required>Description (Français)</Label>
                <textarea name="description_fr" value={form.description_fr} onChange={set} required
                  onFocus={() => setFocused('description_fr')} onBlur={() => setFocused(null)}
                  style={{ ...f('description_fr'), minHeight: '120px', resize: 'vertical' }} />
              </div>
              <div dir="rtl">
                <Label>الوصف (Arabe)</Label>
                <textarea name="description_ar" value={form.description_ar} onChange={set}
                  onFocus={() => setFocused('description_ar')} onBlur={() => setFocused(null)}
                  style={{ ...f('description_ar'), minHeight: '120px', resize: 'vertical', textAlign: 'right' }} />
              </div>
            </div>

            {/* Carte de localisation */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Carte de localisation</SectionTitle>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px', marginTop: '-8px' }}>
                Google Maps → Partager → Intégrer une carte → copier l'attribut{' '}
                <code style={{ fontFamily: 'monospace', fontSize: '11px', background: 'var(--border)', padding: '1px 5px', borderRadius: '3px' }}>src</code> de l'iframe.
              </p>
              <Label>URL d'intégration</Label>
              <input
                type="text"
                value={mapEmbed}
                onChange={e => setMapEmbed(e.target.value)}
                onFocus={() => setFocused('mapEmbed')}
                onBlur={() => setFocused(null)}
                style={f('mapEmbed')}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              {/* Live preview */}
              {mapEmbed.startsWith('https://') && (
                <div style={{ marginTop: '16px', height: '240px', borderRadius: '4px', overflow: 'hidden', background: 'var(--border)' }}>
                  <iframe
                    src={mapEmbed}
                    title="Aperçu carte"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
              {!mapEmbed && (
                <div style={{ marginTop: '16px', height: '100px', borderRadius: '4px', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-4)' }}>Aucune carte configurée — coller une URL ci-dessus</span>
                </div>
              )}
            </div>

          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>

            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Taille dans la grille</SectionTitle>
              <div style={{ display: 'flex', gap: '8px' }}>
                {([2, 3, 4, 5, 6] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setGridSize(s)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '4px',
                      border: gridSize === s ? '2px solid #0e7470' : '1px solid var(--border)',
                      background: gridSize === s ? '#0e7470' : 'var(--bg-page)',
                      color: gridSize === s ? '#fff' : 'var(--text-2)',
                      fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Paramètres</SectionTitle>
              <div style={{ marginBottom: '16px' }}>
                <Label required>Statut</Label>
                <select name="status" value={form.status} onChange={set}
                  onFocus={() => setFocused('status')} onBlur={() => setFocused(null)} style={f('status')}>
                  {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Label required>Nombre d'unités</Label>
                <input name="total_units" type="number" value={form.total_units} onChange={set} required
                  onFocus={() => setFocused('total_units')} onBlur={() => setFocused(null)} style={f('total_units')} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Label>Unités disponibles</Label>
                <input name="available" type="text" value={form.available} onChange={set}
                  onFocus={() => setFocused('available')} onBlur={() => setFocused(null)} style={f('available')} placeholder="Ex: 2 F3, 1 F4" />
              </div>
              <div>
                <Label>Délai de livraison</Label>
                <input name="delivery" type="text" value={form.delivery} onChange={set}
                  onFocus={() => setFocused('delivery')} onBlur={() => setFocused(null)} style={f('delivery')} placeholder="Ex: 24 mois" />
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Visibilité</SectionTitle>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="featuredOnHome" checked={form.featuredOnHome} onChange={set}
                  style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#0e7470', cursor: 'pointer', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-1)', display: 'block' }}>En vedette sur l'accueil</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-4)', display: 'block', marginTop: '2px' }}>Affiché dans la section projets phares</span>
                </div>
              </label>
            </div>

            <button type="submit" style={{
              width: '100%', padding: '14px', background: '#0e7470', color: '#fff',
              border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase', transition: 'background 0.2s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}>
              Enregistrer les modifications
            </button>

            <Link href="/admin/residences" style={{ display: 'block', textAlign: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px', color: 'var(--text-3)', textDecoration: 'none' }}>
              Annuler
            </Link>

            <button type="button" onClick={handleDelete} style={{
              width: '100%', padding: '12px', background: 'transparent',
              border: '1px solid #fecaca', borderRadius: '4px',
              fontSize: '13px', color: '#dc2626', cursor: 'pointer',
              fontWeight: '600', letterSpacing: '0.3px', transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              Supprimer cette résidence
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}
