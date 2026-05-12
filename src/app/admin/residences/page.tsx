'use client';

import Link from 'next/link';
import { useSiteConfig } from '@/lib/site-config-context';

export default function AdminResidencesPage() {
  const { config, updateConfig } = useSiteConfig();
  const residences = config.residenceList ?? [];

  const handleDelete = (id: string) => {
    const r = residences.find(r => r.id === id);
    if (!r) return;
    if (confirm(`Supprimer "${r.name_fr}" définitivement ?`)) {
      updateConfig({ residenceList: residences.filter(r => r.id !== id) });
    }
  };

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Administration</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>Gestion des Résidences</h1>
          <Link href="/admin/residences/new" style={{ background: '#0e7470', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', letterSpacing: '0.5px' }}>+ Ajouter</Link>
        </div>
      </div>

      <div className="dash-glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Nom', 'Arabe', 'Localisation', 'Unités', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {residences.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-4)', fontSize: '14px' }}>Aucune résidence. <Link href="/admin/residences/new" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>Ajouter la première →</Link></td></tr>
            ) : residences.map((r) => (
              <tr key={r.id} className="dash-table-row" style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: 'var(--text-1)' }}>{r.name_fr}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-3)', direction: 'rtl' }}>{r.name_ar}</td>
                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-3)' }}>{r.location}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-3)' }}>{r.units}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                    background: r.status === 'completed' ? 'rgba(16,185,129,0.12)' : 'rgba(14,116,112,0.12)',
                    color: r.status === 'completed' ? '#059669' : '#0e7470',
                  }}>{r.status === 'completed' ? 'Livré' : r.status === 'sold' ? 'Vendu' : 'En cours'}</span>
                </td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '16px' }}>
                  <Link href={`/admin/residences/${r.id}/edit`} style={{ fontSize: '12px', color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>Modifier</Link>
                  <button onClick={() => handleDelete(r.id)} style={{ fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', padding: 0 }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
