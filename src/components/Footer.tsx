'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { lang } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    let done = false;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done) {
        done = true;
        el.querySelectorAll<HTMLElement>('.ft-reveal').forEach((item, i) => {
          item.style.transitionDelay = `${i * 0.04}s`;
          item.classList.add('revealed');
        });
      }
    }, { threshold: 0.15 });

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { fr: 'Accueil',     ar: 'الرئيسية', path: '/' },
    { fr: 'Nos Projets', ar: 'المشاريع', path: '/projets' },
    { fr: 'À Propos',    ar: 'عن الشركة', path: '/apropos' },
    { fr: 'Blog',        ar: 'المدونة',  path: '/blog' },
    { fr: 'Contact',     ar: 'تواصل',    path: '/contact' },
  ];

  const projects = [
    { slug: 'elysia',        label: 'Elysia' },
    { slug: 'les-3-princes', label: 'Les 3 Princes' },
    { slug: 'orea',          label: 'Orea' },
    { slug: 'lumalac',       label: 'Lumalac' },
    { slug: 'marmo',         label: 'Marmo' },
    { slug: 'vertdalya',     label: 'Vert Dalya' },
  ];

  const linkStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.35)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.3s ease, transform 0.3s ease',
    display: 'inline-block',
  };

  return (
    <footer ref={footerRef} style={{
      background: '#06080a',
      color: 'rgba(255,255,255,0.4)',
      fontFamily: 'inherit',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient gradient */}
      <div style={{
        position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,116,112,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Big CTA strip */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '80px 60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '1320px', margin: '0 auto',
        flexWrap: 'wrap', gap: '32px',
      }}>
        <div className="ft-reveal" style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '200',
            color: '#fff', letterSpacing: '-1px', lineHeight: 1.2,
          }}>
            {lang === 'ar'
              ? <>{`ابدأ مشروعك `}<em style={{ color: 'rgba(14,116,112,0.7)', fontStyle: 'italic' }}>معنا</em></>
              : <>{`Lancez votre projet `}<em style={{ color: 'rgba(14,116,112,0.7)', fontStyle: 'italic' }}>avec nous</em></>
            }
          </h2>
        </div>
        <div className="ft-reveal" style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <Link href="/contact" data-cursor className="btn-shine" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'var(--teal, #0e7470)', color: '#fff',
            padding: '16px 40px', borderRadius: '6px',
            fontSize: '12px', fontWeight: '700', letterSpacing: '2.5px',
            textDecoration: 'none', textTransform: 'uppercase',
            transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 8px 32px rgba(14,116,112,0.3)',
            position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 16px 48px rgba(14,116,112,0.5)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 8px 32px rgba(14,116,112,0.3)'; }}
          >
            {lang === 'ar' ? 'تواصل معنا' : 'Contactez-nous'} <span style={{ fontSize: '16px' }}>→</span>
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="footer-inner" style={{ maxWidth: '1320px', margin: '0 auto', padding: '64px 60px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: '56px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '32px',
        }}>

          {/* Brand */}
          <div className="ft-reveal" style={{
            opacity: 0, transform: 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <Image
              src="/images/logo/logo-horizontal-white.png"
              alt="Hamadat"
              width={180} height={48}
              style={{ height: '36px', width: 'auto', objectFit: 'contain', marginBottom: '20px', opacity: 0.8 }}
            />
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)', lineHeight: '1.8', maxWidth: '260px', fontStyle: 'italic' }}>
              {lang === 'ar' ? 'حيث يتحقق حلمك السكني' : 'La où le rêve prend toit.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="ft-reveal" style={{
            opacity: 0, transform: 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <h4 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '24px' }}>
              {lang === 'ar' ? 'التنقل' : 'Navigation'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map(l => (
                <li key={l.path} style={{ marginBottom: '12px' }}>
                  <Link href={l.path} style={linkStyle}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0e7470'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                  >
                    {lang === 'ar' ? l.ar : l.fr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="ft-reveal" style={{
            opacity: 0, transform: 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <h4 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '24px' }}>
              {lang === 'ar' ? 'مشاريعنا' : 'Nos Projets'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {projects.map(p => (
                <li key={p.slug} style={{ marginBottom: '10px' }}>
                  <Link href={`/projets/${p.slug}`} style={linkStyle}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0e7470'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="ft-reveal" style={{
            opacity: 0, transform: 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <h4 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '24px' }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '14px' }}>
                <a href="mailto:contact@hamadat.dz" style={linkStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0e7470'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  contact@hamadat.dz
                </a>
              </li>
              <li style={{ marginBottom: '14px' }}>
                <a href="tel:+21321000000" style={linkStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0e7470'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  +213 21 00 00 00
                </a>
              </li>
              <li><span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>Alger, Algérie</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)', margin: 0 }}>
            © {new Date().getFullYear()} Hamadat Promotion Immobilière.{' '}
            {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.1)', letterSpacing: '1px' }}>
              DESIGN BY HAMADAT
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .ft-reveal.revealed { opacity: 1 !important; transform: translateY(0) !important; }
        @media (max-width: 900px) {
          .footer-inner > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-inner { padding: 48px 24px 36px !important; }
          .footer-inner > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
