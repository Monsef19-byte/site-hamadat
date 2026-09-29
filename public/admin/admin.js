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
  gallery: { data: null, sha: null },
  settings: { data: null, sha: null },
  opportunites: { data: null, sha: null },
  actualites: { data: null, sha: null },
  leads: [],
  leadStats: null,
  smtpPasswordSet: false,
  currentView: "global",
  currentResidenceIndex: null,
  currentArticleIndex: null,
};

// ============================================================================
// Auth
// ============================================================================
async function checkAuth() {
  const me = await api("GET", "/api/admin/me");
  state.smtpPasswordSet = Boolean(me.smtpPasswordSet);
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
  const [g, car, res, blog, links, videos, gallery, settings, opp, news] = await Promise.all([
    api("GET", "/api/admin/content/global.json"),
    api("GET", "/api/admin/content/home_carousel.json"),
    api("GET", "/api/admin/content/residences.json"),
    api("GET", "/api/admin/content/blog.json"),
    api("GET", "/api/admin/content/links.json"),
    api("GET", "/api/admin/content/videos.json"),
    api("GET", "/api/admin/content/gallery.json"),
    api("GET", "/api/admin/content/settings.json"),
    api("GET", "/api/admin/content/opportunites.json"),
    api("GET", "/api/admin/content/actualites.json"),
  ]);
  state.global = { data: g.content, sha: g.sha };
  state.carousel = { data: car.content, sha: car.sha };
  state.residences = { data: res.content, sha: res.sha };
  state.blog = { data: blog.content, sha: blog.sha };
  state.links = { data: links.content, sha: links.sha };
  state.videos = { data: videos.content, sha: videos.sha };
  state.gallery = { data: gallery.content, sha: gallery.sha };
  state.settings = { data: settings.content, sha: settings.sha };
  state.opportunites = { data: opp.content, sha: opp.sha };
  state.actualites = { data: news.content, sha: news.sha };
}

