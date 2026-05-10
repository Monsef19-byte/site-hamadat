'use client';

import Link from 'next/link';
import { useSiteConfig } from '@/lib/site-config-context';

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

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f8', borderBottom: '1px solid #e8e8e6' }}>
              {['Nom', 'Arabe', 'Localisation', 'Unités', 'Statut', 'Carte', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: '#b8b0a8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {residences.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center', color: '#b8b0a8', fontSize: '14px' }}>
                  Aucune résidence.{' '}
                  <Link href="/admin/residences/new" style={{ color: '#0e7470', textDecoration: 'none', fontWeight: '600' }}>
                    Ajouter la première →
                  </Link>
                </td>
              </tr>
            ) : residences.map((r) => {
              const hasMap = !!(config.residences[r.slug]?.mapEmbed);
              return (
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
                    <span title={hasMap ? 'Carte configurée' : 'Aucune carte'} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '11px', fontWeight: '600',
                      color: hasMap ? '#059669' : '#d1c9c0',
                    }}>
                      <span style={{ fontSize: '14px' }}>{hasMap ? '📍' : '○'}</span>
                      {hasMap ? 'OK' : '—'}
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
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
