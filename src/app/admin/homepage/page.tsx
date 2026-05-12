'use client';

import { useState, useEffect } from 'react';
import { useSiteConfig, HomeMedia, VideoEntry } from '@/lib/site-config-context';

function ytId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\s#]+)/);
  return m ? m[1] : '';
}
function ytThumb(url: string) { const id = ytId(url); return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : ''; }

export default function AdminHomepagePage() {
  const { config, updateConfig } = useSiteConfig();

  const mediaList: HomeMedia[]  = [...config.homeMedia].sort((a, b) => a.order - b.order);
  const videoList: VideoEntry[] = [...(config.videos ?? [])].sort((a, b) => a.order - b.order);

  const [newUrl, setNewUrl]     = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType]   = useState<'image' | 'video'>('image');
  const [newVidUrl,   setNewVidUrl]   = useState('');
  const [newVidLabel, setNewVidLabel] = useState('');

  // Hero video state
  const [heroVideo, setHeroVideo] = useState(config.heroVideo || '/hero.mp4');
  const [heroVideoSaved, setHeroVideoSaved] = useState(false);
  useEffect(() => { setHeroVideo(config.heroVideo || '/hero.mp4'); }, [config.heroVideo]);

  // Hero text state
  const [heroTitle, setHeroTitle] = useState(config.heroTitle || 'Hamadat');
  const [heroTitleAr, setHeroTitleAr] = useState(config.heroTitle_ar || 'حمادات');
  const [heroSubFr, setHeroSubFr] = useState(config.heroSubtitle_fr || '');
  const [heroSubAr, setHeroSubAr] = useState(config.heroSubtitle_ar || '');
  const [heroSaved, setHeroSaved] = useState(false);
  useEffect(() => { setHeroTitle(config.heroTitle || 'Hamadat'); setHeroTitleAr(config.heroTitle_ar || 'حمادات'); setHeroSubFr(config.heroSubtitle_fr || ''); setHeroSubAr(config.heroSubtitle_ar || ''); }, [config.heroTitle, config.heroTitle_ar, config.heroSubtitle_fr, config.heroSubtitle_ar]);

  // CTA state
  const [ctaTitleFr, setCtaTitleFr] = useState(config.ctaTitle_fr || '');
  const [ctaTitleAr, setCtaTitleAr] = useState(config.ctaTitle_ar || '');
  const [ctaBtnFr, setCtaBtnFr] = useState(config.ctaButton_fr || '');
  const [ctaBtnAr, setCtaBtnAr] = useState(config.ctaButton_ar || '');
  const [ctaSaved, setCtaSaved] = useState(false);
  useEffect(() => {
    setCtaTitleFr(config.ctaTitle_fr || ''); setCtaTitleAr(config.ctaTitle_ar || '');
    setCtaBtnFr(config.ctaButton_fr || ''); setCtaBtnAr(config.ctaButton_ar || '');
  }, [config.ctaTitle_fr, config.ctaTitle_ar, config.ctaButton_fr, config.ctaButton_ar]);

  // About image
  const [aboutImg, setAboutImg] = useState(config.aboutImage || '');
  const [aboutImgSaved, setAboutImgSaved] = useState(false);
  useEffect(() => { setAboutImg(config.aboutImage || ''); }, [config.aboutImage]);

  const saveHeroVideo = () => {
    updateConfig({ heroVideo: heroVideo.trim() });
    setHeroVideoSaved(true); setTimeout(() => setHeroVideoSaved(false), 2000);
  };
  const saveHero = () => {
    updateConfig({ heroTitle: heroTitle.trim(), heroTitle_ar: heroTitleAr.trim(), heroSubtitle_fr: heroSubFr.trim(), heroSubtitle_ar: heroSubAr.trim() });
    setHeroSaved(true); setTimeout(() => setHeroSaved(false), 2000);
  };
  const saveCta = () => {
    updateConfig({ ctaTitle_fr: ctaTitleFr.trim(), ctaTitle_ar: ctaTitleAr.trim(), ctaButton_fr: ctaBtnFr.trim(), ctaButton_ar: ctaBtnAr.trim() });
    setCtaSaved(true); setTimeout(() => setCtaSaved(false), 2000);
  };
  const saveAboutImg = () => {
    updateConfig({ aboutImage: aboutImg.trim() });
    setAboutImgSaved(true); setTimeout(() => setAboutImgSaved(false), 2000);
  };

  const fieldBase: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid var(--border)', borderRadius: '6px',
    fontSize: '13px', color: 'var(--text-1)', background: 'var(--input-bg)',
    fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  // Media helpers
  const saveMedia = (list: HomeMedia[]) => updateConfig({ homeMedia: list });
  const moveMediaUp   = (i: number) => { if (i === 0) return; const l = [...mediaList]; [l[i-1],l[i]]=[l[i],l[i-1]]; saveMedia(l.map((x,j)=>({...x,order:j}))); };
  const moveMediaDown = (i: number) => { if (i === mediaList.length-1) return; const l=[...mediaList]; [l[i],l[i+1]]=[l[i+1],l[i]]; saveMedia(l.map((x,j)=>({...x,order:j}))); };
  const deleteMedia   = (id: string) => saveMedia(mediaList.filter(m=>m.id!==id).map((x,j)=>({...x,order:j})));
  const updateMediaLabel = (id: string, label: string) => saveMedia(mediaList.map(m=>m.id===id?{...m,label}:m));
  const addMedia = () => {
    if (!newUrl.trim()) return;
    saveMedia([...mediaList, { id:`media-${Date.now()}`, type:newType, src:newUrl.trim(), label:newLabel.trim()||newUrl.trim(), order:mediaList.length }]);
    setNewUrl(''); setNewLabel(''); setNewType('image');
  };

  // Video helpers
  const saveVideos = (list: VideoEntry[]) => updateConfig({ videos: list });
  const moveVidUp   = (i: number) => { if (i === 0) return; const l=[...videoList]; [l[i-1],l[i]]=[l[i],l[i-1]]; saveVideos(l.map((x,j)=>({...x,order:j}))); };
  const moveVidDown = (i: number) => { if (i===videoList.length-1) return; const l=[...videoList]; [l[i],l[i+1]]=[l[i+1],l[i]]; saveVideos(l.map((x,j)=>({...x,order:j}))); };
  const deleteVideo   = (id: string) => saveVideos(videoList.filter(v=>v.id!==id).map((x,j)=>({...x,order:j})));
  const updateVidLabel = (id: string, label: string) => saveVideos(videoList.map(v=>v.id===id?{...v,label}:v));
  const addVideo = () => {
    if (!newVidUrl.trim() || !ytId(newVidUrl.trim())) return;
    saveVideos([...videoList, { id:`vid-${Date.now()}`, url:newVidUrl.trim(), label:newVidLabel.trim()||'Vidéo', order:videoList.length }]);
    setNewVidUrl(''); setNewVidLabel('');
  };

  const BtnRow = ({ style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button style={{ background:'none', border:'1px solid var(--border)', borderRadius:'4px', padding:'2px 6px', cursor:'pointer', fontSize:'12px', color:'var(--text-2)', ...style }} {...props} />
  );

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="dash-glass" style={{ padding: '28px', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        {title}
      </h2>
      {children}
    </div>
  );

  const SaveButton = ({ onClick, saved, label }: { onClick: () => void; saved: boolean; label?: string }) => (
    <button type="button" onClick={onClick} style={{
      padding: '10px 24px', background: saved ? '#16a34a' : 'var(--teal)', color: '#fff',
      border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
      transition: 'background 0.2s', letterSpacing: '0.5px',
    }}>
      {saved ? '✓ Enregistré' : (label || 'Enregistrer')}
    </button>
  );

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration · Accueil
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '200', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
          Paramètres de l&apos;accueil
        </h1>
      </div>

      {/* ── Hero Video ── */}
      <SectionCard title="Vidéo du Hero (arrière-plan)">
        <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px', marginTop: 0 }}>
          La vidéo de fond affichée dans le hero de la page d&apos;accueil. Placez le fichier dans /public/ et indiquez le chemin.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Chemin de la vidéo</label>
            <input type="text" value={heroVideo} onChange={e => { setHeroVideo(e.target.value); setHeroVideoSaved(false); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveHeroVideo(); } }} style={fieldBase} placeholder="/hero.mp4" />
          </div>
          <SaveButton onClick={saveHeroVideo} saved={heroVideoSaved} />
        </div>
        {heroVideo && (
          <div style={{ marginTop: '16px', position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', background: '#06080a' }}>
            <video src={heroVideo} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '3px 8px', borderRadius: '4px' }}>Aperçu vidéo</div>
          </div>
        )}
      </SectionCard>

      {/* ── Hero Texts ── */}
      <SectionCard title="Textes du Hero">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Titre principal — Français (Tahu)</label>
            <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} style={{ ...fieldBase, fontSize: '18px', fontWeight: '500' }} placeholder="Hamadat" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>العنوان الرئيسي — عربي</label>
            <input type="text" dir="rtl" value={heroTitleAr} onChange={e => setHeroTitleAr(e.target.value)} style={{ ...fieldBase, fontSize: '18px', fontWeight: '500', textAlign: 'right' }} placeholder="حمادات" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Sous-titre (Français)</label>
            <input type="text" value={heroSubFr} onChange={e => setHeroSubFr(e.target.value)} style={fieldBase} placeholder="Promotion Immobilière de Prestige" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>العنوان الفرعي (عربي)</label>
            <input type="text" dir="rtl" value={heroSubAr} onChange={e => setHeroSubAr(e.target.value)} style={{ ...fieldBase, textAlign: 'right' }} placeholder="ترقية عقارية فاخرة" />
          </div>
        </div>
        <SaveButton onClick={saveHero} saved={heroSaved} />
      </SectionCard>

      {/* ── Hero Medias ── */}
      <SectionCard title="Médias du Hero (Images / Vidéos)">
        {mediaList.length === 0 && <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '20px' }}>Aucun média configuré.</p>}
        {mediaList.map((item, idx) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <BtnRow onClick={() => moveMediaUp(idx)} disabled={idx === 0} style={{ opacity: idx===0 ? 0.3 : 1 }}>▲</BtnRow>
              <BtnRow onClick={() => moveMediaDown(idx)} disabled={idx===mediaList.length-1} style={{ opacity: idx===mediaList.length-1 ? 0.3 : 1 }}>▼</BtnRow>
            </div>
            <img src={item.src} alt={item.label} style={{ width:'60px', height:'40px', objectFit:'cover', borderRadius:'4px', background:'var(--border)', flexShrink:0 }} onError={(e)=>{(e.currentTarget as HTMLImageElement).style.opacity='0.3';}} />
            <input type="text" value={item.label} onChange={(e)=>updateMediaLabel(item.id,e.target.value)} style={{...fieldBase,flex:1}} placeholder="Libellé" />
            <span style={{ padding:'4px 12px', borderRadius:'12px', fontSize:'9px', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase', flexShrink:0, background:item.type==='image'?'rgba(14,116,112,0.12)':'rgba(99,102,241,0.12)', color:item.type==='image'?'var(--teal)':'#6366f1' }}>
              {item.type === 'image' ? 'Image' : 'Vidéo'}
            </span>
            <button onClick={()=>deleteMedia(item.id)} style={{ background:'none', border:'1px solid #fecaca', borderRadius:'6px', padding:'5px 12px', cursor:'pointer', color:'#dc2626', fontSize:'11px', fontWeight:'600', flexShrink:0 }}>
              Supprimer
            </button>
          </div>
        ))}
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 160px 120px auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>URL</label>
            <input type="text" value={newUrl} onChange={e=>setNewUrl(e.target.value)} style={fieldBase} placeholder="/residences/elysia/vue-001-1.jpg" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addMedia();}}} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>Libellé</label>
            <input type="text" value={newLabel} onChange={e=>setNewLabel(e.target.value)} style={fieldBase} placeholder="Nom" />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>Type</label>
            <select value={newType} onChange={e=>setNewType(e.target.value as 'image'|'video')} style={fieldBase}>
              <option value="image">Image</option>
              <option value="video">Vidéo</option>
            </select>
          </div>
          <button type="button" onClick={addMedia} style={{ padding:'10px 20px', background:'var(--teal)', color:'#fff', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
            + Ajouter
          </button>
        </div>
      </SectionCard>

      {/* ── About Image ── */}
      <SectionCard title="Image section À Propos">
        <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px', marginTop: 0 }}>
          Cette image apparaît à droite du bloc &quot;À Propos&quot; sur la page d&apos;accueil.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
          <input type="text" value={aboutImg} onChange={e => { setAboutImg(e.target.value); setAboutImgSaved(false); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveAboutImg(); } }} style={fieldBase} placeholder="/residences/les-3-princes/vue-2.jpg" />
          <SaveButton onClick={saveAboutImg} saved={aboutImgSaved} />
        </div>
        {aboutImg && (
          <div style={{ marginTop: '16px', position: 'relative', height: '160px', borderRadius: '8px', overflow: 'hidden', background: 'var(--border)' }}>
            <img src={aboutImg} alt="Aperçu" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} onLoad={e => { (e.currentTarget as HTMLImageElement).style.opacity = '1'; }} />
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '3px 8px', borderRadius: '4px' }}>Aperçu</div>
          </div>
        )}
      </SectionCard>

      {/* ── Videos ── */}
      <SectionCard title="Vidéos YouTube">
        <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px', marginTop: 0 }}>
          Ces vidéos apparaissent dans la section &quot;Nos Réalisations&quot; de la page d&apos;accueil.
        </p>
        {videoList.length === 0 && <p style={{ fontSize:'14px', color:'var(--text-3)', marginBottom:'20px' }}>Aucune vidéo configurée.</p>}
        {videoList.map((v, idx) => {
          const thumb = ytThumb(v.url);
          const hasId  = !!ytId(v.url);
          return (
            <div key={v.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                <BtnRow onClick={()=>moveVidUp(idx)} disabled={idx===0} style={{opacity:idx===0?0.3:1}}>▲</BtnRow>
                <BtnRow onClick={()=>moveVidDown(idx)} disabled={idx===videoList.length-1} style={{opacity:idx===videoList.length-1?0.3:1}}>▼</BtnRow>
              </div>
              <div style={{ position:'relative', width:'80px', height:'52px', borderRadius:'4px', overflow:'hidden', background:'var(--border)', flexShrink:0 }}>
                {hasId && <img src={thumb} alt={v.label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />}
                {!hasId && <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'var(--text-4)' }}>?</span>}
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:0, height:0, borderTop:'5px solid transparent', borderBottom:'5px solid transparent', borderLeft:'8px solid rgba(255,255,255,0.9)', marginLeft:'2px' }} />
                </div>
              </div>
              <input type="text" value={v.label} onChange={e=>updateVidLabel(v.id,e.target.value)} style={{...fieldBase,flex:1}} placeholder="Titre de la vidéo" />
              <span style={{ fontSize:'11px', color:'var(--text-4)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flexShrink:0 }}>{v.url}</span>
              <button onClick={()=>deleteVideo(v.id)} style={{ background:'none', border:'1px solid #fecaca', borderRadius:'6px', padding:'5px 12px', cursor:'pointer', color:'#dc2626', fontSize:'11px', fontWeight:'600', flexShrink:0 }}>
                Supprimer
              </button>
            </div>
          );
        })}
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 200px auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>URL YouTube</label>
            <input type="text" value={newVidUrl} onChange={e=>setNewVidUrl(e.target.value)} style={fieldBase} placeholder="https://youtu.be/XXXXXXXXX" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addVideo();}}} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>Titre</label>
            <input type="text" value={newVidLabel} onChange={e=>setNewVidLabel(e.target.value)} style={fieldBase} placeholder="Nom de la résidence" />
          </div>
          <button type="button" onClick={addVideo} style={{ padding:'10px 20px', background:'var(--teal)', color:'#fff', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
            + Ajouter
          </button>
        </div>
        {newVidUrl && !ytId(newVidUrl) && (
          <p style={{ fontSize:'12px', color:'#dc2626', marginTop:'8px' }}>URL YouTube invalide — utilisez le format youtu.be/... ou youtube.com/watch?v=...</p>
        )}
      </SectionCard>

      {/* ── CTA (above footer) ── */}
      <SectionCard title="CTA (au-dessus du footer)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Titre CTA (Français)</label>
            <input type="text" value={ctaTitleFr} onChange={e => setCtaTitleFr(e.target.value)} style={fieldBase} placeholder="Votre futur chez-vous commence ici" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>عنوان CTA (عربي)</label>
            <input type="text" dir="rtl" value={ctaTitleAr} onChange={e => setCtaTitleAr(e.target.value)} style={{ ...fieldBase, textAlign: 'right' }} placeholder="منزلك المستقبلي يبدأ هنا" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Bouton CTA (Français)</label>
            <input type="text" value={ctaBtnFr} onChange={e => setCtaBtnFr(e.target.value)} style={fieldBase} placeholder="Contactez-nous" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>زر CTA (عربي)</label>
            <input type="text" dir="rtl" value={ctaBtnAr} onChange={e => setCtaBtnAr(e.target.value)} style={{ ...fieldBase, textAlign: 'right' }} placeholder="تواصل معنا" />
          </div>
        </div>
        <SaveButton onClick={saveCta} saved={ctaSaved} />
      </SectionCard>
    </div>
  );
}
