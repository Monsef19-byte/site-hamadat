'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer style={{ background: 'var(--bg-footer)', color: 'var(--text-3)', fontFamily: 'inherit' }}>
      <div className="footer-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 60px 48px' }}>

        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '56px',
          paddingBottom: '56px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '36px',
        }}>

          {/* Brand */}
          <div>
            <Image
              src="/images/logo/logo-horizontal-white.png"
              alt="Hamadat"
              width={180}
              height={48}
              style={{ height: '40px', width: 'auto', objectFit: 'contain', marginBottom: '20px' }}
            />
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: '1.8', maxWidth: '220px', fontStyle: 'italic' }}>
              {lang === 'ar' ? 'حيث يتحقق حلمك السكني' : 'La où le rêve prend toit.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
              {lang === 'ar' ? 'الشركة' : 'Navigation'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { fr: 'Accueil',     ar: 'الرئيسية', path: '/' },
                { fr: 'Nos Projets', ar: 'المشاريع', path: '/projets' },
                { fr: 'À Propos',    ar: 'عن الشركة', path: '/apropos' },
                { fr: 'Blog',        ar: 'المدونة',  path: '/blog' },
                { fr: 'Contact',     ar: 'تواصل',    path: '/contact' },
              ].map(l => (
                <li key={l.path} style={{ marginBottom: '12px' }}>
                  <Link href={l.path} style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                  >
                    {lang === 'ar' ? l.ar : l.fr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
              {lang === 'ar' ? 'مشاريعنا' : 'Nos Projets'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { slug: 'elysia',        label: 'Elysia' },
                { slug: 'les-3-princes', label: 'Les 3 Princes' },
                { slug: 'orea',          label: 'Orea' },
                { slug: 'lumalac',       label: 'Lumalac' },
                { slug: 'marmo',         label: 'Marmo' },
                { slug: 'vertdalya',     label: 'Vert Dalya' },
              ].map(p => (
                <li key={p.slug} style={{ marginBottom: '10px' }}>
                  <Link href={`/projets/${p.slug}`} style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
              {lang === 'ar' ? 'اتصل بنا' : 'Contact'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="mailto:contact@hamadat.dz" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  contact@hamadat.dz
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="tel:+21321000000" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  +213 21 00 00 00
                </a>
              </li>
              <li>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>Alger, Algérie</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            © {new Date().getFullYear()} Hamadat Promotion Immobilière.{' '}
            {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
          </p>
          <Link href="/contact" style={{ fontSize: '12px', color: 'var(--teal)', textDecoration: 'none', fontWeight: '600', letterSpacing: '0.5px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal-dk)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
          >
            {lang === 'ar' ? '← تواصل معنا' : 'Nous contacter →'}
          </Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .footer-inner { padding: 48px 24px 36px !important; }
        }
      `}</style>
    </footer>
  );
}
