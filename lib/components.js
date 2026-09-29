// Composants HTML partagés entre plusieurs pages générées.
"use strict";

const { e, bi_inline, assetUrl, icon } = require("./common");

// Carrousel d'images générique (même composant que la galerie des fiches
// résidence : [data-gallery] piloté par main.js#initGalleries). Utilisé pour
// « Qui sommes-nous » (accueil + page À propos) et l'espace photo
// Opportunités. Une seule image → image fixe, sans flèches ni compteur.
function imageCarousel(images, root, { cls = "", alt = "Hamadat" } = {}) {
  const items = (images || []).filter((im) => im && im.asset);
  if (!items.length) return "";
  if (items.length === 1) {
    const im = items[0];
    return `<div class="${cls}"><img src="${assetUrl(root, im.asset)}" alt="${e(im.caption_fr || alt)}">${im.caption_fr ? `<div class="gallery__caption">${bi_inline(im.caption_fr, im.caption_ar || im.caption_fr)}</div>` : ""}</div>`;
  }
  const slides = items
    .map((im, i) => `
      <div class="gallery__slide ${i === 0 ? "active" : ""}">
        <img src="${assetUrl(root, im.asset)}" alt="${e(im.caption_fr || alt)}"${i ? ' loading="lazy"' : ""}>
        ${im.caption_fr ? `<div class="gallery__caption">${bi_inline(im.caption_fr, im.caption_ar || im.caption_fr)}</div>` : ""}
      </div>`)
    .join("");
  return `<div class="${cls}" data-gallery>
      ${slides}
      <div class="gallery__counter">1 / ${items.length}</div>
      <div class="gallery__arrows">
        <div class="hero__arrow" data-g-prev role="button" tabindex="0" aria-label="Précédent">${icon("arrow-right", { size: 16 })}</div>
        <div class="hero__arrow" data-g-next role="button" tabindex="0" aria-label="Suivant">${icon("arrow-right", { size: 16 })}</div>
      </div>
    </div>`;
}

// Images « Qui sommes-nous » : liste dédiée du dashboard ; repli sur la 1ʳᵉ
// image du carrousel d'accueil tant qu'aucune n'a été ajoutée.
function aboutImages(G, CAR) {
  const imgs = ((G.about && G.about.images) || []).filter((im) => im.asset);
  if (imgs.length) return imgs;
  return CAR && CAR[0] && CAR[0].asset ? [{ asset: CAR[0].asset }] : [];
}

// Bandeau d'en-tête en images (pages Actualités / Opportunités) : remplace
// le fond noir par une ou plusieurs photos (défilement si plusieurs), avec
// le titre de la page par-dessus — même principe que le Hero de l'accueil,
// en moins haut. Sans image, repli sur l'en-tête sombre classique.
function mediaHero(images, root, { eyebrow = "", title = "", lead = "" } = {}) {
  const items = (images || []).filter((im) => im && im.asset);
  const text = `
    <div class="media-hero__content">
      <div class="container">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
        <h1>${title}</h1>
        ${lead ? `<p class="page-hero__lead">${lead}</p>` : ""}
      </div>
    </div>`;
  if (!items.length) {
    return `
<section class="page-hero">
  <div class="container">
    ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
    <h1>${title}</h1>
    ${lead ? `<p class="page-hero__lead">${lead}</p>` : ""}
  </div>
</section>
`;
  }
  const multi = items.length > 1;
  const slides = items
    .map((im, i) => {
      const src = assetUrl(root, im.asset);
      const img = i < 2 ? `<img src="${src}" alt="${e(im.caption_fr || "")}">` : `<img data-src="${src}" alt="${e(im.caption_fr || "")}">`;
      return `
    <div class="gallery__slide media-hero__slide ${i === 0 ? "active" : ""}">
      ${img}
      ${im.caption_fr ? `<div class="media-hero__caption">${bi_inline(im.caption_fr, im.caption_ar || im.caption_fr)}</div>` : ""}
    </div>`;
    })
    .join("");
  return `
<section class="media-hero"${multi ? " data-gallery" : ""}>
  ${slides}
  <div class="media-hero__scrim"></div>
  ${text}
  ${multi ? `<div class="gallery__counter media-hero__counter">1 / ${items.length}</div>
  <div class="gallery__arrows media-hero__arrows">
    <div class="hero__arrow" data-g-prev role="button" tabindex="0" aria-label="Précédente">${icon("arrow-right", { size: 16 })}</div>
    <div class="hero__arrow" data-g-next role="button" tabindex="0" aria-label="Suivante">${icon("arrow-right", { size: 16 })}</div>
  </div>` : ""}
</section>
`;
}

module.exports = { imageCarousel, aboutImages, mediaHero };
