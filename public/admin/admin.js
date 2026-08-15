"use strict";

// ============================================================================
// Helpers génériques
// ============================================================================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function api(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : {},
    credentials: "same-origin",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    /* pas de corps JSON */
  }
  if (!res.ok) {
    throw new Error((json && json.error) || `Erreur ${res.status}`);
  }
  return json;
}

let toastTimer = null;
function toast(message, isError) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.remove("hidden", "error");
  if (isError) node.classList.add("error");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.add("hidden"), 3200);
}

// ============================================================================
// État
// ============================================================================
const state = {
  global: { data: null, sha: null },
  carousel: { data: null, sha: null },
  residences: { data: null, sha: null },
  blog: { data: null, sha: null },
  links: { data: null, sha: null },
  videos: { data: null, sha: null },
  currentView: "global",
  currentResidenceIndex: null,
  currentArticleIndex: null,
};

// ============================================================================
// Auth
// ============================================================================
async function checkAuth() {
  const me = await api("GET", "/api/admin/me");
  return me.authenticated;
}

async function boot() {
  let authed = false;
  try {
    authed = await checkAuth();
  } catch (e) {
    authed = false;
  }
  if (authed) {
    await showApp();
  } else {
    showLogin();
  }
}

function showLogin() {
  $("#login-screen").classList.remove("hidden");
  $("#app").classList.add("hidden");
}

async function showApp() {
  $("#login-screen").classList.add("hidden");
  $("#app").classList.remove("hidden");
  try {
    await loadAll();
  } catch (e) {
    toast("Échec du chargement du contenu : " + e.message, true);
    return;
  }
  renderView("global");
}

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#login-submit");
  const errorNode = $("#login-error");
  errorNode.textContent = "";
  btn.disabled = true;
  try {
    await api("POST", "/api/admin/login", { password: $("#login-password").value });
    $("#login-password").value = "";
    await showApp();
  } catch (err) {
    errorNode.textContent = err.message || "Échec de connexion.";
  } finally {
    btn.disabled = false;
  }
});

$("#logout-btn").addEventListener("click", async () => {
  try {
    await api("POST", "/api/admin/logout");
  } catch (e) {
    /* ignore */
  }
  location.reload();
});

// ============================================================================
// Chargement / sauvegarde des données
// ============================================================================
async function loadAll() {
  const [g, car, res, blog, links, videos] = await Promise.all([
    api("GET", "/api/admin/content/global.json"),
    api("GET", "/api/admin/content/home_carousel.json"),
    api("GET", "/api/admin/content/residences.json"),
    api("GET", "/api/admin/content/blog.json"),
    api("GET", "/api/admin/content/links.json"),
    api("GET", "/api/admin/content/videos.json"),
  ]);
  state.global = { data: g.content, sha: g.sha };
  state.carousel = { data: car.content, sha: car.sha };
  state.residences = { data: res.content, sha: res.sha };
  state.blog = { data: blog.content, sha: blog.sha };
  state.links = { data: links.content, sha: links.sha };
  state.videos = { data: videos.content, sha: videos.sha };
}

async function saveSection(key, filename) {
  const section = state[key];
  const result = await api("PUT", `/api/admin/content/${filename}`, {
    data: section.data,
    sha: section.sha,
    message: `admin: mise à jour ${filename}`,
  });
  section.sha = result.sha;
  toast("Modifications enregistrées ✓");
}

// ============================================================================
// Navigation
// ============================================================================
$$(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => renderView(btn.dataset.view));
});

function renderView(view) {
  state.currentView = view;
  state.currentResidenceIndex = null;
  state.currentArticleIndex = null;
  $$(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $$(".view").forEach((v) => v.classList.add("hidden"));
  $(`#view-${view}`).classList.remove("hidden");
  if (view === "global") renderGlobalView();
  if (view === "carousel") renderCarouselView();
  if (view === "residences") renderResidencesList();
  if (view === "blog") renderBlogView();
  if (view === "links") renderLinksView();
  if (view === "videos") renderVideosView();
}

// ============================================================================
// Upload d'image (redimensionnement client via canvas, puis envoi base64)
// ============================================================================
function pickImageFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => resolve(input.files[0] || null);
    input.click();
  });
}

function downscaleImage(file, maxDim = 2000, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl.split(",")[1]);
      };
      img.onerror = () => reject(new Error("Image illisible."));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

async function pickAndUploadImage(folder, onStatus) {
  const file = await pickImageFile();
  if (!file) return null;
  onStatus && onStatus("Traitement…");
  const base64 = await downscaleImage(file);
  onStatus && onStatus("Envoi…");
  const result = await api("POST", "/api/admin/upload", {
    filename: file.name,
    contentType: "image/jpeg",
    dataBase64: base64,
    folder,
  });
  return result.url;
}

