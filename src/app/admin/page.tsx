'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSiteConfig } from '@/lib/site-config-context';

function AnimCounter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const dur = 1400, step = 16, steps = dur / step;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVal(Math.round((1 - Math.pow(1 - i / steps, 3)) * target));
      if (i >= steps) clearInterval(t);
    }, step);
    return () => clearInterval(t);
  }, [target]);
  return <span ref={ref}>{val}</span>;
}

const QUICK_LINKS = [
  { href: '/admin/residences/new', label: 'Ajouter une résidence', icon: '＋', desc: 'Créer un nouveau projet' },
  { href: '/admin/homepage', label: "Gérer l'accueil", icon: '◎', desc: 'Médias, vidéos et hero' },
  { href: '/admin/apropos', label: 'Page À Propos', icon: '◇', desc: "Modifier l'histoire et les valeurs" },
  { href: '/admin/contact', label: 'Coordonnées', icon: '✉', desc: 'Mettre à jour les contacts' },
  { href: '/admin/blog', label: 'Articles Blog', icon: '◆', desc: 'Gérer les publications' },
];

export default function AdminDashboard() {
  const { config } = useSiteConfig();
  const residences = config.residenceList ?? [];

  const STATS = [
    { label: 'Projets', value: residences.length, color: '#0e7470', gradient: 'linear-gradient(135deg, rgba(14,116,112,0.15), rgba(14,116,112,0.05))' },
    { label: 'En cours', value: residences.filter(r => r.status === 'ongoing').length, color: '#2dd4bf', gradient: 'linear-gradient(135deg, rgba(45,212,191,0.12), rgba(45,212,191,0.04))' },
    { label: 'Livrés', value: residences.filter(r => r.status === 'completed').length, color: '#4ade80', gradient: 'linear-gradient(135deg, rgba(74,222,128,0.12), rgba(74,222,128,0.04))' },
    { label: 'Unités totales', value: residences.reduce((s, r) => s + r.units, 0), color: '#a78bfa', gradient: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.04))' },
  ];

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '40px 48px', position: 'relative' }}>

      {/* Header */}
      <div className="dash-animate-in dash-delay-1" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Administration
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
              Tableau de bord
            </h1>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-4)', textTransform: 'capitalize' }}>{today}</span>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {STATS.map((s, i) => (
          <div key={i} className={`dash-stat-card dash-animate-in dash-delay-${i + 2}`}>
            <div style={{
              position: 'absolute', top: '16px', right: '16px',
              width: '40px', height: '40px', borderRadius: '10px',
              background: s.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', color: s.color, fontWeight: '700',
            }}>
              {s.value > 0 ? '↗' : '—'}
            </div>
            <div style={{
              fontSize: '48px', fontWeight: '100', color: 'var(--text-1)',
              lineHeight: 1, letterSpacing: '-3px', marginBottom: '10px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              <AnimCounter target={s.value} />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', margin: 0, fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>

        {/* Residences table */}
        <div className="dash-glass dash-animate-in dash-delay-4" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-1)', margin: 0 }}>
              Résidences
            </h2>
            <Link href="/admin/residences/new" style={{
              background: 'linear-gradient(135deg, #0e7470, #0a5450)',
              color: '#fff', padding: '8px 20px', borderRadius: '8px',
              fontSize: '12px', fontWeight: '600', textDecoration: 'none',
              letterSpacing: '0.3px', transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(14,116,112,0.25)',
            }}>
              + Ajouter
            </Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Nom', 'Localisation', 'Unités', 'Statut', ''].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left',
                    fontSize: '10px', fontWeight: '700', color: 'var(--text-4)',
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {residences.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-4)', fontSize: '13px' }}>
                    Aucune résidence.{' '}
                    <Link href="/admin/residences/new" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>
                      Ajouter la première →
                    </Link>
                  </td>
                </tr>
              ) : residences.map((r) => (
                <tr key={r.id} className="dash-table-row" style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '500', color: 'var(--text-1)' }}>{r.name_fr}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-3)' }}>{r.location}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>{r.units}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 12px',
                      borderRadius: '4px', fontSize: '9px', fontWeight: '700',
                      letterSpacing: '1px', textTransform: 'uppercase',
                      background: r.status === 'completed' ? 'rgba(16,185,129,0.12)' : r.status === 'sold' ? 'rgba(99,102,241,0.12)' : 'rgba(14,116,112,0.12)',
                      color: r.status === 'completed' ? '#059669' : r.status === 'sold' ? '#6366f1' : '#0e7470',
                      border: `1px solid ${r.status === 'completed' ? 'rgba(16,185,129,0.25)' : r.status === 'sold' ? 'rgba(99,102,241,0.25)' : 'rgba(14,116,112,0.25)'}`,
                    }}>
                      {r.status === 'completed' ? 'Livré' : r.status === 'sold' ? 'Vendu' : 'En cours'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/admin/residences/${r.id}/edit`} style={{
                      fontSize: '12px', color: 'var(--teal)', textDecoration: 'none', fontWeight: '600',
                    }}>
                      Modifier →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {residences.length > 0 && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
              <Link href="/admin/residences" style={{ fontSize: '12px', color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>
                Gérer toutes les résidences →
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="dash-glass dash-animate-in dash-delay-5" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-1)', margin: 0 }}>
              Accès rapides
            </h2>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {QUICK_LINKS.map(({ href, label, icon, desc }) => (
              <Link key={href} href={href} className="dash-quick-link" style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 16px', borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'transparent',
                textDecoration: 'none',
                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}>
                <span style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(14,116,112,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', color: 'var(--teal)', flexShrink: 0,
                }}>{icon}</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-1)', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-3)', margin: '2px 0 0' }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Activity placeholder */}
      <div className="dash-glass dash-animate-in dash-delay-6" style={{ marginTop: '24px', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-4)', fontStyle: 'italic', margin: 0 }}>
          Activité récente — Connectez Supabase pour voir les données en temps réel
        </p>
      </div>
    </div>
  );
}
