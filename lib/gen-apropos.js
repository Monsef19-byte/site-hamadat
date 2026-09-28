// Génère apropos.html — Qui sommes-nous (vision, valeurs, signature, stats).
// Port direct de gen_apropos.py.
"use strict";

const { e, bi_inline, assetUrl, icon, HEAD, nav, footer, contactSection } = require("./common");
const { imageCarousel, aboutImages } = require("./components");

const ROOT = "";

function genApropos({ G, RES, CAR, BLOG }) {
  const HERO = `
<section class="page-hero">
  <div class="container">
    <div class="eyebrow">${bi_inline("Qui sommes-nous", "من نحن")}</div>
    <h1>${bi_inline(G.about.title_fr, G.about.title_ar)}</h1>
    <p class="page-hero__lead">${bi_inline(G.about.text_fr, G.about.text_ar)}</p>
  </div>
</section>
`;

  const commitments_html = G.about.commitments_fr
    .map((c, i) => `<li>${bi_inline(c, G.about.commitments_ar[i])}</li>`)
    .join("");

  const INTRO = `
<section>
  <div class="container">
    <div class="intro-grid">
      ${imageCarousel(aboutImages(G, CAR), "", { cls: "intro-figure reveal", alt: "Hamadat Promotion Immobilière" })}
      <div class="reveal">
        <div class="eyebrow">${bi_inline("Notre histoire", "قصتنا")}</div>
        <h2>${bi_inline(G.about.history_title_fr || "Depuis 2004", G.about.history_title_ar || "منذ 2004")}</h2>
        <p>${bi_inline(G.about.text_fr, G.about.text_ar)}</p>
        <ul class="intro-list">${commitments_html}</ul>
      </div>
    </div>
  </div>
</section>
`;

  const VISION = `
<section class="section--tint">
  <div class="container">
    <div class="section-head reveal" style="max-width:760px;">
      <div class="eyebrow">${bi_inline("Notre vision", "رؤيتنا")}</div>
      <h2>${bi_inline(G.vision.title_fr, G.vision.title_ar)}</h2>
      <p>${bi_inline(G.vision.text_fr, G.vision.text_ar)}</p>
    </div>
  </div>
</section>
`;

  const values_cards = G.values
    .map(
      (v, i) => `<div class="value-card reveal">
      <div class="num">${String(i + 1).padStart(2, "0")}</div>
      <h3>${bi_inline(v.title_fr, v.title_ar)}</h3>
      <p>${bi_inline(v.text_fr, v.text_ar)}</p>
    </div>`
    )
    .join("");

  const VALUES = `
<section>
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">${bi_inline("Nos valeurs", "قيمنا")}</div>
      <h2>${bi_inline("Ce qui guide chacun de nos projets", "ما يوجّه كل مشاريعنا")}</h2>
    </div>
    <div class="values-grid">${values_cards}</div>
  </div>
</section>
`;

  const why_points = (G.signature.why_points || [])
    .map((p) => `<div class="feature-item">${icon(p.icon)}${bi_inline(p.text_fr, p.text_ar)}</div>`)
    .join("");

  const SIGNATURE = `
<section class="section--tint">
  <div class="container">
    <div class="detail-grid">
      <div class="reveal">
        <div class="eyebrow">${bi_inline("Notre signature", "بصمتنا")}</div>
        <h2>${bi_inline(G.signature.title_fr, G.signature.title_ar)}</h2>
        <p>${bi_inline(G.signature.text_fr, G.signature.text_ar)}</p>
      </div>
      <div class="reveal">
        <div class="side-card">
          <h3>${bi_inline(G.signature.why_title_fr, G.signature.why_title_ar)}</h3>
          <div class="feature-list">${why_points}</div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

  const stats_items = G.stats.items
    .map((it) => `<div class="stat"><h3>${e(it.value)}</h3><p>${bi_inline(it.label_fr, it.label_ar)}</p></div>`)
    .join("");
  const STATS = `
<section class="section--tight">
  <div class="container">
    <div class="section-head reveal" style="text-align:center;max-width:640px;margin-left:auto;margin-right:auto;">
      <div class="eyebrow">${bi_inline("En chiffres", "بالأرقام")}</div>
      <h2>${bi_inline(G.stats.title_fr, G.stats.title_ar)}</h2>
    </div>
    <div class="stats-band reveal" style="--stats-cols:${Math.max(1, Math.min(4, G.stats.items.length))}">${stats_items}</div>
  </div>
</section>
`;

  const CTA = `
<section class="section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <div>
        <h3>${bi_inline("Envie d'en savoir plus sur nos projets ?", "ترغبون في معرفة المزيد عن مشاريعنا؟")}</h3>
        <p>${bi_inline("Prenez rendez-vous avec un conseiller Hamadat.", "احجزوا موعدًا مع أحد مستشاري حمادات.")}</p>
      </div>
      <div class="cta-band__actions">
        <a href="index.html#residences" class="btn btn--dark">${bi_inline("Voir nos résidences", "مشاهدة إقاماتنا")}</a>
      </div>
    </div>
  </div>
</section>
`;

  const page =
    HEAD({
      title: "Qui sommes-nous — Hamadat Promotion Immobilière",
      desc: "Depuis 2004, Hamadat Promotion Immobilière conçoit des résidences d'exception en Algérie.",
      root: ROOT,
    }) +
    nav(RES, ROOT, { blogEnabled: BLOG.enabled }) +
    HERO +
    INTRO +
    VISION +
    VALUES +
    SIGNATURE +
    STATS +
    CTA +
    contactSection(G) +
    footer(G, RES, ROOT, { blogEnabled: BLOG.enabled });

  return page;
}

module.exports = { genApropos };
