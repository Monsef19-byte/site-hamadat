'use client';

import { useState } from 'react';
import { useSiteConfig } from '@/lib/site-config-context';

export default function AdminContactPage() {
  const { config, updateConfig } = useSiteConfig();

  const [contact, setContact] = useState({ ...config.contact });
  const [social, setSocial] = useState({ ...config.social });
  const [savedContact, setSavedContact] = useState(false);
  const [savedSocial, setSavedSocial] = useState(false);

  const fieldBase: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    border: '1px solid var(--border)', borderRadius: '4px',
    fontSize: '14px', color: 'var(--text-1)', background: 'var(--input-bg)',
    boxSizing: 'border-box', fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.2s',
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
      {children}
    </label>
  );

  const saveContact = () => {
    updateConfig({ contact });
    setSavedContact(true);
    setTimeout(() => setSavedContact(false), 3000);
  };

  const saveSocial = () => {
    updateConfig({ social });
    setSavedSocial(true);
    setTimeout(() => setSavedSocial(false), 3000);
  };

  const SaveBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        marginTop: '20px', padding: '12px 32px',
        background: '#0e7470', color: '#fff',
        border: 'none', borderRadius: '4px',
        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        letterSpacing: '0.5px', textTransform: 'uppercase',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}
    >
      Enregistrer
    </button>
  );

  const SuccessBanner = ({ show }: { show: boolean }) => show ? (
    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#059669', fontWeight: '500' }}>
      ✓ Enregistré avec succès.
    </div>
  ) : null;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#0e7470', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration · Contact
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
          Paramètres Contact
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Card 1: Coordonnées */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            Coordonnées
          </h2>
          <SuccessBanner show={savedContact} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <Label>Email</Label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                style={fieldBase}
                placeholder="contact@hamadat.dz"
              />
            </div>
            <div>
              <Label>Téléphone</Label>
              <input
                type="text"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                style={fieldBase}
                placeholder="+213 21 00 00 00"
              />
            </div>
            <div>
              <Label>Adresse</Label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                style={fieldBase}
                placeholder="Alger, Algérie"
              />
            </div>
          </div>
          <SaveBtn onClick={saveContact} />
        </div>

        {/* Card 2: Réseaux sociaux */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            Réseaux sociaux
          </h2>
          <SuccessBanner show={savedSocial} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <Label>Instagram</Label>
              <input
                type="url"
                value={social.instagram}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                style={fieldBase}
                placeholder="https://instagram.com/hamadat"
              />
            </div>
            <div>
              <Label>Facebook</Label>
              <input
                type="url"
                value={social.facebook}
                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                style={fieldBase}
                placeholder="https://facebook.com/hamadat"
              />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <input
                type="url"
                value={social.linkedin}
                onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
                style={fieldBase}
                placeholder="https://linkedin.com/company/hamadat"
              />
            </div>
            <div>
              <Label>YouTube</Label>
              <input
                type="url"
                value={social.youtube}
                onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                style={fieldBase}
                placeholder="https://youtube.com/@hamadat"
              />
            </div>
          </div>
          <SaveBtn onClick={saveSocial} />
        </div>

      </div>
    </div>
  );
}
