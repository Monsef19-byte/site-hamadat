// Helpers communs pour générer le site statique Hamadat (bilingue FR/AR).
// Port direct de gen_common.py — mêmes templates, même sortie HTML.
"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function readJSON(file, fallback) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function loadData() {
  const G = readJSON("global.json", {});
  const RES = readJSON("residences.json", []);
  const CAR = readJSON("home_carousel.json", []);
  const BLOG = readJSON("blog.json", { enabled: false, page_title_fr: "", page_title_ar: "", page_intro_fr: "", page_intro_ar: "", articles: [] });
  const LINKS = readJSON("links.json", { page_title_fr: "", page_title_ar: "", intro_fr: "", intro_ar: "", items: [] });
  const VIDEOS = readJSON("videos.json", { section_title_fr: "", section_title_ar: "", section_text_fr: "", section_text_ar: "", items: [] });
  const GALLERY = readJSON("gallery.json", { enabled: true, section_title_fr: "", section_title_ar: "", section_text_fr: "", section_text_ar: "", items: [] });
  const OPP = readJSON("opportunites.json", {
    hero_title_fr: "", hero_title_ar: "", hero_text_fr: "", hero_text_ar: "",
    categories_title_fr: "", categories_title_ar: "", categories: [],
    features_title_fr: "", features_title_ar: "", features: [],
    form_title_fr: "", form_title_ar: "", form_text_fr: "", form_text_ar: "",
    submit_fr: "", submit_ar: "",
  });
  const NEWS = readJSON("actualites.json", {
    page_title_fr: "", page_title_ar: "", page_text_fr: "", page_text_ar: "",
    title_fr: "", title_ar: "", date: "", cover: "", body_fr: "", body_ar: "", images: [],
  });
  if (!OPP.media) OPP.media = { mode: "single", images: [] };
  if (!G.brand) G.brand = {};
  if (!G.social) G.social = {};
  if (!G.about.images) G.about.images = [];
  const SETTINGS = readJSON("settings.json", {});
  // CTA sitewide (bulle flottante / barre d'actions rapides / modal RDV) —
  // rattachés à G plutôt que passés séparément à chaque générateur, pour
  // que nav()/footer() (déjà reçus par toutes les pages) suffisent.
  G.cta = {
    float: SETTINGS.cta_float_enabled !== false,
    minibar: SETTINGS.cta_minibar_enabled !== false,
    rdvModal: SETTINGS.cta_rdv_modal_enabled !== false,
  };
  return { G, RES, CAR, BLOG, LINKS, VIDEOS, GALLERY, OPP, SETTINGS, NEWS };
}

