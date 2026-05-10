'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CONFIG_VERSION = 7; // bump whenever DEFAULTS shape changes to clear stale localStorage

interface ResidenceCfg { thumbnail: string; gridSize: 2|3|4|5|6; mapEmbed?: string }
interface BlogCfg      { coverImage: string }
export interface HomeMedia  { id: string; type: 'image'|'video'; src: string; label: string; order: number }
export interface VideoEntry { id: string; url: string; label: string; order: number }

export interface SiteConfig {
  residences:  Record<string, ResidenceCfg>;
  blog:        Record<string, BlogCfg>;
  apropos:     { story_fr: string; story_ar: string };
  contact:     { email: string; phone: string; address: string };
  social:      { facebook: string; instagram: string; linkedin: string; youtube: string };
  homeMedia:   HomeMedia[];
  videos:      VideoEntry[];
  aboutImage:  string;
  darkMode:    boolean;
}

const DEFAULTS: SiteConfig = {
  residences: {
    // Jijel: 36.8206°N 5.7667°E — city-level zoom
    elysia:          { thumbnail: '/residences/elysia/vue-001-1.jpg',        gridSize: 4, mapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50000!2d5.7667!3d36.8206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sdz!4v1715000000000' },
    // Dely Brahim, Alger: 36.7397°N 2.9943°E — neighbourhood zoom
    'les-3-princes': { thumbnail: '/residences/les-3-princes/vue-2.jpg',     gridSize: 3, mapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d2.9943!3d36.7397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sdz!4v1715000000000' },
    orea:            { thumbnail: '/residences/orea/b1.jpg',                 gridSize: 3, mapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d2.9943!3d36.7397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sdz!4v1715000000000' },
    lumalac:         { thumbnail: '/residences/lumalac/lumalac-1.png',       gridSize: 2, mapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d2.9943!3d36.7397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sdz!4v1715000000000' },
    marmo:           { thumbnail: '/residences/marmo/1.jpg',                 gridSize: 2, mapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d2.9943!3d36.7397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sdz!4v1715000000000' },
    vertdalya:       { thumbnail: '/residences/vertdalya/vrtdalya.png',      gridSize: 4, mapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d2.9943!3d36.7397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sdz!4v1715000000000' },
  },
  blog: {},
  apropos: { story_fr: '', story_ar: '' },
  contact: { email: 'contact@hamadat.dz', phone: '+213 21 00 00 00', address: 'Alger, Algérie' },
  social:  { facebook: '', instagram: '', linkedin: '', youtube: '' },
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

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULTS);

  useEffect(() => {
    try {
      const version = localStorage.getItem('hamadat-site-config-version');
      if (version !== String(CONFIG_VERSION)) {
        localStorage.removeItem('hamadat-site-config');
        localStorage.setItem('hamadat-site-config-version', String(CONFIG_VERSION));
        return;
      }
      const raw = localStorage.getItem('hamadat-site-config');
      if (raw) {
        const stored = JSON.parse(raw) as Partial<SiteConfig>;
        setConfig(deepMerge(DEFAULTS, stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const updateConfig = (patch: Partial<SiteConfig>) => {
    setConfig(prev => {
      const next = deepMerge(prev, patch) as SiteConfig;
      const merged: SiteConfig = { ...next };
      if (patch.homeMedia   !== undefined) merged.homeMedia   = patch.homeMedia;
      if (patch.videos      !== undefined) merged.videos      = patch.videos;
      if (patch.residences  !== undefined) merged.residences  = { ...next.residences, ...patch.residences };
      if (patch.blog        !== undefined) merged.blog        = { ...next.blog, ...patch.blog };
      if (patch.apropos     !== undefined) merged.apropos     = { ...next.apropos, ...patch.apropos };
      if (patch.contact     !== undefined) merged.contact     = { ...next.contact, ...patch.contact };
      if (patch.social      !== undefined) merged.social      = { ...next.social, ...patch.social };
      if (patch.aboutImage  !== undefined) merged.aboutImage  = patch.aboutImage;
      if (patch.darkMode    !== undefined) merged.darkMode    = patch.darkMode;
      try {
        localStorage.setItem('hamadat-site-config', JSON.stringify(merged));
        localStorage.setItem('hamadat-site-config-version', String(CONFIG_VERSION));
      } catch {
        // ignore storage errors
      }
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
