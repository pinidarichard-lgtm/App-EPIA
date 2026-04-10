-- ============================================================
-- EPIA — Schéma Supabase pour les Plans d'Unité PD
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase
-- ============================================================

create table if not exists unit_plans (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Informations générales
  matiere text,
  enseignants text,
  annee_scolaire text,
  dates text,
  groupe_matieres text,
  niveau text,        -- 'NM' ou 'NS'
  annee_pd text,      -- '1' ou '2'
  semestre text,      -- '1' ou '2'

  -- Phase 1 — Recherche
  partie_cours text,
  description_unite text,
  evaluations jsonb default '[]',

  -- Objectifs de transfert
  objectif_1 text,
  objectif_2 text,
  objectif_3 text,

  -- Compréhensions essentielles
  connaissance_4 text,
  connaissance_5 text,
  competence_6 text,
  competence_7 text,
  concept_8 text,
  concept_9 text,

  -- Questions de recherche
  question_factuelle_10 text,
  question_factuelle_11 text,
  question_conceptuelle_12 text,
  question_conceptuelle_13 text,
  question_ouverte_14 text,
  question_ouverte_15 text,

  -- Phase 2 — Action
  approches_pedagogiques jsonb default '[]',
  evaluation_formative_18 text,
  evaluation_formative_19 text,
  evaluation_sommative_20 text,
  evaluation_sommative_21 text,
  differentiation jsonb default '[]',
  differentiation_details text,
  ada_competences jsonb default '[]',
  ada_details text,
  langue_apprentissage jsonb default '{}',
  langue_details text,
  tdc jsonb default '{}',
  tdc_details text,
  cas jsonb default '{}',
  cas_details text,
  ressource_22 text,
  ressource_23 text,

  -- Phase 3 — Réflexion
  ce_qui_a_bien_fonctionne text,
  ce_qui_na_pas_bien_fonctionne text,
  remarques_suggestions text,
  reflexion_transfert text,

  -- Métadonnées
  statut text default 'brouillon'  -- 'brouillon' ou 'publié'
);

-- Index pour les recherches fréquentes
create index if not exists idx_unit_plans_matiere on unit_plans(matiere);
create index if not exists idx_unit_plans_annee on unit_plans(annee_scolaire);
create index if not exists idx_unit_plans_statut on unit_plans(statut);

-- Trigger pour mettre à jour updated_at automatiquement
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on unit_plans;
create trigger set_updated_at
  before update on unit_plans
  for each row execute function update_updated_at();

-- Politique RLS (Row Level Security) — accès public en lecture/écriture
-- À adapter selon vos besoins d'authentification
alter table unit_plans enable row level security;

create policy "Lecture publique" on unit_plans
  for select using (true);

create policy "Insertion publique" on unit_plans
  for insert with check (true);

create policy "Mise à jour publique" on unit_plans
  for update using (true);

create policy "Suppression publique" on unit_plans
  for delete using (true);
