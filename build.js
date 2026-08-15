#!/usr/bin/env node
// Orchestrateur de build — génère tout le HTML statique dans public/
// à partir des données JSON dans data/. Équivalent Node du pipeline Python
// (gen_home.py, gen_residences.py, gen_apropos.py, gen_actualites.py).
"use strict";

const fs = require("fs");
const path = require("path");

const { loadData } = require("./lib/common");
const { genHome } = require("./lib/gen-home");
const { genResidences } = require("./lib/gen-residences");
const { genApropos } = require("./lib/gen-apropos");
const { genActualites } = require("./lib/gen-actualites");
const { genBlogIndex, genBlogArticles } = require("./lib/gen-blog");
const { genLinks } = require("./lib/gen-links");
const { ICONS } = require("./lib/icons");

const SITE = path.join(__dirname, "public");

// Régénère public/admin/icons-data.js à partir de lib/icons.js — source
// unique de vérité pour les icônes, partagée entre le HTML généré (Node,
// via lib/common.js) et le sélecteur visuel d'icône du dashboard admin
// (navigateur, qui ne peut pas faire require() d'un module Node).
function writeIconsData() {
  const paths = {};
  const tags = {};
  for (const [name, entry] of Object.entries(ICONS)) {
    paths[name] = entry.d;
    tags[name] = entry.tags;
  }
  const js = `// Fichier généré automatiquement par build.js à partir de lib/icons.js.
// Ne pas éditer à la main — les modifications seraient écrasées au prochain build.
"use strict";
window.HAMADAT_ICON_PATHS = ${JSON.stringify(paths)};
window.HAMADAT_ICON_TAGS = ${JSON.stringify(tags)};
`;
  const adminDir = path.join(SITE, "admin");
  fs.mkdirSync(adminDir, { recursive: true });
  fs.writeFileSync(path.join(adminDir, "icons-data.js"), js, "utf8");
  console.log(`icons-data.js written, ${Object.keys(paths).length} icônes`);
}

function build() {
  const data = loadData();
  const { RES } = data;

  fs.mkdirSync(SITE, { recursive: true });
  fs.mkdirSync(path.join(SITE, "residences"), { recursive: true });

  writeIconsData();

  // index.html
  const home = genHome(data);
  fs.writeFileSync(path.join(SITE, "index.html"), home, "utf8");
  console.log("index.html written,", home.length, "chars");

  // apropos.html
  const apropos = genApropos(data);
  fs.writeFileSync(path.join(SITE, "apropos.html"), apropos, "utf8");
  console.log("apropos.html written,", apropos.length, "chars");

  // actualites.html
  const actualites = genActualites(data);
  fs.writeFileSync(path.join(SITE, "actualites.html"), actualites, "utf8");
  console.log("actualites.html written,", actualites.length, "chars");

  // residences/<slug>.html
  const pages = genResidences(data);
  let count = 0;
  for (const [id, html] of Object.entries(pages)) {
    fs.writeFileSync(path.join(SITE, "residences", `${id}.html`), html, "utf8");
    count++;
  }
  console.log(`${count} pages résidences générées`);

  // blog.html + blog/<slug>.html — uniquement si activé dans le dashboard
  // admin. On nettoie les anciens fichiers si le blog vient d'être
  // désactivé, pour ne pas laisser de pages orphelines accessibles.
  const blogIndexPath = path.join(SITE, "blog.html");
  const blogDir = path.join(SITE, "blog");
  if (data.BLOG && data.BLOG.enabled) {
    const blogIndex = genBlogIndex(data);
    fs.writeFileSync(blogIndexPath, blogIndex, "utf8");
    console.log("blog.html written,", blogIndex.length, "chars");

    fs.mkdirSync(blogDir, { recursive: true });
    const existing = fs.existsSync(blogDir) ? fs.readdirSync(blogDir) : [];
    const articlePages = genBlogArticles(data);
    const keep = new Set(Object.keys(articlePages).map((id) => `${id}.html`));
    for (const f of existing) {
      if (!keep.has(f)) fs.unlinkSync(path.join(blogDir, f));
    }
    for (const [id, html] of Object.entries(articlePages)) {
      fs.writeFileSync(path.join(blogDir, `${id}.html`), html, "utf8");
    }
    console.log(`${Object.keys(articlePages).length} articles de blog générés`);
  } else {
    if (fs.existsSync(blogIndexPath)) fs.unlinkSync(blogIndexPath);
    if (fs.existsSync(blogDir)) fs.rmSync(blogDir, { recursive: true, force: true });
    console.log("Blog désactivé — blog.html / blog/ non générés (nettoyés si présents).");
  }

  // liens.html — page "façon Linktree" utilisée sur les cartes de visite,
  // toujours générée (pas d'activation/désactivation pour cette page).
  const links = genLinks(data);
  fs.writeFileSync(path.join(SITE, "liens.html"), links, "utf8");
  console.log("liens.html written,", links.length, "chars");

  console.log(`\nBuild terminé — ${RES.length} résidences, HTML écrit dans ${SITE}`);
}

build();

module.exports = { build };
