"use strict";

const { issueToken, sessionCookieHeader } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(500).json({ error: "ADMIN_PASSWORD n'est pas configuré côté serveur." });
  }

  const { password } = req.body || {};
  if (!password || password !== expected) {
    return res.status(401).json({ error: "Mot de passe incorrect." });
  }

  let token;
  try {
    token = issueToken();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  res.setHeader("Set-Cookie", sessionCookieHeader(token));
  return res.status(200).json({ ok: true });
};
