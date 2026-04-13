-- BelgaumB2B v2 Schema — Run in Supabase SQL Editor

drop table if exists enquiries cascade;
drop table if exists search_logs cascade;
drop table if exists profiles cascade;

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('retailer','wholesaler','admin')) not null default 'retailer',
  business_name text not null,
  category text,
  phone text,
  address text,
  description text,
  city text default 'Belgaum',
  plan text default 'free' check (plan in ('free','pro','premium')),
  created_at timestamptz default now()
);

create table search_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  query text,
  category text,
  role_searched text check (role_searched in ('retailer','wholesaler')),
  created_at timestamptz default now()
);

create table enquiries (
  id uuid default gen_random_uuid() primary key,
  from_id uuid references profiles(id) on delete cascade,
  to_id uuid references profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table search_logs enable row level security;
alter table enquiries enable row level security;

create policy "read_all_profiles" on profiles for select using (true);
create policy "insert_own_profile" on profiles for insert with check (auth.uid() = id);
create policy "update_own_profile" on profiles for update using (auth.uid() = id);

create policy "insert_own_log" on search_logs for insert with check (auth.uid() = user_id);
create policy "read_logs" on search_logs for select using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "insert_own_enquiry" on enquiries for insert with check (auth.uid() = from_id);
create policy "read_own_enquiries" on enquiries for select using (
  auth.uid() = from_id or auth.uid() = to_id or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- AFTER registering, run this to make yourself admin:
-- update profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'your@email.com');
