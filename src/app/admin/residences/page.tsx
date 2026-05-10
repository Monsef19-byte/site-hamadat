'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSiteConfig } from '@/lib/site-config-context';

const RESIDENCE_SLUGS: { slug: string; name: string }[] = [
  { slug: 'elysia',          name: 'Elysia' },
  { slug: 'les-3-princes',   name: 'Les 3 Princes' },
  { slug: 'orea',            name: 'Orea' },
  { slug: 'lumalac',         name: 'Lumalac' },
  { slug: 'marmo',           name: 'Marmo' },
  { slug: 'vertdalya',       name: 'Vert Dalya' },
];

export default function AdminResidencesPage() {
  const { config, updateConfig } = useSiteConfig();

  // Read directly from config — always in sync with localStorage
  const residences = config.residenceList ?? [];

  const handleDelete = (id: string) => {
    const r = residences.find(r => r.id === id);
    if (!r) return;
    if (confirm(`Supprimer "${r.name_fr}" définitivement ?`)) {
      updateConfig({ residenceList: residences.filter(r => r.id !== id) });
    }
  };

  // ── Maps ──
  const [mapInputs, setMapInputs] = useState<Record<string, string>>(
    Object.fromEntries(RESIDENCE_SLUGS.map(({ slug }) => [slug, config.residences[slug]?.mapEmbed || '']))
  );
  const [mapSaved, setMapSaved] = useState<Record<string, boolean>>({});

  // Sync input fields when config loads from localStorage after mount
  useEffect(() => {
    setMapInputs(prev => {
      const next = Object.fromEntries(
        RESIDENCE_SLUGS.map(({ slug }) => [slug, config.residences[slug]?.mapEmbed || ''])
      );
      return Object.fromEntries(
        RESIDENCE_SLUGS.map(({ slug }) => [slug, mapSaved[slug] ? prev[slug] : next[slug]])
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.residences]);

  const saveMap = (slug: string) => {
    updateConfig({ residences: { ...config.residences, [slug]: { ...config.residences[slug], mapEmbed: mapInputs[slug].trim() } } });
    setMapSaved(prev => ({ ...prev, [slug]: true }));
    setTimeout(() => setMapSaved(prev => ({ ...prev, [slug]: false })), 2000);
  };

  const fieldBase: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #e8e8e6',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#2a2826',
    background: '#fff',
    fontFamily: 'inherit',
    outline: 'none',
  };

  return (
    <div style={{ background: '#f7f7f5', minHeight: '100vh', padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#0e7470', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#2a2826', letterSpacing: '-0.5px', margin: 0 }}>
            Gestion des Résidences
          </h1>
          <Link href="/admin/residences/new" style={{
            background: '#0e7470', color: '#fff',
            padding: '12px 28px', borderRadius: '4px',
            fontSize: '13px', fontWeight: '600', textDecoration: 'none',
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}
          >
            + Ajouter une résidence
          </Link>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f8', borderBottom: '1px solid #e8e8e6' }}>
              {['Nom', 'Arabe', 'Localisation', 'Unités', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: '#b8b0a8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {residences.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '60px 24px', textAlign: 'center', color: '#b8b0a8', fontSize: '14px' }}>
                  Aucune résidence.{' '}
                  <Link href="/admin/residences/new" style={{ color: '#0e7470', textDecoration: 'none', fontWeight: '600' }}>
                    Ajouter la première →
                  </Link>
                </td>
              </tr>
            ) : residences.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid #f7f7f5' }}>
                <td style={{ padding: '18px 24px', fontSize: '14px', fontWeight: '500', color: '#2a2826' }}>
                  {r.name_fr}
                </td>
                <td style={{ padding: '18px 24px', fontSize: '14px', color: '#9a9590', direction: 'rtl' }}>
                  {r.name_ar}
                </td>
                <td style={{ padding: '18px 24px', fontSize: '13px', color: '#6b6560' }}>
                  {r.location}
                </td>
                <td style={{ padding: '18px 24px', fontSize: '14px', color: '#6b6560' }}>
                  {r.units}
                </td>
                <td style={{ padding: '18px 24px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '2px',
                    fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                    background: r.status === 'completed' ? 'rgba(16,185,129,0.1)' : r.status === 'sold' ? 'rgba(99,102,241,0.1)' : 'rgba(14,116,112,0.1)',
                    color: r.status === 'completed' ? '#059669' : r.status === 'sold' ? '#6366f1' : '#0e7470',
                  }}>
                    {r.status === 'completed' ? 'Livré' : r.status === 'sold' ? 'Vendu' : 'En cours'}
                  </span>
                </td>
                <td style={{ padding: '18px 24px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Link href={`/admin/residences/${r.id}/edit`} style={{ fontSize: '13px', color: '#0e7470', textDecoration: 'none', fontWeight: '600' }}>
                      Modifier
                    </Link>
                    <button onClick={() => handleDelete(r.id)} style={{ fontSize: '13px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', padding: 0 }}>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Section: Cartes de localisation ── */}
      <div style={{ background: '#fff', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#b8b0a8', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px', paddingBottom: '12px', borderBottom: '1px solid #e8e8e6' }}>
          Cartes de localisation
        </h2>
        <p style={{ fontSize: '12px', color: '#9a9590', marginBottom: '24px', marginTop: '4px' }}>
          Collez l'URL d'intégration Google Maps pour chaque résidence.{' '}
          <span style={{ color: '#b8b0a8' }}>
            (Google Maps → Partager → Intégrer une carte → copier l'attribut <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>src</code> de l'iframe)
          </span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {RESIDENCE_SLUGS.map(({ slug, name }) => {
            const saved = mapSaved[slug];
            const val   = mapInputs[slug] ?? '';
            return (
              <div key={slug}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: '12px', alignItems: 'end' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#2a2826', paddingBottom: '10px' }}>{name}</span>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#9a9590', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                      URL d'intégration
                    </label>
                    <input
                      type="text"
                      value={val}
                      onChange={e => { setMapInputs(prev => ({ ...prev, [slug]: e.target.value })); setMapSaved(prev => ({ ...prev, [slug]: false })); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveMap(slug); } }}
                      style={{ ...fieldBase, width: '100%' }}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => saveMap(slug)}
                    style={{ padding: '10px 18px', background: saved ? '#16a34a' : '#0e7470', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                    onMouseEnter={e => { if (!saved) (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
                    onMouseLeave={e => { if (!saved) (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}
                  >
                    {saved ? '✓ OK' : 'Enregistrer'}
                  </button>
                </div>
                {val && val.startsWith('https://') && (
                  <div style={{ marginTop: '10px', height: '160px', borderRadius: '4px', overflow: 'hidden', background: '#e8e8e6' }}>
                    <iframe
                      src={val}
                      title={`Map preview — ${name}`}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