function imageDisplayUrl(asset) {
  if (!asset) return null;
  if (/^https?:\/\//i.test(asset) || asset.startsWith("/")) return asset;
  return `/assets/${asset}`;
}

// Extrait l'identifiant YouTube d'une URL (mêmes formats acceptés que côté
// serveur, voir lib/common.js#youtubeId — dupliqué ici car l'admin tourne
// dans le navigateur et ne peut pas faire require() d'un module Node).
function youtubeId(url) {
  if (!url) return null;
  const s = String(url).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*\bv=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/(?:embed|shorts)\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

// ============================================================================
// Sélecteur d'icône
// Bibliothèque partagée avec le site (public/admin/icons-data.js, généré
// au build à partir de lib/icons.js — même registre des deux côtés).
// ============================================================================
function iconSvg(name, size) {
  const paths = window.HAMADAT_ICON_PATHS || {};
  const d = paths[name] || paths["check-circle"] || "";
  return `<svg width="${size || 18}" height="${size || 18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

// Champ "sélecteur d'icône" : bouton affichant l'icône + son nom, qui ouvre
// une grille de recherche au clic. onSelect(name) est appelé au choix.
function iconPickerField(parent, { label, value, onSelect }) {
  const wrap = document.createElement("div");
  wrap.className = "field";
  if (label) {
    const lab = document.createElement("label");
    lab.textContent = label;
    wrap.appendChild(lab);
  }
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "icon-picker-btn";
  function paint(name) {
    btn.innerHTML = `${iconSvg(name, 18)}<span>${escapeHtml(name || "Choisir une icône")}</span>`;
  }
  paint(value);
  btn.addEventListener("click", () => {
    openIconPickerModal(value, (name) => {
      value = name;
      paint(name);
      onSelect(name);
    });
  });
  wrap.appendChild(btn);
  parent.appendChild(wrap);
  return wrap;
}

let _iconPickerOverlay = null;
function _iconPickerEscHandler(e) {
  if (e.key === "Escape") closeIconPickerModal();
}
function closeIconPickerModal() {
  if (_iconPickerOverlay) {
    _iconPickerOverlay.remove();
    _iconPickerOverlay = null;
    document.removeEventListener("keydown", _iconPickerEscHandler);
  }
}

function openIconPickerModal(currentValue, onPick) {
  closeIconPickerModal();
  const paths = window.HAMADAT_ICON_PATHS || {};
  const tags = window.HAMADAT_ICON_TAGS || {};
  const names = Object.keys(paths).sort();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-card icon-picker-modal">
      <div class="modal-header">
        <h3>Choisir une icône</h3>
        <button type="button" class="modal-close" aria-label="Fermer">✕</button>
      </div>
      <input type="text" class="icon-picker-search" placeholder="Rechercher (ex : parking, wifi, piscine…)">
      <div class="icon-picker-grid"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  _iconPickerOverlay = overlay;

  const grid = $(".icon-picker-grid", overlay);
  const search = $(".icon-picker-search", overlay);

  function renderGrid(filter) {
    const f = (filter || "").trim().toLowerCase();
    grid.innerHTML = "";
    const matches = names.filter((name) => !f || name.includes(f) || (tags[name] || "").includes(f));
    matches.forEach((name) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "icon-picker-cell" + (name === currentValue ? " selected" : "");
      cell.innerHTML = `${iconSvg(name, 22)}<span>${escapeHtml(name)}</span>`;
      cell.addEventListener("click", () => {
        onPick(name);
        closeIconPickerModal();
      });
      grid.appendChild(cell);
    });
    if (!matches.length) {
      grid.appendChild(el(`<div class="icon-picker-empty">Aucune icône ne correspond à « ${escapeHtml(f)} ».</div>`));
    }
  }
  renderGrid("");
  search.addEventListener("input", () => renderGrid(search.value));
  setTimeout(() => search.focus(), 30);

  $(".modal-close", overlay).addEventListener("click", closeIconPickerModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeIconPickerModal();
  });
  document.addEventListener("keydown", _iconPickerEscHandler);
}

// ============================================================================
// Champs génériques
// ============================================================================
function makeFieldRow(parent) {
  const row = document.createElement("div");
  row.className = "field-row";
  parent.appendChild(row);
  return row;
}

function makeField(parent, { label, value, multiline, dir, onInput, type }) {
  const wrap = document.createElement("div");
  wrap.className = "field";
  const lab = document.createElement("label");
  lab.textContent = label;
  wrap.appendChild(lab);
  const input = document.createElement(multiline ? "textarea" : "input");
  if (!multiline) input.type = type || "text";
  input.value = value == null ? "" : value;
  if (dir) input.dir = dir;
  input.addEventListener("input", () => onInput(input.value));
  wrap.appendChild(input);
  parent.appendChild(wrap);
  return input;
}

// Paire FR/AR côte à côte
function bilingualRow(parent, label, obj, frKey, arKey, opts = {}) {
  const row = makeFieldRow(parent);
  makeField(row, {
    label: `${label} · FR`,
    value: obj[frKey],
    multiline: opts.multiline,
    onInput: (v) => (obj[frKey] = v),
  });
  makeField(row, {
    label: `${label} · AR`,
    value: obj[arKey],
    multiline: opts.multiline,
    dir: "rtl",
    onInput: (v) => (obj[arKey] = v),
  });
  return row;
}

function newCard(container, title, sub) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h3>${escapeHtml(title)}</h3>${sub ? `<p class="card-sub">${escapeHtml(sub)}</p>` : ""}`;
  container.appendChild(card);
  return card;
}

// Liste de paires de chaînes bilingues alignées par index (ex: engagements, points forts)
function renderBilingualStringList(container, title, hint, obj, frKey, arKey) {
  const card = newCard(container, title, hint);
  const listWrap = document.createElement("div");
  card.appendChild(listWrap);

  function renderList() {
    listWrap.innerHTML = "";
    if (!obj[frKey]) obj[frKey] = [];
    if (!obj[arKey]) obj[arKey] = [];
    const frArr = obj[frKey];
    const arArr = obj[arKey];
    frArr.forEach((_, i) => {
      const item = document.createElement("div");
      item.className = "list-item";
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "list-item-remove";
      removeBtn.textContent = "✕";
      removeBtn.onclick = () => {
        frArr.splice(i, 1);
        arArr.splice(i, 1);
        renderList();
      };
      item.appendChild(removeBtn);
      const row = makeFieldRow(item);
      makeField(row, { label: "FR", value: frArr[i], onInput: (v) => (frArr[i] = v) });
      makeField(row, { label: "AR", value: arArr[i], dir: "rtl", onInput: (v) => (arArr[i] = v) });
      listWrap.appendChild(item);
    });
  }
  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost btn-sm list-add";
  addBtn.textContent = "+ Ajouter une ligne";
  addBtn.onclick = () => {
    obj[frKey].push("");
    obj[arKey].push("");
    renderList();
  };
  card.appendChild(addBtn);
  return card;
}

// Liste d'éléments "icône + texte FR/AR" (services, qualité & finitions,
// pourquoi Hamadat…) — l'icône est choisie explicitement via le sélecteur
// visuel plutôt que devinée automatiquement.
function renderIconTextList(container, title, hint, arr, { defaultIcon = "check-circle" } = {}) {
  const card = newCard(container, title, hint);
  const listWrap = document.createElement("div");
  card.appendChild(listWrap);

  function renderList() {
    listWrap.innerHTML = "";
    arr.forEach((item, i) => {
      if (!item.icon) item.icon = defaultIcon;
      const row = document.createElement("div");
      row.className = "icon-list-row";

      iconPickerField(row, {
        value: item.icon,
        onSelect: (name) => (item.icon = name),
      });

      const fields = makeFieldRow(row);
      fields.style.flex = "1";
      makeField(fields, { label: "FR", value: item.text_fr, onInput: (v) => (item.text_fr = v) });
      makeField(fields, { label: "AR", value: item.text_ar, dir: "rtl", onInput: (v) => (item.text_ar = v) });

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "list-item-remove";
      removeBtn.textContent = "✕";
      removeBtn.onclick = () => {
        arr.splice(i, 1);
        renderList();
      };
      row.appendChild(removeBtn);

      listWrap.appendChild(row);
    });
  }
  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost btn-sm list-add";
  addBtn.textContent = "+ Ajouter une ligne";
  addBtn.onclick = () => {
    arr.push({ icon: defaultIcon, text_fr: "", text_ar: "" });
    renderList();
  };
  card.appendChild(addBtn);
  return card;
}

// Liste d'objets libres (valeurs, statistiques, chiffres clés…)
function renderObjectList(container, { title, hint, arr, fieldsSpec, newItem, itemLabel }) {
  const card = newCard(container, title, hint);
  const listWrap = document.createElement("div");
  card.appendChild(listWrap);

  function renderList() {
    listWrap.innerHTML = "";
    arr.forEach((item, i) => {
      const wrap = document.createElement("div");
      wrap.className = "list-item";
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "list-item-remove";
      removeBtn.textContent = "✕";
      removeBtn.onclick = () => {
        arr.splice(i, 1);
        renderList();
      };
      wrap.appendChild(removeBtn);
      if (itemLabel) {
        const h = document.createElement("div");
        h.style.cssText = "font-weight:700;font-size:12.5px;margin-bottom:8px;color:var(--text-soft);";
        h.textContent = itemLabel(item, i);
        wrap.appendChild(h);
      }
      fieldsSpec(wrap, item);
      listWrap.appendChild(wrap);
    });
  }
  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost btn-sm list-add";
  addBtn.textContent = "+ Ajouter";
  addBtn.onclick = () => {
    arr.push(newItem());
    renderList();
  };
  card.appendChild(addBtn);
  return card;
}

// ============================================================================
// Vue : Contenu global
// ============================================================================
function renderGlobalView() {
  const container = $("#view-global");
  container.innerHTML = "";
  const G = state.global.data;

  container.appendChild(
    el(`<div><h2>Contenu global du site</h2><p class="view-sub">Textes communs à toutes les pages — accueil, à propos, actualités, contact, pied de page.</p></div>`)
  );

  let card = newCard(container, "Accroche d'accueil", "Texte affiché sous le carrousel principal de la page d'accueil.");
  bilingualRow(card, "Introduction", G.home, "hero_intro_fr", "hero_intro_ar", { multiline: true });
  bilingualRow(card, "Bouton d'action", G.home, "hero_cta_fr", "hero_cta_ar");

  card = newCard(container, "Qui sommes-nous");
  bilingualRow(card, "Titre (page d'accueil)", G.about, "title_fr", "title_ar");
  bilingualRow(card, "Titre « Notre histoire » (page Qui sommes-nous)", G.about, "history_title_fr", "history_title_ar");
  bilingualRow(card, "Texte", G.about, "text_fr", "text_ar", { multiline: true });

  renderBilingualStringList(container, "Engagements", "Liste affichée sous le texte « Qui sommes-nous ».", G.about, "commitments_fr", "commitments_ar");

  card = newCard(container, "Notre vision");
  bilingualRow(card, "Titre", G.vision, "title_fr", "title_ar");
  bilingualRow(card, "Texte", G.vision, "text_fr", "text_ar", { multiline: true });

  renderObjectList(container, {
    title: "Nos valeurs",
    hint: "Cartes numérotées affichées sur la page « Qui sommes-nous ».",
    arr: G.values,
    itemLabel: (item, i) => `Valeur ${i + 1}`,
    newItem: () => ({ title_fr: "", title_ar: "", text_fr: "", text_ar: "" }),
    fieldsSpec: (wrap, item) => {
      bilingualRow(wrap, "Titre", item, "title_fr", "title_ar");
      bilingualRow(wrap, "Texte", item, "text_fr", "text_ar", { multiline: true });
    },
  });

  card = newCard(container, "Notre signature");
  bilingualRow(card, "Titre", G.signature, "title_fr", "title_ar");
  bilingualRow(card, "Texte", G.signature, "text_fr", "text_ar", { multiline: true });
  bilingualRow(card, "Titre « Pourquoi Hamadat »", G.signature, "why_title_fr", "why_title_ar");

  if (!G.signature.why_points) G.signature.why_points = [];
  renderIconTextList(container, "Pourquoi choisir Hamadat", "Choisissez une icône pour chaque atout.", G.signature.why_points);

  card = newCard(container, "Chiffres clés");
  bilingualRow(card, "Titre de la section", G.stats, "title_fr", "title_ar");

  renderObjectList(container, {
    title: "Statistiques",
    hint: "Ex : valeur « +20 », libellé « ans d'expérience ».",
    arr: G.stats.items,
    itemLabel: (item, i) => `Statistique ${i + 1}`,
    newItem: () => ({ value: "", label_fr: "", label_ar: "" }),
    fieldsSpec: (wrap, item) => {
      const row = makeFieldRow(wrap);
      makeField(row, { label: "Valeur (ex: +20)", value: item.value, onInput: (v) => (item.value = v) });
      row.appendChild(document.createElement("div"));
      bilingualRow(wrap, "Libellé", item, "label_fr", "label_ar");
    },
  });

  card = newCard(container, "Page « Actualités »", "En-tête de la page /actualites.html");
  bilingualRow(card, "Titre", G.news_section, "title_fr", "title_ar");
  bilingualRow(card, "Texte", G.news_section, "text_fr", "text_ar", { multiline: true });

  card = newCard(container, "Section contact");
  bilingualRow(card, "Titre", G.contact, "title_fr", "title_ar");
  bilingualRow(card, "Texte", G.contact, "text_fr", "text_ar", { multiline: true });
  bilingualRow(card, "Bouton d'envoi", G.contact, "submit_fr", "submit_ar");

  card = newCard(container, "Coordonnées de l'entreprise", "Affichées dans la carte de contact et le pied de page de toutes les pages.");
  bilingualRow(card, "Nom de l'entreprise", G.contact, "company_name_fr", "company_name_ar");
  bilingualRow(card, "Adresse complète", G.contact, "address_fr", "address_ar");
  bilingualRow(card, "Ville (résumé, pied de page)", G.contact, "city_fr", "city_ar");
  {
    const row = makeFieldRow(card);
    makeField(row, { label: "Téléphone", value: G.contact.phone, onInput: (v) => (G.contact.phone = v) });
    makeField(row, { label: "E-mail", value: G.contact.email, type: "email", onInput: (v) => (G.contact.email = v) });
  }
  bilingualRow(card, "Badge (ex : +20 ans d'expérience)", G.contact, "badge_fr", "badge_ar");

  card = newCard(container, "Champs du formulaire", "Libellés affichés au-dessus de chaque champ (la structure du formulaire n'est pas modifiable ici).");
  (G.contact.fields || []).forEach((f) => {
    const wrap = document.createElement("div");
    wrap.className = "list-item";
    bilingualRow(wrap, `Libellé (${f.name})`, f, "label_fr", "label_ar");
    card.appendChild(wrap);
  });

  card = newCard(container, "Pied de page");
  bilingualRow(card, "Citation", G.footer_note, "quote_fr", "quote_ar");

  const toolbar = el(`<div class="section-toolbar"><button class="btn btn-primary" id="save-global">Enregistrer le contenu global</button></div>`);
  container.appendChild(toolbar);
  $("#save-global", toolbar).addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      await saveSection("global", "global.json");
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      e.target.disabled = false;
    }
  });
}

