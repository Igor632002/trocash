
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  area text not null check (area in ('Faro','Albufeira','Portimão','Loulé','Lagos','Silves','Tavira','Olhão','Outro Algarve')),
  created_at timestamptz default now()
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  kind text not null check (kind in ('Objeto','Serviço','Horas')),
  area text not null,
  wish text,
  notes text,
  created_at timestamptz default now(),
  status text not null default 'active' check (status in ('active','paused','removed'))
);

create table public.wishes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  example_urls text[],
  notes text,
  created_at timestamptz default now(),
  status text not null default 'active'
);

create table public.exchange_requests (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  proposer_id uuid not null references public.profiles(id) on delete cascade,
  proposal_type text not null check (proposal_type in ('Objeto','Serviço','Horas')),
  proposal_text text,
  notes text,
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled','completed')),
  created_at timestamptz default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  offer_id uuid references public.offers(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.offers enable row level security;
alter table public.wishes enable row level security;
alter table public.exchange_requests enable row level security;
alter table public.reports enable row level security;

create policy "profiles readable" on public.profiles for select to authenticated using (true);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid()=id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid()=id);

create policy "active offers readable" on public.offers for select to authenticated using (status='active' or owner_id=auth.uid());
create policy "own offers insert" on public.offers for insert to authenticated with check (owner_id=auth.uid());
create policy "own offers update" on public.offers for update to authenticated using (owner_id=auth.uid());
create policy "own offers delete" on public.offers for delete to authenticated using (owner_id=auth.uid());

create policy "wishes readable" on public.wishes for select to authenticated using (status='active' or owner_id=auth.uid());
create policy "own wishes insert" on public.wishes for insert to authenticated with check (owner_id=auth.uid());
create policy "own wishes update" on public.wishes for update to authenticated using (owner_id=auth.uid());

create policy "requests participants read" on public.exchange_requests for select to authenticated using (
  proposer_id=auth.uid() or exists(select 1 from public.offers o where o.id=offer_id and o.owner_id=auth.uid())
);
create policy "request proposer insert" on public.exchange_requests for insert to authenticated with check (proposer_id=auth.uid());
create policy "request participants update" on public.exchange_requests for update to authenticated using (
  proposer_id=auth.uid() or exists(select 1 from public.offers o where o.id=offer_id and o.owner_id=auth.uid())
);

create policy "reports create" on public.reports for insert to authenticated with check (reporter_id=auth.uid());
create policy "own reports read" on public.reports for select to authenticated using (reporter_id=auth.uid());
