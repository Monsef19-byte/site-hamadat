#!/usr/bin/env node
// Serveur de dev local, sans dépendance externe (utile ici : ce bac à sable
// n'a pas d'accès au registre npm pour installer le CLI `vercel`).
// Sert public/ en statique et route /api/admin/* vers les mêmes handlers
// que ceux déployés sur Vercel (même signature (req, res) avec
// req.body / req.query / res.status().json(), donc le code de prod est
// testé tel quel — seul le petit shim ci-dessous change entre les deux
// environnements).
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT = __dirname + "/..";
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = process.env.PORT || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function augmentRes(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (obj) {
    const body = JSON.stringify(obj);
    if (!res.getHeader("Content-Type")) res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(body);
    return res;
  };
  return res;
}

const ROUTES = [
  { test: (p) => p === "/api/admin/login", mod: "../api/admin/login" },
  { test: (p) => p === "/api/admin/logout", mod: "../api/admin/logout" },
  { test: (p) => p === "/api/admin/me", mod: "../api/admin/me" },
  { test: (p) => p === "/api/admin/upload", mod: "../api/admin/upload" },
  {
    test: (p) => /^\/api\/admin\/content\/[^/]+$/.test(p),
    mod: "../api/admin/content/[file]",
    params: (p) => ({ file: decodeURIComponent(p.split("/").pop()) }),
  },
];

async function handleApi(route, req, res, pathname) {
  augmentRes(res);
  req.query = route.params ? route.params(pathname) : {};
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    const raw = await readBody(req);
    if (raw.length) {
      try {
        req.body = JSON.parse(raw.toString("utf8"));
      } catch (e) {
        return res.status(400).json({ error: "JSON invalide dans le corps de la requête." });
      }
    } else {
      req.body = {};
    }
  }
  delete require.cache[require.resolve(route.mod)];
  const handler = require(route.mod);
  try {
    await handler(req, res);
  } catch (e) {
    console.error("Erreur handler API:", e);
    if (!res.headersSent) res.status(500).json({ error: "Erreur serveur : " + e.message });
  }
}

function serveStatic(req, res, pathname) {
  let rel = pathname === "/" ? "/index.html" : pathname;
  // /admin -> /admin/index.html
  if (rel === "/admin" || rel === "/admin/") rel = "/admin/index.html";
  let filePath = path.join(PUBLIC_DIR, decodeURIComponent(rel));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    return res.end("Forbidden");
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // Essaye .html implicite (ex: /apropos -> /apropos.html)
      const withHtml = filePath + ".html";
      fs.stat(withHtml, (err2, stat2) => {
        if (!err2 && stat2.isFile()) return streamFile(withHtml, res);
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("404 — introuvable : " + pathname);
      });
      return;
    }
    streamFile(filePath, res);
  });
}

function streamFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  const route = ROUTES.find((r) => r.test(pathname));
  if (route) {
    return handleApi(route, req, res, pathname);
  }

  if (pathname.startsWith("/api/")) {
    res.statusCode = 404;
    return res.end("API inconnue: " + pathname);
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`Hamadat dev server → http://localhost:${PORT}  (site) · http://localhost:${PORT}/admin  (dashboard admin)`);
});