// ============================================================================
// Vue : Carrousel d'accueil
// ============================================================================
function renderCarouselView() {
  const container = $("#view-carousel");
  container.innerHTML = "";
  const CAR = state.carousel.data;
  const RES = state.residences.data;

  container.appendChild(
    el(`<div><h2>Carrousel de la page d'accueil</h2><p class="view-sub">Une slide plein écran par résidence. L'ordre ci-dessous détermine l'ordre d'affichage.</p></div>`)
  );

  const listWrap = document.createElement("div");
  container.appendChild(listWrap);

  function renderList() {
    listWrap.innerHTML = "";
    CAR.forEach((slide, i) => {
      const card = document.createElement("div");
      card.className = "slide-card";

      const imgUrl = imageDisplayUrl(slide.asset);
      const imgWrap = document.createElement("div");
      imgWrap.innerHTML = imgUrl
        ? `<img src="${imgUrl}" style="width:110px;height:80px;object-fit:cover;border-radius:8px;">`
        : `<div class="img-picker-empty" style="width:110px;height:80px;">Aucune image</div>`;
      card.appendChild(imgWrap.firstElementChild);

      const fields = document.createElement("div");
      fields.className = "slide-fields";
      const topLine = document.createElement("div");
      topLine.style.cssText = "font-weight:700;font-size:13px;";
      topLine.textContent = `${i + 1}. ${slide.name || slide.residence_id}`;
      fields.appendChild(topLine);
      bilingualRow(fields, "Accroche", slide, "tagline_fr", "tagline_ar");
      bilingualRow(fields, "Bouton", slide, "cta_fr", "cta_ar");
      card.appendChild(fields);

      const actions = document.createElement("div");
      actions.className = "slide-actions";

      const uploadBtn = document.createElement("button");
      uploadBtn.type = "button";
      uploadBtn.className = "btn btn-ghost btn-sm";
      uploadBtn.textContent = "Changer l'image";
      uploadBtn.onclick = async () => {
        uploadBtn.disabled = true;
        const prevText = uploadBtn.textContent;
        try {
          const url = await pickAndUploadImage(`home-carousel/${slide.residence_id}`, (s) => (uploadBtn.textContent = s));
          if (url) {
            slide.asset = url;
            renderList();
          }
        } catch (err) {
          toast("Échec de l'upload : " + err.message, true);
        } finally {
          uploadBtn.disabled = false;
          uploadBtn.textContent = prevText;
        }
      };
      actions.appendChild(uploadBtn);

      if (i > 0) {
        const upBtn = document.createElement("button");
        upBtn.type = "button";
        upBtn.className = "btn btn-ghost btn-sm";
        upBtn.textContent = "↑ Monter";
        upBtn.onclick = () => {
          [CAR[i - 1], CAR[i]] = [CAR[i], CAR[i - 1]];
          renderList();
        };
        actions.appendChild(upBtn);
      }
      if (i < CAR.length - 1) {
        const downBtn = document.createElement("button");
        downBtn.type = "button";
        downBtn.className = "btn btn-ghost btn-sm";
        downBtn.textContent = "↓ Descendre";
        downBtn.onclick = () => {
          [CAR[i + 1], CAR[i]] = [CAR[i], CAR[i + 1]];
          renderList();
        };
        actions.appendChild(downBtn);
      }
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-danger btn-sm";
      removeBtn.textContent = "Retirer";
      removeBtn.onclick = () => {
        CAR.splice(i, 1);
        renderList();
      };
      actions.appendChild(removeBtn);

      card.appendChild(actions);
      listWrap.appendChild(card);
    });
  }
  renderList();

  const usedIds = new Set(CAR.map((s) => s.residence_id));
  const available = RES.filter((r) => !usedIds.has(r.id));
  if (available.length) {
    const addWrap = newCard(container, "Ajouter une résidence au carrousel");
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:10px;align-items:center;";
    const select = document.createElement("select");
    select.style.cssText = "flex:1;padding:9px 10px;border:1px solid var(--border);border-radius:7px;";
    available.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = r.name;
      select.appendChild(opt);
    });
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-primary btn-sm";
    addBtn.textContent = "Ajouter";
    addBtn.onclick = () => {
      const r = RES.find((x) => x.id === select.value);
      if (!r) return;
      CAR.push({
        residence_id: r.id,
        name: r.name,
        name_ar: r.name_ar,
        category: r.category,
        tagline_fr: r.tagline_fr,
        tagline_ar: r.tagline_ar,
        location_fr: r.location_fr,
        location_ar: r.location_ar,
        status_fr: r.status_fr,
        status_ar: r.status_ar,
        cta_fr: "Découvrir la résidence",
        cta_ar: "اكتشف الإقامة",
        link: `/residences/${r.id}`,
        asset: "",
      });
      renderCarouselView();
    };
    row.appendChild(select);
    row.appendChild(addBtn);
    addWrap.appendChild(row);
  }

  const toolbar = el(`<div class="section-toolbar"><button class="btn btn-primary" id="save-carousel">Enregistrer le carrousel</button></div>`);
  container.appendChild(toolbar);
  $("#save-carousel", toolbar).addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      await saveSection("carousel", "home_carousel.json");
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      e.target.disabled = false;
    }
  });
}

