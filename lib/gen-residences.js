// Génère residences/<slug>.html pour les résidences — hero diaporama + fiche complète.
// Port direct de gen_residences.py.
"use strict";

const { e, bi_inline, assetUrl, icon, HEAD, nav, footer } = require("./common");

const ROOT = "../";

function build_res_hero(r) {
  let slides = "";
  let dots = "";
  (r.diaporama || []).forEach((d, i) => {
    const active = i === 0 ? "active" : "";
    const asset = d.asset;
    if (!asset) return;
    slides += `
    <div class="res-hero__slide ${active}" data-caption-fr="${e(d.caption_fr)}" data-caption-ar="${e(d.caption_ar)}">
      <img src="${assetUrl(ROOT, asset)}" alt="${e(d.caption_fr)}">
    </div>`;
    dots += `<div class="hero__dot ${active}"></div>`;
  });
  return { slides, dots };
}

function status_badge_detail(r) {
  if (r.category === "en_cours") {
    return bi_inline("Projet en cours", "مشروع قيد الإنجاز");
  }
  return bi_inline(
    "Projet livré" + (r.delivered_year ? ` — ${r.delivered_year}` : ""),
    "مشروع مُسلَّم" + (r.delivered_year ? ` — ${r.delivered_year}` : "")
  );
}

