// Génère actualites.html — UNE seule actualité, sans historique, remplacée
// à chaque mise à jour depuis le dashboard (onglet « Actualités » →
// data/actualites.json) : titre, date, photo principale, texte, galerie de
// photos. Aucune intervention technique nécessaire pour la mettre à jour.
"use strict";

const { e, bi_inline, assetUrl, icon, paragraphsHtml, HEAD, nav, footer } = require("./common");

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

function genActualites({ G, RES, BLOG, NEWS }) {
  const N = NEWS || {};
  const HERO = `
<section class="page-hero">
  <div class="container">
    <div class="eyebrow">${bi_inline("Actualités", "المستجدات")}</div>
    <h1>${bi_inline(N.page_title_fr || "Actualités", N.page_title_ar || "المستجدات")}</h1>
    ${N.page_text_fr ? `<p class="page-hero__lead">${bi_inline(N.page_text_fr, N.page_text_ar || "")}</p>` : ""}
  </div>
</section>
`;

  const date = formatDate(N.date);
  const images = (N.images || []).filter((im) => im && im.asset);
  const photos = images.length
    ? `
      <div class="news-photos">
        ${images
          .map(
            (im, i) => `
        <button type="button" class="news-photos__item" data-lightbox-index="${i}" data-full="${e(assetUrl(ROOT, im.asset))}" data-caption-fr="${e(im.caption_fr || "")}" data-caption-ar="${e(im.caption_ar || "")}" aria-label="${e(im.caption_fr || "Photo " + (i + 1))}">
          <img src="${assetUrl(ROOT, im.asset)}" alt="${e(im.caption_fr || "")}" loading="lazy">
          ${im.caption_fr ? `<span class="news-photos__caption">${bi_inline(im.caption_fr, im.caption_ar || im.caption_fr)}</span>` : ""}
        </button>`
          )
          .join("")}
      </div>`
    : "";

  const hasContent = N.title_fr || N.body_fr || N.cover || images.length;
  const ARTICLE = hasContent
    ? `
<section>
  <div class="container news-article">
    <article class="reveal">
      ${date ? `<div class="news-article__date">${icon("calendar", { size: 15 })} ${bi_inline(date.fr, date.ar)}</div>` : ""}
      ${N.title_fr ? `<h2 class="news-article__title">${bi_inline(N.title_fr, N.title_ar || N.title_fr)}</h2>` : ""}
      ${N.cover ? `<figure class="news-article__cover"><img src="${assetUrl(ROOT, N.cover)}" alt="${e(N.title_fr || "Actualité")}"></figure>` : ""}
      <div class="blog-article__body news-article__body" lang="fr">${paragraphsHtml(N.body_fr)}</div>
      <div class="blog-article__body news-article__body" lang="ar">${paragraphsHtml(N.body_ar || N.body_fr)}</div>
      ${photos}
    </article>
  </div>
</section>`
    : `
<section>
  <div class="container"><p class="news-empty">${bi_inline("Aucune actualité pour le moment — revenez bientôt.", "لا توجد مستجدات حاليًا — عودوا قريبًا.")}</p></div>
</section>`;

  const LIGHTBOX = images.length
    ? `
<div class="lightbox" data-lightbox aria-hidden="true">
  <button type="button" class="lightbox__close" data-lightbox-close aria-label="Fermer">✕</button>
  <button type="button" class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="Précédente">${icon("arrow-right", { size: 20 })}</button>
  <figure class="lightbox__figure"><img alt="" data-lightbox-img><figcaption data-lightbox-caption></figcaption></figure>
  <button type="button" class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="Suivante">${icon("arrow-right", { size: 20 })}</button>
  <div class="lightbox__counter" data-lightbox-counter></div>
</div>`
    : "";

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
      title: `${e(N.title_fr || "Actualités")} — Hamadat Promotion Immobilière`.replace(/"/g, "&quot;"),
      desc: e(String(N.body_fr || "Actualités de Hamadat Promotion Immobilière.").replace(/\s+/g, " ").slice(0, 155)).replace(/"/g, "&quot;"),
      root: ROOT,
    }) +
    nav(RES, ROOT, { blogEnabled: BLOG.enabled }) +
    HERO +
    ARTICLE +
    LIGHTBOX +
    NOTE +
    footer(G, RES, ROOT, { blogEnabled: BLOG.enabled })
  );
}

module.exports = { genActualites };
