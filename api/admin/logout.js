"use strict";

const { clearCookieHeader } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
  res.setHeader("Set-Cookie", clearCookieHeader());
  return res.status(200).json({ ok: true });
};