// ============================================================================
// Vue : Résidences (liste + détail)
// ============================================================================
function blankResidence() {
  const id = "nouvelle-residence-" + Math.random().toString(36).slice(2, 8);
  return {
    id,
    category: "en_cours",
    name: "",
    name_ar: "",
    tagline_fr: "",
    tagline_ar: "",
    location_fr: "",
    location_ar: "",
    google_maps: null,
    status_fr: "",
    status_ar: "",
    description_fr: "",
    description_ar: "",
    why_location_fr: "",
    why_location_ar: "",
    key_numbers: [],
    typologies_fr: "",
    typologies_ar: "",
    services: [],
    quality: [],
    youtube: null,
    images: { principale: [], interieur: [] },
    diaporama: [],
    progress_percent: null,
    availability_fr: "",
    availability_ar: "",
    avail_open: true,
    delivered_year: null,
  };
}

function renderResidencesList() {
  const container = $("#view-residences");
  container.innerHTML = "";
  const RES = state.residences.data;

  container.appendChild(el(`<div><h2>Résidences</h2><p class="view-sub">${RES.length} résidence(s). Cliquez sur une fiche pour modifier tous les détails.</p></div>`));

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-dark";
  addBtn.style.marginBottom = "16px";
  addBtn.textContent = "+ Ajouter une résidence";
  addBtn.onclick = () => {
    RES.push(blankResidence());
    state.currentResidenceIndex = RES.length - 1;
    renderResidenceDetail();
  };
  container.appendChild(addBtn);

  const list = document.createElement("div");
  list.className = "res-list";
  RES.forEach((r, i) => {
    const hero = (state.carousel.data || []).find((c) => c.residence_id === r.id);
    const imgUrl = imageDisplayUrl(hero && hero.asset);
    const row = document.createElement("div");
    row.className = "res-row";
    row.innerHTML = `
      ${imgUrl ? `<img src="${imgUrl}">` : `<div class="img-picker-empty" style="width:52px;height:52px;">—</div>`}
      <div class="res-row-info">
        <div class="res-row-name">${escapeHtml(r.name) || "(sans nom)"} <span class="badge ${r.category === "en_cours" ? "badge-teal" : "badge-grey"}">${r.category === "en_cours" ? "En cours" : "Livré"}</span></div>
        <div class="res-row-meta">${escapeHtml(r.location_fr || "")} · ${escapeHtml(r.availability_fr || "")}</div>
      </div>
    `;
    row.addEventListener("click", () => {
      state.currentResidenceIndex = i;
      renderResidenceDetail();
    });
    list.appendChild(row);
  });
  container.appendChild(list);
}

