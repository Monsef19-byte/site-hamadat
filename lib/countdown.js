// Compte à rebours d'événement (portes ouvertes, lancement…) — rendu HTML.
//
// Réglé dans le dashboard (onglet « Compte à rebours », data/countdown.json).
// Trois emplacements, activables indépendamment :
//   - popup   : fenêtre à l'ouverture du site (une fois par jour et par visiteur)
//   - slide   : première diapositive du carrousel de l'accueil
//   - mini    : petite fenêtre qui reste visible pendant le défilement
// Le décompte tourne côté navigateur (assets/js/main.js, bloc « Compte à
// rebours ») : le site est statique, donc la fin de l'événement (masquer ou
// afficher « C'est aujourd'hui ! ») est aussi gérée côté navigateur, sans
// attendre un nouveau build.
"use strict";

const { e, bi_inline, assetUrl } = require("./common");

const DEFAULTS = {
  enabled: false,
  date: "",
  time: "10:00",
  eyebrow_fr: "Événement",
  eyebrow_ar: "حدث",
  title_fr: "",
  title_ar: "",
  tagline_fr: "",
  tagline_ar: "",
  poster_slide: "",
  poster_window: "",
  show_popup: true,
  show_slide: true,
  show_mini: true,
  button_enabled: true,
  button_label_fr: "Contactez-nous",
  button_label_ar: "اتصلوا بنا",
  button_link: "#contact",
  end_behavior: "hide",
  today_fr: "C'est aujourd'hui !",
  today_ar: "إنه اليوم!",
};

const LABELS = [
  ["d", "Jours", "أيام"],
  ["h", "Heures", "ساعات"],
  ["m", "Min", "دقائق"],
  ["s", "Sec", "ثواني"],
];

function attr(s) {
  return e(s).replace(/"/g, "&quot;");
}

// Heure d'Algérie = UTC+1 toute l'année (pas d'heure d'été).
function targetIso(cd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cd.date || "")) return null;
  const time = /^\d{2}:\d{2}$/.test(cd.time || "") ? cd.time : "00:00";
  return `${cd.date}T${time}:00+01:00`;
}

// Normalise la config et indique si le compte à rebours doit être rendu au
// build. Au-delà de la fin de la journée de l'événement, plus rien n'est
// généré (le navigateur s'en charge aussi entre deux builds).
function countdownConfig(raw) {
  const cd = Object.assign({}, DEFAULTS, raw || {});
  const iso = targetIso(cd);
  const t = iso ? Date.parse(iso) : NaN;
  const hasPoster = Boolean(cd.poster_window || cd.poster_slide);
  let active = Boolean(cd.enabled && !isNaN(t) && hasPoster);
  if (active) {
    const endOfDay = Date.parse(`${cd.date}T00:00:00+01:00`) + 86400000;
    const limit = cd.end_behavior === "today" ? endOfDay : t;
    if (Date.now() >= limit) active = false;
  }
  cd.iso = iso;
  cd.active = active;
  return cd;
}

function unitsHtml(cls, cd) {
  const cells = LABELS.map(
    ([k, fr, ar]) => `<div class="cd-u"><b data-cd-u="${k}">00</b><small class="cd-l">${bi_inline(fr, ar)}</small></div>`
  ).join('<i aria-hidden="true">:</i>');
  return `<div class="${cls}" data-cd-units>${cells}</div><div class="cd-today" hidden>${todayHtml(cd || DEFAULTS)}</div>`;
}

function todayHtml(cd) {
  return bi_inline(cd.today_fr || DEFAULTS.today_fr, cd.today_ar || DEFAULTS.today_ar);
}

function liveLabel() {
  return `<div class="cd-live" data-cd-live>${bi_inline("Ouverture dans", "يبدأ خلال")}</div>`;
}

function buttonHref(cd, root) {
  const link = String(cd.button_link || "#contact").trim() || "#contact";
  if (link.startsWith("#")) return `${root}index.html${link}`;
  return link;
}

