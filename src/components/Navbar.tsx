'use client';

import { useState, useEffect, useRef } from 'react';
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
    <line x1="12" y1="2" x2="12" y2="4.5" /><line x1="12" y1="19.5" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4.5" y2="12" /><line x1="19.5" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" /><line x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" /><line x1="17.3" y1="6.7" x2="19.07" y2="4.93" />
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
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  const isDark = theme === 'dark';
  const isHome = pathname === '/';
  // On homepage the hero is always dark, so use white text when not scrolled.
  // On other pages the background is light (in light mode), so use dark text.
  const heroDark = isHome || isDark;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > 300 && y > lastScroll.current);
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'var(--nav-bg)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
      transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
    }}>
      <div style={{
        maxWidth: '1320px', margin: '0 auto',
        padding: scrolled ? '0 40px' : '0 48px',
        height: scrolled ? '64px' : '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }} className="nav-inner">

        {/* Logo */}
        <Link href="/" className="nav-logo" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Image
            src={!scrolled && heroDark ? '/images/logo/logo-horizontal-white.png' : (isDark ? '/images/logo/logo-horizontal-white.png' : '/images/logo/logo-horizontal-color.png')}
            alt="Hamadat"
            width={160}
            height={42}
            style={{
              height: scrolled ? '34px' : '38px',
              width: 'auto', objectFit: 'contain',
              transition: 'height 0.4s ease',
            }}
            priority
          />
        </Link>

        {/* Nav links */}
        <nav className="nav-desktop" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {NAV.map((item, idx) => {
            const active = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item-${idx} nav-link-anim${active ? ' active' : ''}`}
                data-cursor
                style={{
                  fontSize: '13px',
                  fontWeight: active ? '600' : '400',
                  color: scrolled
                    ? (active ? 'var(--teal)' : 'var(--text-1)')
                    : heroDark
                      ? (active ? '#fff' : 'rgba(255,255,255,0.7)')
                      : (active ? 'var(--teal)' : 'var(--text-1)'),
                  textDecoration: 'none',
                  letterSpacing: '0.3px',
                  position: 'relative',
                  paddingBottom: '4px',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = scrolled ? 'var(--teal)' : (heroDark ? '#fff' : 'var(--teal)'); }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = scrolled ? 'var(--text-1)' : (heroDark ? 'rgba(255,255,255,0.7)' : 'var(--text-1)'); }}
              >
                {lang === 'ar' ? item.ar : item.fr}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            data-cursor
            style={{
              background: 'none',
              border: `1px solid ${scrolled || !heroDark ? 'var(--border)' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '6px', padding: '5px 12px',
              fontSize: '12px', fontWeight: '600',
              color: scrolled || !heroDark ? 'var(--text-1)' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer', letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--teal)';
              el.style.color = 'var(--teal)';
              el.style.background = 'rgba(14,116,112,0.1)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = scrolled || !heroDark ? 'var(--border)' : 'rgba(255,255,255,0.2)';
              el.style.color = scrolled || !heroDark ? 'var(--text-1)' : 'rgba(255,255,255,0.8)';
              el.style.background = 'none';
            }}
          >
            {lang === 'fr' ? 'عربي' : 'FR'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
            data-cursor
            style={{
              background: 'none',
              border: `1px solid ${scrolled || !heroDark ? 'var(--border)' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '6px', padding: '6px 9px',
              cursor: 'pointer', transition: 'all 0.3s ease',
              color: scrolled || !heroDark ? 'var(--text-1)' : 'rgba(255,255,255,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--teal)';
              el.style.color = 'var(--teal)';
              el.style.background = 'rgba(14,116,112,0.1)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = scrolled || !heroDark ? 'var(--border)' : 'rgba(255,255,255,0.2)';
              el.style.color = scrolled || !heroDark ? 'var(--text-1)' : 'rgba(255,255,255,0.8)';
              el.style.background = 'none';
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* CTA */}
          <Link
            href="/contact"
            className="nav-cta btn-shine"
            data-cursor
            style={{
              background: 'var(--teal)',
              color: '#fff',
              padding: '9px 24px', borderRadius: '6px',
              fontSize: '12px', fontWeight: '600',
              textDecoration: 'none', letterSpacing: '0.5px',
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(14,116,112,0.3)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#0a5450';
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 8px 32px rgba(14,116,112,0.4)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--teal)';
              el.style.transform = 'none';
              el.style.boxShadow = '0 4px 20px rgba(14,116,112,0.3)';
            }}
          >
            {lang === 'ar' ? 'تواصل معنا' : 'Nous contacter'}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'none' }}
            aria-label="Menu"
            className="ham-btn"
            data-cursor
          >
            <div style={{ width: '22px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  display: 'block', height: '2px',
                  background: scrolled || !heroDark ? 'var(--text-1)' : '#fff',
                  borderRadius: '1px',
                  transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                  transform: open
                    ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                    : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                    : 'scaleX(0)'
                    : 'none',
                  width: i === 1 && !open ? '16px' : '22px',
                }} />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        padding: open ? '24px 40px 32px' : '0 40px',
        maxHeight: open ? '400px' : '0',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: open ? 1 : 0,
      }}>
        {NAV.map((item, idx) => (
          <Link key={item.path} href={item.path} style={{
            display: 'block', padding: '14px 0',
            borderBottom: '1px solid var(--border-sub)',
            fontSize: '16px', fontWeight: '400',
            color: pathname === item.path ? 'var(--teal)' : 'var(--text-1)',
            textDecoration: 'none',
            transform: open ? 'translateX(0)' : 'translateX(-20px)',
            opacity: open ? 1 : 0,
            transition: `all 0.4s cubic-bezier(0.22,1,0.36,1) ${idx * 0.05}s`,
          }}
            onClick={() => setOpen(false)}
          >
            {lang === 'ar' ? item.ar : item.fr}
          </Link>
        ))}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', color: 'var(--text-1)', cursor: 'pointer' }}>
            {lang === 'fr' ? 'عربي' : 'FR'}
          </button>
          <button onClick={toggleTheme} aria-label="Thème" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 10px', cursor: 'pointer', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
