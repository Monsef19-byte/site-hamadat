# Hamadat Promotion Immobilière — site + dashboard admin

Site vitrine bilingue (FR/AR) pour Hamadat Promotion Immobilière, avec un
dashboard admin permettant de modifier **tous les textes, toutes les images
et tous les détails des résidences, dans les deux langues**, sans toucher au
code.

Le site est **statique** (HTML généré, aucune base de données), mais le
contenu est **entièrement pilotable depuis `/admin`**. Chaque sauvegarde
depuis le dashboard admin crée un commit Git dans votre dépôt GitHub, ce qui
déclenche automatiquement un redeploy Vercel — c'est ce commit qui sert de
"base de données" et d'historique des modifications.

---

## 1. Comment ça marche

```
data/*.json        ← contenu du site (textes FR/AR, résidences, carrousel)
lib/*.js           ← génère le HTML à partir de data/*.json (build.js)
public/             ← site statique généré + assets + dashboard admin
api/admin/*.js      ← fonctions serverless Vercel (auth, contenu, upload)
```

- **En développement local** : le dashboard admin écrit directement sur le
  disque (`data/*.json`, `public/assets/...`) et régénère le HTML
  immédiatement après chaque sauvegarde.
- **En production (Vercel)** : le filesystem est éphémère, donc le dashboard
  admin écrit via l'**API GitHub** (chaque sauvegarde = un commit dans votre
  dépôt) et upload les images vers **Vercel Blob**. Le commit déclenche un
  nouveau build Vercel, qui régénère le site avec le contenu à jour.

Aucune donnée sensible (mot de passe admin, tokens) n'est stockée dans le
dépôt Git : tout passe par des variables d'environnement Vercel.

---

## 2. Développement local

Prérequis : Node.js ≥ 18.

```bash
npm install
cp .env.example .env
# éditez .env : définissez au minimum ADMIN_PASSWORD et JWT_SECRET
```

Chargez les variables d'environnement puis lancez le serveur de dev (aucune
dépendance externe, pas besoin du CLI Vercel) :

```bash
export $(grep -v '^#' .env | xargs)   # ou utilisez `dotenv`/votre méthode habituelle
npm run dev
```

- Site : http://localhost:3000
- Dashboard admin : http://localhost:3000/admin (mot de passe = `ADMIN_PASSWORD`)

En local, l'adaptateur de stockage utilisé est automatiquement `local`
(écriture directe sur disque) tant que `GITHUB_TOKEN` n'est pas défini.

