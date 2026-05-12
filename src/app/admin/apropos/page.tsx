'use client';

import { useState, useEffect } from 'react';
import { useSiteConfig } from '@/lib/site-config-context';

export default function AdminAProposPage() {
  const { config, updateConfig } = useSiteConfig();

  const [storyFr, setStoryFr] = useState(config.apropos.story_fr);
  const [storyAr, setStoryAr] = useState(config.apropos.story_ar);
  const [missionFr, setMissionFr] = useState(config.apropos.mission_fr || '');
  const [missionAr, setMissionAr] = useState(config.apropos.mission_ar || '');
  const [visionFr, setVisionFr] = useState(config.apropos.vision_fr || '');
  const [visionAr, setVisionAr] = useState(config.apropos.vision_ar || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStoryFr(config.apropos.story_fr);
    setStoryAr(config.apropos.story_ar);
    setMissionFr(config.apropos.mission_fr || '');
    setMissionAr(config.apropos.mission_ar || '');
    setVisionFr(config.apropos.vision_fr || '');
    setVisionAr(config.apropos.vision_ar || '');
  }, [config.apropos]);

  const handleSave = () => {
    updateConfig({
      apropos: {
        story_fr: storyFr, story_ar: storyAr,
        mission_fr: missionFr, mission_ar: missionAr,
        vision_fr: visionFr, vision_ar: visionAr,
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fieldBase: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    border: '1px solid var(--border)', borderRadius: '6px',
    fontSize: '14px', color: 'var(--text-1)', background: 'var(--input-bg)',
    boxSizing: 'border-box', fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.2s',
  };

  const textareaBase: React.CSSProperties = {
    ...fieldBase,
    minHeight: '160px', resize: 'vertical', lineHeight: '1.7',
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
      {children}
    </label>
  );

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="dash-glass" style={{ padding: '28px', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div style={{ padding: '40px 48px' }}>

      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration · À Propos
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
          Éditeur À Propos
        </h1>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '14px 20px', marginBottom: '24px', fontSize: '14px', color: '#059669', fontWeight: '500' }}>
          ✓ Contenu enregistré avec succès.
        </div>
      )}

      {/* Story */}
      <SectionCard title="Histoire / القصة">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <Label>Histoire (Français)</Label>
            <textarea value={storyFr} onChange={(e) => setStoryFr(e.target.value)} style={textareaBase} placeholder="Rédigez ici l'histoire de Hamadat en français…" />
          </div>
          <div>
            <Label>القصة بالعربية</Label>
            <textarea dir="rtl" value={storyAr} onChange={(e) => setStoryAr(e.target.value)} style={{ ...textareaBase, textAlign: 'right' }} placeholder="اكتب هنا قصة حمادة بالعربية…" />
          </div>
        </div>
      </SectionCard>

      {/* Mission */}
      <SectionCard title="Mission / المهمة">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <Label>Mission (Français)</Label>
            <textarea value={missionFr} onChange={(e) => setMissionFr(e.target.value)} style={textareaBase} placeholder="Notre mission est de…" />
          </div>
          <div>
            <Label>المهمة بالعربية</Label>
            <textarea dir="rtl" value={missionAr} onChange={(e) => setMissionAr(e.target.value)} style={{ ...textareaBase, textAlign: 'right' }} placeholder="مهمتنا هي…" />
          </div>
        </div>
      </SectionCard>

      {/* Vision */}
      <SectionCard title="Vision / الرؤية">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <Label>Vision (Français)</Label>
            <textarea value={visionFr} onChange={(e) => setVisionFr(e.target.value)} style={textareaBase} placeholder="Notre vision pour l'avenir…" />
          </div>
          <div>
            <Label>الرؤية بالعربية</Label>
            <textarea dir="rtl" value={visionAr} onChange={(e) => setVisionAr(e.target.value)} style={{ ...textareaBase, textAlign: 'right' }} placeholder="رؤيتنا للمستقبل…" />
          </div>
        </div>
      </SectionCard>

      <button
        onClick={handleSave}
        style={{
          padding: '12px 36px', background: '#0e7470', color: '#fff',
          border: 'none', borderRadius: '8px',
          fontSize: '12px', fontWeight: '600', cursor: 'pointer',
          letterSpacing: '0.5px', textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a5450'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0e7470'; }}
      >
        Enregistrer tout
      </button>
    </div>
  );
}
