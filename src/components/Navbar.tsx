'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';

const NAV = [
  { fr: 'Accueil',   ar: 'الرئيسية', path: '/' },
  { fr: 'Projets',   ar: 'المشاريع', path: '/projets' },
  { fr: 'À Propos',  ar: 'عن الشركة', path: '/apropos' },
  { fr: 'Blog',      ar: 'المدونة',  path: '/blog' },
  { fr: 'Contact',   ar: 'تواصل',    path: '/contact' },
];

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.5" />
    <line x1="12" y1="2"    x2="12" y2="4.5" />
    <line x1="12" y1="19.5" x2="12" y2="22" />
    <line x1="2"  y1="12"   x2="4.5" y2="12" />
    <line x1="19.5" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="6.7"  y2="6.7" />
    <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="6.7"  y2="17.3" />
    <line x1="17.3" y1="6.7"   x2="19.07" y2="4.93" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--nav-border)',
      backdropFilter: 'blur(12px)',
      transition: 'background 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 40px',
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }} className="nav-inner">

        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Image
            src={isDark ? '/images/logo/logo-horizontal-white.png' : '/images/logo/logo-horizontal-color.png'}
            alt="Hamadat"
            width={160}
            height={42}
            style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            priority
          />
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {NAV.map((item) => {
            const active = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  fontSize: '13px',
                  fontWeight: active ? '600' : '500',
                  color: active ? 'var(--teal)' : 'var(--text-1)',
                  textDecoration: 'none',
                  letterSpacing: '0.2px',
                  position: 'relative',
                  paddingBottom: '2px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
              >
                {lang === 'ar' ? item.ar : item.fr}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: '-4px', left: 0, right: 0,
                    height: '2px', background: 'var(--teal)', borderRadius: '1px',
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '5px 12px',
              fontSize: '12px', fontWeight: '600', color: 'var(--text-1)',
              cursor: 'pointer', letterSpacing: '0.5px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
          >
            {lang === 'fr' ? 'عربي' : 'FR'}
          </button>

          {/* Dark mode toggle — clean SVG icon */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '6px 9px',
              cursor: 'pointer', transition: 'all 0.2s ease',
              color: 'var(--text-1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* CTA */}
          <Link
            href="/contact"
            className="nav-cta"
            style={{
              background: 'var(--teal)', color: '#fff',
              padding: '9px 22px', borderRadius: '4px',
              fontSize: '13px', fontWeight: '600',
              textDecoration: 'none', letterSpacing: '0.3px',
              transition: 'background 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--teal-dk)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--teal)'; }}
          >
            {lang === 'ar' ? 'تواصل معنا' : 'Nous contacter'}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'none' }}
            aria-label="Menu"
            className="ham-btn"
          >
            <div style={{ width: '22px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  display: 'block', height: '2px', background: 'var(--text-1)', borderRadius: '1px',
                  transition: 'all 0.25s ease',
                  transform: open
                    ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                    : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                    : 'scaleX(0)'
                    : 'none',
                }} />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '20px 40px 28px' }}>
          {NAV.map((item) => (
            <Link key={item.path} href={item.path} style={{
              display: 'block', padding: '12px 0',
              borderBottom: '1px solid var(--border-sub)',
              fontSize: '15px', fontWeight: '500',
              color: pathname === item.path ? 'var(--teal)' : 'var(--text-1)',
              textDecoration: 'none',
            }}>
              {lang === 'ar' ? item.ar : item.fr}
            </Link>
          ))}
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', color: 'var(--text-1)', cursor: 'pointer' }}>
              {lang === 'fr' ? 'عربي' : 'FR'}
            </button>
            <button onClick={toggleTheme} aria-label="Thème" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px 10px', cursor: 'pointer', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .ham-btn { display: flex !important; }
          nav { display: none !important; }
        }
        @media (max-width: 600px) {
          .nav-inner { padding: 0 16px !important; }
          .nav-cta { display: none !important; }
        }
      `}</style>
    </header>
  );
}
