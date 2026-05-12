'use client';

import Link from 'next/link';
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
  const s = { width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
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
    <div className="dash-container" style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '260px', flexShrink: 0,
        background: 'var(--dash-sidebar-bg, #0d0d0c)',
        borderRight: '1px solid var(--dash-sidebar-border, rgba(255,255,255,0.06))',
        padding: '32px 20px',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div className="dash-animate-in dash-delay-1" style={{ marginBottom: '48px', paddingLeft: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0e7470, #0a5450)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: '14px',
              boxShadow: '0 4px 16px rgba(14,116,112,0.3)',
            }}>H</div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--dash-text-1, #fff)', margin: 0, letterSpacing: '-0.3px' }}>Hamadat</p>
              <p style={{ fontSize: '10px', color: 'var(--dash-text-3, rgba(255,255,255,0.3))', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Administration</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {NAV.map(({ href, label, icon }, idx) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`dash-sidebar-link dash-animate-in dash-delay-${Math.min(idx + 2, 6)}${active ? ' active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <span style={{ opacity: active ? 1 : 0.5, display: 'flex', alignItems: 'center' }}><AdminIcon name={icon} /></span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="dash-animate-in dash-delay-6" style={{ paddingLeft: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={toggleTheme}
            style={{
              width: '100%', padding: '10px 18px',
              background: 'transparent',
              border: '1px solid var(--dash-sidebar-border, rgba(255,255,255,0.08))',
              borderRadius: '8px',
              color: 'var(--dash-text-2, rgba(255,255,255,0.4))',
              fontSize: '12px', fontWeight: '500', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{isDark ? <SunIcon /> : <MoonIcon />}</span>
            <span>{isDark ? 'Mode clair' : 'Mode sombre'}</span>
          </button>

          <Link href="/" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px',
            fontSize: '12px', color: 'var(--dash-text-2, rgba(255,255,255,0.4))', textDecoration: 'none',
            transition: 'color 0.15s',
          }}>
            <span>↗</span> Voir le site
          </Link>

          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px 18px',
            background: 'transparent',
            border: '1px solid var(--dash-sidebar-border, rgba(255,255,255,0.08))',
            borderRadius: '8px',
            color: 'var(--dash-text-2, rgba(255,255,255,0.4))',
            fontSize: '11px', fontWeight: '600', cursor: 'pointer',
            letterSpacing: '1px', textTransform: 'uppercase',
            transition: 'all 0.2s ease', textAlign: 'left',
          }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ marginLeft: '260px', flex: 1, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