Pour régénérer le HTML manuellement à partir de `data/*.json` (sans passer
par l'admin) :

```bash
npm run build
```

---

## 3. Déploiement sur Vercel + GitHub

### 3.1 Créer le dépôt GitHub

1. Créez un nouveau dépôt GitHub (public ou privé).
2. Poussez-y le contenu de ce projet :
   ```bash
   git init
   git add .
   git commit -m "Site initial Hamadat"
   git branch -M main
   git remote add origin https://github.com/<votre-compte>/<votre-repo>.git
   git push -u origin main
   ```

### 3.2 Créer un token GitHub pour le dashboard admin

Le dashboard a besoin d'un token pour committer les modifications de contenu
à votre place :

1. GitHub → **Settings** → **Developer settings** → **Personal access
   tokens** → **Fine-grained tokens** (recommandé) → **Generate new token**.
2. Limitez-le à ce seul dépôt, avec la permission **Contents : Read and
   write**.
3. Copiez le token généré (il ne sera plus jamais affiché) — ce sera la
   variable `GITHUB_TOKEN`.

### 3.3 Créer un store Vercel Blob (stockage des images)

1. Dans votre projet Vercel → onglet **Storage** → **Create Database** →
   **Blob**.
2. Une fois créé, copiez le token en lecture/écriture — ce sera la variable
   `BLOB_READ_WRITE_TOKEN`.

### 3.4 Importer le projet sur Vercel

1. Vercel → **Add New** → **Project** → importez votre dépôt GitHub.
2. Framework preset : **Other** (build command et output directory sont déjà
   définis dans `vercel.json`, rien à changer).
3. Avant de déployer, ajoutez les variables d'environnement suivantes
   (Project Settings → Environment Variables) :

| Variable | Valeur |
|---|---|
| `ADMIN_PASSWORD` | Le mot de passe du dashboard admin (choisissez-en un fort). |
| `JWT_SECRET` | Une longue chaîne aléatoire (ex. générée avec `openssl rand -hex 32`). |
| `GITHUB_TOKEN` | Le token créé à l'étape 3.2. |
| `GITHUB_REPO` | `votre-compte/votre-repo` |
| `GITHUB_BRANCH` | `main` (branche de production). Un déploiement de preview enregistre toujours sur sa propre branche, quelle que soit cette valeur. |
| `BLOB_READ_WRITE_TOKEN` | Le token créé à l'étape 3.3. |

Pour utiliser le dashboard sur un déploiement de **preview**, cochez aussi l'environnement *Preview* pour `ADMIN_PASSWORD`, `JWT_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO` et `BLOB_READ_WRITE_TOKEN`. Les enregistrements y sont commités sur la branche de preview et les demandes reçues sont rangées à part (`hamadat/preview/leads/`).

4. Déployez. Vercel exécute `node build.js` (défini dans `vercel.json`) puis
   sert le contenu de `public/`. La page « Liens » est accessible à l'URL
   propre `https://votre-site.vercel.app/liens` (réécriture déjà configurée
   dans `vercel.json`, rien à faire côté Vercel).

### 3.5 Utiliser le dashboard

Rendez-vous sur `https://votre-site.vercel.app/admin`, connectez-vous avec
`ADMIN_PASSWORD`, modifiez le contenu, cliquez sur **Enregistrer**. Chaque
sauvegarde crée un commit sur GitHub (visible dans l'historique du dépôt) et
déclenche automatiquement un nouveau déploiement Vercel (généralement en
moins d'une minute, le temps que le site public reflète le changement).

---

## 4. Ce que le dashboard permet de modifier

- **Contenu global** : accroche d'accueil, section « Qui sommes-nous »
  (texte + engagements), vision, valeurs, signature/« Pourquoi Hamadat »,
  chiffres clés, page Actualités, section contact (textes + libellés des
  champs + coordonnées affichées : nom, adresse, ville, téléphone, e-mail,
  badge), pied de page — en français **et** en arabe pour chaque champ.
- **Carrousel d'accueil** : ordre des slides, accroche/bouton par résidence,
  image de chaque slide, ajout/retrait d'une résidence du carrousel.
- **Résidences** (ajout, modification, suppression) : identité, statut
  (en cours/livré), emplacement, lien Google Maps, disponibilité et badge
  d'avancement des travaux (%), description, pourquoi cet emplacement,
  chiffres clés du projet, services & équipements, qualité & finitions
  (icône choisie via un sélecteur visuel, voir ci-dessous), et la
  galerie/diaporama complète (légendes FR/AR + upload d'image, réordonnable).
- **Blog** : activation/désactivation de la page `/blog` d'un simple
  interrupteur (quand désactivé, le lien disparaît du menu/pied de page et
  la page n'est plus générée), titre/introduction de la page, et gestion
  complète des articles (titre, résumé, contenu FR/AR en paragraphes, image
  de couverture, date de publication, suppression).
- **Page « Liens »** (`/liens`, pensée pour les cartes de visite) : titre et
  introduction, et une liste de cartes réordonnables — chacune avec une
  icône choisie visuellement, un libellé FR/AR et une URL (site, réseau
  social, `tel:`, `mailto:`…).
- **Vidéos YouTube** : titre/texte de la section, et une liste de vidéos
  réordonnables (lien YouTube, titre + description FR/AR) affichées en
  carrousel sur la page d'accueil, avec lecture dans une fenêtre modale au
  clic. La section n'apparaît sur le site que si au moins une vidéo est
  ajoutée.
- **Sélecteur d'icône** : partout où une icône est utilisée (services,
  qualité & finitions, « Pourquoi Hamadat », cartes de liens), un bouton
  ouvre une bibliothèque de 60+ icônes avec recherche par mot-clé — plus
  besoin de deviner ou de coder une icône.

Chaque image uploadée est automatiquement redimensionnée et compressée
côté serveur (max 2400px, JPEG qualité 82) avant stockage.

---

## 5. Limites connues

- Les fonctions Vercel plafonnent le corps de requête à environ 4,5 Mo :
  les images sont donc redimensionnées côté navigateur avant l'envoi, et le
  serveur refuse tout fichier source de plus de 3 Mo (message d'erreur
  explicite affiché dans le dashboard).
- Un seul compte admin (mot de passe partagé) — pas de gestion multi-utilisateurs.
- Chaque sauvegarde est commitée directement sur la branche configurée
  (pas de brouillon/prévisualisation avant publication) — le redeploy
  Vercel prend le contenu en compte en moins d'une minute typiquement.
- Le logo et les couleurs de marque ne sont pas éditables depuis le
  dashboard (changement rare, nécessite une intervention technique).
- L'éditeur d'articles de blog utilise du texte brut (un paragraphe par
  bloc séparé par une ligne vide, mise en forme automatique) plutôt qu'un
  éditeur de texte enrichi (gras, liens, etc.), pour rester simple et sans
  dépendance supplémentaire.
