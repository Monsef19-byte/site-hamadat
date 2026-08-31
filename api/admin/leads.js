// GET /api/admin/leads → { leads: [...], stats: {...} } (admin uniquement)
"use strict";

const { requireAuth } = require("../../lib/auth");
const { getAdapter } = require("../../lib/leads");

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  if (req.method === "GET") {
    try {
      const leads = await getAdapter().list();
      const stats = { total: leads.length, new: 0, by_code: {} };
      for (const lead of leads) {
        if (lead.status === "new") stats.new += 1;
        stats.by_code[lead.code] = (stats.by_code[lead.code] || 0) + 1;
      }
      return res.status(200).json({ leads, stats });
    } catch (e) {
      return res.status(e.statusCode || 500).json({ error: e.message });
    }
  }

  if (req.method === "PATCH") {
    const { id, status } = req.body || {};
    if (!id || !["new", "handled"].includes(status)) {
      return res.status(400).json({ error: "Corps invalide : 'id' et 'status' ('new'|'handled') requis." });
    }
    try {
      const lead = await getAdapter().updateStatus(id, status);
      return res.status(200).json({ ok: true, lead });
    } catch (e) {
      return res.status(e.statusCode || 500).json({ error: e.message });
    }
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ error: "Méthode non autorisée." });
};
