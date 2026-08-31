// Demandes reçues (leads) — stockage + classification + envoi email.
//
// Contrairement au contenu (data/*.json, versionné via l'adaptateur Git de
// lib/storage.js), chaque lead est écrit indépendamment et fréquemment : le
// committer sur Git alourdirait l'historique à chaque soumission de
// formulaire. On utilise donc un stockage séparé :
//  - "local"  : un fichier JSON par lead sous data/leads/ (dev).
//  - "blob"   : un objet JSON par lead dans Vercel Blob, préfixe
//               "hamadat/leads/" (production). Le mot de passe SMTP, lui,
//               n'est jamais stocké ici ni dans data/settings.json — comme
//               les autres secrets de ce projet (ADMIN_PASSWORD, JWT_SECRET,
//               GITHUB_TOKEN), il vit uniquement dans la variable
//               d'environnement Vercel SMTP_PASSWORD.
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LEADS_DIR = path.join(__dirname, "..", "data", "leads");

function mode() {
  const forced = process.env.STORAGE_ADAPTER;
  if (forced === "local" || forced === "blob") return forced;
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";
}

// ---------------------------------------------------------------------------
// Classification — pas de liste figée : le code se construit à partir des
// options réellement soumises, pour rester cohérent même si les options du
// formulaire changent depuis le dashboard. Deux familles de demandes :
//  - "résidence" (formulaire de contact) : résidence + type de bien (F2…).
//  - "proposition" (page Opportunités) : un visiteur propose un terrain ou
//    un bien À Hamadat — reconnu par la présence de type_bien/type_demande,
//    jamais les deux familles en même temps sur un même envoi.
// ---------------------------------------------------------------------------
function classify(fields) {
  const typeBien = (fields.type_bien || "").trim();
  const typeDemande = (fields.type_demande || "").trim();
  if (typeBien || typeDemande) {
    const code = ["HMD", "PROP", slugify(typeBien || typeDemande).toUpperCase()].join("-");
    return {
      code,
      residence: null,
      unit_type: null,
      type_bien: typeBien || null,
      type_demande: typeDemande || null,
    };
  }

  const residence = (fields.residence || "").trim();
  const unitType = (fields.unit_type || "").trim();
  const parts = ["HMD"];
  parts.push(residence ? slugify(residence).toUpperCase() : "GENERAL");
  if (unitType) parts.push(slugify(unitType).toUpperCase());
  return {
    code: parts.join("-"),
    residence: residence || null,
    unit_type: unitType || null,
    type_bien: null,
    type_demande: null,
  };
}

function newId() {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return `${ts}-${crypto.randomBytes(3).toString("hex")}`;
}

// ---------------------------------------------------------------------------
// Adaptateur local
// ---------------------------------------------------------------------------
const localAdapter = {
  name: "local",

  async save(lead) {
    fs.mkdirSync(LEADS_DIR, { recursive: true });
    fs.writeFileSync(path.join(LEADS_DIR, `${lead.id}.json`), JSON.stringify(lead, null, 2) + "\n", "utf8");
    return lead;
  },

  async list() {
    if (!fs.existsSync(LEADS_DIR)) return [];
    return fs
      .readdirSync(LEADS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(fs.readFileSync(path.join(LEADS_DIR, f), "utf8")))
      .sort((a, b) => (a.received_at < b.received_at ? 1 : -1));
  },

  async updateStatus(id, status) {
    const file = path.join(LEADS_DIR, `${id}.json`);
    if (!fs.existsSync(file)) {
      const err = new Error("Demande introuvable.");
      err.statusCode = 404;
      throw err;
    }
    const lead = JSON.parse(fs.readFileSync(file, "utf8"));
    lead.status = status;
    fs.writeFileSync(file, JSON.stringify(lead, null, 2) + "\n", "utf8");
    return lead;
  },
};