function renderResidenceDetail() {
  const container = $("#view-residences");
  container.innerHTML = "";
  const RES = state.residences.data;
  const idx = state.currentResidenceIndex;
  const r = RES[idx];

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "detail-back";
  backBtn.textContent = "← Retour aux résidences";
  backBtn.onclick = () => {
    state.currentResidenceIndex = null;
    renderResidencesList();
  };
  container.appendChild(backBtn);

  container.appendChild(
    el(`<div><h2>${escapeHtml(r.name) || "Nouvelle résidence"}</h2><p class="view-sub">Identifiant technique : <code>${escapeHtml(r.id)}</code> (utilisé dans l'URL de la page résidence).</p></div>`)
  );

  let card = newCard(container, "Identité");
  {
    const row = makeFieldRow(card);
    makeField(row, {
      label: "Identifiant (URL)",
      value: r.id,
      onInput: (v) => (r.id = v.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-")),
    });
    const catField = document.createElement("div");
    catField.className = "field";
    catField.innerHTML = `<label>Statut</label>`;
    const select = document.createElement("select");
    ["en_cours", "livre"].forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v === "en_cours" ? "En cours" : "Livré";
      if (r.category === v) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => (r.category = select.value));
    catField.appendChild(select);
    row.appendChild(catField);
  }
  bilingualRow(card, "Nom", r, "name", "name_ar");
  bilingualRow(card, "Accroche", r, "tagline_fr", "tagline_ar");
  bilingualRow(card, "Emplacement", r, "location_fr", "location_ar");
  {
    const row = makeFieldRow(card);
    makeField(row, { label: "Lien Google Maps", value: r.google_maps, onInput: (v) => (r.google_maps = v || null) });
    makeField(row, { label: "Année de livraison (si livrée)", value: r.delivered_year, onInput: (v) => (r.delivered_year = v || null) });
  }

  card = newCard(container, "Disponibilité & avancement", "Affiché en badge sur la page d'accueil, la fiche résidence et la page actualités.");
  bilingualRow(card, "Disponibilité", r, "availability_fr", "availability_ar");
  {
    const row = makeFieldRow(card);
    const chkField = document.createElement("div");
    chkField.className = "field";
    chkField.innerHTML = `<div class="checkbox-row"><input type="checkbox" id="avail-open-chk" ${r.avail_open ? "checked" : ""}> <label for="avail-open-chk" style="margin:0;">Encore disponible (badge vert)</label></div>`;
    row.appendChild(chkField);
    $("#avail-open-chk", chkField).addEventListener("change", (e) => (r.avail_open = e.target.checked));

    const pctField = document.createElement("div");
    pctField.className = "field";
    pctField.innerHTML = `<label>Avancement des travaux (%)</label>`;
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.value = r.progress_percent == null ? "" : r.progress_percent;
    input.placeholder = "Laisser vide si non communiqué";
    input.addEventListener("input", () => {
      r.progress_percent = input.value === "" ? null : Math.max(0, Math.min(100, Number(input.value)));
    });
    pctField.appendChild(input);
    pctField.appendChild(el(`<div class="progress-hint">Laissez vide si le client n'a pas communiqué de pourcentage — aucune barre ne sera affichée.</div>`));
    row.appendChild(pctField);
  }

  card = newCard(container, "Statut (fiche résidence)");
  bilingualRow(card, "Statut", r, "status_fr", "status_ar");

  card = newCard(container, "Présentation");
  bilingualRow(card, "Description", r, "description_fr", "description_ar", { multiline: true });
  bilingualRow(card, "Pourquoi cet emplacement", r, "why_location_fr", "why_location_ar", { multiline: true });
  bilingualRow(card, "Typologies (ex: F3 · F4 · F5)", r, "typologies_fr", "typologies_ar");

  if (!r.key_numbers) r.key_numbers = [];
  renderObjectList(container, {
    title: "Le projet en chiffres",
    hint: "Ex : valeur « 20 », libellé « appartements haut standing ».",
    arr: r.key_numbers,
    itemLabel: (item, i) => `Chiffre ${i + 1}`,
    newItem: () => ({ value: "", label_fr: "", label_ar: "" }),
    fieldsSpec: (wrap, item) => {
      const row = makeFieldRow(wrap);
      makeField(row, { label: "Valeur", value: item.value, onInput: (v) => (item.value = v) });
      row.appendChild(document.createElement("div"));
      bilingualRow(wrap, "Libellé", item, "label_fr", "label_ar");
    },
  });

  if (!r.services) r.services = [];
  if (!r.quality) r.quality = [];
  renderIconTextList(container, "Services & équipements", "Choisissez une icône pour chaque élément (ex : ascenseur, piscine, climatisation…).", r.services);
  renderIconTextList(container, "Qualité & finitions", "Choisissez une icône pour chaque élément.", r.quality);

  renderDiaporamaEditor(container, r);

  card = newCard(container, "Zone sensible", "La suppression retire la résidence de la liste et de toutes les pages générées (à retirer aussi du carrousel d'accueil si elle y figure).");
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "btn btn-danger";
  delBtn.textContent = "Supprimer cette résidence";
  delBtn.onclick = () => {
    if (!confirm(`Supprimer définitivement « ${r.name || r.id} » ? Cette action n'est effective qu'après avoir cliqué sur « Enregistrer ».`)) return;
    RES.splice(idx, 1);
    state.currentResidenceIndex = null;
    renderResidencesList();
  };
  card.appendChild(delBtn);

  const toolbar = el(`<div class="section-toolbar">
    <button class="btn btn-ghost" id="cancel-res">Annuler</button>
    <button class="btn btn-primary" id="save-res">Enregistrer toutes les résidences</button>
  </div>`);
  container.appendChild(toolbar);
  $("#cancel-res", toolbar).addEventListener("click", () => {
    state.currentResidenceIndex = null;
    renderResidencesList();
  });
  $("#save-res", toolbar).addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      await saveSection("residences", "residences.json");
      renderResidenceDetail();
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      e.target.disabled = false;
    }
  });
}

