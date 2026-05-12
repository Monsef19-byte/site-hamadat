'use client';

import { useState, useEffect } from 'react';

interface Residence {
  id: string;
  name_fr: string;
  name_ar: string;
  location: string;
  status: 'Projet en cours' | 'Livré' | 'Vendu';
  total_units: number;
  typology: string;
  description_fr: string;
  description_ar: string;
  images?: string[];
  thumbnail?: string;
}

const mockResidences: Residence[] = [
  { id: '1', name_fr: 'Elysia', name_ar: 'إليسيا', location: 'Jijel', status: 'Projet en cours', total_units: 56, typology: 'F3 (96-110 m²)', description_fr: 'Résidence de prestige à Jijel', description_ar: 'مجمع سكني فاخر في جيجل' },
  { id: '2', name_fr: 'Les 3 Princes', name_ar: 'الثلاث أمراء', location: 'Alger', status: 'Projet en cours', total_units: 120, typology: 'F2, F3, F4', description_fr: "Projet ambitieux au cœur d'Alger", description_ar: 'مشروع طموح في قلب الجزائر' },
  { id: '3', name_fr: 'Orea', name_ar: 'أوريا', location: 'Oran', status: 'Livré', total_units: 80, typology: 'F3 (100-120 m²)', description_fr: 'Projet achevé avec succès', description_ar: 'مشروع مكتمل بنجاح' },
  { id: '4', name_fr: 'Lumalac', name_ar: 'لوملاك', location: 'Béjaïa', status: 'Projet en cours', total_units: 45, typology: 'F3, F4', description_fr: 'Résidence moderne à Béjaïa', description_ar: 'مجمع حديث في بجاية' },
  { id: '5', name_fr: 'Marmo', name_ar: 'مارمو', location: 'Sétif', status: 'Projet en cours', total_units: 60, typology: 'F3 (98-115 m²)', description_fr: 'Projet de qualité à Sétif', description_ar: 'مشروع جودة في سطيف' },
  { id: '6', name_fr: 'Vert Dalya', name_ar: 'فيرت داليا', location: 'Alger', status: 'Livré', total_units: 90, typology: 'F2, F3, F4', description_fr: 'Projet vert et durable', description_ar: 'مشروع أخضر ومستدام' },
];

