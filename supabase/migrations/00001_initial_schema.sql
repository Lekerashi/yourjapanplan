-- ============================================================
-- Your Japan Plan — Initial Database Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- Enums
-- ============================================================

create type region as enum (
  'hokkaido', 'tohoku', 'kanto', 'chubu', 'kansai',
  'chugoku', 'shikoku', 'kyushu', 'okinawa'
);

create type activity_type as enum (
  'sight', 'food', 'experience', 'shopping', 'nightlife', 'nature'
);

create type travel_style as enum (
  'solo', 'couple', 'friends', 'family', 'workcation'
);

create type itinerary_status as enum ('draft', 'published');

-- ============================================================
-- Profiles (extends Supabase auth.users)
-- ============================================================

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Destinations (curated)
-- ============================================================

create table destinations (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  region region not null,
  description text not null,
  highlights text[] default '{}',
  best_seasons text[] default '{}',
  crowd_level_by_month jsonb default '{}',
  tags text[] default '{}',
  image_url text default '',
  lat double precision not null,
  lng double precision not null,
  jr_accessible boolean default true,
  reservation_tips text default '',
  accommodation_zones jsonb default '[]',
  created_at timestamptz default now() not null
);

create index idx_destinations_region on destinations(region);
create index idx_destinations_tags on destinations using gin(tags);

-- ============================================================
-- Activities (curated, tied to destinations)
-- ============================================================

create table activities (
  id uuid primary key default uuid_generate_v4(),
  destination_id uuid not null references destinations on delete cascade,
  name text not null,
  description text not null,
  type activity_type not null,
  duration_minutes int default 60,
  cost_estimate text default '',
  reservation_required boolean default false,
  reservation_url text,
  best_time_of_day text,
  seasonal_availability text[] default '{}',
  tags text[] default '{}',
  image_url text default '',
  address text default '',
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz default now() not null
);

create index idx_activities_destination on activities(destination_id);
create index idx_activities_type on activities(type);

-- ============================================================
-- Itineraries
-- ============================================================

create table itineraries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles on delete set null,
  title text not null,
  status itinerary_status default 'draft',
  start_date date,
  end_date date,
  travel_style travel_style default 'solo',
  num_travelers int default 1,
  total_budget_estimate text,
  jr_pass_recommended boolean,
  jr_pass_reasoning text,
  share_token uuid unique default uuid_generate_v4(),
  is_public boolean default false,
  preferences_snapshot jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_itineraries_user on itineraries(user_id);
create index idx_itineraries_share_token on itineraries(share_token);

-- ============================================================
-- Itinerary Days
-- ============================================================

create table itinerary_days (
  id uuid primary key default uuid_generate_v4(),
  itinerary_id uuid not null references itineraries on delete cascade,
  day_number int not null,
  date date,
  destination_id uuid references destinations,
  notes text,
  accommodation_suggestion jsonb,
  constraint unique_day_per_itinerary unique (itinerary_id, day_number)
);

create index idx_itinerary_days_itinerary on itinerary_days(itinerary_id);

-- ============================================================
-- Itinerary Activities
-- ============================================================

create table itinerary_activities (
  id uuid primary key default uuid_generate_v4(),
  day_id uuid not null references itinerary_days on delete cascade,
  activity_id uuid references activities,
  time_slot text default '',
  custom_name text,
  custom_description text,
  order_index int default 0,
  notes text
);

create index idx_itinerary_activities_day on itinerary_activities(day_id);

-- ============================================================
-- Quiz Responses (for analytics and re-generation)
-- ============================================================

create table quiz_responses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles on delete set null,
  responses jsonb not null,
  created_at timestamptz default now() not null
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles enable row level security;
alter table destinations enable row level security;
alter table activities enable row level security;
alter table itineraries enable row level security;
alter table itinerary_days enable row level security;
alter table itinerary_activities enable row level security;
alter table quiz_responses enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Destinations & Activities: public read
create policy "Destinations are publicly readable"
  on destinations for select using (true);
create policy "Activities are publicly readable"
  on activities for select using (true);

-- Itineraries: owner full access, public read for shared
create policy "Users can manage own itineraries"
  on itineraries for all using (auth.uid() = user_id);
create policy "Public itineraries are readable"
  on itineraries for select using (is_public = true);

-- Itinerary days: same as parent itinerary
create policy "Users can manage own itinerary days"
  on itinerary_days for all
  using (itinerary_id in (select id from itineraries where user_id = auth.uid()));
create policy "Public itinerary days are readable"
  on itinerary_days for select
  using (itinerary_id in (select id from itineraries where is_public = true));

-- Itinerary activities: same as parent
create policy "Users can manage own itinerary activities"
  on itinerary_activities for all
  using (day_id in (
    select id.id from itinerary_days id
    join itineraries i on i.id = id.itinerary_id
    where i.user_id = auth.uid()
  ));
create policy "Public itinerary activities are readable"
  on itinerary_activities for select
  using (day_id in (
    select id.id from itinerary_days id
    join itineraries i on i.id = id.itinerary_id
    where i.is_public = true
  ));

-- Quiz responses: owner only
create policy "Users can manage own quiz responses"
  on quiz_responses for all using (auth.uid() = user_id);
-- Allow anonymous inserts (user_id can be null)
create policy "Anyone can insert quiz responses"
  on quiz_responses for insert with check (true);

-- ============================================================
-- Updated_at trigger
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger itineraries_updated_at
  before update on itineraries
  for each row execute function update_updated_at();