async function loadLeads() {
  const { leads, stats } = await api("GET", "/api/admin/leads");
  state.leads = leads;
  state.leadStats = stats;
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
  if (view === "gallery") renderGalleryView();
  if (view === "leads") renderLeadsView();
  if (view === "settings") renderSettingsView();
  if (view === "opportunites") renderOpportunitesView();
  if (view === "actualites") renderActualitesView();
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

  if (!G.brand) G.brand = {};
  let card = newCard(container, "Slogan", "Affiché dans le pied de page de toutes les pages et dans le titre de l'onglet de la page d'accueil.");
  bilingualRow(card, "Slogan", G.brand, "slogan_fr", "slogan_ar");

  card = newCard(container, "Carrousel d'accueil (Hero)", "Texte du bouton affiché sur chaque image du carrousel principal — il mène au formulaire de contact.");
  bilingualRow(card, "Bouton", G.home, "hero_cta_fr", "hero_cta_ar");

  card = newCard(container, "Qui sommes-nous");
  bilingualRow(card, "Titre (accueil + page Qui sommes-nous)", G.about, "title_fr", "title_ar");
  bilingualRow(card, "Titre « Notre histoire » (page Qui sommes-nous)", G.about, "history_title_fr", "history_title_ar");
  bilingualRow(card, "Texte", G.about, "text_fr", "text_ar", { multiline: true });

  renderBilingualStringList(container, "Engagements", "Liste affichée sous le texte « Qui sommes-nous ».", G.about, "commitments_fr", "commitments_ar");

  if (!G.about.images) G.about.images = [];
  renderImageListEditor(container, {
    title: "Photos « Qui sommes-nous »",
    hint: "Carrousel affiché dans la section « Qui sommes-nous » de l'accueil et sur la page Qui sommes-nous. Une seule photo = image fixe. Sans photo, la 1ʳᵉ image du carrousel d'accueil est utilisée.",
    arr: G.about.images,
    folder: "about",
  });

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

  card = newCard(container, "Chiffres clés", "Bande de chiffres de l'accueil et de la page Qui sommes-nous (1 à 4 chiffres, la mise en page s'adapte).");
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
    const warn = el(`<div class="field-warning hidden"></div>`);
    const checkPhone = (v) => {
      const ok = String(v || "").replace(/\D/g, "").length >= 8;
      warn.classList.toggle("hidden", ok);
      warn.textContent = ok ? "" : "⚠ Numéro incomplet ou factice : les boutons « Appeler » et WhatsApp du site renvoient vers le formulaire de contact tant qu'un vrai numéro (8 chiffres minimum) n'est pas saisi.";
    };
    const phoneInput = makeField(row, { label: "Téléphone (boutons Appeler / WhatsApp)", value: G.contact.phone, onInput: (v) => { G.contact.phone = v; checkPhone(v); } });
    phoneInput.parentNode.appendChild(warn);
    checkPhone(G.contact.phone);
    makeField(row, { label: "E-mail", value: G.contact.email, type: "email", onInput: (v) => (G.contact.email = v) });
  }
  bilingualRow(card, "Badge (ex : +20 ans d'expérience)", G.contact, "badge_fr", "badge_ar");

  card = newCard(container, "Champs du formulaire", "Libellés affichés au-dessus de chaque champ, et choix proposés dans les listes (un par ligne). Tous les champs sont obligatoires, sauf « Description ».");
  (G.contact.fields || []).forEach((f) => {
    const wrap = document.createElement("div");
    wrap.className = "list-item";
    bilingualRow(wrap, `Libellé (${f.name})`, f, "label_fr", "label_ar");
    if (f.type === "select") {
      const row = makeFieldRow(wrap);
      const ta = makeField(row, { label: "Choix proposés (un par ligne)", value: (f.options || []).join("\n"), multiline: true, onInput: (v) => (f.options = v.split("\n").map((x) => x.trim()).filter(Boolean)) });
      ta.rows = 5;
      if (f.name === "residence") {
        const sync = el(`<button type="button" class="btn btn-ghost btn-sm">Reprendre la liste des résidences</button>`);
        sync.onclick = () => {
          f.options = (state.residences.data || []).map((r) => r.name).filter(Boolean);
          ta.value = f.options.join("\n");
        };
        row.appendChild(sync);
      }
    }
    card.appendChild(wrap);
  });

  if (!G.social) G.social = {};
  card = newCard(container, "Réseaux sociaux", "Icônes cliquables du pied de page. Collez l'adresse complète du compte (https://…) ; laissez vide pour masquer l'icône.");
  [["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"], ["tiktok", "TikTok"], ["linkedin", "LinkedIn"], ["x", "X (Twitter)"]].forEach(([k, label], i, all) => {
    if (i % 2 === 0) card._row = makeFieldRow(card);
    const input = makeField(card._row, { label, value: G.social[k] || "", type: "url", onInput: (v) => (G.social[k] = v.trim()) });
    input.placeholder = "https://…";
    const test = el(`<a class="field-link" target="_blank" rel="noopener">Tester le lien ↗</a>`);
    const sync = () => { const v = input.value.trim(); test.href = v || "#"; test.classList.toggle("hidden", !/^https?:\/\//i.test(v)); };
    input.addEventListener("input", sync);
    sync();
    input.parentNode.appendChild(test);
  });

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

  container.appendChild(
    el(`<div><h2>Carrousel de la page d'accueil</h2><p class="view-sub">Des slides plein écran, entièrement libres : titre, accroche, emplacement, badges et image sont saisis ici, indépendamment des fiches résidences. L'ordre ci-dessous détermine l'ordre d'affichage.</p></div>`)
  );

  const addSlideBtn = document.createElement("button");
  addSlideBtn.type = "button";
  addSlideBtn.className = "btn btn-primary";
  addSlideBtn.id = "add-slide-btn";
  addSlideBtn.style.cssText = "font-size:16px;padding:14px 22px;margin:4px 0 20px;";
  addSlideBtn.textContent = "+ Ajouter une slide";
  addSlideBtn.onclick = () => {
    CAR.push({
      residence_id: null,
      free_id: "libre-" + Math.random().toString(36).slice(2, 8),
      name: "",
      name_ar: "",
      location_fr: "",
      location_ar: "",
      tagline_fr: "",
      tagline_ar: "",
      badges: [],
      asset: "",
    });
    renderCarouselView();
  };
  container.appendChild(addSlideBtn);

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
      topLine.textContent = `Slide ${i + 1}`;
      fields.appendChild(topLine);
      bilingualRow(fields, "Titre", slide, "name", "name_ar");
      bilingualRow(fields, "Emplacement (sous-titre)", slide, "location_fr", "location_ar");
      bilingualRow(fields, "Accroche", slide, "tagline_fr", "tagline_ar");
      const ctaNote = document.createElement("div");
      ctaNote.className = "hint";
      ctaNote.textContent = "Le bouton du hero est fixe : « Contactez-nous », identique sur toutes les slides (pointe vers la section contact de la page d'accueil).";
      fields.appendChild(ctaNote);
      const badgesField = document.createElement("div");
      badgesField.className = "field";
      badgesField.innerHTML = `<label>Badges libres (un par ligne, ex : « Nouveau », « Livraison 2026 ») — jamais liés au statut d'une résidence, uniquement ce que vous écrivez ici.</label>`;
      const badgesTa = document.createElement("textarea");
      badgesTa.value = (slide.badges || []).join("\n");
      badgesTa.addEventListener("input", () => {
        slide.badges = badgesTa.value.split("\n").map((s) => s.trim()).filter(Boolean);
      });
      badgesField.appendChild(badgesTa);
      fields.appendChild(badgesField);
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
          if (!slide.residence_id && !slide.free_id) slide.free_id = "libre-" + Math.random().toString(36).slice(2, 8);
          const url = await pickAndUploadImage(`home-carousel/${slide.residence_id || slide.free_id}`, (s) => (uploadBtn.textContent = s));
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

  const bottomAddBtn = document.createElement("button");
  bottomAddBtn.type = "button";
  bottomAddBtn.className = "btn btn-ghost";
  bottomAddBtn.style.cssText = "margin:10px 0 4px;";
  bottomAddBtn.textContent = "+ Ajouter une slide";
  bottomAddBtn.onclick = addSlideBtn.onclick;
  container.appendChild(bottomAddBtn);

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
    dispo: { intro_fr: "", intro_ar: "", typologies: [], note_fr: "", note_ar: "" },
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
        <div class="res-row-name">${escapeHtml(r.name) || "(sans nom)"} <span class="badge ${r.category === "en_cours" ? "badge-teal" : "badge-grey"}">${r.category === "en_cours" ? "En cours" : "Référence"}</span></div>
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
      opt.textContent = v === "en_cours" ? "En cours" : "Référence (livrée)";
      if (r.category === v) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => (r.category = select.value));
    catField.appendChild(select);
    row.appendChild(catField);
  }
  bilingualRow(card, "Nom", r, "name", "name_ar");
  bilingualRow(card, "Accroche (description courte pour Google et le partage)", r, "tagline_fr", "tagline_ar");
  bilingualRow(card, "Emplacement", r, "location_fr", "location_ar");
  {
    const row = makeFieldRow(card);
    makeField(row, { label: "Lien Google Maps", value: r.google_maps, onInput: (v) => (r.google_maps = v || null) });
    makeField(row, { label: "Année de livraison (références)", value: r.delivered_year, onInput: (v) => (r.delivered_year = v || null) });
  }

  card = newCard(container, "Disponibilité & avancement", "La disponibilité est affichée sur les cartes (accueil, Actualités) et la fiche. L'avancement s'affiche dans un cercle sur la fiche résidence et dans la section « Nos résidences » de la page Actualités — plus sur l'accueil.");
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
    pctField.appendChild(el(`<div class="progress-hint">Laissez vide si le pourcentage n'est pas communiqué — aucun cercle ne sera affiché.</div>`));
    row.appendChild(pctField);
  }

  card = newCard(container, "Statut (fiche résidence)");
  bilingualRow(card, "Statut", r, "status_fr", "status_ar");

  card = newCard(container, "Présentation");
  bilingualRow(card, "Description", r, "description_fr", "description_ar", { multiline: true });
  bilingualRow(card, "Pourquoi cet emplacement", r, "why_location_fr", "why_location_ar", { multiline: true });
  bilingualRow(card, "Typologies (ex: F3 · F4 · F5) — affichées dans la fiche résidence", r, "typologies_fr", "typologies_ar");

  if (!r.services) r.services = [];
  if (!r.quality) r.quality = [];
  renderIconTextList(container, "Services & équipements", "Choisissez une icône pour chaque élément (ex : ascenseur, piscine, climatisation…).", r.services);
  renderIconTextList(container, "Qualité & finitions", "Choisissez une icône pour chaque élément.", r.quality);

  renderDiaporamaEditor(container, r);
  renderDispoEditor(container, r);

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