function renderDiaporamaEditor(container, r) {
  const card = newCard(
    container,
    "Galerie / diaporama",
    "Images affichées dans le diaporama plein écran de la page résidence et dans la galerie. La 1ʳᵉ image sert de photo principale."
  );
  const listWrap = document.createElement("div");
  card.appendChild(listWrap);

  if (!r.diaporama) r.diaporama = [];

  function renderList() {
    listWrap.innerHTML = "";
    r.diaporama.forEach((slide, i) => {
      const slideCard = document.createElement("div");
      slideCard.className = "slide-card";

      const imgUrl = imageDisplayUrl(slide.asset);
      const imgHtml = imgUrl
        ? `<img src="${imgUrl}" style="width:110px;height:80px;object-fit:cover;border-radius:8px;">`
        : `<div class="img-picker-empty" style="width:110px;height:80px;">Aucune image</div>`;
      slideCard.appendChild(el(imgHtml));

      const fields = document.createElement("div");
      fields.className = "slide-fields";
      bilingualRow(fields, `Légende ${i + 1}`, slide, "caption_fr", "caption_ar");
      slideCard.appendChild(fields);

      const actions = document.createElement("div");
      actions.className = "slide-actions";
      const uploadBtn = document.createElement("button");
      uploadBtn.type = "button";
      uploadBtn.className = "btn btn-ghost btn-sm";
      uploadBtn.textContent = "Changer l'image";
      uploadBtn.onclick = async () => {
        uploadBtn.disabled = true;
        const prevText = uploadBtn.textContent;
        try {
          const url = await pickAndUploadImage(`residences/${r.id}/diaporama`, (s) => (uploadBtn.textContent = s));
          if (url) {
            slide.asset = url;
            slide.caption_proposed = false;
            renderList();
          }
        } catch (err) {
          toast("Échec de l'upload : " + err.message, true);
        } finally {
          uploadBtn.disabled = false;
          uploadBtn.textContent = prevText;
        }
      };
      actions.appendChild(uploadBtn);

      if (i > 0) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-ghost btn-sm";
        b.textContent = "↑";
        b.onclick = () => {
          [r.diaporama[i - 1], r.diaporama[i]] = [r.diaporama[i], r.diaporama[i - 1]];
          renderList();
        };
        actions.appendChild(b);
      }
      if (i < r.diaporama.length - 1) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-ghost btn-sm";
        b.textContent = "↓";
        b.onclick = () => {
          [r.diaporama[i + 1], r.diaporama[i]] = [r.diaporama[i], r.diaporama[i + 1]];
          renderList();
        };
        actions.appendChild(b);
      }
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-danger btn-sm";
      removeBtn.textContent = "Retirer";
      removeBtn.onclick = () => {
        r.diaporama.splice(i, 1);
        renderList();
      };
      actions.appendChild(removeBtn);

      slideCard.appendChild(actions);
      listWrap.appendChild(slideCard);
    });
  }
  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost btn-sm list-add";
  addBtn.textContent = "+ Ajouter une image";
  addBtn.onclick = async () => {
    addBtn.disabled = true;
    const prevText = addBtn.textContent;
    try {
      const url = await pickAndUploadImage(`residences/${r.id}/diaporama`, (s) => (addBtn.textContent = s));
      if (url) {
        r.diaporama.push({ file: "", caption_fr: "", caption_ar: "", caption_proposed: true, asset: url });
        renderList();
      }
    } catch (err) {
      toast("Échec de l'upload : " + err.message, true);
    } finally {
      addBtn.disabled = false;
      addBtn.textContent = prevText;
    }
  };
  card.appendChild(addBtn);
}

// ============================================================================
// Vue : Blog (liste + détail d'article)
// ============================================================================
function blankArticle() {
  const id = "article-" + Math.random().toString(36).slice(2, 8);
  const today = new Date().toISOString().slice(0, 10);
  return {
    id,
    title_fr: "",
    title_ar: "",
    excerpt_fr: "",
    excerpt_ar: "",
    content_fr: "",
    content_ar: "",
    cover_image: "",
    published_at: today,
  };
}

