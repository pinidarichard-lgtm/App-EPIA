# EPIA — Plans d'Unité PD en ligne
### L'École Pilote Innovante Alpha de Lomé, Togo

Application web pour créer et consulter les plans d'unité du **Programme du Diplôme IB** en ligne.

---

## Fonctionnalités

- **Formulaire en 4 étapes** : Infos générales → Phase 1 Recherche → Phase 2 Action → Phase 3 Réflexion
- **Sauvegarde automatique** dans Supabase (brouillon ou publié)
- **Consultation** de tous les plans avec filtres (matière, niveau, groupe)
- **Vue détaillée** de chaque plan d'unité
- **Interface responsive** adaptée desktop et mobile

---

## Déploiement — Guide pas à pas

### Étape 1 : Créer votre base de données Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte gratuit
2. Créez un **nouveau projet** (choisissez un mot de passe fort)
3. Une fois le projet créé, allez dans **SQL Editor** (menu de gauche)
4. Copiez-collez le contenu du fichier `supabase_schema.sql` et cliquez **Run**
5. La table `unit_plans` est maintenant créée

6. Récupérez vos clés dans **Settings → API** :
   - `Project URL` → c'est votre `VITE_SUPABASE_URL`
   - `anon / public` key → c'est votre `VITE_SUPABASE_ANON_KEY`

---

### Étape 2 : Déployer sur Netlify

#### Option A — Déploiement via GitHub (recommandé)

1. Poussez ce projet sur un repo GitHub (public ou privé)
2. Allez sur [netlify.com](https://netlify.com) et connectez votre compte GitHub
3. Cliquez **Add new site → Import an existing project**
4. Sélectionnez votre repo GitHub
5. Configurez le build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
6. Cliquez **Add environment variables** et ajoutez :
   ```
   VITE_SUPABASE_URL = https://VOTRE_ID.supabase.co
   VITE_SUPABASE_ANON_KEY = votre_clé_anon
   ```
7. Cliquez **Deploy site** — Netlify construit et déploie automatiquement

#### Option B — Déploiement manuel (drag & drop)

1. En local, installez les dépendances et construisez :
   ```bash
   # Copiez le fichier d'environnement
   cp .env.example .env.local
   # Éditez .env.local avec vos vraies clés Supabase
   
   npm install
   npm run build
   ```
2. Sur Netlify, allez dans **Sites → Add new site → Deploy manually**
3. Glissez-déposez le dossier `dist/` généré
4. Allez dans **Site settings → Environment variables** et ajoutez les deux variables

---

### Étape 3 : Tester localement (optionnel)

```bash
# 1. Clonez ou copiez le projet
cd epia-unit-planner

# 2. Installez les dépendances
npm install

# 3. Configurez les variables d'environnement
cp .env.example .env.local
# Éditez .env.local avec vos clés Supabase

# 4. Lancez le serveur de développement
npm run dev
# → Ouvrez http://localhost:5173
```

---

## Structure du projet

```
epia-unit-planner/
├── index.html                    # Point d'entrée HTML
├── vite.config.js                # Configuration Vite
├── netlify.toml                  # Config Netlify (routing SPA)
├── package.json
├── .env.example                  # Template variables d'environnement
├── supabase_schema.sql           # Script SQL à exécuter dans Supabase
└── src/
    ├── main.jsx                  # Point d'entrée React
    ├── App.jsx                   # Routage principal
    ├── lib/
    │   ├── supabase.js           # Client Supabase
    │   └── formConfig.js        # Configuration du formulaire (options, état initial)
    ├── components/
    │   ├── Layout.jsx            # En-tête, navigation, pied de page
    │   ├── FormComponents.jsx    # Composants réutilisables du formulaire
    │   └── UnitPlanForm.jsx      # Formulaire principal (4 phases)
    └── pages/
        ├── HomePage.jsx          # Page d'accueil
        ├── PlansListPage.jsx     # Liste de tous les plans
        ├── NewPlanPage.jsx       # Créer un nouveau plan
        ├── EditPlanPage.jsx      # Modifier un plan existant
        └── ViewPlanPage.jsx      # Consulter un plan (lecture seule)
```

---

## Sécurité — À adapter selon vos besoins

Par défaut, le schéma SQL configure un **accès public** (lecture et écriture sans authentification). C'est pratique pour démarrer, mais pour une école vous voudrez peut-être :

- **Ajouter l'authentification Supabase** pour que seuls les enseignants connectés puissent créer/modifier des plans
- **Restreindre les politiques RLS** pour que chaque enseignant ne voit que ses propres plans
- **Rendre la lecture publique** mais l'écriture réservée aux comptes authentifiés

Consultez la [documentation Supabase Auth](https://supabase.com/docs/guides/auth) pour mettre en place l'authentification.

---

## Technologies utilisées

- **React 18** + **React Router 6** — Interface utilisateur
- **Vite 5** — Build tool rapide
- **Supabase** — Base de données PostgreSQL + API REST automatique
- **Netlify** — Hébergement et déploiement continu

---

*EPIA — École Pilote Innovante Alpha · Lomé, Togo*