// Éditeur du bloc « Disponibilité » d'une résidence — tableau par typologie
// affiché dans la fenêtre modale « Voir les disponibilités » de la fiche
// résidence (public, généré par lib/gen-residences.js#render_dispo_modal).
// Porté depuis New Era (admin/static/admin.js#renderVillaDispo), adapté au
// contenu bilingue FR/AR de Hamadat.
function renderDispoEditor(container, r) {
  if (!r.dispo) r.dispo = { intro_fr: "", intro_ar: "", typologies: [], note_fr: "", note_ar: "" };
  const d = r.dispo;
  if (!d.typologies) d.typologies = [];

  const card = newCard(
    container,
    "Disponibilité",
    "Tableau et détails affichés dans la fenêtre « Voir les disponibilités » — le bouton est visible sur toutes les fiches résidences. Tant qu'aucune typologie n'est ajoutée ci-dessous, la fenêtre affiche un message « à venir » au lieu d'un tableau vide."
  );
  bilingualRow(card, "Texte d'introduction", d, "intro_fr", "intro_ar");

  const listWrap = document.createElement("div");
  card.appendChild(listWrap);

  function renderList() {
    listWrap.innerHTML = "";
    d.typologies.forEach((t, i) => {
      const wrap = document.createElement("div");
      wrap.className = "list-item";
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "list-item-remove";
      removeBtn.textContent = "✕";
      removeBtn.onclick = () => {
        d.typologies.splice(i, 1);
        renderList();
      };
      wrap.appendChild(removeBtn);

      bilingualRow(wrap, "Typologie", t, "name_fr", "name_ar");
      bilingualRow(wrap, "Nb. d'appartements", t, "count_fr", "count_ar");

      const chkField = document.createElement("div");
      chkField.className = "field";
      chkField.innerHTML = `<div class="checkbox-row"><input type="checkbox" id="dispo-confirmed-${i}" ${t.confirmed ? "checked" : ""}> <label for="dispo-confirmed-${i}" style="margin:0;">Confirmé (sinon « à confirmer »)</label></div>`;
      wrap.appendChild(chkField);
      $(`#dispo-confirmed-${i}`, chkField).addEventListener("change", (e) => {
        t.confirmed = e.target.checked;
      });

      bilingualRow(wrap, "Détail (texte optionnel)", t, "detail_text_fr", "detail_text_ar", { multiline: true });

      if (!t.detail_images) t.detail_images = [];
      const imgsField = document.createElement("div");
      imgsField.className = "field";
      imgsField.innerHTML = `<label>Images de cette typologie (plans, photos — affichées dans « voir détails »)</label>`;
      const thumbRow = document.createElement("div");
      thumbRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;";
      function renderThumbs() {
        thumbRow.innerHTML = "";
        t.detail_images.forEach((imgAsset, ii) => {
          const thumbWrap = document.createElement("div");
          thumbWrap.style.cssText = "position:relative;width:90px;";
          const url = imageDisplayUrl(imgAsset);
          thumbWrap.innerHTML = url
            ? `<img src="${url}" style="width:90px;height:66px;object-fit:cover;border-radius:6px;">`
            : `<div class="img-picker-empty" style="width:90px;height:66px;">Image</div>`;
          const rm = document.createElement("button");
          rm.type = "button";
          rm.title = "Retirer cette image";
          rm.textContent = "✕";
          rm.style.cssText = "position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;border:none;background:#c0392b;color:#fff;cursor:pointer;font-size:11px;line-height:1;";
          rm.onclick = () => {
            t.detail_images.splice(ii, 1);
            renderThumbs();
          };
          thumbWrap.appendChild(rm);
          thumbRow.appendChild(thumbWrap);
        });
        const addImgBtn = document.createElement("button");
        addImgBtn.type = "button";
        addImgBtn.className = "btn btn-ghost btn-sm";
        addImgBtn.textContent = "+ Ajouter une image";
        addImgBtn.onclick = async () => {
          addImgBtn.disabled = true;
          const prevText = addImgBtn.textContent;
          try {
            const url = await pickAndUploadImage(`residences/${r.id}/dispo/${i}`, (s) => (addImgBtn.textContent = s));
            if (url) {
              t.detail_images.push(url);
              renderThumbs();
            }
          } catch (err) {
            toast("Échec de l'upload : " + err.message, true);
          } finally {
            addImgBtn.disabled = false;
            addImgBtn.textContent = prevText;
          }
        };
        thumbRow.appendChild(addImgBtn);
      }
      renderThumbs();
      imgsField.appendChild(thumbRow);
      wrap.appendChild(imgsField);

      listWrap.appendChild(wrap);
    });
  }
  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost btn-sm list-add";
  addBtn.textContent = "+ Ajouter une typologie";
  addBtn.onclick = () => {
    d.typologies.push({ name_fr: "", name_ar: "", count_fr: "à confirmer", count_ar: "للتأكيد", confirmed: false, detail_text_fr: "", detail_text_ar: "", detail_images: [] });
    renderList();
  };
  card.appendChild(addBtn);

  bilingualRow(card, "Note en bas de tableau", d, "note_fr", "note_ar", { multiline: true });
}