function buttonHtml(cd, root, extraCls = "") {
  if (!cd.button_enabled) return "";
  const href = buttonHref(cd, root);
  const ext = /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener"' : "";
  return `<a href="${attr(href)}" class="btn btn--primary${extraCls ? " " + extraCls : ""}"${ext}>${bi_inline(cd.button_label_fr, cd.button_label_ar)}</a>`;
}

// Fenêtre (popup) + petite fenêtre au défilement + config JS — sur toutes
// les pages (injecté par footer()).
function countdownWidgets(cd, root = "") {
  if (!cd || !cd.active) return "";
  const poster = assetUrl(root, cd.poster_window || cd.poster_slide);
  const title = bi_inline(cd.title_fr, cd.title_ar);
  const eyebrow = bi_inline(cd.eyebrow_fr, cd.eyebrow_ar);
  const cfg = {
    target: cd.iso,
    end: cd.end_behavior === "today" ? "today" : "hide",
    popup: Boolean(cd.show_popup),
    mini: Boolean(cd.show_mini),
  };
  const popup = cd.show_popup || cd.show_mini
    ? `
<div class="cd-pop" id="cdPop" role="dialog" aria-modal="true" aria-labelledby="cdPopTitle" hidden>
  <div class="cd-pop__card">
    <button type="button" class="cd-pop__x" data-cd-close aria-label="Fermer">✕</button>
    <img class="cd-pop__img" src="${attr(poster)}" alt="">
    <div class="cd-pop__body">
      <div class="eyebrow">${eyebrow}</div>
      <h3 id="cdPopTitle">${title}</h3>
      ${liveLabel()}
      ${unitsHtml("cd-units cd-units--pop", cd)}
      ${buttonHtml(cd, root, "cd-pop__btn")}
    </div>
  </div>
</div>`
    : "";
  const mini = cd.show_mini
    ? `
<div class="cd-mini" id="cdMini" hidden>
  <button type="button" class="cd-mini__x" data-cd-mini-close aria-label="Fermer">✕</button>
  <img class="cd-mini__img" src="${attr(poster)}" alt="" data-cd-open>
  <div class="cd-mini__body">
    ${liveLabel()}
    <h4>${title}</h4>
    ${unitsHtml("cd-units cd-units--mini", cd)}
    ${buttonHtml(cd, root, "cd-mini__btn")}
  </div>
</div>`
    : "";
  return `${popup}${mini}
<script>window.HAMADAT_CD=${JSON.stringify(cfg)};</script>
`;
}

// Diapositive du carrousel d'accueil : même structure que les autres
// (image plein écran + voile, pastille, titre, accroche, bouton) avec le
// compte à rebours en plus. Toujours en première position.
function countdownSlide(cd) {
  if (!cd || !cd.active || !cd.show_slide) return null;
  const img = assetUrl("", cd.poster_slide || cd.poster_window);
  const slide = `
    <div class="hero__slide" data-cd-slide data-duration="12000">
      <img src="${attr(img)}" alt="${attr(cd.title_fr)}">
      <div class="hero__scrim"></div>
    </div>`;
  const content = (i) => `
    <div class="hero__content-slide" data-slide="${i}" data-cd-slide style="display:${i === 0 ? "block" : "none"}">
      <div class="hero__eyebrow">${bi_inline(cd.eyebrow_fr, cd.eyebrow_ar)}</div>
      <h1 class="hero__title">${bi_inline(cd.title_fr, cd.title_ar)}</h1>
      ${cd.tagline_fr || cd.tagline_ar ? `<p class="hero__tagline">${bi_inline(cd.tagline_fr, cd.tagline_ar)}</p>` : ""}
      ${liveLabel()}
      ${unitsHtml("cd-units hero__countdown", cd)}
      ${cd.button_enabled ? `<div class="hero__cta-row">${buttonHtml(cd, "")}</div>` : ""}
    </div>`;
  return { slide, content };
}

module.exports = { DEFAULTS, countdownConfig, countdownWidgets, countdownSlide, todayHtml };
