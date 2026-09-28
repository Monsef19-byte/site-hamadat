// Génère opportunites.html — page miroir de celle de New Era : des
// visiteurs qui ont un terrain ou un bien à proposer à Hamadat (vente, troc,
// partenariat), pas des clients qui achètent une résidence. Entièrement
// piloté par data/opportunites.json (dashboard-éditable comme le reste).
"use strict";

const { e, bi_inline, icon, HEAD, nav, footer, chooseOption } = require("./common");
const { imageCarousel } = require("./components");

const ROOT = "";

function opCard(cat) {
  const attrs = [
    cat.type_bien ? ` data-typebien="${e(cat.type_bien)}"` : "",
    cat.type_demande ? ` data-typedemande="${e(cat.type_demande)}"` : "",
  ].join("");
  return `
    <div class="opp-card reveal" role="button" tabindex="0"${attrs} aria-label="${e(cat.label_fr)}">
      <div class="opp-card__icon">${icon(cat.icon, { size: 26 })}</div>
      <b>${bi_inline(cat.label_fr, cat.label_ar)}</b>
    </div>`;
}

function genOpportunites({ G, RES, BLOG, OPP }) {
  const HERO = `
<section class="page-hero">
  <div class="container">
    <div class="eyebrow">${bi_inline("Opportunités", "الفرص")}</div>
    <h1>${bi_inline(OPP.hero_title_fr, OPP.hero_title_ar)}</h1>
    <p class="page-hero__lead">${bi_inline(OPP.hero_text_fr, OPP.hero_text_ar)}</p>
  </div>
</section>
`;

  // Espace photo — mode choisi dans le dashboard : « single » (1ʳᵉ image
  // seulement) ou « carousel » (toutes les images, défilement).
  const media = OPP.media || {};
  const mediaImages = (media.images || []).filter((im) => im && im.asset);
  const shown = media.mode === "carousel" ? mediaImages : mediaImages.slice(0, 1);
  const MEDIA = shown.length
    ? `
<section class="section--tight opp-media-section">
  <div class="container">
    ${imageCarousel(shown, ROOT, { cls: "opp-media reveal", alt: "Opportunités — Hamadat" })}
  </div>
</section>
`
    : "";

  const CATEGORIES = `
<section>
  <div class="container">
    <div class="section-head reveal">
      <h2>${bi_inline(OPP.categories_title_fr, OPP.categories_title_ar)}</h2>
    </div>
    <div class="opp-grid">
      ${(OPP.categories || []).map(opCard).join("")}
    </div>
  </div>
</section>
`;

  const FEATURES = `
<section class="section--tint">
  <div class="container">
    <div class="section-head reveal">
      <h2>${bi_inline(OPP.features_title_fr, OPP.features_title_ar)}</h2>
    </div>
    <div class="bullet-grid reveal">
      ${(OPP.features || [])
        .map(
          (f) => `<div class="bullet-item">${icon("check-circle", { size: 16 })}${bi_inline(f.fr, f.ar)}</div>`
        )
        .join("")}
    </div>
  </div>
</section>
`;

  const FORM = `
<section class="section--dark" id="proposer">
  <div class="container" style="max-width:720px;">
    <div class="eyebrow">${bi_inline("Contact", "اتصل بنا")}</div>
    <h2>${bi_inline(OPP.form_title_fr, OPP.form_title_ar)}</h2>
    <p style="color:rgba(255,255,255,.78);margin-bottom:8px;">${bi_inline(OPP.form_text_fr, OPP.form_text_ar)}</p>
    <form data-proposal-form data-lead-source="opportunites" novalidate>
      <div class="form-field-row">
        <div class="form-field">
          <label>${bi_inline("Type de demande", "نوع الطلب")} <span class="req" aria-hidden="true">*</span></label>
          <select name="type_demande" id="prop-typedemande" required>${chooseOption()}<option>Vente</option><option>Achat</option><option>Troc</option><option>Partenariat</option></select>
        </div>
        <div class="form-field">
          <label>${bi_inline("Type de bien", "نوع العقار")} <span class="req" aria-hidden="true">*</span></label>
          <select name="type_bien" id="prop-typebien" required>${chooseOption()}<option>Terrain</option><option>Bien existant</option><option>Immeuble</option></select>
        </div>
      </div>
      <div class="form-field">
        <label>${bi_inline("Localisation du bien", "موقع العقار")} <span class="req" aria-hidden="true">*</span></label>
        <input type="text" name="localisation" placeholder="Wilaya, commune..." required>
      </div>
      <div class="form-field-row">
        <div class="form-field">
          <label>${bi_inline("Nom et Prénom", "الاسم واللقب")} <span class="req" aria-hidden="true">*</span></label>
          <input type="text" name="full_name" id="prop-nom" required>
        </div>
        <div class="form-field">
          <label>${bi_inline("Téléphone", "رقم الهاتف")} <span class="req" aria-hidden="true">*</span></label>
          <input type="tel" name="phone" required inputmode="tel" autocomplete="tel">
        </div>
      </div>
      <div class="form-field">
        <label>${bi_inline("Adresse e-mail", "البريد الإلكتروني")} <span class="req" aria-hidden="true">*</span></label>
        <input type="email" name="email" required autocomplete="email">
      </div>
      <div class="form-field">
        <label>${bi_inline("Description (facultatif)", "الوصف (اختياري)")}</label>
        <textarea rows="4" name="message" placeholder="Décrivez votre bien ou votre projet..."></textarea>
      </div>
      <div class="form-field form-field--hp" aria-hidden="true">
        <label>Laisser vide / اترك فارغًا</label>
        <input type="text" name="website" tabindex="-1" autocomplete="off">
      </div>
      <div class="form-msg" data-form-msg role="status" aria-live="polite"></div>
      <button type="submit" class="btn btn--primary">${bi_inline(OPP.submit_fr, OPP.submit_ar)}</button>
    </form>
  </div>
</section>
`;

  const page =
    HEAD({
      title: "Opportunités — Hamadat Promotion Immobilière",
      desc: OPP.hero_text_fr,
      root: ROOT,
    }) +
    nav(RES, ROOT, { blogEnabled: BLOG && BLOG.enabled }) +
    HERO +
    MEDIA +
    CATEGORIES +
    FEATURES +
    FORM +
    footer(G, RES, ROOT, { blogEnabled: BLOG && BLOG.enabled });

  return page;
}

module.exports = { genOpportunites };