// Éditeur du carrousel de photos « Qui sommes-nous » (G.about.images) —
// affiché dans la section .intro-figure de la page /apropos.html
// (lib/gen-apropos.js). Tant qu'aucune photo n'est ajoutée ici, la page
// retombe automatiquement sur la 1ʳᵉ image du carrousel d'accueil.
// Sélecteur « Choisir parmi les images du site » : toutes les images déjà
// présentes (carrousel, résidences, Qui sommes-nous, Opportunités,
// Actualités, Galerie) — on réutilise une photo sans la renvoyer.
function openSiteImagePicker(onPick) {
  const all = galleryCollect();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-card site-image-modal">
      <div class="modal-header"><h3>Choisir une image du site</h3><button type="button" class="modal-close" aria-label="Fermer">✕</button></div>
      <input type="text" class="icon-picker-search" placeholder="Filtrer (ex : Elysia, séjour, façade…)">
      <div class="site-image-grid"></div>
    </div>`;
  document.body.appendChild(overlay);
  const grid = $(".site-image-grid", overlay);
  const close = () => { overlay.remove(); document.removeEventListener("keydown", esc); };
  const esc = (e) => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", esc);
  $(".modal-close", overlay).onclick = close;
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  function draw(f) {
    const q = (f || "").toLowerCase();
    grid.innerHTML = "";
    all.filter((it) => !q || (it.source + " " + it.caption).toLowerCase().includes(q)).forEach((it) => {
      const b = el(`<button type="button" class="site-image-cell" title="${escapeHtml(it.source + (it.caption ? " — " + it.caption : ""))}"><img src="${escapeHtml(imageDisplayUrl(it.asset))}" loading="lazy" alt=""><span>${escapeHtml(it.source)}</span></button>`);
      b.onclick = () => { close(); onPick(it); };
      grid.appendChild(b);
    });
    if (!grid.children.length) grid.appendChild(el(`<div class="entry-empty">Aucune image ne correspond.</div>`));
  }
  draw("");
  $(".icon-picker-search", overlay).addEventListener("input", (e) => draw(e.target.value));
}

// Liste d'images générique : ajout (upload), légende FR/AR optionnelle,
// réordonnancement ↑/↓, retrait. Utilisée pour « Qui sommes-nous »,
// l'espace photo Opportunités, les photos d'Actualités et la Galerie.
function renderImageListEditor(container, { title, hint, arr, folder, captions = true, emptyText = "Aucune image pour le moment." }) {
  const card = newCard(container, title, hint);
  const listWrap = document.createElement("div");
  card.appendChild(listWrap);

  async function upload(btn, onUrl) {
    btn.disabled = true;
    const prevText = btn.textContent;
    try {
      const url = await pickAndUploadImage(folder, (st) => (btn.textContent = st));
      if (url) onUrl(url);
    } catch (err) {
      toast("Échec de l'upload : " + err.message, true);
    } finally {
      btn.disabled = false;
      btn.textContent = prevText;
    }
  }

  function renderList() {
    listWrap.innerHTML = "";
    arr.forEach((img, i) => {
      const slideCard = document.createElement("div");
      slideCard.className = "slide-card";
      const imgUrl = imageDisplayUrl(img.asset);
      slideCard.appendChild(
        el(imgUrl
          ? `<img src="${escapeHtml(imgUrl)}" style="width:110px;height:80px;object-fit:cover;border-radius:8px;">`
          : `<div class="img-picker-empty" style="width:110px;height:80px;">Aucune image</div>`)
      );
      const fields = document.createElement("div");
      fields.className = "slide-fields";
      if (captions) bilingualRow(fields, `Légende ${i + 1} (optionnelle)`, img, "caption_fr", "caption_ar");
      else fields.appendChild(el(`<div class="card-sub">Image ${i + 1}</div>`));
      slideCard.appendChild(fields);

      const actions = document.createElement("div");
      actions.className = "slide-actions";
      const uploadBtn = document.createElement("button");
      uploadBtn.type = "button";
      uploadBtn.className = "btn btn-ghost btn-sm";
      uploadBtn.textContent = "Changer l'image";
      uploadBtn.onclick = () => upload(uploadBtn, (url) => { img.asset = url; renderList(); });
      actions.appendChild(uploadBtn);
      const pickBtn = document.createElement("button");
      pickBtn.type = "button";
      pickBtn.className = "btn btn-ghost btn-sm";
      pickBtn.textContent = "Image du site…";
      pickBtn.title = "Remplacer par une image déjà présente sur le site";
      pickBtn.onclick = () => openSiteImagePicker((it) => { img.asset = it.asset; renderList(); });
      actions.appendChild(pickBtn);
      if (i > 0) {
        const up = document.createElement("button");
        up.type = "button";
        up.className = "btn btn-ghost btn-sm";
        up.textContent = "↑";
        up.title = "Monter";
        up.onclick = () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; renderList(); };
        actions.appendChild(up);
      }
      if (i < arr.length - 1) {
        const down = document.createElement("button");
        down.type = "button";
        down.className = "btn btn-ghost btn-sm";
        down.textContent = "↓";
        down.title = "Descendre";
        down.onclick = () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; renderList(); };
        actions.appendChild(down);
      }
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-danger btn-sm";
      removeBtn.textContent = "Retirer";
      removeBtn.onclick = () => { arr.splice(i, 1); renderList(); };
      actions.appendChild(removeBtn);
      slideCard.appendChild(actions);
      listWrap.appendChild(slideCard);
    });
    if (!arr.length) listWrap.appendChild(el(`<div class="entry-empty">${escapeHtml(emptyText)}</div>`));
  }
  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost btn-sm list-add";
  addBtn.textContent = "+ Ajouter une image";
  addBtn.onclick = () => upload(addBtn, (url) => { arr.push({ asset: url, caption_fr: "", caption_ar: "" }); renderList(); });
  card.appendChild(addBtn);
  const addPick = document.createElement("button");
  addPick.type = "button";
  addPick.className = "btn btn-ghost btn-sm list-add";
  addPick.textContent = "+ Choisir une image du site";
  addPick.onclick = () => openSiteImagePicker((it) => { arr.push({ asset: it.asset, caption_fr: it.caption || "", caption_ar: it.caption_ar || "" }); renderList(); });
  card.appendChild(addPick);
  return card;
}

// Bouton « Enregistrer » standard en bas de vue.
function saveToolbar(container, label, key, filename, after) {
  const toolbar = el(`<div class="section-toolbar"><button class="btn btn-primary">${escapeHtml(label)}</button></div>`);
  container.appendChild(toolbar);
  const btn = toolbar.querySelector("button");
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    try {
      await saveSection(key, filename);
      if (after) after();
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      btn.disabled = false;
    }
  });
  return toolbar;
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
// Vue : Galerie / Catalogue (carrousel accueil)
// ============================================================================
// Même agrégation que lib/gallery.js#collectGallery (côté build) — à garder
// synchronisées. Calculée sur l'état COURANT du dashboard, donc une image
// ajoutée dans un autre onglet apparaît ici immédiatement.
function galleryCollect() {
  const G = state.global.data || {};
  const CAR = state.carousel.data || [];
  const RES = state.residences.data || [];
  const OPP = state.opportunites.data || {};
  const NEWS = state.actualites.data || {};
  const GALLERY = state.gallery.data || {};
  const seen = new Set();
  const out = [];
  const add = (asset, caption, source, caption_ar) => {
    if (!asset || seen.has(asset)) return;
    seen.add(asset);
    out.push({ asset, caption: caption || "", caption_ar: caption_ar || "", source });
  };
  (GALLERY.items || []).forEach((it) => add(it.asset, it.caption_fr, "Galerie"));
  CAR.forEach((c) => add(c.asset, c.name, "Carrousel d'accueil"));
  ((G.about && G.about.images) || []).forEach((im) => add(im.asset, im.caption_fr, "Qui sommes-nous"));
  RES.forEach((r) => (r.diaporama || []).forEach((d) => add(d.asset, d.caption_fr ? `${r.name} — ${d.caption_fr}` : r.name, `Résidence ${r.name}`, d.caption_ar ? `${r.name_ar || r.name} — ${d.caption_ar}` : "")));
  ((OPP.media && OPP.media.images) || []).forEach((im) => add(im.asset, im.caption_fr, "Opportunités"));
  add(NEWS.cover, NEWS.title_fr, "Actualités");
  (NEWS.images || []).forEach((im) => add(im.asset, im.caption_fr, "Actualités"));
  return out;
}

function renderGalleryView() {
  const container = $("#view-gallery");
  container.innerHTML = "";
  const GALLERY = state.gallery.data;
  if (!GALLERY.items) GALLERY.items = [];
  if (!GALLERY.excluded) GALLERY.excluded = [];
  if (GALLERY.enabled === undefined) GALLERY.enabled = true;

  container.appendChild(
    el(`<div><h2>Galerie</h2><p class="view-sub">Carrousel « Galerie » de la page d'accueil : il regroupe automatiquement toutes les images du site (carrousel, Qui sommes-nous, résidences, Opportunités, Actualités). Décochez une image pour la retirer de la galerie — elle reste en place ailleurs sur le site.</p></div>`)
  );

  let card = newCard(container, "Activation");
  {
    const row = document.createElement("div");
    row.className = "toggle-row";
    row.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="gallery-enabled-chk" ${GALLERY.enabled ? "checked" : ""}>
        <span class="track"></span>
      </label>
      <div>
        <div class="toggle-label">Afficher la Galerie sur le site</div>
        <div class="toggle-sub">Quand désactivée, la section disparaît du site sans rien perdre (sélection et images conservées).</div>
      </div>
    `;
    card.appendChild(row);
    $("#gallery-enabled-chk", row).addEventListener("change", (e) => (GALLERY.enabled = e.target.checked));
  }

  card = newCard(container, "En-tête de la section");
  bilingualRow(card, "Titre", GALLERY, "section_title_fr", "section_title_ar");
  bilingualRow(card, "Texte", GALLERY, "section_text_fr", "section_text_ar", { multiline: true });

  const all = galleryCollect();
  const excluded = new Set(GALLERY.excluded);
  card = newCard(container, "Images affichées", "");
  const sub = el(`<p class="card-sub"></p>`);
  card.appendChild(sub);
  const bulk = el(`<div class="gallery-bulk"><button type="button" class="btn btn-ghost btn-sm" data-all>Tout cocher</button><button type="button" class="btn btn-ghost btn-sm" data-none>Tout décocher</button></div>`);
  card.appendChild(bulk);
  const grid = el(`<div class="gallery-pick-grid"></div>`);
  card.appendChild(grid);
  const refreshCount = () => {
    const shown = all.filter((it) => !excluded.has(it.asset)).length;
    sub.textContent = `${shown} image(s) affichée(s) sur ${all.length}. Les nouvelles images ajoutées ailleurs sur le site apparaissent automatiquement.`;
    GALLERY.excluded = Array.from(excluded);
  };
  const renderGrid = () => {
    grid.innerHTML = "";
    let lastSource = null;
    all.forEach((it) => {
      if (it.source !== lastSource) {
        grid.appendChild(el(`<div class="gallery-pick-group">${escapeHtml(it.source)}</div>`));
        lastSource = it.source;
      }
      const on = !excluded.has(it.asset);
      const tile = el(`<label class="gallery-pick${on ? "" : " is-off"}" title="${escapeHtml(it.caption)}">
        <img src="${escapeHtml(imageDisplayUrl(it.asset))}" loading="lazy" alt="">
        <span class="gallery-pick__chk"><input type="checkbox" ${on ? "checked" : ""}> Afficher</span>
      </label>`);
      tile.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) excluded.delete(it.asset); else excluded.add(it.asset);
        tile.classList.toggle("is-off", !e.target.checked);
        refreshCount();
      });
      grid.appendChild(tile);
    });
    if (!all.length) grid.appendChild(el(`<div class="entry-empty">Aucune image sur le site pour le moment.</div>`));
    refreshCount();
  };
  bulk.querySelector("[data-all]").onclick = () => { excluded.clear(); renderGrid(); };
  bulk.querySelector("[data-none]").onclick = () => { all.forEach((it) => excluded.add(it.asset)); renderGrid(); };
  renderGrid();

  renderImageListEditor(container, {
    title: "Images supplémentaires",
    hint: "Images présentes uniquement dans la Galerie (réalisations, chantier, documents…). Elles s'ajoutent à celles du reste du site. Enregistrez puis revenez sur cet onglet pour les voir dans la sélection ci-dessus.",
    arr: GALLERY.items,
    folder: "catalogue",
  });

  saveToolbar(container, "Enregistrer la galerie", "gallery", "gallery.json", () => renderGalleryView());
}

// ============================================================================
// Vue : Actualités (une seule actualité, remplacée à chaque mise à jour)
// ============================================================================
function renderActualitesView() {
  const container = $("#view-actualites");
  container.innerHTML = "";
  const N = state.actualites.data;
  if (!N.images) N.images = [];

  container.appendChild(
    el(`<div><h2>Actualités</h2><p class="view-sub">La page /actualites.html affiche UNE actualité, sans historique : en haut, un bandeau de photos (carrousel) ; en dessous, l'article ; en bas, la section « Nos résidences ». Modifiez puis enregistrez — l'ancienne actualité est remplacée.</p></div>`)
  );

  let card = newCard(container, "En-tête de la page", "Titre et texte affichés sur le bandeau de photos, en haut de la page.");
  bilingualRow(card, "Titre de la page", N, "page_title_fr", "page_title_ar");
  bilingualRow(card, "Texte d'introduction", N, "page_text_fr", "page_text_ar", { multiline: true });

  card = newCard(container, "L'actualité");
  bilingualRow(card, "Titre", N, "title_fr", "title_ar");
  {
    const row = makeFieldRow(card);
    makeField(row, { label: "Date (optionnelle)", value: N.date || "", type: "date", onInput: (v) => (N.date = v) });
    row.appendChild(document.createElement("div"));
  }
  bilingualRow(card, "Texte (laisser une ligne vide entre deux paragraphes)", N, "body_fr", "body_ar", { multiline: true });
  card.querySelectorAll("textarea").forEach((t) => (t.rows = 10));

  card = newCard(container, "Photo principale", "Première photo du bandeau en haut de la page.");
  const coverWrap = document.createElement("div");
  card.appendChild(coverWrap);
  const renderCover = () => {
    coverWrap.innerHTML = "";
    const url = imageDisplayUrl(N.cover);
    const box = el(`<div class="slide-card">${url ? `<img src="${escapeHtml(url)}" style="width:160px;height:110px;object-fit:cover;border-radius:8px;">` : `<div class="img-picker-empty" style="width:160px;height:110px;">Aucune photo</div>`}<div class="slide-actions"></div></div>`);
    const actions = box.querySelector(".slide-actions");
    const up = el(`<button type="button" class="btn btn-ghost btn-sm">${N.cover ? "Changer la photo" : "Ajouter une photo"}</button>`);
    up.onclick = async () => {
      up.disabled = true;
      try {
        const u = await pickAndUploadImage("actualites", (st) => (up.textContent = st));
        if (u) { N.cover = u; renderCover(); }
      } catch (err) {
        toast("Échec de l'upload : " + err.message, true);
      } finally { up.disabled = false; }
    };
    actions.appendChild(up);
    const pk = el(`<button type="button" class="btn btn-ghost btn-sm">Image du site…</button>`);
    pk.onclick = () => openSiteImagePicker((it) => { N.cover = it.asset; renderCover(); });
    actions.appendChild(pk);
    if (N.cover) {
      const rm = el(`<button type="button" class="btn btn-danger btn-sm">Retirer</button>`);
      rm.onclick = () => { N.cover = ""; renderCover(); };
      actions.appendChild(rm);
    }
    coverWrap.appendChild(box);
  };
  renderCover();

  renderImageListEditor(container, {
    title: "Photos de l'actualité",
    hint: "Photos du bandeau en haut de la page : elles défilent après la photo principale. Ajoutez-en autant que nécessaire.",
    arr: N.images,
    folder: "actualites",
    emptyText: "Aucune photo pour le moment.",
  });

  card = newCard(container, "Section « Nos résidences » (bas de page)", "Grille des résidences sous l'actualité : onglet « En cours » par défaut, « Références » pour les projets livrés, avancement en cercle. Statuts, photos et pourcentages se gèrent dans l'onglet Résidences.");
  {
    if (N.tracker_enabled === undefined) N.tracker_enabled = true;
    const row = document.createElement("div");
    row.className = "toggle-row";
    row.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="news-tracker-chk" ${N.tracker_enabled !== false ? "checked" : ""}>
        <span class="track"></span>
      </label>
      <div><div class="toggle-label">Afficher la section « Nos résidences »</div></div>`;
    card.appendChild(row);
    $("#news-tracker-chk", row).addEventListener("change", (e) => (N.tracker_enabled = e.target.checked));
  }
  bilingualRow(card, "Titre", N, "tracker_title_fr", "tracker_title_ar");
  bilingualRow(card, "Texte", N, "tracker_text_fr", "tracker_text_ar", { multiline: true });

  saveToolbar(container, "Publier l'actualité", "actualites", "actualites.json");
}

