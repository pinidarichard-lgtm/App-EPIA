-- ============================================================
-- NOUVELLES TABLES — Cahier de textes + Listes élèves + Appels
-- Exécutez dans SQL Editor de Supabase
-- ============================================================

-- Table élèves
create table if not exists eleves (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  nom text not null,
  prenom text not null,
  annee_pd text not null,       -- 'D1' ou 'D2'
  annee_scolaire text default '2025-2026',
  actif boolean default true
);

-- Table cahier de textes
create table if not exists cahier_textes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  date_cours date not null,
  matiere text not null,
  enseignant text,
  annee_pd text,                -- 'D1', 'D2', ou 'D1/D2'
  niveau text,                  -- 'NM', 'NS', 'NM/NS'
  contenu text,
  devoirs text,
  observations text,
  annee_scolaire text default '2025-2026'
);

-- Table appels (feuilles de présence)
create table if not exists appels (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  date_appel date not null,
  matiere text not null,
  enseignant text,
  annee_pd text not null,
  annee_scolaire text default '2025-2026',
  presences jsonb default '{}'
);

-- Trigger updated_at
create or replace function update_cahier_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists set_updated_at_cahier on cahier_textes;
create trigger set_updated_at_cahier
  before update on cahier_textes
  for each row execute function update_cahier_updated_at();

-- RLS (accès public)
alter table eleves enable row level security;
alter table cahier_textes enable row level security;
alter table appels enable row level security;

drop policy if exists "Public eleves" on eleves;
drop policy if exists "Public cahier" on cahier_textes;
drop policy if exists "Public appels" on appels;

create policy "Public eleves" on eleves for all using (true) with check (true);
create policy "Public cahier" on cahier_textes for all using (true) with check (true);
create policy "Public appels" on appels for all using (true) with check (true);
