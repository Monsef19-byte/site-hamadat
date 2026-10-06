// Génère actualites.html — UNE seule actualité, sans historique, remplacée
// à chaque mise à jour depuis le dashboard (onglet « Actualités » →
// data/actualites.json) : titre, date, photo principale, texte, galerie de
// photos. Aucune intervention technique nécessaire pour la mettre à jour.
"use strict";

const { residenceCover, e, bi_inline, assetUrl, icon, paragraphsHtml, HEAD, nav, footer, progressCircle } = require("./common");
const { mediaHero } = require("./components");

const ROOT = "";

const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MONTHS_AR = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!m) return null;
  const y = m[1], mo = Number(m[2]) - 1, d = Number(m[3]);
  if (mo < 0 || mo > 11) return null;
  return { fr: `${d} ${MONTHS_FR[mo]} ${y}`, ar: `${d} ${MONTHS_AR[mo]} ${y}` };
}

// Espace « Nos résidences » en bas de page (suivi des projets) : même grille
// que l'accueil, onglet « En cours » par défaut, « Références » pour les
// projets livrés, avancement en cercle statique pour les projets en cours.
function residencesTracker(N, RES, CAR) {
  if (N.tracker_enabled === false || !(RES || []).length) return "";
  const cards = RES.map((r) => {
    const asset = residenceCover(r, CAR);
    const badge = r.category === "en_cours"
      ? `<span class="res-card__badge res-card__badge--teal">${bi_inline("En cours", "قيد الإنجاز")}</span>`
      : `<span class="res-card__badge res-card__badge--status">${bi_inline("Référence", "مرجع")}</span>`;
    const pct = r.category === "en_cours" && r.progress_percent !== null && r.progress_percent !== undefined
      ? `<div class="progress-mini">${progressCircle(r.progress_percent, { size: 52 })}</div>` : "";
    return `
    <a href="residences/${r.id}.html" class="res-card reveal" data-category="${r.category}"${r.category === "en_cours" ? "" : ' style="display:none"'}>
      <img src="${assetUrl(ROOT, asset)}" alt="${e(r.name)}" loading="lazy">
      <div class="res-card__scrim"></div>
      <div class="res-card__badges">${badge}</div>
      <div class="res-card__body">
        <h3>${e(r.name)}</h3>
        <div class="loc">${icon("pin", { size: 13 })} ${e(r.location_fr)}</div>
        <span class="avail-chip ${r.avail_open ? "avail-chip--open" : "avail-chip--sold"}">${bi_inline(r.availability_fr, r.availability_ar)}</span>
        ${pct}
        <div class="res-card__cta">${bi_inline("Voir la fiche", "عرض البطاقة")} →</div>
      </div>
    </a>`;
  }).join("");
  return `
<section id="residences" class="section--tint">
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">${bi_inline("Nos résidences", "إقاماتنا")}</div>
      <h2>${bi_inline(N.tracker_title_fr || "L'avancement de chaque résidence", N.tracker_title_ar || N.tracker_title_fr || "تقدّم كل إقامة")}</h2>
      ${N.tracker_text_fr ? `<p>${bi_inline(N.tracker_text_fr, N.tracker_text_ar || N.tracker_text_fr)}</p>` : ""}
    </div>
    <div class="tabs" data-tabs="#news-grid">
      <button class="tab-btn active" data-filter="en_cours">${bi_inline("En cours", "قيد الإنجاز")}</button>
      <button class="tab-btn" data-filter="livre">${bi_inline("Références", "مراجعنا")}</button>
      <button class="tab-btn" data-filter="all">${bi_inline("Tous", "الكل")}</button>
    </div>
    <div class="res-grid" id="news-grid">${cards}
    </div>
  </div>
</section>
`;
}

function genActualites({ G, RES, CAR, BLOG, NEWS }) {
  const N = NEWS || {};
  const date = formatDate(N.date);
  // Bandeau en images en haut de page : photo principale puis photos de
  // l'actualité (carrousel), à la place de l'ancien fond noir.
  const heroImages = [];
  if (N.cover) heroImages.push({ asset: N.cover, caption_fr: "", caption_ar: "" });
  (N.images || []).forEach((im) => { if (im && im.asset && im.asset !== N.cover) heroImages.push(im); });
  const HERO = mediaHero(heroImages, ROOT, {
    eyebrow: bi_inline("Actualités", "المستجدات"),
    title: bi_inline(N.page_title_fr || "Actualités", N.page_title_ar || "المستجدات"),
    lead: N.page_text_fr ? bi_inline(N.page_text_fr, N.page_text_ar || N.page_text_fr) : "",
  });

  const hasContent = N.title_fr || N.body_fr;
  const ARTICLE = hasContent
    ? `
<section class="news-article-section">
  <div class="container news-article">
    <article class="reveal">
      ${date ? `<div class="news-article__date">${icon("calendar", { size: 15 })} ${bi_inline(date.fr, date.ar)}</div>` : ""}
      ${N.title_fr ? `<h2 class="news-article__title">${bi_inline(N.title_fr, N.title_ar || N.title_fr)}</h2>` : ""}
      <div class="blog-article__body news-article__body" lang="fr">${paragraphsHtml(N.body_fr)}</div>
      <div class="blog-article__body news-article__body" lang="ar">${paragraphsHtml(N.body_ar || N.body_fr)}</div>
    </article>
  </div>
</section>`
    : `
<section>
  <div class="container"><p class="news-empty">${bi_inline("Aucune actualité pour le moment — revenez bientôt.", "لا توجد مستجدات حاليًا — عودوا قريبًا.")}</p></div>
</section>`;

  const NOTE = `
<section class="section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <div>
        <h3>${bi_inline("Une question sur l'un de nos projets ?", "لديكم سؤال حول أحد مشاريعنا؟")}</h3>
        <p>${bi_inline("Nos conseillers vous répondent rapidement.", "مستشارونا يجيبونكم في أقرب الآجال.")}</p>
      </div>
      <div class="cta-band__actions">
        <a href="index.html#contact" class="btn btn--dark" data-rdv-trigger>${bi_inline("Prendre rendez-vous", "أخذ موعد")}</a>
      </div>
    </div>
  </div>
</section>
`;

  return (
    HEAD({
      title: `${e(N.page_title_fr || "Actualités")} — Hamadat Promotion Immobilière`.replace(/"/g, "&quot;"),
      desc: e(String(N.body_fr || "Actualités de Hamadat Promotion Immobilière.").replace(/\s+/g, " ").slice(0, 155)).replace(/"/g, "&quot;"),
      root: ROOT,
    }) +
    nav(RES, ROOT, { blogEnabled: BLOG.enabled }) +
    HERO +
    ARTICLE +
    residencesTracker(N, RES, CAR) +
    NOTE +
    footer(G, RES, ROOT, { blogEnabled: BLOG.enabled })
  );
}

module.exports = { genActualites };
