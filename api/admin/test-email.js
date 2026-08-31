// POST /api/admin/test-email — envoie un e-mail de test avec les réglages
// actuellement enregistrés dans data/settings.json + SMTP_PASSWORD (env).
// Ne modifie rien, ne stocke rien : juste un aller-retour SMTP pour valider
// la configuration depuis le dashboard, sans passer par un vrai formulaire.
"use strict";

const { requireAuth } = require("../../lib/auth");
const { getAdapter } = require("../../lib/storage");
const { sendLeadEmail } = require("../../lib/leads");

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  if (!process.env.SMTP_PASSWORD) {
    return res.status(400).json({ error: "SMTP_PASSWORD n'est pas défini côté serveur (variable d'environnement Vercel)." });
  }

  let settings;
  try {
    const result = await getAdapter().readJSON("settings.json");
    settings = result.content;
  } catch (e) {
    return res.status(e.statusCode || 500).json({ error: e.message });
  }

  if (!settings.smtp_user || !settings.lead_recipient) {
    return res.status(400).json({ error: "Renseignez au moins l'expéditeur SMTP et le destinataire des demandes avant de tester." });
  }

  const testLead = {
    code: "TEST",
    fields: {
      full_name: "Test dashboard",
      email: "test@example.com",
      phone: "—",
      unit_type: "—",
      residence: "—",
      message: "Ceci est un e-mail de test envoyé depuis le dashboard admin Hamadat.",
    },
    received_at: new Date().toISOString(),
  };

  const result = await sendLeadEmail(testLead, { ...settings, notify_enabled: true });
  if (!result.sent) {
    return res.status(502).json({ error: `Échec de l'envoi : ${result.reason || "raison inconnue"}` });
  }
  return res.status(200).json({ ok: true });
};
