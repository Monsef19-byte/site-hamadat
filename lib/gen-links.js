// Génère liens.html — page façon "Linktree" utilisée sur les cartes de
// visite (hamadat-promotion.com/liens, réécrite en URL propre côté Vercel).
// Une carte cliquable par lien (réseau social, téléphone, site, etc.),
// chacune avec une icône choisie dans l'admin.
"use strict";

const { e, bi_inline, icon, HEAD, nav, footer } = require("./common");

const ROOT = "";

function linkCard(item) {
  const external = /^https?:\/\//i.test(item.url || "");
  const attrs = external ? ' target="_blank" rel="noopener"' : "";
  return `
    <a href="${e(item.url || "#")}" class="link-card reveal"${attrs}>
      <span class="link-card__icon">${icon(item.icon, { size: 22 })}</span>
      <span class="link-card__label">${bi_inline(item.label_fr, item.label_ar)}</span>
      <span class="link-card__arrow">${icon("arrow-right", { size: 16 })}</span>
    </a>`;
}

function genLinks({ G, RES, BLOG, LINKS }) {
  const HERO = `
<section class="page-hero page-hero--links">
  <div class="container">
    <div class="eyebrow">${bi_inline("Liens", "الروابط")}</div>
    <h1>${bi_inline(LINKS.page_title_fr || "Nos liens", LINKS.page_title_ar || "روابطنا")}</h1>
    <p class="page-hero__lead">${bi_inline(LINKS.intro_fr || "", LINKS.intro_ar || "")}</p>
  </div>
</section>
`;

  const items = LINKS.items || [];
  const GRID = items.length
    ? `
<section>
  <div class="container">
    <div class="links-list">
      ${items.map(linkCard).join("")}
    </div>
  </div>
</section>
`
    : `
<section>
  <div class="container">
    <p style="text-align:center;color:var(--grey-3);padding:60px 0;">${bi_inline("Aucun lien pour le moment.", "لا توجد روابط حاليًا.")}</p>
  </div>
</section>
`;

  const page =
    HEAD({
      title: "Liens — Hamadat Promotion Immobilière",
      desc: LINKS.intro_fr || "Tous les liens et réseaux de Hamadat Promotion Immobilière",
      root: ROOT,
    }) +
    nav(RES, ROOT, { blogEnabled: BLOG && BLOG.enabled }) +
    HERO +
    GRID +
    footer(G, RES, ROOT, { blogEnabled: BLOG && BLOG.enabled });

  return page;
}

module.exports = { genLinks };