function renderBlogView() {
  const container = $("#view-blog");
  container.innerHTML = "";
  const BLOG = state.blog.data;
  if (!BLOG.articles) BLOG.articles = [];

  container.appendChild(
    el(`<div><h2>Blog</h2><p class="view-sub">Activez la page Blog et gérez ses articles. Quand désactivée, la page et tous les articles sont retirés du site public.</p></div>`)
  );

  let card = newCard(container, "Activation");
  {
    const row = document.createElement("div");
    row.className = "toggle-row";
    row.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="blog-enabled-chk" ${BLOG.enabled ? "checked" : ""}>
        <span class="track"></span>
      </label>
      <div>
        <div class="toggle-label">Activer la page Blog</div>
        <div class="toggle-sub">Quand désactivé, le lien « Blog » disparaît du menu et du pied de page, et la page /blog n'est plus générée.</div>
      </div>
    `;
    card.appendChild(row);
    $("#blog-enabled-chk", row).addEventListener("change", (e) => (BLOG.enabled = e.target.checked));
  }

  card = newCard(container, "Page Blog", "Titre et introduction affichés en haut de la page /blog.");
  bilingualRow(card, "Titre", BLOG, "page_title_fr", "page_title_ar");
  bilingualRow(card, "Introduction", BLOG, "page_intro_fr", "page_intro_ar", { multiline: true });

  card = newCard(container, "Articles", `${BLOG.articles.length} article(s).`);
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-dark";
  addBtn.style.marginBottom = "14px";
  addBtn.textContent = "+ Ajouter un article";
  addBtn.onclick = () => {
    BLOG.articles.push(blankArticle());
    state.currentArticleIndex = BLOG.articles.length - 1;
    renderArticleDetail();
  };
  card.appendChild(addBtn);

  const list = document.createElement("div");
  list.className = "entry-list";
  if (!BLOG.articles.length) {
    list.appendChild(el(`<div class="entry-empty">Aucun article pour le moment.</div>`));
  }
  BLOG.articles.forEach((a, i) => {
    const imgUrl = imageDisplayUrl(a.cover_image);
    const row = document.createElement("div");
    row.className = "entry-row";
    row.innerHTML = `
      ${imgUrl ? `<img src="${imgUrl}">` : `<div class="img-picker-empty" style="width:52px;height:52px;">—</div>`}
      <div class="entry-row-info">
        <div class="entry-row-name">${escapeHtml(a.title_fr) || "(sans titre)"}</div>
        <div class="entry-row-meta">${escapeHtml(a.published_at || "")} · ${escapeHtml(a.excerpt_fr || "")}</div>
      </div>
    `;
    row.addEventListener("click", () => {
      state.currentArticleIndex = i;
      renderArticleDetail();
    });
    list.appendChild(row);
  });
  card.appendChild(list);

  const toolbar = el(`<div class="section-toolbar"><button class="btn btn-primary" id="save-blog">Enregistrer le blog</button></div>`);
  container.appendChild(toolbar);
  $("#save-blog", toolbar).addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      await saveSection("blog", "blog.json");
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      e.target.disabled = false;
    }
  });
}

function renderArticleDetail() {
  const container = $("#view-blog");
  container.innerHTML = "";
  const BLOG = state.blog.data;
  const idx = state.currentArticleIndex;
  const a = BLOG.articles[idx];

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "detail-back";
  backBtn.textContent = "← Retour aux articles";
  backBtn.onclick = () => {
    state.currentArticleIndex = null;
    renderBlogView();
  };
  container.appendChild(backBtn);

  container.appendChild(
    el(`<div><h2>${escapeHtml(a.title_fr) || "Nouvel article"}</h2><p class="view-sub">Identifiant technique : <code>${escapeHtml(a.id)}</code> (utilisé dans l'URL de l'article).</p></div>`)
  );

  let card = newCard(container, "Identité");
  {
    const row = makeFieldRow(card);
    makeField(row, {
      label: "Identifiant (URL)",
      value: a.id,
      onInput: (v) => (a.id = v.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-")),
    });
    makeField(row, { label: "Date de publication (AAAA-MM-JJ)", value: a.published_at, onInput: (v) => (a.published_at = v) });
  }
  bilingualRow(card, "Titre", a, "title_fr", "title_ar");
  bilingualRow(card, "Résumé (aperçu sur la liste)", a, "excerpt_fr", "excerpt_ar", { multiline: true });

  card = newCard(container, "Image de couverture");
  {
    const imgUrl = imageDisplayUrl(a.cover_image);
    const preview = document.createElement("div");
    preview.style.cssText = "display:flex;align-items:center;gap:14px;margin-bottom:10px;";
    preview.innerHTML = imgUrl
      ? `<img src="${imgUrl}" style="width:140px;height:100px;object-fit:cover;border-radius:8px;">`
      : `<div class="img-picker-empty" style="width:140px;height:100px;">Aucune image</div>`;
    card.appendChild(preview);
    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.className = "btn btn-ghost btn-sm";
    uploadBtn.textContent = "Changer l'image";
    uploadBtn.onclick = async () => {
      uploadBtn.disabled = true;
      const prevText = uploadBtn.textContent;
      try {
        const url = await pickAndUploadImage(`blog/${a.id}`, (s) => (uploadBtn.textContent = s));
        if (url) {
          a.cover_image = url;
          renderArticleDetail();
        }
      } catch (err) {
        toast("Échec de l'upload : " + err.message, true);
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = prevText;
      }
    };
    card.appendChild(uploadBtn);
  }

  card = newCard(container, "Contenu de l'article", "Séparez les paragraphes par une ligne vide.");
  bilingualRow(card, "Texte", a, "content_fr", "content_ar", { multiline: true });

  card = newCard(container, "Zone sensible");
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "btn btn-danger";
  delBtn.textContent = "Supprimer cet article";
  delBtn.onclick = () => {
    if (!confirm(`Supprimer définitivement « ${a.title_fr || a.id} » ? Cette action n'est effective qu'après avoir cliqué sur « Enregistrer ».`)) return;
    BLOG.articles.splice(idx, 1);
    state.currentArticleIndex = null;
    renderBlogView();
  };
  card.appendChild(delBtn);

  const toolbar = el(`<div class="section-toolbar">
    <button class="btn btn-ghost" id="cancel-article">Annuler</button>
    <button class="btn btn-primary" id="save-article">Enregistrer tous les articles</button>
  </div>`);
  container.appendChild(toolbar);
  $("#cancel-article", toolbar).addEventListener("click", () => {
    state.currentArticleIndex = null;
    renderBlogView();
  });
  $("#save-article", toolbar).addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      await saveSection("blog", "blog.json");
      renderArticleDetail();
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      e.target.disabled = false;
    }
  });
}

// ============================================================================
// Vue : Liens (page façon Linktree, /liens)
// ============================================================================
function renderLinksView() {
  const container = $("#view-links");
  container.innerHTML = "";
  const LINKS = state.links.data;
  if (!LINKS.items) LINKS.items = [];

  container.appendChild(
    el(`<div><h2>Page « Liens »</h2><p class="view-sub">Page utilisée sur les cartes de visite (hamadat-promotion.com/liens) — une carte cliquable par réseau ou lien important.</p></div>`)
  );

  let card = newCard(container, "En-tête de la page");
  bilingualRow(card, "Titre", LINKS, "page_title_fr", "page_title_ar");
  bilingualRow(card, "Introduction", LINKS, "intro_fr", "intro_ar", { multiline: true });

  card = newCard(container, "Cartes de liens", "Choisissez une icône, écrivez le libellé dans les deux langues, et indiquez l'URL (ou tel:+213… pour un numéro, mailto:… pour un e-mail).");
  const listWrap = document.createElement("div");
  card.appendChild(listWrap);

  function renderList() {
    listWrap.innerHTML = "";
    LINKS.items.forEach((item, i) => {
      if (!item.icon) item.icon = "link";
      const row = document.createElement("div");
      row.className = "slide-card";

      iconPickerField(row, {
        value: item.icon,
        onSelect: (name) => (item.icon = name),
      });

      const fields = document.createElement("div");
      fields.className = "slide-fields";
      bilingualRow(fields, "Libellé", item, "label_fr", "label_ar");
      const urlRow = makeFieldRow(fields);
      makeField(urlRow, { label: "URL (https://…, tel:…, mailto:…)", value: item.url, onInput: (v) => (item.url = v) });
      row.appendChild(fields);

      const actions = document.createElement("div");
      actions.className = "slide-actions";
      if (i > 0) {
        const upBtn = document.createElement("button");
        upBtn.type = "button";
        upBtn.className = "btn btn-ghost btn-sm";
        upBtn.textContent = "↑ Monter";
        upBtn.onclick = () => {
          [LINKS.items[i - 1], LINKS.items[i]] = [LINKS.items[i], LINKS.items[i - 1]];
          renderList();
        };
        actions.appendChild(upBtn);
      }
      if (i < LINKS.items.length - 1) {
        const downBtn = document.createElement("button");
        downBtn.type = "button";
        downBtn.className = "btn btn-ghost btn-sm";
        downBtn.textContent = "↓ Descendre";
        downBtn.onclick = () => {
          [LINKS.items[i + 1], LINKS.items[i]] = [LINKS.items[i], LINKS.items[i + 1]];
          renderList();
        };
        actions.appendChild(downBtn);
      }
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-danger btn-sm";
      removeBtn.textContent = "Retirer";
      removeBtn.onclick = () => {
        LINKS.items.splice(i, 1);
        renderList();
      };
      actions.appendChild(removeBtn);

      row.appendChild(actions);
      listWrap.appendChild(row);
    });
  }
  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost btn-sm list-add";
  addBtn.textContent = "+ Ajouter un lien";
  addBtn.onclick = () => {
    LINKS.items.push({ icon: "link", label_fr: "", label_ar: "", url: "" });
    renderList();
  };
  card.appendChild(addBtn);

  const toolbar = el(`<div class="section-toolbar"><button class="btn btn-primary" id="save-links">Enregistrer la page Liens</button></div>`);
  container.appendChild(toolbar);
  $("#save-links", toolbar).addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      await saveSection("links", "links.json");
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      e.target.disabled = false;
    }
  });
}

// ============================================================================
// Vue : Vidéos YouTube (carrousel accueil)
// ============================================================================
function renderVideosView() {
  const container = $("#view-videos");
  container.innerHTML = "";
  const VIDEOS = state.videos.data;
  if (!VIDEOS.items) VIDEOS.items = [];

  container.appendChild(
    el(`<div><h2>Vidéos YouTube</h2><p class="view-sub">Carrousel affiché sur la page d'accueil. Collez simplement le lien YouTube de la vidéo (page, "partager" ou lien court).</p></div>`)
  );

  let card = newCard(container, "En-tête de la section");
  bilingualRow(card, "Titre", VIDEOS, "section_title_fr", "section_title_ar");
  bilingualRow(card, "Texte", VIDEOS, "section_text_fr", "section_text_ar", { multiline: true });

  card = newCard(container, "Vidéos", "Si aucune vidéo n'est ajoutée, la section n'apparaît pas sur le site.");
  const listWrap = document.createElement("div");
  card.appendChild(listWrap);

  function renderList() {
    listWrap.innerHTML = "";
    VIDEOS.items.forEach((item, i) => {
      const id = youtubeId(item.url);
      const slideCard = document.createElement("div");
      slideCard.className = "slide-card";

      const thumbWrap = document.createElement("div");
      thumbWrap.innerHTML = id
        ? `<img src="https://img.youtube.com/vi/${id}/mqdefault.jpg" style="width:110px;height:80px;object-fit:cover;border-radius:8px;">`
        : `<div class="img-picker-empty" style="width:110px;height:80px;">Lien invalide</div>`;
      slideCard.appendChild(thumbWrap.firstElementChild);

      const fields = document.createElement("div");
      fields.className = "slide-fields";
      const urlRow = makeFieldRow(fields);
      makeField(urlRow, {
        label: "Lien YouTube",
        value: item.url,
        onInput: (v) => {
          item.url = v;
          const newId = youtubeId(v);
          thumbWrap.innerHTML = newId
            ? `<img src="https://img.youtube.com/vi/${newId}/mqdefault.jpg" style="width:110px;height:80px;object-fit:cover;border-radius:8px;">`
            : `<div class="img-picker-empty" style="width:110px;height:80px;">Lien invalide</div>`;
          slideCard.replaceChild(thumbWrap.firstElementChild, slideCard.firstElementChild);
        },
      });
      bilingualRow(fields, "Titre", item, "title_fr", "title_ar");
      bilingualRow(fields, "Description", item, "desc_fr", "desc_ar", { multiline: true });
      slideCard.appendChild(fields);

      const actions = document.createElement("div");
      actions.className = "slide-actions";
      if (i > 0) {
        const upBtn = document.createElement("button");
        upBtn.type = "button";
        upBtn.className = "btn btn-ghost btn-sm";
        upBtn.textContent = "↑ Monter";
        upBtn.onclick = () => {
          [VIDEOS.items[i - 1], VIDEOS.items[i]] = [VIDEOS.items[i], VIDEOS.items[i - 1]];
          renderList();
        };
        actions.appendChild(upBtn);
      }
      if (i < VIDEOS.items.length - 1) {
        const downBtn = document.createElement("button");
        downBtn.type = "button";
        downBtn.className = "btn btn-ghost btn-sm";
        downBtn.textContent = "↓ Descendre";
        downBtn.onclick = () => {
          [VIDEOS.items[i + 1], VIDEOS.items[i]] = [VIDEOS.items[i], VIDEOS.items[i + 1]];
          renderList();
        };
        actions.appendChild(downBtn);
      }
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-danger btn-sm";
      removeBtn.textContent = "Retirer";
      removeBtn.onclick = () => {
        VIDEOS.items.splice(i, 1);
        renderList();
      };
      actions.appendChild(removeBtn);

      slideCard.appendChild(actions);
      listWrap.appendChild(slideCard);
    });
    if (!VIDEOS.items.length) {
      listWrap.appendChild(el(`<div class="entry-empty">Aucune vidéo pour le moment.</div>`));
    }
  }
  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost btn-sm list-add";
  addBtn.textContent = "+ Ajouter une vidéo";
  addBtn.onclick = () => {
    VIDEOS.items.push({ url: "", title_fr: "", title_ar: "", desc_fr: "", desc_ar: "" });
    renderList();
  };
  card.appendChild(addBtn);

  const toolbar = el(`<div class="section-toolbar"><button class="btn btn-primary" id="save-videos">Enregistrer les vidéos</button></div>`);
  container.appendChild(toolbar);
  $("#save-videos", toolbar).addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      await saveSection("videos", "videos.json");
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      e.target.disabled = false;
    }
  });
}

// ============================================================================
boot();
