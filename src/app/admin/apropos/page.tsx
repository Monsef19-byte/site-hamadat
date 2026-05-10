'use client';

import { useState, useEffect } from 'react';
import { useSiteConfig } from '@/lib/site-config-context';

export default function AdminAProposPage() {
  const { config, updateConfig } = useSiteConfig();
  const [storyFr, setStoryFr] = useState(config.apropos.story_fr);
  const [storyAr, setStoryAr] = useState(config.apropos.story_ar);
  const [saved, setSaved] = useState(false);

  // Sync when config loads from localStorage after mount
  useEffect(() => {
    setStoryFr(config.apropos.story_fr);
    setStoryAr(config.apropos.story_ar);
  }, [config.apropos.story_fr, config.apropos.story_ar]);

  const handleSave = () => {
    updateConfig({ apropos: { story_fr: storyFr, story_ar: storyAr } });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const textareaBase: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    border: '1px solid var(--border)', borderRadius: '4px',
    fontSize: '14px', color: 'var(--text-1)', background: 'var(--input-bg)',
    boxSizing: 'border-box', fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.2s',
    minHeight: '200px', resize: 'vertical', lineHeight: '1.7',
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#0e7470', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration · À Propos
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
          Éditeur À Propos
        </h1>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '4px', padding: '14px 20px', marginBottom: '28px', fontSize: '14px', color: '#059669', fontWeight: '500' }}>
          ✓ Contenu enregistré avec succès.
        </div>
      )}

      {/* Card */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 24px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
          Histoire / القصة
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* French */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Histoire (Français)
            </label>
            <textarea
              value={storyFr}
              onChange={(e) => setStoryFr(e.target.value)}
              style={textareaBase}
              placeholder="Rédigez ici l'histoire de Hamadat en français…"
            />
          </div>
          {/* Arabic */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              القصة بالعربية
            </label>
            <textarea
              dir="rtl"
              value={storyAr}
              onChange={(e) => setStoryAr(e.target.value)}
              style={{ ...textareaBase, textAlign: 'right' }}
              placeholder="اكتب هنا قصة حمادة بالعربية…"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: '14px 40px', background: '#0e7470', color: '#fff',
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
    </div>
  );
}
