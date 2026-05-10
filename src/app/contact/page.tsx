'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/language-context';
import { useSiteConfig } from '@/lib/site-config-context';

export default function ContactPage() {
  const { lang } = useLanguage();
  const { config } = useSiteConfig();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const input = (field: string): React.CSSProperties => ({
    width: '100%', padding: '14px 18px',
    border: focused === field ? '2px solid var(--teal)' : '1px solid var(--border)',
    borderRadius: '4px', fontSize: '15px',
    boxSizing: 'border-box', outline: 'none',
    transition: 'border 0.2s ease',
    background: 'var(--input-bg)', color: 'var(--text-1)',
    fontFamily: 'inherit',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const email   = config.contact.email   || 'contact@hamadat.dz';
  const phone   = config.contact.phone   || '+213 21 00 00 00';
  const address = config.contact.address || 'Alger, Algérie';

  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '160px', paddingBottom: '80px', paddingLeft: '60px', paddingRight: '60px', maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', animation: 'fadeUp 0.7s ease-out both' }}>
          {lang === 'ar' ? 'تواصل معنا' : 'Contact'}
        </p>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-1.5px', margin: 0, animation: 'fadeUp 0.7s ease-out 0.05s both' }}>
          {lang === 'ar' ? 'اتصل بنا' : 'Contactez-Nous'}
        </h1>
      </section>

      {/* Content */}
      <section style={{ background: 'var(--bg-card)', padding: '80px 60px 120px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'start' }}>

          {/* Form */}
          <div style={{ animation: 'fadeUp 0.7s ease-out 0.1s both' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '300', color: 'var(--text-1)', marginBottom: '36px', letterSpacing: '-0.3px' }}>
              {lang === 'ar' ? 'أرسل لنا رسالة' : 'Envoyez-nous un message'}
            </h2>

            {sent && (
              <div style={{
                background: 'rgba(14,116,112,0.08)', border: '1px solid rgba(14,116,112,0.25)',
                borderRadius: '4px', padding: '16px 20px', marginBottom: '28px',
                fontSize: '14px', color: 'var(--teal)', fontWeight: '500',
              }}>
                {lang === 'ar' ? '✓ تم إرسال رسالتك بنجاح!' : '✓ Votre message a bien été envoyé !'}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                </label>
                <input type="text" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                  style={input('name')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Email</label>
                  <input type="email" value={form.email} required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    style={input('email')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'الهاتف' : 'Téléphone'}
                  </label>
                  <input type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                    style={input('phone')} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? 'الرسالة' : 'Message'}
                </label>
                <textarea value={form.message} required
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                  style={{ ...input('message'), minHeight: '160px', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{
                alignSelf: 'flex-start',
                background: 'var(--teal)', color: '#fff',
                padding: '14px 40px', borderRadius: '4px',
                fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px',
                border: 'none', cursor: 'pointer',
                textTransform: 'uppercase', transition: 'background 0.25s ease',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--teal-dk)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--teal)'; }}
              >
                {lang === 'ar' ? 'إرسال' : 'Envoyer'}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div style={{ animation: 'fadeUp 0.7s ease-out 0.18s both' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '300', color: 'var(--text-1)', marginBottom: '40px', letterSpacing: '-0.3px' }}>
              {lang === 'ar' ? 'معلومات التواصل' : 'Nos Coordonnées'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
              {[
                { label: 'Email',                                          value: email,   href: `mailto:${email}` },
                { label: lang === 'ar' ? 'الهاتف' : 'Téléphone',          value: phone,   href: `tel:${phone.replace(/\s/g, '')}` },
                { label: lang === 'ar' ? 'العنوان' : 'Adresse',            value: address },
              ].map((item) => (
                <div key={item.label} style={{ borderLeft: '3px solid var(--teal)', paddingLeft: '20px' }}>
                  <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: '16px', color: 'var(--text-1)', textDecoration: 'none', fontWeight: '400', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--teal)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ fontSize: '16px', color: 'var(--text-1)', margin: 0 }}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