// ============================================================================
// Vue : Demandes reçues (leads du formulaire de contact)
// ============================================================================
function leadStatusLabel(status) {
  return status === "handled" ? "Traitée" : "Nouvelle";
}

async function renderLeadsView() {
  const container = $("#view-leads");
  container.innerHTML = "";
  container.appendChild(
    el(`<div><h2>Demandes reçues</h2><p class="view-sub">Chaque soumission du formulaire de contact (accueil, Qui sommes-nous, blog) apparaît ici — même si l'e-mail de notification échoue.</p></div>`)
  );
  const loadingCard = newCard(container, "Chargement…");
  try {
    await loadLeads();
  } catch (err) {
    loadingCard.innerHTML = `<h3>Échec du chargement</h3><p class="card-sub">${escapeHtml(err.message)}</p>`;
    return;
  }
  container.removeChild(loadingCard);

  const stats = state.leadStats || { total: 0, new: 0 };
  const statsCard = newCard(container, "Aperçu");
  statsCard.appendChild(el(`<p class="card-sub">${stats.total} demande(s) au total, dont <strong>${stats.new}</strong> non traitée(s).</p>`));

  if (!state.leads.length) {
    newCard(container, "Aucune demande pour le moment", "Les nouvelles soumissions du formulaire de contact apparaîtront ici automatiquement.");
    return;
  }

  const listCard = newCard(container, "Toutes les demandes");
  const table = document.createElement("table");
  table.className = "leads-table";
  table.innerHTML = `<thead><tr>
    <th>Reçue le</th><th>Nom</th><th>Contact</th><th>Bien</th><th>Code</th><th>E-mail</th><th>Statut</th><th></th>
  </tr></thead>`;
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  function paintRows() {
    tbody.innerHTML = "";
    state.leads.forEach((lead) => {
      const f = lead.fields || {};
      const tr = document.createElement("tr");
      const when = new Date(lead.received_at).toLocaleString("fr-FR");
      tr.innerHTML = `
        <td>${escapeHtml(when)}</td>
        <td>${escapeHtml(f.full_name)}</td>
        <td>${escapeHtml(f.email)}<br><span class="card-sub">${escapeHtml(f.phone)}</span></td>
        <td>${escapeHtml([f.unit_type, f.residence, f.type_demande, f.type_bien, f.localisation].filter(Boolean).join(" · ") || "—")}</td>
        <td><span class="badge badge-teal">${escapeHtml(lead.code)}</span></td>
        <td>${lead.email_sent ? "✓ envoyé" : "✗ non envoyé"}</td>
        <td><span class="badge ${lead.status === "handled" ? "badge-grey" : "badge-teal"}">${leadStatusLabel(lead.status)}</span></td>
        <td></td>
      `;
      const actionTd = tr.lastElementChild;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost btn-sm";
      btn.textContent = lead.status === "handled" ? "Marquer nouvelle" : "Marquer traitée";
      btn.onclick = async () => {
        btn.disabled = true;
        try {
          const nextStatus = lead.status === "handled" ? "new" : "handled";
          await api("PATCH", "/api/admin/leads", { id: lead.id, status: nextStatus });
          lead.status = nextStatus;
          paintRows();
        } catch (err) {
          toast("Échec : " + err.message, true);
          btn.disabled = false;
        }
      };
      actionTd.appendChild(btn);
      if (f.message) {
        const msgRow = document.createElement("tr");
        msgRow.className = "leads-table-msgrow";
        msgRow.innerHTML = `<td></td><td colspan="7" class="card-sub">« ${escapeHtml(f.message)} »</td>`;
        tbody.appendChild(tr);
        tbody.appendChild(msgRow);
      } else {
        tbody.appendChild(tr);
      }
    });
  }
  paintRows();
  listCard.appendChild(table);

  const refreshBtn = el(`<div class="section-toolbar"><button class="btn btn-ghost" id="refresh-leads">↻ Actualiser</button></div>`);
  container.appendChild(refreshBtn);
  $("#refresh-leads", refreshBtn).addEventListener("click", () => renderLeadsView());
}

