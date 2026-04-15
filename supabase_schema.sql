-- ============================================================
-- BelgaumB2B v3 — Supabase Schema
-- Run this in Supabase SQL Editor (safe to re-run)
-- ============================================================

-- Clean slate
drop table if exists enquiries cascade;
drop table if exists search_logs cascade;
drop table if exists profiles cascade;

-- PROFILES (includes phone + description)
create table profiles (
  id          uuid references auth.users on delete cascade primary key,
  role        text not null default 'retailer'
              check (role in ('retailer','wholesaler','admin')),
  business_name text not null,
  category    text,
  phone       text,
  address     text,
  description text,
  city        text default 'Belgaum',
  plan        text default 'free'
              check (plan in ('free','pro','premium')),
  created_at  timestamptz default now()
);

-- SEARCH LOGS
create table search_logs (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references profiles(id) on delete cascade,
  query        text,
  category     text,
  role_searched text check (role_searched in ('retailer','wholesaler')),
  created_at   timestamptz default now()
);

-- ENQUIRIES
create table enquiries (
  id         uuid default gen_random_uuid() primary key,
  from_id    uuid references profiles(id) on delete cascade,
  to_id      uuid references profiles(id) on delete cascade,
  message    text not null,
  created_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
alter table profiles    enable row level security;
alter table search_logs enable row level security;
alter table enquiries   enable row level security;

-- Profiles: anyone can read, only owner can write
create policy "profiles_read_all"   on profiles for select using (true);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Search logs: own insert; self + admin can read
create policy "logs_insert_own" on search_logs for insert with check (auth.uid() = user_id);
create policy "logs_read"       on search_logs for select using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Enquiries: own insert; involved parties + admin can read
create policy "enq_insert_own" on enquiries for insert with check (auth.uid() = from_id);
create policy "enq_read"       on enquiries for select using (
  auth.uid() = from_id or auth.uid() = to_id or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ── AFTER DEPLOYING ─────────────────────────────────────────
-- 1. Supabase → Authentication → Settings → DISABLE "Enable email confirmations"
-- 2. Register on the site with your email
-- 3. Run this to make yourself admin (replace email):
--
-- update profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'your@email.com');
-- ────────────────────────────────────────────────────────────
