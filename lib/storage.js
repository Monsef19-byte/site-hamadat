// Adaptateur de stockage pour le dashboard admin.
//
// Deux implémentations, choisies automatiquement selon l'environnement :
//  - "local"  : écrit directement sur le disque (dev local / `vercel dev`).
//  - "github" : lit/écrit via l'API Contents de GitHub — chaque sauvegarde
//               admin devient un commit Git, qui déclenche un redeploy
//               Vercel automatique (site déployé sur Vercel + Git).
// Les images uploadées passent par Vercel Blob en production (les JSON de
// contenu restent versionnés dans Git ; les binaires vont dans Blob plutôt
// que d'alourdir l'historique Git à chaque upload).
"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const PUBLIC_ASSETS_DIR = path.join(__dirname, "..", "public", "assets");
const ALLOWED_FILES = new Set(["global.json", "residences.json", "home_carousel.json", "blog.json", "links.json", "videos.json", "gallery.json", "settings.json", "opportunites.json"]);

function assertAllowed(file) {
  if (!ALLOWED_FILES.has(file)) {
    const err = new Error(`Fichier non autorisé : ${file}`);
    err.statusCode = 400;
    throw err;
  }
}

function mode() {
  const forced = process.env.STORAGE_ADAPTER;
  if (forced === "local" || forced === "github") return forced;
  return process.env.GITHUB_TOKEN && process.env.GITHUB_REPO ? "github" : "local";
}

// ---------------------------------------------------------------------------
// Adaptateur local (dev)
// ---------------------------------------------------------------------------
const localAdapter = {
  name: "local",

  async readJSON(file) {
    assertAllowed(file);
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
    return { content: JSON.parse(raw), sha: null };
  },

  async writeJSON(file, data /*, { sha, message } = {} */) {
    assertAllowed(file);
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2) + "\n", "utf8");
    return { sha: null };
  },

  async uploadImage(relPath, buffer /*, contentType */) {
    const dest = path.join(PUBLIC_ASSETS_DIR, relPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buffer);
    return { url: `/assets/${relPath}` };
  },
};

// ---------------------------------------------------------------------------
// Adaptateur GitHub Contents API (production)
// ---------------------------------------------------------------------------
const GITHUB_API = "https://api.github.com";

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "hamadat-admin-dashboard",
  };
}

function ghBranch() {
  return process.env.GITHUB_BRANCH || "main";
}

async function ghGetFile(repoPath) {
  const url = `${GITHUB_API}/repos/${process.env.GITHUB_REPO}/contents/${encodeURI(repoPath)}?ref=${ghBranch()}`;
  const res = await fetch(url, { headers: ghHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`GitHub GET ${repoPath} → ${res.status}: ${body}`);
    err.statusCode = res.status === 404 ? 404 : 502;
    throw err;
  }
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf8");
  return { content, sha: json.sha };
}

async function ghPutFile(repoPath, contentBuffer, { sha, message } = {}) {
  const url = `${GITHUB_API}/repos/${process.env.GITHUB_REPO}/contents/${encodeURI(repoPath)}`;
  const body = {
    message: message || `admin: mise à jour ${repoPath}`,
    content: contentBuffer.toString("base64"),
    branch: ghBranch(),
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    const err = new Error(`GitHub PUT ${repoPath} → ${res.status}: ${errBody}`);
    // 409 = conflit de sha (quelqu'un d'autre a modifié le fichier entre-temps)
    err.statusCode = res.status === 409 ? 409 : 502;
    throw err;
  }
  const json = await res.json();
  return { sha: json.content.sha };
}

const githubAdapter = {
  name: "github",

  async readJSON(file) {
    assertAllowed(file);
    const { content, sha } = await ghGetFile(`data/${file}`);
    return { content: JSON.parse(content), sha };
  },

  async writeJSON(file, data, { sha, message } = {}) {
    assertAllowed(file);
    const buf = Buffer.from(JSON.stringify(data, null, 2) + "\n", "utf8");
    return ghPutFile(`data/${file}`, buf, { sha, message: message || `admin: mise à jour ${file}` });
  },

  async uploadImage(relPath, buffer, contentType) {
    const { put } = require("@vercel/blob");
    const blob = await put(`hamadat/${relPath}`, buffer, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });
    return { url: blob.url };
  },
};

function getAdapter() {
  return mode() === "github" ? githubAdapter : localAdapter;
}

module.exports = { getAdapter, ALLOWED_FILES, mode };
