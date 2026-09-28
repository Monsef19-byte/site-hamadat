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

module.exports = { imageCarousel, aboutImages };