// ============================================================================
// Vue : Réglages Email
// ============================================================================
function renderSettingsView() {
  const container = $("#view-settings");
  container.innerHTML = "";
  const S = state.settings.data;

  container.appendChild(
    el(`<div><h2>Réglages</h2><p class="view-sub">Boutons d'action sitewide et notifications par e-mail des nouvelles demandes.</p></div>`)
  );

  const ctaCard = newCard(container, "Boutons d'action (CTA)", "Chaque élément est activable/désactivable indépendamment. Un élément désactivé disparaît proprement — les liens existants (« Prendre rendez-vous »…) redeviennent de simples ancres.");
  const ctaToggles = [
    { key: "cta_float_enabled", label: "Bulle flottante (Appeler / WhatsApp)", sub: "Bulle en bas à droite, visible sur ordinateur — masquée tant que le Hero (grande image du haut) est à l'écran." },
    { key: "cta_minibar_enabled", label: "Barre d'actions rapides (mobile)", sub: "Barre en bas d'écran sur mobile : Appeler / WhatsApp / RDV — masquée tant que le Hero est à l'écran." },
    { key: "cta_rdv_modal_enabled", label: "Modal « Prendre rendez-vous »", sub: "Fait apparaître un choix (Appeler / E-mail / Formulaire) au clic sur tout lien « Prendre rendez-vous »." },
  ];
  ctaToggles.forEach(({ key, label, sub }) => {
    const row = document.createElement("div");
    row.className = "toggle-row";
    row.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="${key}-chk" ${S[key] !== false ? "checked" : ""}>
        <span class="track"></span>
      </label>
      <div>
        <div class="toggle-label">${label}</div>
        <div class="toggle-sub">${sub}</div>
      </div>
    `;
    ctaCard.appendChild(row);
    $(`#${key}-chk`, row).addEventListener("change", (e) => (S[key] = e.target.checked));
  });
  const ctaSaveBtn = document.createElement("button");
  ctaSaveBtn.type = "button";
  ctaSaveBtn.className = "btn btn-primary btn-sm";
  ctaSaveBtn.style.marginTop = "8px";
  ctaSaveBtn.textContent = "Enregistrer les CTA";
  ctaSaveBtn.addEventListener("click", async () => {
    ctaSaveBtn.disabled = true;
    try {
      await saveSection("settings", "settings.json");
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      ctaSaveBtn.disabled = false;
    }
  });
  ctaCard.appendChild(ctaSaveBtn);

  const card = newCard(container, "Notification par e-mail");
  const toggleRow = makeFieldRow(card);
  const toggleWrap = document.createElement("div");
  toggleWrap.className = "field";
  toggleWrap.innerHTML = `<label>Envoyer un e-mail à chaque nouvelle demande</label>`;
  const toggleSelect = document.createElement("select");
  toggleSelect.innerHTML = `<option value="false">Désactivé</option><option value="true">Activé</option>`;
  toggleSelect.value = String(Boolean(S.notify_enabled));
  toggleSelect.addEventListener("change", () => (S.notify_enabled = toggleSelect.value === "true"));
  toggleWrap.appendChild(toggleSelect);
  toggleRow.appendChild(toggleWrap);
  toggleRow.appendChild(document.createElement("div"));

  {
    const row = makeFieldRow(card);
    makeField(row, { label: "Destinataire des demandes", value: S.lead_recipient, type: "email", onInput: (v) => (S.lead_recipient = v) });
    makeField(row, { label: "Nom de l'expéditeur (affiché)", value: S.smtp_sender_name, onInput: (v) => (S.smtp_sender_name = v) });
  }
  {
    const row = makeFieldRow(card);
    makeField(row, { label: "Serveur SMTP (ex : smtp.gmail.com)", value: S.smtp_host, onInput: (v) => (S.smtp_host = v) });
    makeField(row, { label: "Port SMTP (ex : 587)", value: S.smtp_port, type: "number", onInput: (v) => (S.smtp_port = Number(v) || 587) });
  }
  {
    const row = makeFieldRow(card);
    makeField(row, { label: "Adresse d'envoi (compte SMTP)", value: S.smtp_user, type: "email", onInput: (v) => (S.smtp_user = v) });
  }

  const pwCard = newCard(container, "Mot de passe SMTP", "Volontairement absent de ce dashboard : comme les autres identifiants du projet (mot de passe admin, jetons GitHub…), il n'est jamais stocké dans le contenu versionné, uniquement dans la variable d'environnement Vercel SMTP_PASSWORD.");
  const pwStatus = document.createElement("p");
  pwStatus.className = state.smtpPasswordSet ? "card-sub" : "card-sub";
  pwStatus.innerHTML = state.smtpPasswordSet
    ? `<span class="badge badge-teal">Configuré</span> — SMTP_PASSWORD est défini côté serveur.`
    : `<span class="badge badge-grey">Non configuré</span> — ajoutez la variable d'environnement SMTP_PASSWORD dans Vercel (Project Settings → Environment Variables), pour un compte Gmail utilisez un « mot de passe d'application », pas le mot de passe normal.`;
  pwCard.appendChild(pwStatus);

  const toolbar = el(`<div class="section-toolbar"></div>`);
  const saveBtn = document.createElement("button");
  saveBtn.className = "btn btn-primary";
  saveBtn.textContent = "Enregistrer les réglages";
  const testBtn = document.createElement("button");
  testBtn.className = "btn btn-ghost";
  testBtn.textContent = "Tester l'envoi";
  toolbar.appendChild(saveBtn);
  toolbar.appendChild(testBtn);
  container.appendChild(toolbar);

  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    try {
      await saveSection("settings", "settings.json");
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      saveBtn.disabled = false;
    }
  });

  testBtn.addEventListener("click", async () => {
    testBtn.disabled = true;
    try {
      await saveSection("settings", "settings.json");
      await api("POST", "/api/admin/test-email");
      toast("E-mail de test envoyé ✓");
    } catch (err) {
      toast("Échec du test : " + err.message, true);
    } finally {
      testBtn.disabled = false;
    }
  });
}

