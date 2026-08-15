// GET  /api/admin/content/:file  → { content, sha, adapter }
// PUT  /api/admin/content/:file  (body: { data, sha, message }) → { ok, sha, adapter }
//
// :file doit être l'un de global.json | residences.json | home_carousel.json.
// C'est le seul point d'entrée d'écriture pour tout le contenu du site (le
// dashboard admin lit/modifie le JSON entier côté client puis renvoie
// l'objet complet ici — écriture atomique, pas de patch partiel côté
// serveur). `sha` permet la concurrence optimiste avec l'adaptateur GitHub :
// on doit renvoyer le sha obtenu au dernier GET, sinon GitHub refuse
// l'écriture avec 409 si le fichier a changé entre-temps.
"use strict";

const { requireAuth } = require("../../../lib/auth");
const { getAdapter, ALLOWED_FILES } = require("../../../lib/storage");

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  const file = req.query.file;
  if (!ALLOWED_FILES.has(file)) {
    return res.status(400).json({ error: `Fichier non autorisé : ${file}` });
  }

  const adapter = getAdapter();

  if (req.method === "GET") {
    try {
      const { content, sha } = await adapter.readJSON(file);
      return res.status(200).json({ content, sha, adapter: adapter.name });
    } catch (e) {
      return res.status(e.statusCode || 500).json({ error: e.message });
    }
  }

  if (req.method === "PUT") {
    const { data, sha, message } = req.body || {};
    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Corps invalide : 'data' (objet/tableau JSON) requis." });
    }
    try {
      const result = await adapter.writeJSON(file, data, { sha, message });

      // En local (dev), on régénère immédiatement le HTML statique pour que
      // l'aperçu reflète la modification tout de suite. En production
      // (adaptateur GitHub), c'est le commit qui déclenche le build Vercel —
      // pas besoin (et pas possible : filesystem éphémère) de rebuild ici.
      if (adapter.name === "local") {
        try {
          const buildPath = require.resolve("../../../build");
          delete require.cache[buildPath];
          require(buildPath);
        } catch (buildErr) {
          console.error("Rebuild local après sauvegarde a échoué :", buildErr);
        }
      }

      return res.status(200).json({ ok: true, sha: result.sha, adapter: adapter.name });
    } catch (e) {
      return res.status(e.statusCode || 500).json({ error: e.message });
    }
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ error: "Méthode non autorisée." });
};