function build_page(r, RES, CAR, G, BLOG) {
  const { slides, dots } = build_res_hero(r);

  const first_caption = r.diaporama && r.diaporama.length ? e(r.diaporama[0].caption_fr) : "";

  const HERO = `
<section class="res-hero" data-res-hero>
  ${slides}
  <div class="hero__scrim"></div>
  <div class="res-breadcrumb">
    <div class="container">
      <a href="${ROOT}index.html">${bi_inline("Accueil", "الرئيسية")}</a> /
      <a href="${ROOT}index.html#residences">${bi_inline("Nos résidences", "إقاماتنا")}</a> /
      <span>${e(r.name)}</span>
    </div>
  </div>
  <div class="res-hero__caption">
    <div class="container">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:20px;">
        <div class="badge-status" style="background:rgba(255,255,255,.15);color:#fff;margin-bottom:0;">${status_badge_detail(r)}</div>
        <span class="avail-chip ${r.avail_open ? "avail-chip--open" : "avail-chip--sold"}" style="background:rgba(255,255,255,.16);color:#fff;">${bi_inline(r.availability_fr, r.availability_ar)}</span>
        ${
          r.progress_percent !== null && r.progress_percent !== undefined
            ? `<span class="avail-chip" style="background:rgba(255,255,255,.16);color:#fff;">${bi_inline("Avancement", "التقدّم")} ${r.progress_percent}%</span>`
            : ""
        }
      </div>
      <h1>${bi_inline(r.name, r.name_ar)}</h1>
      <p class="res-hero__slidetext" data-caption-text>${first_caption}</p>
    </div>
  </div>
  <div class="res-hero__dots">${dots}</div>
  <div class="res-hero__progress"><div class="res-hero__progress-bar"></div></div>
</section>
<script>
(function(){
  function syncCaption(){
    var root = document.querySelector('[data-res-hero]');
    if(!root) return;
    var active = root.querySelector('.res-hero__slide.active');
    var out = root.querySelector('[data-caption-text]');
    if(active && out){
      var lang = document.documentElement.lang === 'ar' ? 'ar' : 'fr';
      var val = lang === 'ar' ? active.dataset.captionAr : active.dataset.captionFr;
      if(out.textContent !== val) out.textContent = val;
    }
  }
  setInterval(syncCaption, 250);
})();
</script>
`;

  const key_numbers_html = (r.key_numbers || [])
    .map((k) => `<div class="kn"><div class="v">${e(k.value)}</div><div class="l">${bi_inline(k.label_fr, k.label_ar)}</div></div>`)
    .join("");

  const services_html = r.services && r.services.length
    ? r.services.map((s) => `<div class="feature-item">${icon(s.icon)}${bi_inline(s.text_fr, s.text_ar)}</div>`).join("")
    : "";

  const quality_html = r.quality && r.quality.length
    ? r.quality.map((s) => `<div class="feature-item">${icon(s.icon)}${bi_inline(s.text_fr, s.text_ar)}</div>`).join("")
    : "";

  let why_block = "";
  if (r.why_location_fr) {
    why_block = `
        <h2>${bi_inline("Pourquoi cet emplacement", "لماذا هذا الموقع")}</h2>
        <p>${bi_inline(r.why_location_fr, r.why_location_ar)}</p>`;
  }

  const maps_row = r.google_maps
    ? `<div class="row"><span>${bi_inline("Localisation", "الموقع")}</span><span><a href="${r.google_maps}" target="_blank" rel="noopener">${bi_inline("Voir sur Maps", "عرض على الخريطة")}</a></span></div>`
    : "";
  const year_row = r.delivered_year
    ? `<div class="row"><span>${bi_inline("Livraison", "التسليم")}</span><span>${r.delivered_year}</span></div>`
    : "";
  const avail_row = `<div class="row"><span>${bi_inline("Disponibilité", "التوفر")}</span><span>${bi_inline(r.availability_fr, r.availability_ar)}</span></div>`;
  let progress_card_block = "";
  if (r.progress_percent !== null && r.progress_percent !== undefined) {
    const pct = r.progress_percent;
    progress_card_block = `
          <div class="progress-block" style="margin-top:18px;">
            <div class="progress-label">${bi_inline("État d'avancement", "نسبة التقدّم")} <strong>${pct}%</strong></div>
            <div class="progress-track"><div class="progress-track__bar" style="width:${pct}%;"></div></div>
          </div>`;
  }

  const DETAIL = `
<section>
  <div class="container">
    <div class="detail-grid">
      <div class="reveal">
        <div class="eyebrow">${bi_inline(r.location_fr, r.location_ar)}</div>
        <h2>${bi_inline("Présentation", "عرض المشروع")}</h2>
        <p>${bi_inline(r.description_fr, r.description_ar)}</p>
        ${why_block}

        <h2 style="margin-top:36px;">${bi_inline("Le projet en chiffres", "المشروع بالأرقام")}</h2>
        <div class="key-numbers">${key_numbers_html}</div>
        <p style="font-size:14px;">${bi_inline("Typologies : " + r.typologies_fr, "الأنماط: " + r.typologies_ar)}</p>

        ${services_html ? '<h2 style="margin-top:36px;">' + bi_inline("Services & équipements", "خدمات وتجهيزات") + '</h2><div class="feature-list">' + services_html + "</div>" : ""}
        ${quality_html ? '<h2 style="margin-top:36px;">' + bi_inline("Qualité & finitions", "الجودة والتشطيبات") + '</h2><div class="feature-list">' + quality_html + "</div>" : ""}
      </div>
      <div class="reveal">
        <div class="side-card">
          <h3>${bi_inline("Fiche résidence", "بطاقة الإقامة")}</h3>
          <div class="row"><span>${bi_inline("Statut", "الحالة")}</span><span>${bi_inline(r.status_fr, r.status_ar)}</span></div>
          ${year_row}
          <div class="row"><span>${bi_inline("Emplacement", "الموقع")}</span><span>${bi_inline(r.location_fr, r.location_ar)}</span></div>
          ${avail_row}
          ${maps_row}
          ${progress_card_block}
          <a href="${ROOT}index.html#contact" class="btn btn--primary">${bi_inline("Prendre rendez-vous", "أخذ موعد")}</a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

  // Own diaporama gallery
  let gallery_slides = "";
  (r.diaporama || []).forEach((d, i) => {
    const asset = d.asset;
    if (!asset) return;
    const active = i === 0 ? "active" : "";
    const proposed_tag = d.caption_proposed
      ? `<span class="proposed-tag">(${bi_inline("à valider", "للتأكيد")})</span>`
      : "";
    gallery_slides += `
      <div class="gallery__slide ${active}">
        <img src="${assetUrl(ROOT, asset)}" alt="${e(d.caption_fr)}">
        <div class="gallery__caption">${bi_inline(d.caption_fr, d.caption_ar)}${proposed_tag}</div>
      </div>`;
  });

  const GALLERY = `
<section class="section--tint">
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">${bi_inline("Galerie", "معرض الصور")}</div>
      <h2>${bi_inline("Découvrez " + r.name, "اكتشفوا " + r.name_ar)}</h2>
    </div>
    <div class="gallery reveal" data-gallery>
      ${gallery_slides}
      <div class="gallery__counter">1 / ${(r.diaporama || []).length}</div>
      <div class="gallery__arrows">
        <div class="hero__arrow" data-g-prev>${icon("arrow-right", { size: 16 })}</div>
        <div class="hero__arrow" data-g-next>${icon("arrow-right", { size: 16 })}</div>
      </div>
    </div>
  </div>
</section>
`;

  // Autres résidences (cross-sell)
  const others = RES.filter((x) => x.id !== r.id).slice(0, 3);
  let other_cards = "";
  for (const o of others) {
    const hero = CAR.find((c) => c.residence_id === o.id);
    const asset = hero ? hero.asset : "";
    other_cards += `
      <a href="${o.id}.html" class="res-card reveal">
        <img src="${assetUrl(ROOT, asset)}" alt="${e(o.name)}">
        <div class="res-card__scrim"></div>
        <div class="res-card__body">
          <h3>${e(o.name)}</h3>
          <div class="loc">${icon("pin", { size: 13 })} ${e(o.location_fr)}</div>
        </div>
      </a>`;
  }

  const OTHERS = `
<section>
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">${bi_inline("À découvrir aussi", "اكتشفوا أيضًا")}</div>
      <h2>${bi_inline("Nos autres résidences", "إقاماتنا الأخرى")}</h2>
    </div>
    <div class="res-grid">${other_cards}</div>
  </div>
</section>
`;

  const CTA = `
<section class="section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <div>
        <h3>${bi_inline("Cette résidence vous intéresse ?", "هل تهمكم هذه الإقامة؟")}</h3>
        <p>${bi_inline("Contactez un conseiller Hamadat pour en savoir plus.", "تواصلوا مع أحد مستشاري حمادات لمزيد من المعلومات.")}</p>
      </div>
      <div class="cta-band__actions">
        <a href="${ROOT}index.html#contact" class="btn btn--dark">${bi_inline("Prendre rendez-vous", "أخذ موعد")}</a>
      </div>
    </div>
  </div>
</section>
`;

  const page =
    HEAD({
      title: `${r.name} — Hamadat Promotion Immobilière`,
      desc: r.tagline_fr,
      root: ROOT,
    }) +
    nav(RES, ROOT, { blogEnabled: BLOG.enabled }) +
    HERO +
    DETAIL +
    GALLERY +
    OTHERS +
    CTA +
    footer(G, RES, ROOT, { blogEnabled: BLOG.enabled });
  return page;
}

function genResidences({ G, RES, CAR, BLOG }) {
  const pages = {};
  for (const r of RES) {
    pages[r.id] = build_page(r, RES, CAR, G, BLOG);
  }
  return pages;
}

module.exports = { genResidences };
