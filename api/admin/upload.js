// POST /api/admin/upload
// Body JSON : { filename, contentType, dataBase64, folder }
// (pas de multipart/form-data pour éviter une dépendance de parsing
// supplémentaire : le client encode le fichier en base64 avant l'envoi).
//
// Redimensionne/compresse l'image via sharp (miroir de optimize_images.py),
// puis la stocke via l'adaptateur actif (disque local en dev, Vercel Blob
// en production) et renvoie son URL publique définitive.
"use strict";

const { requireAuth } = require("../../lib/auth");
const { getAdapter } = require("../../lib/storage");

// Les fonctions Vercel plafonnent la taille du corps de requête à ~4.5 Mo ;
// on limite donc l'image source (avant encodage base64, qui gonfle ~33%)
// pour rester sous cette limite avec de la marge.
const MAX_BYTES = 3 * 1024 * 1024;

function safeSegment(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Comme safeSegment, mais préserve la structure en sous-dossiers (ex:
// "residences/orea/diaporama" reste "residences/orea/diaporama" au lieu
// d'être aplati en "residences-orea-diaporama").
function safeFolderPath(s) {
  return String(s || "")
    .split("/")
    .map(safeSegment)
    .filter(Boolean)
    .join("/");
}

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const { filename, contentType, dataBase64, folder } = req.body || {};
  if (!dataBase64 || !filename) {
    return res.status(400).json({ error: "Corps invalide : 'filename' et 'dataBase64' requis." });
  }
  if (!/^image\//i.test(contentType || "")) {
    return res.status(400).json({ error: "Seules les images sont acceptées." });
  }

  let buffer;
  try {
    buffer = Buffer.from(dataBase64, "base64");
  } catch (e) {
    return res.status(400).json({ error: "dataBase64 invalide." });
  }
  if (!buffer.length) {
    return res.status(400).json({ error: "Fichier vide." });
  }
  if (buffer.length > MAX_BYTES) {
    return res.status(413).json({
      error: `Image trop volumineuse (${(buffer.length / 1024 / 1024).toFixed(1)} Mo, max ${(MAX_BYTES / 1024 / 1024).toFixed(0)} Mo). Réduisez-la avant l'envoi.`,
    });
  }

  let optimized;
  try {
    const sharp = require("sharp");
    optimized = await sharp(buffer)
      .rotate() // corrige l'orientation EXIF
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  } catch (e) {
    return res.status(400).json({ error: "Image illisible ou format non supporté : " + e.message });
  }

  const safeFolder = safeFolderPath(folder) || "uploads";
  const base = safeSegment(filename.replace(/\.[a-zA-Z0-9]+$/, "")) || "image";
  const relPath = `${safeFolder}/${Date.now()}-${base}.jpg`;

  try {
    const adapter = getAdapter();
    const { url } = await adapter.uploadImage(relPath, optimized, "image/jpeg");
    return res.status(200).json({ ok: true, url });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ error: e.message });
  }
};
