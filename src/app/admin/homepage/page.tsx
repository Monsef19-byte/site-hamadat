'use client';

import { useState, useEffect } from 'react';
import { useSiteConfig, HomeMedia, VideoEntry } from '@/lib/site-config-context';

const RESIDENCE_SLUGS: { slug: string; name: string }[] = [
  { slug: 'elysia',          name: 'Elysia' },
  { slug: 'les-3-princes',   name: 'Les 3 Princes' },
  { slug: 'orea',            name: 'Orea' },
  { slug: 'lumalac',         name: 'Lumalac' },
  { slug: 'marmo',           name: 'Marmo' },
  { slug: 'vertdalya',       name: 'Vert Dalya' },
];

function ytId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\s#]+)/);
  return m ? m[1] : '';
}
function ytThumb(url: string) { const id = ytId(url); return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : ''; }

export default function AdminHomepagePage() {
  const { config, updateConfig } = useSiteConfig();

  // ── Hero media ──
  const [mediaList, setMediaList] = useState<HomeMedia[]>(
    [...config.homeMedia].sort((a, b) => a.order - b.order)
  );
  const [newUrl, setNewUrl]     = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType]   = useState<'image' | 'video'>('image');

  // ── About image ──
  const [aboutImg, setAboutImg] = useState(config.aboutImage || '/residences/les-3-princes/vue-2.jpg');
  const [aboutImgSaved, setAboutImgSaved] = useState(false);

  // keep in sync with config (loaded from localStorage after mount)
  useEffect(() => { setAboutImg(config.aboutImage || '/residences/les-3-princes/vue-2.jpg'); }, [config.aboutImage]);

  const saveAboutImg = () => {
    updateConfig({ aboutImage: aboutImg.trim() });
    setAboutImgSaved(true);
    setTimeout(() => setAboutImgSaved(false), 2000);
  };

  // ── Videos ──
  const [videoList, setVideoList] = useState<VideoEntry[]>(
    [...(config.videos ?? [])].sort((a, b) => a.order - b.order)
  );
  const [newVidUrl,   setNewVidUrl]   = useState('');
  const [newVidLabel, setNewVidLabel] = useState('');

  const fieldBase: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid var(--border)', borderRadius: '4px',
    fontSize: '13px', color: 'var(--text-1)', background: 'var(--input-bg)',
    fontFamily: 'inherit', outline: 'none',
  };

  // ── Media helpers ──
  const saveMedia = (list: HomeMedia[]) => { setMediaList(list); updateConfig({ homeMedia: list }); };
  const moveMediaUp   = (i: number) => { if (i === 0) return; const l = [...mediaList]; [l[i-1],l[i]]=[l[i],l[i-1]]; saveMedia(l.map((x,j)=>({...x,order:j}))); };
  const moveMediaDown = (i: number) => { if (i === mediaList.length-1) return; const l=[...mediaList]; [l[i],l[i+1]]=[l[i+1],l[i]]; saveMedia(l.map((x,j)=>({...x,order:j}))); };
  const deleteMedia   = (id: string) => saveMedia(mediaList.filter(m=>m.id!==id).map((x,j)=>({...x,order:j})));
  const updateMediaLabel = (id: string, label: string) => saveMedia(mediaList.map(m=>m.id===id?{...m,label}:m));
  const addMedia = () => {
    if (!newUrl.trim()) return;
    saveMedia([...mediaList, { id:`media-${Date.now()}`, type:newType, src:newUrl.trim(), label:newLabel.trim()||newUrl.trim(), order:mediaList.length }]);
    setNewUrl(''); setNewLabel(''); setNewType('image');
  };

  // ── Video helpers ──
  const saveVideos = (list: VideoEntry[]) => { setVideoList(list); updateConfig({ videos: list }); };
  const moveVidUp   = (i: number) => { if (i === 0) return; const l=[...videoList]; [l[i-1],l[i]]=[l[i],l[i-1]]; saveVideos(l.map((x,j)=>({...x,order:j}))); };
  const moveVidDown = (i: number) => { if (i===videoList.length-1) return; const l=[...videoList]; [l[i],l[i+1]]=[l[i+1],l[i]]; saveVideos(l.map((x,j)=>({...x,order:j}))); };
  const deleteVideo   = (id: string) => saveVideos(videoList.filter(v=>v.id!==id).map((x,j)=>({...x,order:j})));
  const updateVidLabel = (id: string, label: string) => saveVideos(videoList.map(v=>v.id===id?{...v,label}:v));
  const addVideo = () => {
    if (!newVidUrl.trim() || !ytId(newVidUrl.trim())) return;
    saveVideos([...videoList, { id:`vid-${Date.now()}`, url:newVidUrl.trim(), label:newVidLabel.trim()||'Vidéo', order:videoList.length }]);
    setNewVidUrl(''); setNewVidLabel('');
  };

  const setGridSize = (slug: string, size: 2|3|4|5|6) => {
    updateConfig({ residences: { ...config.residences, [slug]: { ...config.residences[slug], gridSize: size } } });
  };

  const BtnRow = ({ style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button style={{ background:'none', border:'1px solid var(--border)', borderRadius:'3px', padding:'2px 6px', cursor:'pointer', fontSize:'12px', color:'var(--text-2)', ...style }} {...props} />
  );

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Administration · Accueil
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '300', color: 'var(--text-1)', letterSpacing: '-0.5px', margin: 0 }}>
          Paramètres de l'accueil
        </h1>
      </div>

      {/* ── Section A: Hero médias ── */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
          Médias du hero
        </h2>

        {mediaList.length === 0 && <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '20px' }}>Aucun média configuré.</p>}
        {mediaList.map((item, idx) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-sub)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <BtnRow onClick={() => moveMediaUp(idx)} disabled={idx === 0} style={{ opacity: idx===0 ? 0.3 : 1 }}>▲</BtnRow>
              <BtnRow onClick={() => moveMediaDown(idx)} disabled={idx===mediaList.length-1} style={{ opacity: idx===mediaList.length-1 ? 0.3 : 1 }}>▼</BtnRow>
            </div>
            <img src={item.src} alt={item.label} style={{ width:'60px', height:'40px', objectFit:'cover', borderRadius:'3px', background:'var(--border)', flexShrink:0 }} onError={(e)=>{(e.currentTarget as HTMLImageElement).style.opacity='0.3';}} />
            <input type="text" value={item.label} onChange={(e)=>updateMediaLabel(item.id,e.target.value)} style={{...fieldBase,flex:1}} placeholder="Libellé" />
            <span style={{ padding:'3px 10px', borderRadius:'12px', fontSize:'10px', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase', flexShrink:0, background:item.type==='image'?'rgba(14,116,112,0.1)':'rgba(99,102,241,0.1)', color:item.type==='image'?'var(--teal)':'#6366f1' }}>
              {item.type === 'image' ? 'Image' : 'Vidéo'}
            </span>
            <button onClick={()=>deleteMedia(item.id)} style={{ background:'none', border:'1px solid #fecaca', borderRadius:'4px', padding:'5px 12px', cursor:'pointer', color:'#dc2626', fontSize:'12px', fontWeight:'600', flexShrink:0, transition:'all 0.15s' }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#fee2e2';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='none';}}>
              Supprimer
            </button>
          </div>
        ))}

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 160px 120px auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>URL</label>
            <input type="text" value={newUrl} onChange={e=>setNewUrl(e.target.value)} style={{...fieldBase,width:'100%'}} placeholder="/residences/elysia/vue-001-1.jpg" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addMedia();}}} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>Libellé</label>
            <input type="text" value={newLabel} onChange={e=>setNewLabel(e.target.value)} style={{...fieldBase,width:'100%'}} placeholder="Nom" />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>Type</label>
            <select value={newType} onChange={e=>setNewType(e.target.value as 'image'|'video')} style={{...fieldBase,width:'100%'}}>
              <option value="image">Image</option>
              <option value="video">Vidéo</option>
            </select>
          </div>
          <button type="button" onClick={addMedia} style={{ padding:'10px 20px', background:'var(--teal)', color:'#fff', border:'none', borderRadius:'4px', fontSize:'13px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--teal-dk)';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='var(--teal)';}}>
            + Ajouter
          </button>
        </div>
      </div>

      {/* ── Section B: Image section À Propos ── */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
          Image de la section "À Propos"
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px', marginTop: '4px' }}>
          Cette image apparaît à droite du bloc "À Propos" sur la page d'accueil.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Chemin ou URL de l'image
            </label>
            <input
              type="text"
              value={aboutImg}
              onChange={e => { setAboutImg(e.target.value); setAboutImgSaved(false); }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveAboutImg(); } }}
              style={{ ...fieldBase, width: '100%' }}
              placeholder="/residences/les-3-princes/vue-2.jpg"
            />
          </div>
          <button
            type="button"
            onClick={saveAboutImg}
            style={{ padding: '10px 20px', background: aboutImgSaved ? '#16a34a' : 'var(--teal)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
            onMouseEnter={e => { if (!aboutImgSaved) (e.currentTarget as HTMLElement).style.background = 'var(--teal-dk)'; }}
            onMouseLeave={e => { if (!aboutImgSaved) (e.currentTarget as HTMLElement).style.background = 'var(--teal)'; }}
          >
            {aboutImgSaved ? '✓ Enregistré' : 'Enregistrer'}
          </button>
        </div>

        {/* Preview */}
        {aboutImg && (
          <div style={{ marginTop: '16px', position: 'relative', height: '160px', borderRadius: '4px', overflow: 'hidden', background: 'var(--border)' }}>
            <img
              src={aboutImg}
              alt="Aperçu"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
              onLoad={e  => { (e.currentTarget as HTMLImageElement).style.opacity = '1'; }}
            />
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.5px' }}>
              Aperçu
            </div>
          </div>
        )}
      </div>

      {/* ── Section C: Vidéos YouTube ── */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
          Vidéos YouTube
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px', marginTop: '4px' }}>
          Ces vidéos apparaissent dans la section "Nos Réalisations" de la page d'accueil.
        </p>

        {videoList.length === 0 && <p style={{ fontSize:'14px', color:'var(--text-3)', marginBottom:'20px' }}>Aucune vidéo configurée.</p>}
        {videoList.map((v, idx) => {
          const thumb = ytThumb(v.url);
          const hasId  = !!ytId(v.url);
          return (
            <div key={v.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid var(--border-sub)' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                <BtnRow onClick={()=>moveVidUp(idx)} disabled={idx===0} style={{opacity:idx===0?0.3:1}}>▲</BtnRow>
                <BtnRow onClick={()=>moveVidDown(idx)} disabled={idx===videoList.length-1} style={{opacity:idx===videoList.length-1?0.3:1}}>▼</BtnRow>
              </div>

              {/* Thumbnail */}
              <div style={{ position:'relative', width:'80px', height:'52px', borderRadius:'4px', overflow:'hidden', background:'var(--border)', flexShrink:0 }}>
                {hasId && <img src={thumb} alt={v.label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />}
                {!hasId && <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'var(--text-4)' }}>?</span>}
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:0, height:0, borderTop:'5px solid transparent', borderBottom:'5px solid transparent', borderLeft:'8px solid rgba(255,255,255,0.9)', marginLeft:'2px' }} />
                </div>
              </div>

              {/* Label */}
              <input type="text" value={v.label} onChange={e=>updateVidLabel(v.id,e.target.value)} style={{...fieldBase,flex:1}} placeholder="Titre de la vidéo" />

              {/* URL display */}
              <span style={{ fontSize:'11px', color:'var(--text-4)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flexShrink:0 }}>
                {v.url}
              </span>

              <button onClick={()=>deleteVideo(v.id)} style={{ background:'none', border:'1px solid #fecaca', borderRadius:'4px', padding:'5px 12px', cursor:'pointer', color:'#dc2626', fontSize:'12px', fontWeight:'600', flexShrink:0, transition:'all 0.15s' }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#fee2e2';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='none';}}>
                Supprimer
              </button>
            </div>
          );
        })}

        {/* Add video form */}
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 200px auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>URL YouTube</label>
            <input type="text" value={newVidUrl} onChange={e=>setNewVidUrl(e.target.value)} style={{...fieldBase,width:'100%'}} placeholder="https://youtu.be/XXXXXXXXX" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addVideo();}}} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'10px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'6px' }}>Titre</label>
            <input type="text" value={newVidLabel} onChange={e=>setNewVidLabel(e.target.value)} style={{...fieldBase,width:'100%'}} placeholder="Nom de la résidence" />
          </div>
          <button type="button" onClick={addVideo} style={{ padding:'10px 20px', background:'var(--teal)', color:'#fff', border:'none', borderRadius:'4px', fontSize:'13px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--teal-dk)';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='var(--teal)';}}>
            + Ajouter
          </button>
        </div>
        {newVidUrl && !ytId(newVidUrl) && (
          <p style={{ fontSize:'12px', color:'#dc2626', marginTop:'8px' }}>URL YouTube invalide — utilisez le format youtu.be/... ou youtube.com/watch?v=...</p>
        )}
      </div>

      {/* ── Section D: Taille des résidences ── */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-4)', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
          Taille des résidences dans la grille
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {RESIDENCE_SLUGS.map(({ slug, name }) => {
            const currentSize = config.residences[slug]?.gridSize ?? 3;
            return (
              <div key={slug} style={{ display: 'grid', gridTemplateColumns: '160px auto 1fr', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-1)' }}>{name}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {([2,3,4,5,6] as const).map(s => (
                    <button key={s} type="button" onClick={()=>setGridSize(slug,s)} style={{ width:'36px', height:'36px', borderRadius:'4px', border:currentSize===s?'2px solid var(--teal)':'1px solid var(--border)', background:currentSize===s?'var(--teal)':'var(--bg-page)', color:currentSize===s?'#fff':'var(--text-2)', fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'all 0.15s' }}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height:'100%', width:`${(currentSize/6)*100}%`, background:'var(--teal)', borderRadius:'4px', transition:'width 0.3s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
}