// Convertit un texte "brut" saisi dans l'admin (paragraphes séparés par une
// ligne vide, retours à la ligne simples préservés) en HTML de paragraphes
// <p>, pour le corps des articles de blog. Échappe le HTML au passage.
function paragraphsHtml(text) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${e(block).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

// html.escape(s, quote=False) equivalent: escape & < > only, leave quotes untouched.
function e(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function bi(fr, ar, tag = "span", cls = "") {
  const classattr = cls ? ` class="${cls}"` : "";
  return `<${tag}${classattr}><span lang="fr">${e(fr)}</span><span lang="ar">${e(ar)}</span></${tag}>`;
}

function bi_inline(fr, ar) {
  return `<span lang="fr">${e(fr)}</span><span lang="ar">${e(ar)}</span>`;
}

// Résout le chemin d'une image : si l'admin a uploadé le fichier, l'asset
// est soit une URL Vercel Blob absolue (https://..., production) soit un
// chemin déjà servi depuis la racine (/assets/..., écrit par l'adaptateur
// d'upload local) — dans les deux cas on l'utilise tel quel. Sinon (chemin
// relatif d'origine, ex: "residences/foo/hero.jpg") on préfixe avec
// root + "assets/" comme pour les images statiques du site.
function assetUrl(root, asset) {
  if (!asset) return "";
  if (/^https?:\/\//i.test(asset) || asset.startsWith("/")) return asset;
  return `${root}assets/${asset}`;
}

// Extrait l'identifiant à 11 caractères d'une URL YouTube, quel que soit son
// format (watch?v=, youtu.be/, embed/, shorts/) — ou accepte directement un
// identifiant brut. Retourne null si non reconnu (carte vidéo alors ignorée
// plutôt que de générer un lien cassé).
function youtubeId(url) {
  if (!url) return null;
  const s = String(url).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*\bv=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/(?:embed|shorts)\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

function youtubeThumb(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// ---------------------------------------------------------------------------
// Icônes en ligne (style Feather/Lucide — traits fins, coins arrondis).
// Registre unique partagé avec le sélecteur d'icône de l'admin, voir
// lib/icons.js (et public/admin/icons-data.js, généré au build).
// ---------------------------------------------------------------------------
const { ICONS } = require("./icons");

// Ancien système de détection automatique par mot-clé — conservé uniquement
// comme filet de sécurité pour d'éventuelles données non migrées (icône
// manquante) ; le choix d'icône se fait désormais explicitement dans
// l'admin (voir lib/icons.js + le sélecteur visuel).
const FEATURE_ICON_RULES = [
  ["ascenseur", "lift"],
  ["sécurité", "shield"],
  ["parking", "car"],
  ["aire de jeux", "playground"],
  ["climatisation", "snowflake"],
  ["chauffage", "snowflake"],
  ["cuisine", "utensils"],
  ["dressing", "closet"],
  ["interphone", "bell"],
  ["bâche", "droplet"],
  ["jacuzzi", "droplet"],
  ["piscine", "droplet"],
  ["hammam", "droplet"],
  ["salle de sport", "dumbbell"],
  ["conception architecturale", "building"],
  ["design contemporain", "building"],
  ["façade", "layers"],
  ["fenêtre", "window"],
  ["finitions", "sparkles"],
  ["isolation", "soundwave"],
  ["matériaux", "package"],
  ["revêtements", "grid"],
  ["savoir-faire", "badge"],
  ["délais", "clock"],
  ["suivi", "eye"],
  ["transparen", "eye"],
];

function featureIconName(textFr) {
  const low = String(textFr).toLowerCase();
  for (const [kw, name] of FEATURE_ICON_RULES) {
    if (low.includes(kw)) return name;
  }
  return "check-circle";
}

function icon(name, { cls = "icon", size = 16 } = {}) {
  const entry = ICONS[name] || ICONS["check-circle"];
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${entry.d}</svg>`;
}

// Slogan de marque — source unique (Contenu global → « Slogan »), repris
// dans le pied de page de toutes les pages et le titre de l'accueil.
function slogan(G) {
  const b = G.brand || {};
  return { fr: b.slogan_fr || "", ar: b.slogan_ar || b.slogan_fr || "" };
}

// Indicateur d'avancement : un simple cercle STATIQUE avec le pourcentage
// au centre — pas d'arc de progression, pas de barre ni d'animation
// (demande client : « uniquement le pourcentage dans un cercle statique »).
function progressCircle(pct, { size = 64, label = true } = {}) {
  const p = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return `<div class="progress-circle" style="--pc-size:${size}px" role="img" aria-label="Avancement ${p}%"><span class="progress-circle__value">${p}%</span></div>${label ? `<div class="progress-circle__label">${bi_inline("Avancement", "نسبة التقدّم")}</div>` : ""}`;
}

// Réseaux sociaux (Contenu global → « Réseaux sociaux ») — un champ vide
// masque l'icône correspondante, jamais de lien mort.
const SOCIAL_NETWORKS = [
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["youtube", "YouTube"],
  ["tiktok", "TikTok"],
  ["linkedin", "LinkedIn"],
  ["x", "X"],
];
function socialLinks(G) {
  const S = G.social || {};
  const items = SOCIAL_NETWORKS.filter(([k]) => /^https?:\/\//i.test(String(S[k] || "").trim()))
    .map(([k, label]) => `<a class="social-link" href="${e(String(S[k]).trim())}" target="_blank" rel="noopener" aria-label="${label}" title="${label}">${icon(k, { size: 18 })}</a>`)
    .join("");
  return items ? `<div class="social-links">${items}</div>` : "";
}

// Option vide « Choisissez » des listes déroulantes — valeur vide + required
// côté <select> pour que le navigateur ET notre validation JS refusent
// l'envoi tant qu'aucun choix n'est fait. Le texte suit la langue (main.js).
function chooseOption() {
  return `<option value="" selected disabled data-choose-fr="Choisissez" data-choose-ar="اختر">Choisissez</option>`;
}

const HEAD = ({ title, desc, root }) => `<!doctype html>
<html lang="fr" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="icon" href="${root}assets/logo/hamadat-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}assets/css/style.css">
</head>
<body>
`;

function nav(RES, root = "", opts = {}) {
  const link = (href, fr, ar) => `<a href="${root}${href}">${bi_inline(fr, ar)}</a>`;
  return `
<div class="nav-wrap">
  <nav class="nav">
    <a class="nav__logo" href="${root}index.html">
      <img src="${root}assets/logo/hamadat-logo.png" alt="Hamadat Promotion Immobilière">
    </a>
    <div class="nav__links">
      ${link("index.html", "Accueil", "الرئيسية")}
      ${link("apropos.html", "Qui sommes-nous", "من نحن")}
      ${link("index.html#residences", "Nos résidences", "إقاماتنا")}
      ${link("actualites.html", "Actualités", "المستجدات")}
      ${link("opportunites.html", "Opportunités", "الفرص")}
      ${opts.blogEnabled ? link("blog.html", "Blog", "المدونة") : ""}
      ${link("index.html#contact", "Contact", "اتصل بنا")}
    </div>
    <div class="nav__right">
      <button class="theme-toggle" aria-label="Basculer le mode sombre">
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
      </button>
      <div class="lang-toggle">
        <button data-lang="fr" class="active">FR</button>
        <button data-lang="ar">AR</button>
      </div>
      <a class="nav__cta" href="${root}index.html#contact" data-rdv-trigger>${bi_inline("Prendre rendez-vous", "أخذ موعد")}</a>
      <button class="nav__burger" aria-label="menu">${icon("menu", { size: 18 })}</button>
    </div>
  </nav>
</div>
`;
}

// tel:/wa.me href derivés du numéro affiché dans les Coordonnées — pas de
// numéro figé dans le code : dès que G.contact.phone change (dashboard),
// tous les CTA (bulle flottante, barre d'actions rapides, modal RDV) suivent
// automatiquement, sans jamais pouvoir désynchroniser (contrairement au bug
// corrigé côté New Era, où un second numéro était resté codé en dur).
// Un numéro n'est considéré valide qu'avec au moins 8 chiffres : un
// numéro factice (« +213 XX XX XX XX ») ne doit jamais produire un lien
// tel:+213 qui appelle dans le vide — les boutons renvoient alors vers le
// formulaire de contact en attendant la saisie du vrai numéro (dashboard).
function phoneIsValid(phone) {
  return String(phone || "").replace(/\D/g, "").length >= 8;
}
function telHref(phone) {
  if (!phoneIsValid(phone)) return null;
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}
function waHref(phone) {
  if (!phoneIsValid(phone)) return null;
  return `https://wa.me/${String(phone).replace(/\D/g, "")}`;
}

function floatingCta(G, root = "") {
  const contactHref = `${root}index.html#contact`;
  const tel = telHref(G.contact.phone) || contactHref;
  const wa = waHref(G.contact.phone);
  const cta = G.cta || { float: true, minibar: true, rdvModal: true };
  // Le bouton RDV reste un lien plein vers #contact quand le modal est
  // désactivé — jamais un href="#" mort : le clic garde un effet utile
  // même sans JS de modal.
  const rdvAttrs = cta.rdvModal ? ' data-rdv-trigger' : "";

  const floatBlock = cta.float
    ? `
<div class="float-cta" id="floatCta" aria-label="Contact rapide">${icon("phone", { size: 22 })}</div>
<div class="float-card" id="floatCard">
  <div class="x" id="floatClose">✕</div>
  <p>${bi_inline("Une question sur votre projet ?", "لديكم سؤال حول مشروعكم؟")}</p>
  <a class="float-btn call" href="${tel}">${bi_inline("Appeler maintenant", "اتصل الآن")}</a>
  ${wa ? `<a class="float-btn wa" href="${wa}" target="_blank" rel="noopener">${bi_inline("WhatsApp", "واتساب")}</a>` : ""}
</div>`
    : "";

  const minibarBlock = cta.minibar
    ? `
<nav class="mini-cta-bar" aria-label="${e("Actions rapides")}">
  <a href="${tel}">${icon("phone", { size: 18 })}<span>${bi_inline("Appeler", "اتصال")}</span></a>
  ${wa ? `<a class="mid" href="${wa}" target="_blank" rel="noopener">${icon("whatsapp", { size: 18 })}<span>WhatsApp</span></a>` : ""}
  <a href="${contactHref}"${rdvAttrs}>${icon("calendar", { size: 18 })}<span>${bi_inline("RDV", "موعد")}</span></a>
</nav>`
    : "";

  return `${floatBlock}${minibarBlock}
<script>window.HAMADAT_CTA_FLAGS=${JSON.stringify(cta)};</script>
`;
}

function footer(G, RES, root = "", opts = {}) {
  const resLinks = RES.slice(0, 6)
    .map((r) => `<li><a href="${root}residences/${r.id}.html">${e(r.name)}</a></li>`)
    .join("\n          ");
  return `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-logo">
          <img src="${root}assets/logo/hamadat-logo.png" alt="Hamadat">
        </div>
        <p class="footer-slogan">${bi_inline(slogan(G).fr, slogan(G).ar)}</p>
        ${socialLinks(G)}
      </div>
      <div>
        <h4>${bi_inline("Navigation", "روابط")}</h4>
        <ul>
          <li><a href="${root}index.html">${bi_inline("Accueil", "الرئيسية")}</a></li>
          <li><a href="${root}apropos.html">${bi_inline("Qui sommes-nous", "من نحن")}</a></li>
          <li><a href="${root}index.html#residences">${bi_inline("Nos résidences", "إقاماتنا")}</a></li>
          <li><a href="${root}actualites.html">${bi_inline("Actualités", "المستجدات")}</a></li>
          <li><a href="${root}opportunites.html">${bi_inline("Opportunités", "الفرص")}</a></li>
          ${opts.blogEnabled ? `<li><a href="${root}blog.html">${bi_inline("Blog", "المدونة")}</a></li>` : ""}
          <li><a href="${root}liens.html">${bi_inline("Liens", "الروابط")}</a></li>
        </ul>
      </div>
      <div>
        <h4>${bi_inline("Résidences", "الإقامات")}</h4>
        <ul>
          ${resLinks}
        </ul>
      </div>
      <div>
        <h4>${bi_inline("Contact", "اتصل بنا")}</h4>
        <ul>
          <li>${bi_inline(G.contact.city_fr, G.contact.city_ar)}</li>
          <li><a href="${root}index.html#contact" data-rdv-trigger>${bi_inline("Prendre rendez-vous", "أخذ موعد")}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© ${new Date().getFullYear()} ${e(G.contact.company_name_fr)} — ${bi_inline("Tous droits réservés", "جميع الحقوق محفوظة")}</div>
    </div>
  </div>
</footer>
${floatingCta(G, root)}
<script>window.HAMADAT_CONTACT_EMAIL=${JSON.stringify(G.contact.email || "")};</script>
<script src="${root}assets/js/main.js"></script>
</body>
</html>
`;
}

function contactSection(G) {
  let fieldsHtml = "";
  for (const f of G.contact.fields) {
    if (f.type === "select") {
      const opts = f.options.map((o) => `<option>${e(o)}</option>`).join("");
      fieldsHtml += `
      <div class="form-field">
        <label>${bi_inline(f.label_fr, f.label_ar)} <span class="req" aria-hidden="true">*</span></label>
        <select name="${f.name}" required>${chooseOption()}${opts}</select>
      </div>`;
    } else {
      fieldsHtml += `
      <div class="form-field">
        <label>${bi_inline(f.label_fr, f.label_ar)} <span class="req" aria-hidden="true">*</span></label>
        <input type="${f.type}" name="${f.name}" required${f.type === "tel" ? ' inputmode="tel" autocomplete="tel"' : ""}${f.type === "email" ? ' autocomplete="email"' : ""}>
      </div>`;
    }
  }
  return `
<section id="contact" class="section--tint">
  <div class="container">
    <div class="contact-grid">
      <div class="reveal">
        <div class="eyebrow">${bi_inline("Contact", "اتصل بنا")}</div>
        <h2>${bi_inline(G.contact.title_fr, G.contact.title_ar)}</h2>
        <p>${bi_inline(G.contact.text_fr, G.contact.text_ar)}</p>
        <form data-contact-form data-lead-source="contact" novalidate>
          ${fieldsHtml}
          <div class="form-field">
            <label>${bi_inline("Description (facultatif)", "الوصف (اختياري)")}</label>
            <textarea rows="4" name="message"></textarea>
          </div>
          <div class="form-field form-field--hp" aria-hidden="true">
            <label>Laisser vide / اترك فارغًا</label>
            <input type="text" name="website" tabindex="-1" autocomplete="off">
          </div>
          <div class="form-msg" data-form-msg role="status" aria-live="polite"></div>
          <button type="submit" class="btn btn--primary">${bi_inline(G.contact.submit_fr, G.contact.submit_ar)}</button>
        </form>
      </div>
      <div class="contact-info-card reveal">
        <h3>${bi_inline(G.contact.company_name_fr, G.contact.company_name_ar)}</h3>
        <div class="row"><span>${icon("pin")}</span><span>${bi_inline(G.contact.address_fr, G.contact.address_ar)}</span></div>
        ${phoneIsValid(G.contact.phone) ? `<div class="row"><span>${icon("phone")}</span><span><a href="${telHref(G.contact.phone)}" dir="ltr">${e(G.contact.phone)}</a></span></div>` : ""}
        <div class="row"><span>${icon("mail")}</span><span>${e(G.contact.email)}</span></div>
        <div class="row"><span>${icon("badge")}</span><span>${bi_inline(G.contact.badge_fr, G.contact.badge_ar)}</span></div>
      </div>
    </div>
  </div>
</section>
`;
}

module.exports = { loadData, e, bi, bi_inline, assetUrl, youtubeId, youtubeThumb, paragraphsHtml, icon, featureIconName, HEAD, nav, footer, contactSection, slogan, progressCircle, socialLinks, chooseOption, phoneIsValid };
