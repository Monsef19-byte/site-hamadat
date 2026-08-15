// Génère blog.html (liste des articles) + blog/<slug>.html (un par article)
// — uniquement si BLOG.enabled est vrai. Le contenu de chaque article est
// un texte brut (paragraphes séparés par une ligne vide) transformé en HTML
// via paragraphsHtml(), pour rester simple côté admin (pas d'éditeur riche).
"use strict";

const { e, bi_inline, assetUrl, paragraphsHtml, HEAD, nav, footer, contactSection } = require("./common");

const ROOT = "";
const ARTICLE_ROOT = "../";

function articleCard(a, root) {
  const cover = a.cover_image
    ? `<img src="${assetUrl(root, a.cover_image)}" alt="${e(a.title_fr)}">`
    : `<div class="blog-card__placeholder"></div>`;
  return `
    <a href="${root}blog/${a.id}.html" class="blog-card reveal">
      ${cover}
      <div class="blog-card__body">
        ${a.published_at ? `<div class="blog-card__date">${e(a.published_at)}</div>` : ""}
        <h3>${bi_inline(a.title_fr, a.title_ar)}</h3>
        <p>${bi_inline(a.excerpt_fr || "", a.excerpt_ar || "")}</p>
        <div class="blog-card__cta">${bi_inline("Lire l'article", "قراءة المقال")} →</div>
      </div>
    </a>`;
}

function genBlogIndex({ G, RES, BLOG }) {
  if (!BLOG || !BLOG.enabled) return null;

  const HERO = `
<section class="page-hero">
  <div class="container">
    <div class="eyebrow">${bi_inline("Blog", "المدونة")}</div>
    <h1>${bi_inline(BLOG.page_title_fr || "Blog", BLOG.page_title_ar || "المدونة")}</h1>
    <p class="page-hero__lead">${bi_inline(BLOG.page_intro_fr || "", BLOG.page_intro_ar || "")}</p>
  </div>
</section>
`;

  const articles = (BLOG.articles || []).slice().sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));

  const GRID = articles.length
    ? `
<section>
  <div class="container">
    <div class="blog-grid">
      ${articles.map((a) => articleCard(a, ROOT)).join("")}
    </div>
  </div>
</section>
`
    : `
<section>
  <div class="container">
    <p style="text-align:center;color:var(--grey-3);padding:60px 0;">${bi_inline("Aucun article publié pour le moment.", "لا توجد مقالات منشورة حاليًا.")}</p>
  </div>
</section>
`;

  const page =
    HEAD({
      title: "Blog — Hamadat Promotion Immobilière",
      desc: BLOG.page_intro_fr || "Blog Hamadat Promotion Immobilière",
      root: ROOT,
    }) +
    nav(RES, ROOT, { blogEnabled: true }) +
    HERO +
    GRID +
    contactSection(G) +
    footer(G, RES, ROOT, { blogEnabled: true });

  return page;
}

function genBlogArticles({ G, RES, BLOG }) {
  if (!BLOG || !BLOG.enabled) return {};
  const pages = {};
  const articles = BLOG.articles || [];
  for (const a of articles) {
    const BREADCRUMB = `
<div class="blog-article__breadcrumb">
  <div class="container">
    <a href="${ARTICLE_ROOT}index.html">${bi_inline("Accueil", "الرئيسية")}</a> /
    <a href="${ARTICLE_ROOT}blog.html">${bi_inline("Blog", "المدونة")}</a> /
    <span>${bi_inline(a.title_fr, a.title_ar)}</span>
  </div>
</div>`;

    const COVER = a.cover_image
      ? `<div class="blog-article__cover"><img src="${assetUrl(ARTICLE_ROOT, a.cover_image)}" alt="${e(a.title_fr)}"></div>`
      : "";

    const ARTICLE = `
<section>
  <div class="container blog-article">
    ${COVER}
    ${a.published_at ? `<div class="blog-card__date">${e(a.published_at)}</div>` : ""}
    <h1>${bi_inline(a.title_fr, a.title_ar)}</h1>
    <div class="blog-article__body" lang="fr">
      ${paragraphsHtml(a.content_fr)}
    </div>
    <div class="blog-article__body" lang="ar" dir="rtl">
      ${paragraphsHtml(a.content_ar)}
    </div>
  </div>
</section>
`;

    const CTA = `
<section class="section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <div>
        <h3>${bi_inline("Envie de découvrir nos résidences ?", "ترغبون في اكتشاف إقاماتنا؟")}</h3>
        <p>${bi_inline("Prenez rendez-vous avec un conseiller Hamadat.", "احجزوا موعدًا مع أحد مستشاري حمادات.")}</p>
      </div>
      <div class="cta-band__actions">
        <a href="${ARTICLE_ROOT}index.html#residences" class="btn btn--dark">${bi_inline("Voir nos résidences", "مشاهدة إقاماتنا")}</a>
      </div>
    </div>
  </div>
</section>
`;

    const page =
      HEAD({
        title: `${a.title_fr} — Blog Hamadat Promotion Immobilière`,
        desc: a.excerpt_fr || a.title_fr,
        root: ARTICLE_ROOT,
      }) +
      nav(RES, ARTICLE_ROOT, { blogEnabled: true }) +
      BREADCRUMB +
      ARTICLE +
      CTA +
      footer(G, RES, ARTICLE_ROOT, { blogEnabled: true });

    pages[a.id] = page;
  }
  return pages;
}

module.exports = { genBlogIndex, genBlogArticles };
