// Génère index.html — page d'accueil avec carrousel plein écran + grilles résidences.
// Port direct de gen_home.py.
"use strict";

const { residenceCover, e, bi_inline, assetUrl, icon, youtubeId, youtubeThumb, HEAD, nav, footer, contactSection, slogan } = require("./common");
const { collectGallery } = require("./gallery");
const { imageCarousel, aboutImages } = require("./components");

function genHome(data) {
  const { G, RES, CAR, BLOG, VIDEOS, GALLERY } = data;
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

  // Note : le carrousel d'accueil n'est plus lié au statut d'une résidence
  // (disponibilité, avancement) — même quand une slide garde un residence_id
  // pour mémoire, son titre/accroche/emplacement/badges sont des champs
  // libres saisis dans le dashboard, jamais dérivés de data/residences.json.
  let hero_content_slides = "";
  CAR.forEach((c, i) => {
    const disp = i === 0 ? "block" : "none";
    const badges_html = (c.badges || []).length
      ? `<div class="hero__badges">${c.badges.map((b) => `<span class="hero__badge">${e(b)}</span>`).join("")}</div>`
      : "";
    // Bouton fixe : le même sur toutes les slides, pointe vers la section
    // contact de la page d'accueil — plus de lien par slide vers une fiche
    // résidence individuelle.
    const cta_html = `<a href="#contact" class="btn btn--primary">${bi_inline((G.home && G.home.hero_cta_fr) || "Contactez-nous", (G.home && G.home.hero_cta_ar) || "اتصلوا بنا")}</a>`;
    hero_content_slides += `
    <div class="hero__content-slide" data-slide="${i}" style="display:${disp}">
      ${badges_html}
      <div class="hero__eyebrow">${e(c.location_fr)}</div>
      <h1 class="hero__title">${bi_inline(c.name, c.name_ar)}</h1>
      <p class="hero__tagline">${bi_inline(c.tagline_fr, c.tagline_ar)}</p>
      <div class="hero__cta-row">
        ${cta_html}
      </div>
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
      ${imageCarousel(aboutImages(G, CAR), "", { cls: "intro-figure reveal" })}
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
    <div class="stats-band reveal" style="--stats-cols:${Math.max(1, Math.min(4, G.stats.items.length))}">${stats_items}</div>
  </div>
</section>
`;

  // ---------------- Residences grid (onglets : en cours [défaut] / références / tous) ----------------
  function status_badge(r) {
    if (r.category === "en_cours") {
      return `<span class="res-card__badge res-card__badge--teal">${bi_inline("En cours", "قيد الإنجاز")}</span>`;
    }
    return `<span class="res-card__badge res-card__badge--status">${bi_inline("Référence", "مرجع")}</span>`;
  }

  let cards = "";
  for (const r of RES) {
    const asset = residenceCover(r, CAR);
    const avail_cls = r.avail_open ? "avail-chip--open" : "avail-chip--sold";
    // Pas d'avancement sur l'accueil (demande client) — uniquement sur la fiche résidence.
    cards += `
    <a href="residences/${r.id}.html" class="res-card reveal" data-category="${r.category}"${r.category === "en_cours" ? "" : ' style="display:none"'}>
      <img src="${assetUrl("", asset)}" alt="${e(r.name)}">
      <div class="res-card__scrim"></div>
      <div class="res-card__badges">
        ${status_badge(r)}
      </div>
      <div class="res-card__body">
        <h3>${e(r.name)}</h3>
        <div class="loc">${icon("pin", { size: 13 })} ${e(r.location_fr)}</div>
        <span class="avail-chip ${avail_cls}">${bi_inline(r.availability_fr, r.availability_ar)}</span>
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
      <p>${bi_inline("Projets en cours et références — découvrez les réalisations signées Hamadat Promotion Immobilière.", "مشاريع قيد الإنجاز ومراجعنا — اكتشفوا إنجازات حمادات للترقية العقارية.")}</p>
    </div>
    <div class="tabs" data-tabs="#res-grid">
      <button class="tab-btn active" data-filter="en_cours">${bi_inline("En cours", "قيد الإنجاز")}</button>
      <button class="tab-btn" data-filter="livre">${bi_inline("Références", "مراجعنا")}</button>
      <button class="tab-btn" data-filter="all">${bi_inline("Tous", "الكل")}</button>
    </div>
    <div class="res-grid" id="res-grid">
      ${cards}
    </div>
  </div>
</section>
`;

  // ---------------- Galerie sitewide (toutes les images du site) ----------------
  // Agrégation automatique (lib/gallery.js) moins les images exclues depuis
  // le dashboard, présentée en carrousel simple.
  const galleryEnabled = !GALLERY || GALLERY.enabled !== false;
  const galleryItems = galleryEnabled ? collectGallery(data) : [];
  let GALLERY_SECTION = "";
  if (galleryItems.length) {
    // Carrousel simple (une image à la fois, flèches + compteur, défilement
    // auto) — seules les 2 premières images sont chargées d'emblée, les
    // suivantes au fil du défilement (data-src, voir main.js).
    const gSlides = galleryItems
      .map((it, i) => {
        const src = assetUrl("", it.asset);
        return `
      <div class="gallery__slide ${i === 0 ? "active" : ""}">
        <img ${i < 2 ? "src" : "data-src"}="${src}" alt="${e(it.caption_fr || "")}">
        ${it.caption_fr ? `<div class="gallery__caption">${bi_inline(it.caption_fr, it.caption_ar || it.caption_fr)}</div>` : ""}
      </div>`;
      })
      .join("");
    GALLERY_SECTION = `
<section id="galerie" class="section--tint">
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">${bi_inline("Galerie", "معرض الصور")}</div>
      <h2>${bi_inline(GALLERY.section_title_fr || "Galerie", GALLERY.section_title_ar || "معرض الصور")}</h2>
      ${GALLERY.section_text_fr ? `<p>${bi_inline(GALLERY.section_text_fr, GALLERY.section_text_ar || "")}</p>` : ""}
    </div>
    <div class="gallery reveal" data-gallery>
      ${gSlides}
      ${galleryItems.length > 1 ? `<div class="gallery__counter">1 / ${galleryItems.length}</div>
      <div class="gallery__arrows">
        <div class="hero__arrow" data-g-prev role="button" tabindex="0" aria-label="Précédente">${icon("arrow-right", { size: 16 })}</div>
        <div class="hero__arrow" data-g-next role="button" tabindex="0" aria-label="Suivante">${icon("arrow-right", { size: 16 })}</div>
      </div>` : ""}
    </div>
  </div>
</section>
`;
  }

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
        <a href="#contact" class="btn btn--dark" data-rdv-trigger>${bi_inline("Prendre rendez-vous", "أخذ موعد")}</a>
      </div>
    </div>
  </div>
</section>
`;

  const html_out =
    HEAD({
      title: `Hamadat Promotion Immobilière — ${e(slogan(G).fr)}`,
      desc: "Hamadat Promotion Immobilière conçoit des résidences d'exception à Alger et Jijel.",
      root: "",
    }) +
    nav(RES, "", { blogEnabled: BLOG.enabled }) +
    HERO +
    HERO_SYNC_JS +
    INTRO +
    STATS +
    RESIDENCES_SECTION +
    GALLERY_SECTION +
    VIDEOS_SECTION +
    CTA +
    contactSection(G) +
    footer(G, RES, "", { blogEnabled: BLOG.enabled });

  return html_out;
}

module.exports = { genHome };
