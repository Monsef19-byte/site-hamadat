'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';

const NAV = [
  { href: '/admin',            label: 'Tableau de bord', icon: 'dashboard' },
  { href: '/admin/residences', label: 'Résidences',       icon: 'building' },
  { href: '/admin/blog',       label: 'Blog',             icon: 'pencil' },
  { href: '/admin/homepage',   label: 'Accueil',          icon: 'home' },
  { href: '/admin/apropos',    label: 'À Propos',         icon: 'info' },
  { href: '/admin/contact',    label: 'Contact',          icon: 'mail' },
];

const AdminIcon = ({ name }: { name: string }) => {
  const s = { width: 15, height: 15, fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'dashboard': return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case 'building':  return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="4" width="18" height="17" rx="1"/><path d="M9 21V9h6v12"/><path d="M3 9h18"/></svg>;
    case 'pencil':    return <svg viewBox="0 0 24 24" {...s}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case 'home':      return <svg viewBox="0 0 24 24" {...s}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'info':      return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8.5"/><line x1="12" y1="11" x2="12" y2="16"/></svg>;
    case 'mail':      return <svg viewBox="0 0 24 24" {...s}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 4 12 13 22 4"/></svg>;
    default:          return null;
  }
};

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.5"/>
    <line x1="12" y1="2"    x2="12" y2="4.5"/>
    <line x1="12" y1="19.5" x2="12" y2="22"/>
    <line x1="2"  y1="12"   x2="4.5" y2="12"/>
    <line x1="19.5" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="4.93"  x2="6.7"  y2="6.7"/>
    <line x1="17.3" y1="17.3"  x2="19.07" y2="19.07"/>
    <line x1="4.93" y1="19.07" x2="6.7"  y2="17.3"/>
    <line x1="17.3" y1="6.7"   x2="19.07" y2="4.93"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    document.cookie = 'admin-auth-token=; path=/; max-age=0';
    document.cookie = 'admin-verified=; path=/; max-age=0';
    router.push('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', fontFamily: 'inherit' }}>

      {/* ── Sidebar ── always dark #1c1917 */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: '#1c1917',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '32px 24px 24px', borderBottom: '1px solid #2c2826' }}>
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <Image
              src="/images/logo/logo-horizontal-white.png"
              alt="Hamadat"
              width={140} height={38}
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>
          <p style={{ fontSize: '10px', color: '#6b6560', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '8px', marginBottom: 0 }}>
            Administration
          </p>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
          {NAV.map(({ href, label, icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 24px',
                textDecoration: 'none',
                fontSize: '13px', fontWeight: active ? '600' : '400',
                color: active ? '#fff' : '#78716c',
                background: active ? 'rgba(14,116,112,0.2)' : 'transparent',
                borderLeft: active ? '3px solid #0e7470' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}>
                <span style={{ opacity: active ? 1 : 0.6, display: 'flex', alignItems: 'center' }}><AdminIcon name={icon} /></span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #2c2826' }}>
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: '100%', padding: '9px 16px',
              background: 'transparent', border: '1px solid #3c3330',
              borderRadius: '4px', color: '#78716c',
              fontSize: '12px', fontWeight: '500', cursor: 'pointer',
              letterSpacing: '0.3px',
              transition: 'all 0.15s ease', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '10px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#0e7470';
              (e.currentTarget as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#3c3330';
              (e.currentTarget as HTMLElement).style.color = '#78716c';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{isDark ? <SunIcon /> : <MoonIcon />}</span>
            <span>{isDark ? 'Mode clair' : 'Mode sombre'}</span>
          </button>

          <Link href="/" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', color: '#6b6560', textDecoration: 'none', marginBottom: '12px',
            transition: 'color 0.15s',
          }}>
            <span>↗</span> Voir le site
          </Link>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px 16px',
            background: 'transparent', border: '1px solid #3c3330',
            borderRadius: '4px', color: '#78716c',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            letterSpacing: '0.5px', textTransform: 'uppercase',
            transition: 'all 0.15s ease', textAlign: 'left',
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#dc2626';
              (e.currentTarget as HTMLElement).style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#3c3330';
              (e.currentTarget as HTMLElement).style.color = '#78716c';
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
