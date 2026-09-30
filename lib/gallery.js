// Galerie sitewide — agrège automatiquement TOUTES les images du site
// (carrousel d'accueil, « Qui sommes-nous », diaporamas et plans des
// résidences, page Opportunités, Actualités, images ajoutées à la main dans
// l'onglet Galerie), sans doublon. Le dashboard ne stocke que la liste des
// images EXCLUES (gallery.json → excluded) : toute nouvelle image ajoutée
// ailleurs apparaît donc d'elle-même dans la galerie, sans double saisie.
//
// ⚠ Même logique dupliquée dans public/admin/admin.js (galleryCollect) —
// le dashboard tourne dans le navigateur et ne peut pas require() ce module.
// Toute modification ici doit y être reportée.
"use strict";

function collectGallery({ G, RES, CAR, OPP, NEWS, GALLERY }) {
  const seen = new Set();
  const out = [];
  function add(asset, caption_fr, caption_ar, source) {
    if (!asset || seen.has(asset)) return;
    seen.add(asset);
    out.push({ asset, caption_fr: caption_fr || "", caption_ar: caption_ar || "", source });
  }
  ((GALLERY && GALLERY.items) || []).forEach((it) => add(it.asset, it.caption_fr, it.caption_ar, "Galerie"));
  (CAR || []).forEach((c) => add(c.asset, c.name, c.name_ar, "Carrousel d'accueil"));
  ((G && G.about && G.about.images) || []).forEach((im) => add(im.asset, im.caption_fr, im.caption_ar, "Qui sommes-nous"));
  (RES || []).forEach((r) => {
    (r.diaporama || []).forEach((d) => add(d.asset, d.caption_fr || r.name, d.caption_ar || r.name_ar, `Résidence ${r.name}`));
  });
  ((OPP && OPP.media && OPP.media.images) || []).forEach((im) => add(im.asset, im.caption_fr, im.caption_ar, "Opportunités"));
  if (NEWS) {
    add(NEWS.cover, NEWS.title_fr, NEWS.title_ar, "Actualités");
    (NEWS.images || []).forEach((im) => add(im.asset, im.caption_fr, im.caption_ar, "Actualités"));
  }
  const excluded = new Set((GALLERY && GALLERY.excluded) || []);
  return out.filter((it) => !excluded.has(it.asset));
}

module.exports = { collectGallery };
