// Génère index.html — page d'accueil avec carrousel plein écran + grilles résidences.
// Port direct de gen_home.py.
"use strict";

const { e, bi_inline, assetUrl, icon, youtubeId, youtubeThumb, HEAD, nav, footer, contactSection } = require("./common");

function genHome({ G, RES, CAR, BLOG, VIDEOS }) {
  // ---------------- Hero full-screen carousel (1 slide per residence) ----------------
  let hero_slides = "";
  let hero_dots = "";
  CAR.forEach((c, i) => {
    const active = i === 0 ? "active" : "";
    hero_slides += `
    <div class="hero__slide ${active}">
      <img src="${assetUrl("", c.asset)}" alt="${e(c.name)}">
      <div class="hero__scrim"></div>
    </div>`;
    hero_dots += `<div class="hero__dot ${active}"></div>`;
  });

  const RES_BY_ID = {};
  RES.forEach((r) => { RES_BY_ID[r.id] = r; });

  let hero_content_slides = "";
  CAR.forEach((c, i) => {
    const disp = i === 0 ? "block" : "none";
    const r = RES_BY_ID[c.residence_id];
    let avail_html = "";
    let progress_html = "";
    if (r) {
      const avail_cls = r.avail_open ? "avail-chip--open" : "avail-chip--sold";
      avail_html = `<span class="avail-chip ${avail_cls}">${bi_inline(r.availability_fr, r.availability_ar)}</span>`;
      if (r.progress_percent !== null && r.progress_percent !== undefined) {
        const pct = r.progress_percent;
        progress_html = `
      <div class="progress-block" style="max-width:320px;">
        <div class="progress-label">${bi_inline("État d'avancement", "نسبة التقدّم")} <strong>${pct}%</strong></div>
        <div class="progress-track"><div class="progress-track__bar" style="width:${pct}%;"></div></div>
      </div>`;
      }
    }
    hero_content_slides += `
    <div class="hero__content-slide" data-slide="${i}" style="display:${disp}">
      <div class="hero__eyebrow">${e(c.location_fr)}</div>
      <h1 class="hero__title">${bi_inline(c.name, c.name_ar)}</h1>
      <p class="hero__tagline">${bi_inline(c.tagline_fr, c.tagline_ar)}</p>
      <div class="hero__cta-row">
        <a href="residences/${c.residence_id}.html" class="btn btn--primary">${bi_inline(c.cta_fr, c.cta_ar)}</a>
        ${avail_html}
      </div>
      ${progress_html}
    </div>`;
  });

  const HERO = `
<section class="hero" data-hero-carousel>
  ${hero_slides}
  <div class="hero__content">
    <div class="hero__inner">
      ${hero_content_slides}
    </div>
  </div>
  <div class="hero__dots">${hero_dots}</div>
  <div class="hero__nav">
    <div class="hero__arrow" data-hero-prev>${icon("arrow-right", { size: 18 })}</div>
    <div class="hero__arrow" data-hero-next>${icon("arrow-right", { size: 18 })}</div>
  </div>
  <div class="hero__scroll">${bi_inline("Défiler", "مرر لأسفل")}</div>
</section>
`;

  const HERO_SYNC_JS = `
<script>
(function(){
  function syncHero(){
    var root = document.querySelector('[data-hero-carousel]');
    if(!root) return;
    var dots = root.querySelectorAll('.hero__dot');
    var texts = root.querySelectorAll('.hero__content-slide');
    var activeIndex = 0;
    dots.forEach(function(d,i){ if(d.classList.contains('active')) activeIndex = i; });
    texts.forEach(function(t){ t.style.display = (parseInt(t.dataset.slide) === activeIndex) ? 'block' : 'none'; });
  }
  setInterval(syncHero, 300);
})();
</script>
`;

  // ---------------- Intro / about teaser ----------------
  const commitments = G.about.commitments_fr
    .map((c, i) => `<li>${bi_inline(c, G.about.commitments_ar[i])}</li>`)
    .join("");

  const INTRO = `
<section>
  <div class="container">
    <div class="intro-grid">
      <div class="reveal">
        <div class="eyebrow">${bi_inline("Qui sommes-nous", "من نحن")}</div>
        <h2>${bi_inline(G.about.title_fr, G.about.title_ar)}</h2>
        <p>${bi_inline(G.about.text_fr, G.about.text_ar)}</p>
        <ul class="intro-list">
          ${commitments}
        </ul>
        <div style="margin-top:32px;"><a href="apropos.html" class="btn btn--ghost">${bi_inline("En savoir plus", "المزيد")}</a></div>
      </div>
      <div class="intro-figure reveal">
        <img src="${assetUrl("", CAR[0].asset)}" alt="Hamadat">
      </div>
    </div>
  </div>
</section>
`;

  // ---------------- Stats band ----------------
  const stats_items = G.stats.items
    .map((it) => `<div class="stat"><h3>${e(it.value)}</h3><p>${bi_inline(it.label_fr, it.label_ar)}</p></div>`)
    .join("");
  const STATS = `
<section class="section--tight">
  <div class="container">
    <div class="stats-band reveal">${stats_items}</div>
  </div>
</section>
`;

  // ---------------- Residences grid (tabs: en cours / livrées) ----------------
  function status_badge(r) {
    if (r.category === "en_cours") {
      return `<span class="res-card__badge res-card__badge--teal">${bi_inline("En cours", "قيد الإنجاز")}</span>`;
    }
    return `<span class="res-card__badge res-card__badge--status">${bi_inline("Livré", "مُسلَّم")}</span>`;
  }

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
      <div class="res-card__badges">
        ${status_badge(r)}
      </div>
      <div class="res-card__body">
        <h3>${e(r.name)}</h3>
        <div class="loc">${icon("pin", { size: 13 })} ${e(r.location_fr)}</div>
        <span class="avail-chip ${avail_cls}">${bi_inline(r.availability_fr, r.availability_ar)}</span>
        ${progress_mini}
        <div class="res-card__cta">${bi_inline("Découvrir", "اكتشف")} →</div>
      </div>
    </a>`;
  }

  const RESIDENCES_SECTION = `
<section id="residences" class="section--tint">
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">${bi_inline("Nos résidences", "إقاماتنا")}</div>
      <h2>${bi_inline("Des résidences pensées pour durer", "إقامات صُممت لتدوم")}</h2>
      <p>${bi_inline("Projets en cours et projets livrés — découvrez les réalisations signées Hamadat Promotion Immobilière.", "مشاريع قيد الإنجاز ومشاريع مُسلَّمة — اكتشفوا إنجازات حمادات للترقية العقارية.")}</p>
    </div>
    <div class="tabs" data-tabs="#res-grid">
      <button class="tab-btn active" data-filter="all">${bi_inline("Tous", "الكل")}</button>
      <button class="tab-btn" data-filter="en_cours">${bi_inline("En cours", "قيد الإنجاز")}</button>
      <button class="tab-btn" data-filter="livre">${bi_inline("Livrées", "مُسلَّمة")}</button>
    </div>
    <div class="res-grid" id="res-grid">
      ${cards}
    </div>
  </div>
</section>
`;

  // ---------------- Vidéos YouTube (carrousel) ----------------
  const videoItems = ((VIDEOS && VIDEOS.items) || []).filter((v) => youtubeId(v.url));
  let VIDEOS_SECTION = "";
  if (videoItems.length) {
    const slides = videoItems
      .map((v) => {
        const id = youtubeId(v.url);
        return `
      <div class="video-card reveal" data-youtube-id="${e(id)}" tabindex="0" role="button" aria-label="${e(v.title_fr)}">
        <div class="video-card__thumb">
          <img src="${youtubeThumb(id)}" alt="${e(v.title_fr)}" loading="lazy">
          <span class="video-card__play">${icon("video", { size: 22 })}</span>
        </div>
        <div class="video-card__body">
          <h3>${bi_inline(v.title_fr, v.title_ar)}</h3>
          <p>${bi_inline(v.desc_fr || "", v.desc_ar || "")}</p>
        </div>
      </div>`;
      })
      .join("");

    VIDEOS_SECTION = `
<section id="videos" class="section--tint">
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">${bi_inline("Vidéos", "فيديوهات")}</div>
      <h2>${bi_inline(VIDEOS.section_title_fr || "Nos vidéos", VIDEOS.section_title_ar || "فيديوهاتنا")}</h2>
      <p>${bi_inline(VIDEOS.section_text_fr || "", VIDEOS.section_text_ar || "")}</p>
    </div>
    <div class="video-carousel">
      <div class="video-carousel__track" data-video-track>
        ${slides}
      </div>
      <button type="button" class="video-carousel__arrow video-carousel__arrow--prev" data-video-prev aria-label="Précédent">${icon("arrow-right", { size: 18 })}</button>
      <button type="button" class="video-carousel__arrow video-carousel__arrow--next" data-video-next aria-label="Suivant">${icon("arrow-right", { size: 18 })}</button>
    </div>
  </div>
</section>

<div class="video-lightbox" data-video-lightbox aria-hidden="true">
  <div class="video-lightbox__backdrop" data-video-lightbox-close></div>
  <div class="video-lightbox__frame">
    <button type="button" class="video-lightbox__close" data-video-lightbox-close aria-label="Fermer">✕</button>
    <div class="video-lightbox__embed" data-video-lightbox-embed></div>
  </div>
</div>
`;
  }

  // ---------------- CTA band ----------------
  const CTA = `
<section class="section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <div>
        <h3>${bi_inline("Envie de découvrir nos résidences en personne ?", "ترغبون في اكتشاف إقاماتنا عن قرب؟")}</h3>
        <p>${bi_inline("Prenez rendez-vous avec un conseiller Hamadat.", "احجزوا موعدًا مع أحد مستشاري حمادات.")}</p>
      </div>
      <div class="cta-band__actions">
        <a href="#contact" class="btn btn--dark">${bi_inline("Prendre rendez-vous", "أخذ موعد")}</a>
      </div>
    </div>
  </div>
</section>
`;

  const html_out =
    HEAD({
      title: "Hamadat Promotion Immobilière — Bâtir l'excellence depuis 2004",
      desc: "Hamadat Promotion Immobilière conçoit des résidences d'exception à Alger et Jijel.",
      root: "",
    }) +
    nav(RES, "", { blogEnabled: BLOG.enabled }) +
    HERO +
    HERO_SYNC_JS +
    INTRO +
    STATS +
    RESIDENCES_SECTION +
    VIDEOS_SECTION +
    CTA +
    contactSection(G) +
    footer(G, RES, "", { blogEnabled: BLOG.enabled });

  return html_out;
}

module.exports = { genHome };
