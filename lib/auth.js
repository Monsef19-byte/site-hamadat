// Authentification admin — mot de passe unique (ADMIN_PASSWORD) + cookie de
// session signé (JWT HS256, HttpOnly). Pas de compte utilisateur, pas de
// base de données : un seul admin, un seul secret partagé.
//
// Le JWT est signé "à la main" avec le module `crypto` intégré à Node
// (format standard HS256 : base64url(header).base64url(payload).signature)
// plutôt qu'avec la librairie `jsonwebtoken`, pour ne dépendre d'aucun
// paquet tiers sur ce point précis — l'auth est le seul chemin qui doit
// fonctionner même si l'installation npm échoue pour une raison quelconque.
"use strict";

const crypto = require("crypto");

const COOKIE_NAME = "hamadat_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    const err = new Error("JWT_SECRET n'est pas configuré côté serveur.");
    err.statusCode = 500;
    throw err;
  }
  return s;
}

function b64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlJSON(obj) {
  return b64url(JSON.stringify(obj));
}

function b64urlDecodeJSON(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
}

function sign(data) {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function issueToken() {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { role: "admin", iat: now, exp: now + SESSION_TTL_SECONDS };
  const data = `${b64urlJSON(header)}.${b64urlJSON(payload)}`;
  return `${data}.${sign(data)}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sig] = parts;
  const data = `${headerB64}.${payloadB64}`;
  let expectedSig;
  try {
    expectedSig = sign(data);
  } catch (e) {
    return null; // JWT_SECRET manquant
  }
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  let payload;
  try {
    payload = b64urlDecodeJSON(payloadB64);
  } catch (e) {
    return null;
  }
  if (!payload.exp || Math.floor(Date.now() / 1000) > payload.exp) return null;
  return payload;
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    try {
      out[k] = decodeURIComponent(v);
    } catch (e) {
      out[k] = v;
    }
  });
  return out;
}

function isProdEnv() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

function sessionCookieHeader(token) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];
  if (isProdEnv()) parts.push("Secure");
  return parts.join("; ");
}

function clearCookieHeader() {
  const parts = [`${COOKIE_NAME}=`, "Path=/", "HttpOnly", "SameSite=Strict", "Max-Age=0"];
  if (isProdEnv()) parts.push("Secure");
  return parts.join("; ");
}

function getSessionFromReq(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}

// Helper pour les endpoints protégés : renvoie la session, ou répond 401 et
// renvoie null si l'appelant n'est pas authentifié (l'endpoint doit alors
// `return` immédiatement).
function requireAuth(req, res) {
  const session = getSessionFromReq(req);
  if (!session) {
    res.status(401).json({ error: "Non authentifié." });
    return null;
  }
  return session;
}

module.exports = {
  COOKIE_NAME,
  issueToken,
  verifyToken,
  parseCookies,
  sessionCookieHeader,
  clearCookieHeader,
  getSessionFromReq,
  requireAuth,
};
