'use client';

import Link from 'next/link';
import { useSiteConfig } from '@/lib/site-config-context';

export default function AdminDashboard() {
  const { config } = useSiteConfig();
  const residences = config.residenceList ?? [];

  const STATS = [
    { label: 'Projets',        value: residences.length },
    { label: 'En cours',       value: residences.filter(r => r.status === 'ongoing').length },
    { label: 'Livrés',         value: residences.filter(r => r.status === 'completed').length },
    { label: 'Unités totales', value: residences.reduce((s, r) => s + r.units, 0) },
  ];

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ background: '#f7f7f5', minHeight: '100vh', padding: '40px 48px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#0e7470', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#2a2826', letterSpacing: '-0.5px', margin: 0 }}>
            Tableau de bord
          </h1>
          <span style={{ fontSize: '12px', color: '#b8b0a8', textTransform: 'capitalize' }}>{today}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '40px' }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            background: '#fff',
            padding: '32px 28px',
            borderRight: i < 3 ? '1px solid #e8e8e6' : 'none',
          }}>
            <div style={{ fontSize: '48px', fontWeight: '200', color: '#9a9590', lineHeight: 1, letterSpacing: '-2px', marginBottom: '8px' }}>
              {s.value}
            </div>
            <p style={{ fontSize: '11px', color: '#b8b0a8', margin: 0, fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Résidences table */}
        <div style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #e8e8e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#2a2826', margin: 0, letterSpacing: '0.3px' }}>
              Résidences
            </h2>
            <Link href="/admin/residences/new" style={{
              background: '#0e7470', color: '#fff',
              padding: '8px 18px', borderRadius: '3px',
              fontSize: '12px', fontWeight: '600', textDecoration: 'none',
              letterSpacing: '0.3px', transition: 'background 0.2s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}
            >
              + Ajouter
            </Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f8' }}>
                {['Nom', 'Unités', 'Statut', ''].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: '#b8b0a8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {residences.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '32px 20px', textAlign: 'center', color: '#b8b0a8', fontSize: '13px' }}>
                    Aucune résidence.{' '}
                    <Link href="/admin/residences/new" style={{ color: '#0e7470', textDecoration: 'none', fontWeight: '600' }}>
                      Ajouter la première →
                    </Link>
                  </td>
                </tr>
              ) : residences.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid #f7f7f5' }}>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '500', color: '#2a2826' }}>{r.name_fr}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: '#6b6560' }}>{r.units}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '2px',
                      fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                      background: r.status === 'completed' ? 'rgba(16,185,129,0.1)' : r.status === 'sold' ? 'rgba(99,102,241,0.1)' : 'rgba(14,116,112,0.1)',
                      color: r.status === 'completed' ? '#059669' : r.status === 'sold' ? '#6366f1' : '#0e7470',
                    }}>
                      {r.status === 'completed' ? 'Livré' : r.status === 'sold' ? 'Vendu' : 'En cours'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/admin/residences/${r.id}/edit`} style={{ fontSize: '12px', color: '#0e7470', textDecoration: 'none', fontWeight: '600' }}>
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e8e8e6', textAlign: 'right' }}>
            <Link href="/admin/residences" style={{ fontSize: '12px', color: '#0e7470', textDecoration: 'none', fontWeight: '600' }}>
              Gérer les résidences →
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #e8e8e6' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#2a2826', margin: 0, letterSpacing: '0.3px' }}>
              Accès rapides
            </h2>
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: '/admin/residences/new', label: '+ Ajouter une résidence' },
              { href: '/admin/homepage',       label: 'Gérer l\'accueil (médias & vidéos)' },
              { href: '/admin/apropos',        label: 'Modifier la page À Propos' },
              { href: '/admin/contact',        label: 'Mettre à jour les coordonnées' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                display: 'block', padding: '12px 16px',
                border: '1px solid #e8e8e6', borderRadius: '4px',
                fontSize: '13px', color: '#2a2826', textDecoration: 'none',
                fontWeight: '500', transition: 'border-color 0.15s, color 0.15s',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#0e7470';
                  (e.currentTarget as HTMLElement).style.color = '#0e7470';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#e8e8e6';
                  (e.currentTarget as HTMLElement).style.color = '#2a2826';
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
