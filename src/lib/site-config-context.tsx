'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CONFIG_VERSION = 10; // bump whenever DEFAULTS shape changes to clear stale localStorage

interface ResidenceCfg { thumbnail: string; gridSize: 2|3|4|5|6; mapEmbed?: string }
interface BlogCfg      { coverImage: string }
export interface HomeMedia  { id: string; type: 'image'|'video'; src: string; label: string; order: number }
export interface VideoEntry { id: string; url: string; label: string; order: number }
export interface ResidenceEntry {
  id: string; slug: string;
  name_fr: string; name_ar: string;
  location: string;
  status: 'ongoing' | 'completed' | 'sold';
  units: number; typology: string;
  description_fr: string; description_ar: string;
  available?: string; delivery?: string;
  featuredOnHome?: boolean;
}

export interface SiteConfig {
  residences:    Record<string, ResidenceCfg>;
  residenceList: ResidenceEntry[];
  blog:          Record<string, BlogCfg>;
  apropos:     { story_fr: string; story_ar: string; mission_fr: string; mission_ar: string; vision_fr: string; vision_ar: string };
  contact:     { email: string; phone: string; address: string; mapEmbed: string };
  social:      { facebook: string; instagram: string; linkedin: string; youtube: string; tiktok: string; twitter: string };
  homeMedia:   HomeMedia[];
  videos:      VideoEntry[];
  aboutImage:  string;
  darkMode:    boolean;
  heroVideo: string;
  heroTitle: string;
  heroTitle_ar: string;
  heroSubtitle_fr: string;
  heroSubtitle_ar: string;
  ctaTitle_fr: string;
  ctaTitle_ar: string;
  ctaButton_fr: string;
  ctaButton_ar: string;
}