// ============================================================================
// Vue : Opportunités (proposez-nous votre bien)
// ============================================================================
function renderOpportunitesView() {
  const container = $("#view-opportunites");
  container.innerHTML = "";
  const OPP = state.opportunites.data;
  if (!OPP.categories) OPP.categories = [];
  if (!OPP.features) OPP.features = [];

  container.appendChild(
    el(`<div><h2>Page Opportunités</h2><p class="view-sub">Page destinée aux visiteurs qui ont un terrain ou un bien à proposer à Hamadat — pas aux acheteurs de résidence. Accessible sur /opportunites.html.</p></div>`)
  );

  let card = newCard(container, "En-tête de la page");
  bilingualRow(card, "Titre", OPP, "hero_title_fr", "hero_title_ar");
  bilingualRow(card, "Texte", OPP, "hero_text_fr", "hero_text_ar", { multiline: true });

  if (!OPP.media) OPP.media = { mode: "single", images: [] };
  if (!OPP.media.images) OPP.media.images = [];
  card = newCard(container, "Espace photo", "Bandeau en haut de la page Opportunités, sous le titre (à la place du fond noir). Choisissez une image unique ou un carrousel.");
  {
    const row = makeFieldRow(card);
    const f = document.createElement("div");
    f.className = "field";
    f.innerHTML = `<label>Mode d'affichage</label>`;
    const sel = document.createElement("select");
    sel.innerHTML = `<option value="single">Image unique (1ʳᵉ image de la liste)</option><option value="carousel">Carrousel (toutes les images)</option>`;
    sel.value = OPP.media.mode === "carousel" ? "carousel" : "single";
    sel.addEventListener("change", () => (OPP.media.mode = sel.value));
    f.appendChild(sel);
    row.appendChild(f);
    row.appendChild(document.createElement("div"));
  }
  renderImageListEditor(container, {
    title: "Images de l'espace photo",
    hint: "En mode « Image unique », seule la première image est affichée (utilisez ↑ pour la choisir). Aucune image = en-tête sombre sans photo.",
    arr: OPP.media.images,
    folder: "opportunites",
  });

  renderObjectList(container, {
    title: "Ce que nous recherchons",
    hint: "Cartes cliquables — au clic, le visiteur est envoyé directement au formulaire avec le type déjà présélectionné.",
    arr: OPP.categories,
    itemLabel: (item, i) => `Catégorie ${i + 1}`,
    newItem: () => ({ icon: "map", label_fr: "", label_ar: "", type_bien: "", type_demande: "" }),
    fieldsSpec: (wrap, item) => {
      iconPickerField(wrap, { label: "Icône", value: item.icon, onSelect: (name) => (item.icon = name) });
      bilingualRow(wrap, "Libellé", item, "label_fr", "label_ar");
      const row = makeFieldRow(wrap);
      makeField(row, { label: "Type de bien à présélectionner (ex: Terrain) — laisser vide si non applicable", value: item.type_bien, onInput: (v) => (item.type_bien = v) });
      makeField(row, { label: "Type de demande à présélectionner (ex: Troc) — laisser vide si non applicable", value: item.type_demande, onInput: (v) => (item.type_demande = v) });
    },
  });

  card = newCard(container, "Caractéristiques");
  bilingualRow(card, "Titre de la section", OPP, "features_title_fr", "features_title_ar");
  renderObjectList(container, {
    title: "Liste à puces",
    hint: "Affichée sous forme de liste avec coche.",
    arr: OPP.features,
    itemLabel: (item, i) => `Ligne ${i + 1}`,
    newItem: () => ({ fr: "", ar: "" }),
    fieldsSpec: (wrap, item) => {
      const row = makeFieldRow(wrap);
      makeField(row, { label: "FR", value: item.fr, onInput: (v) => (item.fr = v) });
      makeField(row, { label: "AR", value: item.ar, dir: "rtl", onInput: (v) => (item.ar = v) });
    },
  });

  card = newCard(container, "Formulaire de proposition");
  bilingualRow(card, "Titre", OPP, "form_title_fr", "form_title_ar");
  bilingualRow(card, "Texte", OPP, "form_text_fr", "form_text_ar", { multiline: true });
  bilingualRow(card, "Bouton d'envoi", OPP, "submit_fr", "submit_ar");
  {
    if (!OPP.form_type_demande_options) OPP.form_type_demande_options = ["Vente", "Achat", "Troc", "Partenariat"];
    if (!OPP.form_type_bien_options) OPP.form_type_bien_options = ["Terrain", "Bien existant", "Immeuble"];
    const row = makeFieldRow(card);
    const t1 = makeField(row, { label: "Choix « Type de demande » (un par ligne)", value: OPP.form_type_demande_options.join("\n"), multiline: true, onInput: (v) => (OPP.form_type_demande_options = v.split("\n").map((x) => x.trim()).filter(Boolean)) });
    const t2 = makeField(row, { label: "Choix « Type de bien » (un par ligne)", value: OPP.form_type_bien_options.join("\n"), multiline: true, onInput: (v) => (OPP.form_type_bien_options = v.split("\n").map((x) => x.trim()).filter(Boolean)) });
    t1.rows = t2.rows = 5;
    card.appendChild(el(`<p class="card-sub">Les cartes « Ce que nous recherchons » présélectionnent un choix : leur valeur doit correspondre exactement à l'une de ces lignes.</p>`));
  }

  const toolbar = el(`<div class="section-toolbar"><button class="btn btn-primary" id="save-opportunites">Enregistrer la page Opportunités</button></div>`);
  container.appendChild(toolbar);
  $("#save-opportunites", toolbar).addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      await saveSection("opportunites", "opportunites.json");
    } catch (err) {
      toast("Échec de l'enregistrement : " + err.message, true);
    } finally {
      e.target.disabled = false;
    }
  });
}

// ============================================================================
boot();