// ── shared dark tokens ────────────────────────────────────────────────
const D = {
  bg:       '#0f0f0e',
  card:     '#181817',
  cardAlt:  '#1c1c1b',
  border:   '#272624',
  text1:    '#e8e6e3',
  text2:    '#a09c97',
  text3:    '#6b6764',
  teal:     '#1a958b',
  tealDk:   '#0e7470',
  tealBg:   'rgba(26,149,139,0.12)',
  tealRing: 'rgba(26,149,139,0.35)',
  red:      'rgba(239,68,68,0.85)',
  input:    '#141413',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: D.input, border: `1px solid ${D.border}`,
  borderRadius: '8px', fontSize: '13px', color: D.text1,
  fontFamily: 'inherit', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.2s',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: '600',
  color: D.text3, letterSpacing: '1px', textTransform: 'uppercase',
  marginBottom: '8px',
};
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ── status pill ──────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const cfg =
    status === 'Livré'
      ? { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.3)' }
      : status === 'Vendu'
      ? { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: 'rgba(139,92,246,0.3)' }
      : { bg: D.tealBg, color: D.teal, border: D.tealRing };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px',
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      borderRadius: '4px', fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
    }}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [residences, setResidences]   = useState<Residence[]>(mockResidences);
  const [showModal, setShowModal]     = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [formData, setFormData]       = useState<Residence | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('admin-token')) setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (email === 'admin@hamadat.dz' && password === 'admin123') {
        localStorage.setItem('admin-token', 'mock-token-' + Date.now());
        setIsLoggedIn(true); setEmail(''); setPassword('');
      } else { setError('Identifiants invalides'); }
    } catch { setError('Erreur de connexion'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsLoggedIn(false); setEmail(''); setPassword('');
  };

  const openNewModal = () => {
    setFormData({ id: Date.now().toString(), name_fr: '', name_ar: '', location: '', status: 'Projet en cours', total_units: 0, typology: '', description_fr: '', description_ar: '', images: [], thumbnail: undefined });
    setEditingId(null); setImagePreview(null); setShowModal(true);
  };
  const openEditModal = (r: Residence) => {
    setFormData({ ...r, images: r.images || [], thumbnail: r.thumbnail });
    setEditingId(r.id); setImagePreview(r.thumbnail || null); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setFormData(null); setEditingId(null); setImagePreview(null); };

  const handleSave = () => {
    if (!formData) return;
    setResidences(editingId
      ? residences.map(r => r.id === editingId ? formData : r)
      : [...residences, formData]);
    closeModal();
  };
  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette résidence ?')) setResidences(residences.filter(r => r.id !== id));
  };
  const handleInputChange = (field: keyof Residence, value: unknown) => {
    if (formData) setFormData({ ...formData, [field]: value });
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = ev.target?.result as string;
        if (formData) {
          const imgs = [...(formData.images || []), img];
          setFormData({ ...formData, images: imgs, thumbnail: formData.thumbnail || img });
          if (!formData.thumbnail) setImagePreview(img);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const handleRemoveImage = (i: number) => {
    if (!formData) return;
    const imgs = formData.images?.filter((_, j) => j !== i) || [];
    const thumb = formData.thumbnail === formData.images?.[i] ? imgs[0] : formData.thumbnail;
    setFormData({ ...formData, images: imgs, thumbnail: thumb });
    if (formData.thumbnail === formData.images?.[i]) setImagePreview(imgs[0] || null);
  };
  const handleSetThumbnail = (img: string) => {
    if (formData) { setFormData({ ...formData, thumbnail: img }); setImagePreview(img); }
  };

  const stats = [
    { label: 'Résidences', value: residences.length, sub: 'total' },
    { label: 'En Cours', value: residences.filter(r => r.status === 'Projet en cours').length, sub: 'actifs' },
    { label: 'Livrés', value: residences.filter(r => r.status === 'Livré').length, sub: 'terminés' },
    { label: 'Unités', value: residences.reduce((s, r) => s + r.total_units, 0), sub: 'logements' },
  ];

  // ── LOGIN ────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: D.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: `linear-gradient(135deg, ${D.tealDk}, ${D.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 0 0 1px ${D.tealRing}, 0 16px 40px rgba(14,116,112,0.25)` }}>
              <span style={{ color: '#fff', fontWeight: '700', fontSize: '22px', letterSpacing: '-1px' }}>H</span>
            </div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: D.teal, marginBottom: '8px' }}>Hamadat Admin</p>
            <h1 style={{ fontSize: '26px', fontWeight: '200', color: D.text1, margin: 0, letterSpacing: '-0.5px' }}>Tableau de Bord</h1>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} placeholder="admin@hamadat.dz" style={inputStyle} />
            </Field>
            <Field label="Mot de passe">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} placeholder="••••••••" style={inputStyle} />
            </Field>

            {error && (
              <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '13px', color: '#ef4444' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ padding: '13px', background: loading ? D.border : `linear-gradient(135deg, ${D.tealDk}, ${D.teal})`, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.5px', transition: 'opacity 0.2s', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Connexion…' : 'Se Connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '11px', color: D.text3, marginTop: '24px' }}>
            admin@hamadat.dz / admin123
          </p>
        </div>

        <style>{`
          input:focus { border-color: ${D.teal} !important; box-shadow: 0 0 0 3px ${D.tealBg}; }
          body { background: ${D.bg}; }
        `}</style>
      </div>
    );
  }

  // ── DASHBOARD ────────────────────────────────────────────────────────
  const TH_COLS = ['Vignette', 'Nom', 'Localisation', 'Unités', 'Statut', 'Typologies', 'Actions'];

  return (
    <div style={{ minHeight: '100vh', background: D.bg, fontFamily: 'var(--font-main, system-ui, sans-serif)', color: D.text1 }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: D.teal, marginBottom: '8px' }}>Hamadat Admin</p>
            <h1 style={{ fontSize: '32px', fontWeight: '200', color: D.text1, margin: 0, letterSpacing: '-1px' }}>Tableau de Bord</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={openNewModal} style={{ padding: '10px 22px', background: `linear-gradient(135deg, ${D.tealDk}, ${D.teal})`, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px' }}>
              + Ajouter
            </button>
            <button onClick={handleLogout} style={{ padding: '10px 22px', background: 'transparent', color: D.text3, border: `1px solid ${D.border}`, borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: '12px', padding: '24px 20px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: D.text3, marginBottom: '12px' }}>{s.label}</p>
              <p style={{ fontSize: '40px', fontWeight: '200', color: D.teal, margin: '0 0 4px', letterSpacing: '-2px', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: D.text3, margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${D.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: D.text1, margin: 0 }}>Résidences</h2>
            <span style={{ fontSize: '11px', color: D.text3 }}>{residences.length} projets</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr>
                  {TH_COLS.map(col => (
                    <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: D.text3, background: D.cardAlt, borderBottom: `1px solid ${D.border}` }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {residences.map((r, idx) => (
                  <tr key={r.id} style={{ borderBottom: idx < residences.length - 1 ? `1px solid ${D.border}` : 'none', background: 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = D.cardAlt)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      {r.thumbnail
                        ? <img src={r.thumbnail} alt="" style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${D.border}` }} />
                        : <div style={{ width: '52px', height: '52px', background: D.cardAlt, borderRadius: '8px', border: `1px solid ${D.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '18px', opacity: 0.3 }}>🏢</span>
                          </div>
                      }
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: D.text1, margin: '0 0 2px' }}>{r.name_fr}</p>
                      <p style={{ fontSize: '12px', color: D.text3, margin: 0 }}>{r.name_ar}</p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: D.text2 }}>{r.location}</td>
                    <td style={{ padding: '14px 16px', fontSize: '20px', fontWeight: '200', color: D.teal, letterSpacing: '-0.5px' }}>{r.total_units}</td>
                    <td style={{ padding: '14px 16px' }}><StatusPill status={r.status} /></td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: D.text3 }}>{r.typology}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEditModal(r)} style={{ padding: '6px 14px', background: D.tealBg, color: D.teal, border: `1px solid ${D.tealRing}`, borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(r.id)} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && formData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
          onClick={closeModal}
        >
          <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: '16px', padding: '32px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '300', color: D.text1, margin: 0, letterSpacing: '-0.3px' }}>
                {editingId ? 'Modifier Résidence' : 'Ajouter Résidence'}
              </h2>
              <button onClick={closeModal} style={{ width: '32px', height: '32px', background: 'transparent', border: `1px solid ${D.border}`, borderRadius: '8px', cursor: 'pointer', color: D.text3, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Field label="Nom (Français)">
                <input type="text" value={formData.name_fr} onChange={e => handleInputChange('name_fr', e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Nom (Arabe)">
                <input type="text" value={formData.name_ar} onChange={e => handleInputChange('name_ar', e.target.value)} style={{ ...inputStyle, direction: 'rtl' }} />
              </Field>
              <Field label="Localisation">
                <input type="text" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Statut">
                <select value={formData.status} onChange={e => handleInputChange('status', e.target.value as Residence['status'])} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="Projet en cours">Projet en cours</option>
                  <option value="Livré">Livré</option>
                  <option value="Vendu">Vendu</option>
                </select>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Nb d'unités">
                  <input type="number" value={formData.total_units} onChange={e => handleInputChange('total_units', parseInt(e.target.value))} style={inputStyle} />
                </Field>
                <Field label="Typologies">
                  <input type="text" value={formData.typology} onChange={e => handleInputChange('typology', e.target.value)} style={inputStyle} />
                </Field>
              </div>
              <Field label="Description (Français)">
                <textarea value={formData.description_fr} onChange={e => handleInputChange('description_fr', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              </Field>
              <Field label="Description (Arabe)">
                <textarea value={formData.description_ar} onChange={e => handleInputChange('description_ar', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', direction: 'rtl' }} />
              </Field>

              {/* Photos */}
              <Field label="Photos">
                <label htmlFor="img-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px', border: `1px dashed ${D.border}`, borderRadius: '10px', cursor: 'pointer', gap: '6px' }}>
                  <span style={{ fontSize: '24px' }}>+</span>
                  <span style={{ fontSize: '12px', color: D.text3 }}>Cliquez pour ajouter des images</span>
                </label>
                <input id="img-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

                {imagePreview && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ ...labelStyle, marginBottom: '8px' }}>Vignette</p>
                    <img src={imagePreview} alt="thumb" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${D.tealRing}` }} />
                  </div>
                )}

                {(formData.images?.length ?? 0) > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={labelStyle}>Galerie ({formData.images!.length})</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
                      {formData.images!.map((img, i) => (
                        <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${formData.thumbnail === img ? D.teal : D.border}` }}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                          >
                            {formData.thumbnail !== img && (
                              <button onClick={() => handleSetThumbnail(img)} style={{ padding: '4px 8px', background: D.tealBg, color: D.teal, border: `1px solid ${D.tealRing}`, borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: '700' }}>
                                Vignette
                              </button>
                            )}
                            <button onClick={() => handleRemoveImage(i)} style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: '700' }}>
                              Retirer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Field>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button onClick={handleSave} style={{ flex: 1, padding: '13px', background: `linear-gradient(135deg, ${D.tealDk}, ${D.teal})`, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Enregistrer
                </button>
                <button onClick={closeModal} style={{ flex: 1, padding: '13px', background: 'transparent', color: D.text2, border: `1px solid ${D.border}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input:focus, select:focus, textarea:focus { border-color: ${D.teal} !important; box-shadow: 0 0 0 3px ${D.tealBg}; }
        select option { background: ${D.card}; color: ${D.text1}; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${D.border}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${D.teal}; }
      `}</style>
    </div>
  );
}
