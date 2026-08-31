// POST /api/submit-lead — endpoint PUBLIC (pas d'auth) appelé par le
// formulaire de contact (page d'accueil, « Qui sommes-nous », blog) ET par
// le formulaire de proposition de la page Opportunités (type_bien /
// type_demande / localisation à la place de unit_type / residence —
// lib/leads.js classify() distingue les deux familles automatiquement).
//
// Ordre strict : on ENREGISTRE le lead d'abord, on tente l'e-mail ensuite.
// Si l'e-mail échoue (SMTP mal configuré, mot de passe manquant...), le
// visiteur voit quand même un succès et la demande reste consultable dans
// le dashboard ("Demandes reçues") — jamais perdue silencieusement.
"use strict";

const { getAdapter: getSettingsAdapter } = require("../lib/storage");
const { getAdapter: getLeadsAdapter, classify, newId, sendLeadEmail } = require("../lib/leads");

const MAX_LEN = {
  full_name: 200, email: 200, phone: 40, unit_type: 60, residence: 60, message: 4000, source: 40,
  type_bien: 60, type_demande: 60, localisation: 120,
};

function clean(v, max) {
  return String(v == null ? "" : v).trim().slice(0, max);
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const body = req.body || {};

  // Piège à robots : champ "website" caché, jamais rempli par un humain.
  // On répond 200 sans rien stocker, pour ne pas indiquer au bot que le
  // piège a été détecté.
  if (clean(body.website, 100)) {
    return res.status(200).json({ ok: true });
  }

  const fields = {
    full_name: clean(body.full_name, MAX_LEN.full_name),
    email: clean(body.email, MAX_LEN.email),
    phone: clean(body.phone, MAX_LEN.phone),
    unit_type: clean(body.unit_type, MAX_LEN.unit_type),
    residence: clean(body.residence, MAX_LEN.residence),
    type_bien: clean(body.type_bien, MAX_LEN.type_bien),
    type_demande: clean(body.type_demande, MAX_LEN.type_demande),
    localisation: clean(body.localisation, MAX_LEN.localisation),
    message: clean(body.message, MAX_LEN.message),
  };
  const source = clean(body.source, MAX_LEN.source) || "contact";
  const lang = body.lang === "ar" ? "ar" : "fr";

  if (!fields.full_name || !fields.email || !fields.phone) {
    return res.status(400).json({ error: "Nom, e-mail et téléphone sont requis." });
  }
  if (!isEmail(fields.email)) {
    return res.status(400).json({ error: "Adresse e-mail invalide." });
  }

  const cls = classify(fields);
  const lead = {
    id: newId(),
    code: cls.code,
    residence: cls.residence,
    unit_type: cls.unit_type,
    type_bien: cls.type_bien,
    type_demande: cls.type_demande,
    fields,
    source,
    lang,
    received_at: new Date().toISOString(),
    status: "new",
    email_sent: false,
  };

  try {
    await getLeadsAdapter().save(lead);
  } catch (e) {
    console.error("Échec enregistrement lead:", e.message);
    return res.status(500).json({ error: "Impossible d'enregistrer la demande pour le moment. Merci de réessayer." });
  }

  // L'échec de cette étape ne doit jamais changer la réponse envoyée au
  // visiteur : le lead est déjà en sécurité.
  try {
    const { content: settings } = await getSettingsAdapter().readJSON("settings.json");
    const result = await sendLeadEmail(lead, settings);
    lead.email_sent = Boolean(result.sent);
    if (!result.sent) lead.email_skip_reason = result.reason;
    // best-effort : on retente d'enregistrer avec le statut email_sent à jour
    await getLeadsAdapter().save(lead).catch(() => {});
  } catch (e) {
    console.error("Étape email lead a levé une exception (lead déjà stocké, sans impact visiteur):", e.message);
  }

  return res.status(200).json({ ok: true, code: lead.code });
};
