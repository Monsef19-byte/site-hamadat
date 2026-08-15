#!/usr/bin/env node
// Migration ponctuelle : convertit les listes bilingues parallèles
// (services_fr/services_ar, quality_fr/quality_ar, why_points_fr/why_points_ar)
// en tableaux d'objets {icon, text_fr, text_ar} avec une icône choisie
// explicitement (au lieu d'être devinée à l'affichage). On réutilise
// l'ancien détecteur par mot-clé pour donner une valeur de départ sensée
// à chaque ligne existante — l'admin peut ensuite la changer librement
// depuis le sélecteur d'icône.
"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

const FEATURE_ICON_RULES = [
  ["ascenseur", "lift"],
  ["sécurité", "shield"],
  ["parking", "car"],
  ["aire de jeux", "playground"],
  ["climatisation", "snowflake"],
  ["chauffage", "snowflake"],
  ["cuisine", "utensils"],
  ["dressing", "closet"],
  ["interphone", "bell"],
  ["bâche", "droplet"],
  ["jacuzzi", "droplet"],
  ["piscine", "droplet"],
  ["hammam", "droplet"],
  ["salle de sport", "dumbbell"],
  ["conception architecturale", "building"],
  ["design contemporain", "building"],
  ["façade", "layers"],
  ["fenêtre", "window"],
  ["finitions", "sparkles"],
  ["isolation", "soundwave"],
  ["matériaux", "package"],
  ["revêtements", "grid"],
  ["savoir-faire", "badge"],
  ["délais", "clock"],
  ["suivi", "eye"],
  ["transparen", "eye"],
];

function guessIcon(textFr) {
  const low = String(textFr).toLowerCase();
  for (const [kw, name] of FEATURE_ICON_RULES) {
    if (low.includes(kw)) return name;
  }
  return "check-circle";
}

function toObjectList(frArr, arArr) {
  return (frArr || []).map((fr, i) => ({
    icon: guessIcon(fr),
    text_fr: fr,
    text_ar: (arArr || [])[i] || "",
  }));
}

function migrateResidences() {
  const p = path.join(DATA_DIR, "residences.json");
  const res = JSON.parse(fs.readFileSync(p, "utf8"));
  let changed = 0;
  for (const r of res) {
    if (Array.isArray(r.services_fr)) {
      r.services = toObjectList(r.services_fr, r.services_ar);
      delete r.services_fr;
      delete r.services_ar;
      changed++;
    }
    if (Array.isArray(r.quality_fr)) {
      r.quality = toObjectList(r.quality_fr, r.quality_ar);
      delete r.quality_fr;
      delete r.quality_ar;
      changed++;
    }
  }
  fs.writeFileSync(p, JSON.stringify(res, null, 2) + "\n", "utf8");
  console.log(`residences.json : ${changed} listes migrées (services/qualité).`);
}

function migrateGlobal() {
  const p = path.join(DATA_DIR, "global.json");
  const g = JSON.parse(fs.readFileSync(p, "utf8"));
  if (g.signature && Array.isArray(g.signature.why_points_fr)) {
    g.signature.why_points = toObjectList(g.signature.why_points_fr, g.signature.why_points_ar);
    delete g.signature.why_points_fr;
    delete g.signature.why_points_ar;
    fs.writeFileSync(p, JSON.stringify(g, null, 2) + "\n", "utf8");
    console.log("global.json : signature.why_points migré.");
  } else {
    console.log("global.json : déjà migré ou champ absent, rien à faire.");
  }
}

migrateResidences();
migrateGlobal();
