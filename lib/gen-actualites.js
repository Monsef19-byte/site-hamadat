// Génère actualites.html — page Actualités & avancement.
// Port direct de gen_actualites.py.
"use strict";

const { e, bi_inline, assetUrl, icon, HEAD, nav, footer } = require("./common");

const ROOT = "";

function status_badge(r) {
  if (r.category === "en_cours") {
    return `<span class="res-card__badge res-card__badge--teal">${bi_inline("En cours", "قيد الإنجاز")}</span>`;
  }
  return `<span class="res-card__badge res-card__badge--status">${bi_inline("Livré", "مُسلَّم")}</span>`;
}

function genActualites({ G, RES, CAR, BLOG }) {
  const HERO = `
<section class="page-hero">
  <div class="container">
    <div class="eyebrow">${bi_inline("Actualités", "المستجدات")}</div>
    <h1>${bi_inline(G.news_section.title_fr, G.news_section.title_ar)}</h1>
    <p class="page-hero__lead">${bi_inline(G.news_section.text_fr, G.news_section.text_ar)}</p>
  </div>
</section>
`;

  let cards = "";
  for (const r of RES) {
    const hero = CAR.find((c) => c.residence_id === r.id);
    const asset = hero ? hero.asset : "";
    const avail_cls = r.avail_open ? "avail-chip--open" : "avail-chip--sold";
    let progress_mini = "";
    if (r.progress_percent !== null && r.progress_percent !== undefined) {
      const pct = r.progress_percent;
      progress_mini = `
        <div class="progress-block">
          <div class="progress-label">${bi_inline("Avancement", "التقدّم")} <strong>${pct}%</strong></div>
          <div class="progress-track"><div class="progress-track__bar" style="width:${pct}%;"></div></div>
        </div>`;
    }
    cards += `
    <a href="residences/${r.id}.html" class="res-card reveal" data-category="${r.category}">
      <img src="${assetUrl("", asset)}" alt="${e(r.name)}">
      <div class="res-card__scrim"></div>
      <div class="res-card__badges">${status_badge(r)}</div>
      <div class="res-card__body">
        <h3>${e(r.name)}</h3>
        <div class="loc">${icon("pin", { size: 13 })} ${e(r.location_fr)}</div>
        <span class="avail-chip ${avail_cls}">${bi_inline(r.availability_fr, r.availability_ar)}</span>
        ${progress_mini}
        <div class="res-card__cta">${bi_inline("Voir la fiche", "عرض البطاقة")} →</div>
      </div>
    </a>`;
  }

  const TRACKER = `
<section class="section--tint">
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">${bi_inline("Suivi des projets", "متابعة المشاريع")}</div>
      <h2>${bi_inline("L'avancement de chaque résidence", "تقدّم كل إقامة")}</h2>
      <p>${bi_inline("Chaque fiche résidence indique son statut actuel — projet en cours ou déjà livré.", "تشير كل بطاقة إقامة إلى وضعها الحالي — مشروع قيد الإنجاز أو تم تسليمه بالفعل.")}</p>
    </div>
    <div class="tabs" data-tabs="#news-grid">
      <button class="tab-btn active" data-filter="all">${bi_inline("Tous", "الكل")}</button>
      <button class="tab-btn" data-filter="en_cours">${bi_inline("En cours", "قيد الإنجاز")}</button>
      <button class="tab-btn" data-filter="livre">${bi_inline("Livrées", "مُسلَّمة")}</button>
    </div>
    <div class="res-grid" id="news-grid">${cards}</div>
  </div>
</section>
`;

  const NOTE = `
<section class="section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <div>
        <h3>${bi_inline("Suivez l'évolution de nos chantiers", "تابعوا تطور مشاريعنا")}</h3>
        <p>${bi_inline("De nouvelles photos et mises à jour seront publiées régulièrement sur cette page.", "سيتم نشر صور وتحديثات جديدة بانتظام على هذه الصفحة.")}</p>
      </div>
      <div class="cta-band__actions">
        <a href="index.html#contact" class="btn btn--dark">${bi_inline("Nous contacter", "تواصلوا معنا")}</a>
      </div>
    </div>
  </div>
</section>
`;

  const page =
    HEAD({
      title: "Actualités & avancement — Hamadat Promotion Immobilière",
      desc: "Suivez l'avancement des projets et résidences de Hamadat Promotion Immobilière.",
      root: ROOT,
    }) +
    nav(RES, ROOT, { blogEnabled: BLOG.enabled }) +
    HERO +
    TRACKER +
    NOTE +
    footer(G, RES, ROOT, { blogEnabled: BLOG.enabled });

  return page;
}

module.exports = { genActualites };