// ---------------------------------------------------------------------------
// Adaptateur Vercel Blob
// ---------------------------------------------------------------------------
const blobAdapter = {
  name: "blob",

  async save(lead) {
    const { put } = require("@vercel/blob");
    await put(`hamadat/leads/${lead.id}.json`, JSON.stringify(lead, null, 2), {
      access: "public",
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });
    return lead;
  },

  async list() {
    const { list } = require("@vercel/blob");
    const out = [];
    let cursor;
    do {
      const page = await list({
        prefix: "hamadat/leads/",
        cursor,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        limit: 200,
      });
      for (const item of page.blobs) {
        try {
          const res = await fetch(item.url);
          if (res.ok) out.push(await res.json());
        } catch (e) {
          // un lead illisible ne doit pas casser la liste entière
          console.error("Lecture lead échouée:", item.pathname, e.message);
        }
      }
      cursor = page.cursor;
    } while (cursor);
    return out.sort((a, b) => (a.received_at < b.received_at ? 1 : -1));
  },

  async updateStatus(id, status) {
    const { put } = require("@vercel/blob");
    const all = await this.list();
    const lead = all.find((l) => l.id === id);
    if (!lead) {
      const err = new Error("Demande introuvable.");
      err.statusCode = 404;
      throw err;
    }
    lead.status = status;
    await put(`hamadat/leads/${id}.json`, JSON.stringify(lead, null, 2), {
      access: "public",
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });
    return lead;
  },
};

function getAdapter() {
  return mode() === "blob" ? blobAdapter : localAdapter;
}

// ---------------------------------------------------------------------------
// Email — envoyé APRÈS le stockage (jamais avant : un échec SMTP ne doit
// jamais faire perdre un lead déjà validé côté visiteur).
// ---------------------------------------------------------------------------
async function sendLeadEmail(lead, settings) {
  const password = process.env.SMTP_PASSWORD;
  if (!settings.notify_enabled || !password || !settings.smtp_user || !settings.lead_recipient) {
    return { sent: false, reason: "not_configured" };
  }
  let nodemailer;
  try {
    nodemailer = require("nodemailer");
  } catch (e) {
    return { sent: false, reason: "nodemailer_missing" };
  }
  const transporter = nodemailer.createTransport({
    host: settings.smtp_host,
    port: Number(settings.smtp_port) || 587,
    secure: Number(settings.smtp_port) === 465,
    auth: { user: settings.smtp_user, pass: password },
  });
  const f = lead.fields;
  const isProposal = Boolean(lead.type_bien || lead.type_demande);
  const lines = isProposal
    ? [
        `Nouvelle proposition (Opportunités) — ${lead.code}`,
        ``,
        `Nom : ${f.full_name || "—"}`,
        `E-mail : ${f.email || "—"}`,
        `Téléphone : ${f.phone || "—"}`,
        `Type de demande : ${f.type_demande || "—"}`,
        `Type de bien : ${f.type_bien || "—"}`,
        `Localisation : ${f.localisation || "—"}`,
        `Message : ${f.message || "—"}`,
        ``,
        `Reçu le ${lead.received_at}`,
      ]
    : [
        `Nouvelle demande — ${lead.code}`,
        ``,
        `Nom : ${f.full_name || "—"}`,
        `E-mail : ${f.email || "—"}`,
        `Téléphone : ${f.phone || "—"}`,
        `Type de bien : ${f.unit_type || "—"}`,
        `Résidence souhaitée : ${f.residence || "—"}`,
        `Message : ${f.message || "—"}`,
        ``,
        `Reçu le ${lead.received_at}`,
      ];
  try {
    await transporter.sendMail({
      from: `"${settings.smtp_sender_name || "Hamadat — Site Web"}" <${settings.smtp_user}>`,
      to: settings.lead_recipient,
      replyTo: f.email || undefined,
      subject: `[Hamadat] Nouvelle demande — ${lead.code}`,
      text: lines.join("\n"),
    });
    return { sent: true };
  } catch (e) {
    console.error("Envoi email lead échoué:", e.message);
    return { sent: false, reason: e.message };
  }
}

module.exports = { getAdapter, classify, newId, mode, sendLeadEmail };
