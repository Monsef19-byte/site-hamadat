'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

const SOCIAL_ICONS: Record<string, { label: string; svg: JSX.Element }> = {
  instagram: {
    label: 'Instagram',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  },
  facebook: {
    label: 'Facebook',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
  },
  linkedin: {
    label: 'LinkedIn',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
  },
  youtube: {
    label: 'YouTube',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>,
  },
  tiktok: {
    label: 'TikTok',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /></svg>,
  },
  twitter: {
    label: 'X / Twitter',
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16H20L8.267 4H4z" /><path d="M4 20l6.768-6.768M20 4l-6.768 6.768" /></svg>,
  },
};

export default function ContactPage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let raf = 0;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.batch('.ct-reveal', {
        onEnter: (els) => {
          gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06 });
        },
        start: 'top 90%',
        once: true,
      });
    };
    raf = requestAnimationFrame(() => init());
    return () => { cancelAnimationFrame(raf); import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.getAll().forEach(t => t.kill())); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const email = config.contact.email || 'contact@hamadat.dz';
  const phone = config.contact.phone || '+213 21 00 00 00';
  const address = config.contact.address || 'Alger, Algérie';
  const mapEmbed = config.contact.mapEmbed || '';

  // Collect active social links
  const socialLinks = Object.entries(config.social)
    .filter(([, url]) => url && url.trim())
    .map(([key, url]) => ({ key, url, ...(SOCIAL_ICONS[key] || { label: key, svg: null }) }));

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '16px 20px',
    border: '1px solid var(--border)', borderRadius: '10px',
    fontSize: '15px', boxSizing: 'border-box', outline: 'none',
    background: 'var(--input-bg)', color: 'var(--text-1)',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };
  const inputFocused = (field: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: focused === field ? 'var(--teal)' : 'var(--border)',
    boxShadow: focused === field ? '0 0 0 3px rgba(14,116,112,0.12)' : 'none',
  });

  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        paddingTop: '160px', paddingBottom: '80px',
        paddingLeft: '60px', paddingRight: '60px',
        maxWidth: '1320px', margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)',
          fontSize: 'clamp(100px, 18vw, 240px)', fontWeight: '700',
          color: 'var(--border)', opacity: 0.3, letterSpacing: '-0.04em',
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          CONTACT
        </div>
        <p className="eyebrow" style={{ marginBottom: '20px', animation: 'fadeUp 0.7s ease-out both' }}>
          {lang === 'ar' ? 'تواصل معنا' : 'Contact'}
        </p>
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '200',
          color: 'var(--text-1)', letterSpacing: '-1.5px', margin: 0,
          animation: 'fadeUp 0.7s ease-out 0.05s both',
        }}>
          {lang === 'ar' ? 'اتصل بنا' : <>Contactez-<em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Nous</em></>}
        </h1>
      </section>

      {/* Content */}
      <section style={{ background: 'var(--bg-card)', padding: '100px 60px 120px', borderTop: '1px solid var(--border)' }}>
        <div className="contact-grid" style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '120px', alignItems: 'start' }}>

          {/* Form */}
          <div>
            <h2 className="ct-reveal" style={{ fontSize: '28px', fontWeight: '200', color: 'var(--text-1)', marginBottom: '12px', letterSpacing: '-0.3px' }}>
              {lang === 'ar' ? 'أرسل لنا رسالة' : <>Envoyez-nous un <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>message</em></>}
            </h2>
            <p className="ct-reveal" style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '40px', lineHeight: 1.7 }}>
              {lang === 'ar' ? 'نسعد بالتواصل معكم' : 'Nous serons ravis de vous répondre dans les plus brefs délais.'}
            </p>

            {sent && (
              <div style={{
                background: 'rgba(14,116,112,0.06)', border: '1px solid rgba(14,116,112,0.2)',
                borderRadius: '10px', padding: '18px 24px', marginBottom: '28px',
                fontSize: '14px', color: 'var(--teal)', fontWeight: '500',
                animation: 'fadeUp 0.4s ease both',
              }}>
                {lang === 'ar' ? '✓ تم إرسال رسالتك بنجاح!' : '✓ Votre message a bien été envoyé !'}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="ct-reveal">
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', marginBottom: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                </label>
                <input type="text" value={form.name} required placeholder=" "
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                  style={inputFocused('name')} />
              </div>
              <div className="form-row ct-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', marginBottom: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Email</label>
                  <input type="email" value={form.email} required placeholder=" "
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    style={inputFocused('email')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', marginBottom: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'الهاتف' : 'Téléphone'}
                  </label>
                  <input type="tel" value={form.phone} placeholder=" "
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                    style={inputFocused('phone')} />
                </div>
              </div>
              <div className="ct-reveal">
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', marginBottom: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? 'الرسالة' : 'Message'}
                </label>
                <textarea value={form.message} required placeholder=" "
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                  style={{ ...inputFocused('message'), minHeight: '180px', resize: 'vertical' }} />
              </div>
              <div className="ct-reveal">
                <button type="submit" data-cursor className="btn-shine" style={{
                  background: 'var(--teal)', color: '#fff',
                  padding: '16px 44px', borderRadius: '8px',
                  fontSize: '12px', fontWeight: '700', letterSpacing: '2px',
                  border: 'none', cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                  boxShadow: '0 6px 24px rgba(14,116,112,0.2)',
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 12px 40px rgba(14,116,112,0.35)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 6px 24px rgba(14,116,112,0.2)'; }}
                >
                  {lang === 'ar' ? 'إرسال' : 'Envoyer le message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact info */}
          <div>
            <h2 className="ct-reveal" style={{ fontSize: '28px', fontWeight: '200', color: 'var(--text-1)', marginBottom: '48px', letterSpacing: '-0.3px' }}>
              {lang === 'ar' ? 'معلومات التواصل' : <>Nos <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Coordonnées</em></>}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
              {[
                { icon: '✉', label: 'Email', value: email, href: `mailto:${email}` },
                { icon: '☎', label: lang === 'ar' ? 'الهاتف' : 'Téléphone', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
                { icon: '◎', label: lang === 'ar' ? 'العنوان' : 'Adresse', value: address },
              ].map((item) => (
                <div key={item.label} className="ct-reveal" style={{
                  borderLeft: '2px solid var(--teal)', paddingLeft: '24px',
                  transition: 'all 0.3s ease',
                }}>
                  <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 8px' }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} data-cursor style={{
                      fontSize: '17px', color: 'var(--text-1)', textDecoration: 'none', fontWeight: '300',
                      transition: 'color 0.3s',
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ fontSize: '17px', color: 'var(--text-1)', margin: 0, fontWeight: '300' }}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="ct-reveal" style={{ marginTop: '48px' }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>
                  {lang === 'ar' ? 'تابعونا' : 'Suivez-nous'}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {socialLinks.map(({ key, url, label, svg }) => (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" data-cursor
                      title={label}
                      style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-3)', textDecoration: 'none',
                        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                        background: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = 'var(--teal)';
                        el.style.color = '#fff';
                        el.style.borderColor = 'var(--teal)';
                        el.style.transform = 'translateY(-3px)';
                        el.style.boxShadow = '0 8px 24px rgba(14,116,112,0.25)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = 'transparent';
                        el.style.color = 'var(--text-3)';
                        el.style.borderColor = 'var(--border)';
                        el.style.transform = 'none';
                        el.style.boxShadow = 'none';
                      }}
                    >
                      {svg}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="ct-reveal" style={{
              marginTop: '48px', borderRadius: '16px', overflow: 'hidden',
              height: '240px', background: 'var(--bg-page)',
              border: '1px solid var(--border)',
            }}>
              {mapEmbed ? (
                <iframe src={mapEmbed} style={{ width: '100%', height: '100%', border: 'none' }} loading="lazy" allowFullScreen />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-4)', fontStyle: 'italic' }}>
                    {lang === 'ar' ? 'خريطة الموقع' : 'Carte interactive — bientôt disponible'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; gap: 64px !important; } }
        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
