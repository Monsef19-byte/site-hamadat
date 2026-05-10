'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSiteConfig } from '@/lib/site-config-context';

const STATUTS = ['En cours', 'Livré', 'Vendu'];

const fieldBase: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  border: '1px solid #e5e5e3', borderRadius: '4px',
  fontSize: '14px', color: '#2a2826', background: '#fff',
  boxSizing: 'border-box', fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
};

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#9a9590', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
    {children}{required && <span style={{ color: '#0e7470', marginLeft: '3px' }}>*</span>}
  </label>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#b8b0a8', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid #e8e8e6' }}>
    {children}
  </h2>
);

export default function NewResidencePage() {
  const router = useRouter();
  const { config, updateConfig } = useSiteConfig();
  const [focused, setFocused] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    name_fr: '', name_ar: '',
    location: '', status: 'En cours',
    total_units: '', typology: '',
    description_fr: '', description_ar: '',
    available: '', delivery: '',
    featuredOnHome: false,
  });

  const f = (name: string): React.CSSProperties => ({
    ...fieldBase,
    borderColor: focused === name ? '#0e7470' : '#e5e5e3',
    boxShadow: focused === name ? '0 0 0 3px rgba(14,116,112,0.08)' : 'none',
  });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.name_fr.toLowerCase().trim()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newEntry = {
      id: `r-${Date.now()}`,
      slug,
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
    updateConfig({ residenceList: [...(config.residenceList ?? []), newEntry] });
    setSaved(true);
    setTimeout(() => router.push('/admin/residences'), 1200);
  };

  return (
    <div style={{ background: '#f7f7f5', minHeight: '100vh', padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <Link href="/admin/residences" style={{ fontSize: '12px', color: '#9a9590', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          ← Retour aux résidences
        </Link>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#0e7470', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration · Résidences
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#2a2826', letterSpacing: '-0.5px', margin: 0 }}>
          Nouvelle résidence
        </h1>
      </div>

      {saved && (
        <div style={{ background: 'rgba(14,116,112,0.08)', border: '1px solid rgba(14,116,112,0.25)', borderRadius: '4px', padding: '14px 20px', marginBottom: '28px', fontSize: '14px', color: '#0e7470', fontWeight: '500' }}>
          ✓ Résidence ajoutée avec succès. Redirection…
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Identité */}
            <div style={{ background: '#fff', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Identité du projet</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <Label required>Nom (Français)</Label>
                  <input name="name_fr" type="text" value={form.name_fr} onChange={set} required
                    onFocus={() => setFocused('name_fr')} onBlur={() => setFocused(null)}
                    style={f('name_fr')} placeholder="Ex: Elysia" />
                </div>
                <div>
                  <Label required>Nom (Arabe)</Label>
                  <input name="name_ar" type="text" value={form.name_ar} onChange={set} required dir="rtl"
                    onFocus={() => setFocused('name_ar')} onBlur={() => setFocused(null)}
                    style={{ ...f('name_ar'), textAlign: 'right' }} placeholder="إليسيا" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Label required>Localisation</Label>
                  <input name="location" type="text" value={form.location} onChange={set} required
                    onFocus={() => setFocused('location')} onBlur={() => setFocused(null)}
                    style={f('location')} placeholder="Ex: Jijel" />
                </div>
                <div>
                  <Label required>Typologies</Label>
                  <input name="typology" type="text" value={form.typology} onChange={set} required
                    onFocus={() => setFocused('typology')} onBlur={() => setFocused(null)}
                    style={f('typology')} placeholder="Ex: F3 (96 m² — 110 m²)" />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div style={{ background: '#fff', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Descriptions</SectionTitle>
              <div style={{ marginBottom: '16px' }}>
                <Label required>Description (Français)</Label>
                <textarea name="description_fr" value={form.description_fr} onChange={set} required
                  onFocus={() => setFocused('description_fr')} onBlur={() => setFocused(null)}
                  style={{ ...f('description_fr'), minHeight: '120px', resize: 'vertical' }}
                  placeholder="Décrivez le projet en français…" />
              </div>
              <div dir="rtl">
                <Label required>الوصف (Arabe)</Label>
                <textarea name="description_ar" value={form.description_ar} onChange={set}
                  onFocus={() => setFocused('description_ar')} onBlur={() => setFocused(null)}
                  style={{ ...f('description_ar'), minHeight: '120px', resize: 'vertical', textAlign: 'right' }}
                  placeholder="وصف المشروع بالعربية…" />
              </div>
            </div>

            {/* Médias */}
            <div style={{ background: '#fff', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Photos du projet</SectionTitle>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed #e5e5e3', borderRadius: '4px', padding: '36px 24px',
                cursor: 'pointer', transition: 'border-color 0.2s',
                color: '#b8b0a8', fontSize: '13px', gap: '8px',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#0e7470'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e5e3'; }}
              >
                <span style={{ fontSize: '28px', opacity: 0.4 }}>⊕</span>
                {images.length > 0
                  ? <span style={{ color: '#0e7470', fontWeight: '600' }}>{images.length} fichier(s) sélectionné(s)</span>
                  : <span>Cliquer pour sélectionner des photos</span>
                }
                <span style={{ fontSize: '11px' }}>JPG, PNG, WEBP</span>
                <input type="file" multiple accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => e.target.files && setImages(Array.from(e.target.files))} />
              </label>
            </div>

          </div>

          {/* Right — sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>

            {/* Statut & chiffres */}
            <div style={{ background: '#fff', borderRadius: '4px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Paramètres</SectionTitle>
              <div style={{ marginBottom: '16px' }}>
                <Label required>Statut</Label>
                <select name="status" value={form.status} onChange={set}
                  onFocus={() => setFocused('status')} onBlur={() => setFocused(null)}
                  style={f('status')}>
                  {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Label required>Nombre d'unités</Label>
                <input name="total_units" type="number" value={form.total_units} onChange={set} required
                  onFocus={() => setFocused('total_units')} onBlur={() => setFocused(null)}
                  style={f('total_units')} placeholder="Ex: 56" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Label>Unités disponibles</Label>
                <input name="available" type="text" value={form.available} onChange={set}
                  onFocus={() => setFocused('available')} onBlur={() => setFocused(null)}
                  style={f('available')} placeholder="Ex: 2 F3, 1 F4" />
              </div>
              <div>
                <Label>Délai de livraison</Label>
                <input name="delivery" type="text" value={form.delivery} onChange={set}
                  onFocus={() => setFocused('delivery')} onBlur={() => setFocused(null)}
                  style={f('delivery')} placeholder="Ex: 24 mois" />
              </div>
            </div>

            {/* Visibility */}
            <div style={{ background: '#fff', borderRadius: '4px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <SectionTitle>Visibilité</SectionTitle>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="featuredOnHome" checked={form.featuredOnHome}
                  onChange={set} style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#0e7470', cursor: 'pointer', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#2a2826', display: 'block' }}>En vedette sur l'accueil</span>
                  <span style={{ fontSize: '12px', color: '#b8b0a8', display: 'block', marginTop: '2px' }}>Affiché dans la section projets phares</span>
                </div>
              </label>
            </div>

            {/* Actions */}
            <button type="submit" style={{
              width: '100%', padding: '14px',
              background: '#0e7470', color: '#fff', border: 'none',
              borderRadius: '4px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}
            >
              Ajouter la résidence
            </button>
            <Link href="/admin/residences" style={{
              display: 'block', textAlign: 'center', padding: '12px',
              border: '1px solid #e5e5e3', borderRadius: '4px',
              fontSize: '13px', color: '#9a9590', textDecoration: 'none',
            }}>
              Annuler
            </Link>
          </div>

        </div>
      </form>
    </div>
  );
}