const DEFAULTS: SiteConfig = {
  residenceList: [
    { id: '1', slug: 'elysia',        name_fr: 'Elysia',        name_ar: 'إليسيا',       location: 'Jijel',              status: 'ongoing',   units: 56, typology: 'F3 (96 m² — 110 m²)',   description_fr: "Implantée à Jijel, la résidence Elysia est un projet en cours développé par Hamadat Promotion Immobilière, proposant 56 logements de type F3 aux surfaces optimisées (96 m² et 110 m²). Pensée pour offrir un équilibre entre espace, luminosité et confort, Elysia s'inscrit dans une dynamique urbaine attractive.", description_ar: 'في جيجل، تقدم إليسيا 56 وحدة سكنية من نوع F3 بمساحات 96 و110 م².', available: '', delivery: '24 mois', featuredOnHome: true },
    { id: '2', slug: 'les-3-princes', name_fr: 'Les 3 Princes', name_ar: 'الثلاث أمراء', location: 'Dely Brahim, Alger', status: 'completed', units: 43, typology: 'F3 à F6 — Simplex & Duplex', description_fr: 'La résidence Les 3 Princes est un projet achevé comprenant 43 appartements allant du F3 au F6, répartis en simplex et duplex.',                                                                                                                                                                              description_ar: 'مجمع مكتمل في دالي إبراهيم يضم 43 شقة من F3 إلى F6.', available: '', delivery: '', featuredOnHome: false },
    { id: '3', slug: 'orea',          name_fr: 'Orea',          name_ar: 'أوريا',         location: 'Dely Brahim, Alger', status: 'ongoing',   units: 38, typology: 'F3 à F6',               description_fr: 'Orea est un projet en cours proposant 38 appartements allant du F3 au F6, situé à Dely Brahim.',                                                                                                                                                                                               description_ar: 'أوريا مشروع جارٍ يضم 38 شقة من F3 إلى F6.', available: '2 F3, 1 F4', delivery: '24 mois', featuredOnHome: true },
    { id: '4', slug: 'lumalac',       name_fr: 'Lumalac',       name_ar: 'لوملاك',        location: 'Dely Brahim, Alger', status: 'ongoing',   units: 8,  typology: '6 × F3 — 2 × Triplex F7', description_fr: 'La résidence Lumalac est un projet en cours composé de 8 logements, dont 6 appartements F3 et 2 triplex F7, à Dely Brahim.',                                                                                                                                                                   description_ar: 'لوملاك مشروع حديث في دالي إبراهيم يضم 8 وحدات.', available: '', delivery: '', featuredOnHome: false },
    { id: '5', slug: 'marmo',         name_fr: 'Marmo',         name_ar: 'مارمو',         location: 'Dely Brahim, Alger', status: 'completed', units: 8,  typology: '6 × F3 — 2 × Duplex F6', description_fr: 'Le projet Marmo est une résidence livrée de 8 logements, dont 6 appartements F3 et 2 duplex F6, à Dely Brahim.',                                                                                                                                                                              description_ar: 'مارمو مجمع سكني مسلم في دالي إبراهيم يضم 8 وحدات.', available: '', delivery: '', featuredOnHome: false },
    { id: '6', slug: 'vertdalya',     name_fr: 'Vert Dalya',    name_ar: 'فيرت داليا',    location: 'Dely Brahim, Alger', status: 'completed', units: 10, typology: 'Loft 270 m²',            description_fr: 'Vertdalya est une résidence finalisée composée de 10 lofts spacieux de 270 m², alliant confort et design contemporain.',                                                                                                                                                                        description_ar: 'فيرت داليا مجمع مكتمل في دالي إبراهيم يضم 10 شقق من نوع لوفت.', available: 'Disponible', delivery: '', featuredOnHome: false },
  ],
  residences: {
    // Elysia — Jijel (36.82°N 5.77°E)
    elysia:          { thumbnail: '/residences/elysia/vue-001-1.jpg',        gridSize: 4, mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=5.5%2C36.65%2C6.05%2C37.0&layer=mapnik&marker=36.8206%2C5.7667' },
    // Dely Brahim, Alger (36.74°N 2.99°E)
    'les-3-princes': { thumbnail: '/residences/les-3-princes/vue-2.jpg',     gridSize: 3, mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=2.88%2C36.69%2C3.11%2C36.80&layer=mapnik&marker=36.7397%2C2.9943' },
    orea:            { thumbnail: '/residences/orea/b1.jpg',                 gridSize: 3, mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=2.88%2C36.69%2C3.11%2C36.80&layer=mapnik&marker=36.7397%2C2.9943' },
    lumalac:         { thumbnail: '/residences/lumalac/lumalac-1.png',       gridSize: 2, mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=2.88%2C36.69%2C3.11%2C36.80&layer=mapnik&marker=36.7397%2C2.9943' },
    marmo:           { thumbnail: '/residences/marmo/1.jpg',                 gridSize: 2, mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=2.88%2C36.69%2C3.11%2C36.80&layer=mapnik&marker=36.7397%2C2.9943' },
    vertdalya:       { thumbnail: '/residences/vertdalya/vrtdalya.png',      gridSize: 4, mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=2.88%2C36.69%2C3.11%2C36.80&layer=mapnik&marker=36.7397%2C2.9943' },
  },
  blog: {},
  apropos: { story_fr: '', story_ar: '', mission_fr: '', mission_ar: '', vision_fr: '', vision_ar: '' },
  contact: { email: 'contact@hamadat.dz', phone: '+213 21 00 00 00', address: 'Alger, Algérie', mapEmbed: '' },
  social:  { facebook: '', instagram: '', linkedin: '', youtube: '', tiktok: '', twitter: '' },
  homeMedia: [
    { id: '1', type: 'image', src: '/residences/elysia/vue-001-1.jpg',    label: 'Elysia',        order: 0 },
    { id: '2', type: 'image', src: '/residences/les-3-princes/vue-2.jpg', label: 'Les 3 Princes', order: 1 },
  ],
  videos: [
    { id: 'v1', url: 'https://youtu.be/SDcC89WZURM',  label: 'Résidence Elysia',       order: 0 },
    { id: 'v2', url: 'https://youtu.be/tsqQgXL7rQA',  label: 'Les 3 Princes',          order: 1 },
    { id: 'v3', url: 'https://youtu.be/3sxR15_FN2s',  label: 'Résidence Orea',         order: 2 },
  ],
  aboutImage: '/residences/les-3-princes/vue-2.jpg',
  darkMode: false,
  heroVideo: '/hero.mp4',
  heroTitle: 'Hamadat',
  heroTitle_ar: 'حمادات',
  heroSubtitle_fr: 'Promotion Immobilière de Prestige',
  heroSubtitle_ar: 'ترقية عقارية فاخرة',
  ctaTitle_fr: 'Votre futur chez-vous commence ici',
  ctaTitle_ar: 'منزلك المستقبلي يبدأ هنا',
  ctaButton_fr: 'Contactez-nous',
  ctaButton_ar: 'تواصل معنا',
};

function deepMerge<T>(defaults: T, stored: Partial<T>): T {
  if (typeof defaults !== 'object' || defaults === null || Array.isArray(defaults)) {
    return (stored !== undefined ? stored : defaults) as T;
  }
  const result = { ...defaults } as Record<string, unknown>;
  for (const key of Object.keys(stored as object)) {
    const storedVal = (stored as Record<string, unknown>)[key];
    const defaultVal = (defaults as Record<string, unknown>)[key];
    if (Array.isArray(storedVal)) {
      result[key] = storedVal;
    } else if (typeof storedVal === 'object' && storedVal !== null && typeof defaultVal === 'object' && defaultVal !== null && !Array.isArray(defaultVal)) {
      result[key] = deepMerge(defaultVal as object, storedVal as Partial<object>);
    } else if (storedVal !== undefined) {
      result[key] = storedVal;
    }
  }
  return result as T;
}

interface SiteConfigCtx {
  config: SiteConfig;
  updateConfig: (patch: Partial<SiteConfig>) => void;
}

const SiteConfigContext = createContext<SiteConfigCtx | undefined>(undefined);

function applyPatch(prev: SiteConfig, patch: Partial<SiteConfig>): SiteConfig {
  const next = deepMerge(prev, patch) as SiteConfig;
  const merged: SiteConfig = { ...next };
  if (patch.residenceList !== undefined) merged.residenceList = patch.residenceList;
  if (patch.homeMedia   !== undefined) merged.homeMedia   = patch.homeMedia;
  if (patch.videos      !== undefined) merged.videos      = patch.videos;
  if (patch.residences  !== undefined) merged.residences  = { ...next.residences, ...patch.residences };
  if (patch.blog        !== undefined) merged.blog        = { ...next.blog, ...patch.blog };
  if (patch.apropos     !== undefined) merged.apropos     = { ...next.apropos, ...patch.apropos };
  if (patch.contact     !== undefined) merged.contact     = { ...next.contact, ...patch.contact };
  if (patch.social      !== undefined) merged.social      = { ...next.social, ...patch.social };
  if (patch.aboutImage  !== undefined) merged.aboutImage  = patch.aboutImage;
  if (patch.darkMode    !== undefined) merged.darkMode    = patch.darkMode;
  if (patch.heroVideo       !== undefined) merged.heroVideo       = patch.heroVideo;
  if (patch.heroTitle       !== undefined) merged.heroTitle       = patch.heroTitle;
  if (patch.heroTitle_ar    !== undefined) merged.heroTitle_ar    = patch.heroTitle_ar;
  if (patch.heroSubtitle_fr !== undefined) merged.heroSubtitle_fr = patch.heroSubtitle_fr;
  if (patch.heroSubtitle_ar !== undefined) merged.heroSubtitle_ar = patch.heroSubtitle_ar;
  if (patch.ctaTitle_fr  !== undefined) merged.ctaTitle_fr  = patch.ctaTitle_fr;
  if (patch.ctaTitle_ar  !== undefined) merged.ctaTitle_ar  = patch.ctaTitle_ar;
  if (patch.ctaButton_fr !== undefined) merged.ctaButton_fr = patch.ctaButton_fr;
  if (patch.ctaButton_ar !== undefined) merged.ctaButton_ar = patch.ctaButton_ar;
  return merged;
}

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULTS);

  // Load config from API (server-side KV), fall back to localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/config', { cache: 'no-store' });
        if (res.ok) {
          const remote = await res.json();
          if (remote && !cancelled && typeof remote === 'object' && remote.residenceList) {
            const merged = deepMerge(DEFAULTS, remote);
            // Ensure arrays from remote take precedence
            if (remote.residenceList) merged.residenceList = remote.residenceList;
            if (remote.homeMedia) merged.homeMedia = remote.homeMedia;
            if (remote.videos) merged.videos = remote.videos;
            setConfig(merged);
            return;
          }
        }
      } catch {
        // API unavailable — fall back to localStorage
      }
      // Fallback: localStorage
      try {
        const version = localStorage.getItem('hamadat-site-config-version');
        if (version !== String(CONFIG_VERSION)) {
          localStorage.removeItem('hamadat-site-config');
          localStorage.setItem('hamadat-site-config-version', String(CONFIG_VERSION));
          return;
        }
        const raw = localStorage.getItem('hamadat-site-config');
        if (raw && !cancelled) {
          const stored = JSON.parse(raw) as Partial<SiteConfig>;
          setConfig(deepMerge(DEFAULTS, stored));
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const updateConfig = (patch: Partial<SiteConfig>) => {
    setConfig(prev => {
      const merged = applyPatch(prev, patch);
      // Save to localStorage as cache
      try {
        localStorage.setItem('hamadat-site-config', JSON.stringify(merged));
        localStorage.setItem('hamadat-site-config-version', String(CONFIG_VERSION));
      } catch { /* ignore */ }
      // Save to server (KV) — fire and forget
      fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      }).catch(() => { /* ignore network errors */ });
      return merged;
    });
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfigCtx {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider');
  return ctx;
}
