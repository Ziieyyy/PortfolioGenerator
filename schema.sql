-- Enable UUID generation extension
create extension if not exists "uuid-ossp";

-- ====================================================================
-- 1. USERS TABLE (Mirrors auth.users)
-- ====================================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 2. PROFILES TABLE
-- ====================================================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  full_name text not null,
  title text,
  bio text,
  email text,
  phone text,
  location text,
  profile_image_url text,
  website text,
  university text,
  degree text,
  graduation_year text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 3. PROJECTS TABLE
-- ====================================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  thumbnail_url text,
  project_url text,
  github_url text,
  featured boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 4. EXPERIENCE TABLE
-- ====================================================================
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  position text not null,
  start_date text,
  end_date text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 5. EDUCATION TABLE
-- ====================================================================
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution text not null,
  program text not null,
  graduation_year text,
  cgpa text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 6. SKILLS TABLE
-- ====================================================================
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  level text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 7. CERTIFICATIONS TABLE
-- ====================================================================
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  issuer text not null,
  issue_date text,
  certificate_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 8. ACHIEVEMENTS TABLE
-- ====================================================================
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  award_date text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 9. SOCIAL LINKS TABLE
-- ====================================================================
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_url_validity check (url ~* '^https?://[^\s/$.?#].[^\s]*$')
);

-- ====================================================================
-- 10. PORTFOLIO SETTINGS TABLE
-- ====================================================================
create table if not exists public.portfolio_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  template text default 'minimal' not null,
  theme text default 'minimal' not null,
  custom_domain text,
  is_public boolean default false not null,
  slug text unique not null,
  seo_title text,
  seo_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 11. SUBSCRIPTIONS TABLE
-- ====================================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  plan text default 'Free' not null,
  status text default 'active' not null,
  renewal_date timestamp with time zone,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 12. PAYMENTS TABLE
-- ====================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  currency text default 'USD' not null,
  payment_status text not null,
  invoice_url text,
  payment_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 13. ANALYTICS TABLE
-- ====================================================================
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolio_settings(id) on delete cascade,
  visitor_ip_hash text not null,
  country text,
  device_type text,
  referrer text,
  visited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 14. NOTIFICATIONS TABLE
-- ====================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text default 'info' not null,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 15. AUDIT LOG TABLE
-- ====================================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) ENABLEMENT
-- ====================================================================
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.achievements enable row level security;
alter table public.social_links enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.analytics enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- ====================================================================
-- RLS POLICIES
-- ====================================================================

-- Drop existing policies to prevent "already exists" errors when re-running schema.sql
drop policy if exists "Users can perform all operations on their own user row" on public.users;
drop policy if exists "Users can perform CRUD on their own profile" on public.profiles;
drop policy if exists "Anyone can select profiles if portfolio is public" on public.profiles;
drop policy if exists "Users can perform CRUD on their own projects" on public.projects;
drop policy if exists "Anyone can select projects if portfolio is public" on public.projects;
drop policy if exists "Users can perform CRUD on their own experience" on public.experience;
drop policy if exists "Anyone can select experience if portfolio is public" on public.experience;
drop policy if exists "Users can perform CRUD on their own education" on public.education;
drop policy if exists "Anyone can select education if portfolio is public" on public.education;
drop policy if exists "Users can perform CRUD on their own skills" on public.skills;
drop policy if exists "Anyone can select skills if portfolio is public" on public.skills;
drop policy if exists "Users can perform CRUD on their own certifications" on public.certifications;
drop policy if exists "Anyone can select certifications if portfolio is public" on public.certifications;
drop policy if exists "Users can perform CRUD on their own achievements" on public.achievements;
drop policy if exists "Anyone can select achievements if portfolio is public" on public.achievements;
drop policy if exists "Users can perform CRUD on their own social links" on public.social_links;
drop policy if exists "Anyone can select social links if portfolio is public" on public.social_links;
drop policy if exists "Users can perform CRUD on their own portfolio settings" on public.portfolio_settings;
drop policy if exists "Anyone can select portfolio settings if public" on public.portfolio_settings;
drop policy if exists "Users can select their own subscriptions" on public.subscriptions;
drop policy if exists "Users can update their own subscriptions" on public.subscriptions;
drop policy if exists "Users can select their own payments" on public.payments;
drop policy if exists "Users can select their own portfolio analytics" on public.analytics;
drop policy if exists "Anyone can insert analytics rows (asynchronously)" on public.analytics;
drop policy if exists "Users can perform CRUD on their own notifications" on public.notifications;
drop policy if exists "Users can select their own audit logs" on public.audit_logs;
drop policy if exists "Anyone can insert audit logs" on public.audit_logs;

-- Users Policies
create policy "Users can perform all operations on their own user row"
  on public.users for all using (auth.uid() = id);

-- Profiles Policies
create policy "Users can perform CRUD on their own profile"
  on public.profiles for all using (auth.uid() = user_id);
create policy "Anyone can select profiles if portfolio is public"
  on public.profiles for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.user_id = profiles.user_id and portfolio_settings.is_public = true
    )
  );

-- Projects Policies
create policy "Users can perform CRUD on their own projects"
  on public.projects for all using (auth.uid() = user_id);
create policy "Anyone can select projects if portfolio is public"
  on public.projects for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.user_id = projects.user_id and portfolio_settings.is_public = true
    )
  );

-- Experience Policies
create policy "Users can perform CRUD on their own experience"
  on public.experience for all using (auth.uid() = user_id);
create policy "Anyone can select experience if portfolio is public"
  on public.experience for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.user_id = experience.user_id and portfolio_settings.is_public = true
    )
  );

-- Education Policies
create policy "Users can perform CRUD on their own education"
  on public.education for all using (auth.uid() = user_id);
create policy "Anyone can select education if portfolio is public"
  on public.education for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.user_id = education.user_id and portfolio_settings.is_public = true
    )
  );

-- Skills Policies
create policy "Users can perform CRUD on their own skills"
  on public.skills for all using (auth.uid() = user_id);
create policy "Anyone can select skills if portfolio is public"
  on public.skills for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.user_id = skills.user_id and portfolio_settings.is_public = true
    )
  );

-- Certifications Policies
create policy "Users can perform CRUD on their own certifications"
  on public.certifications for all using (auth.uid() = user_id);
create policy "Anyone can select certifications if portfolio is public"
  on public.certifications for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.user_id = certifications.user_id and portfolio_settings.is_public = true
    )
  );

-- Achievements Policies
create policy "Users can perform CRUD on their own achievements"
  on public.achievements for all using (auth.uid() = user_id);
create policy "Anyone can select achievements if portfolio is public"
  on public.achievements for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.user_id = achievements.user_id and portfolio_settings.is_public = true
    )
  );

-- Social Links Policies
create policy "Users can perform CRUD on their own social links"
  on public.social_links for all using (auth.uid() = user_id);
create policy "Anyone can select social links if portfolio is public"
  on public.social_links for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.user_id = social_links.user_id and portfolio_settings.is_public = true
    )
  );

-- Portfolio Settings Policies
create policy "Users can perform CRUD on their own portfolio settings"
  on public.portfolio_settings for all using (auth.uid() = user_id);
create policy "Anyone can select portfolio settings if public"
  on public.portfolio_settings for select using (is_public = true);

-- Subscriptions Policies
create policy "Users can select their own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can update their own subscriptions"
  on public.subscriptions for update using (auth.uid() = user_id);

-- Payments Policies
create policy "Users can select their own payments"
  on public.payments for select using (auth.uid() = user_id);

-- Analytics Policies
create policy "Users can select their own portfolio analytics"
  on public.analytics for select using (
    exists (
      select 1 from public.portfolio_settings
      where portfolio_settings.id = analytics.portfolio_id and portfolio_settings.user_id = auth.uid()
    )
  );
create policy "Anyone can insert analytics rows (asynchronously)"
  on public.analytics for insert with check (true);

-- Notifications Policies
create policy "Users can perform CRUD on their own notifications"
  on public.notifications for all using (auth.uid() = user_id);

-- Audit Logs Policies
create policy "Users can select their own audit logs"
  on public.audit_logs for select using (auth.uid() = user_id);
create policy "Anyone can insert audit logs"
  on public.audit_logs for insert with check (true);

-- ====================================================================
-- AUTOMATIC USER REGISTER TRIGGER & HANDLER
-- ====================================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  clean_slug text;
begin
  -- Generate unique clean slug based on email prefix and first 4 characters of UUID
  clean_slug := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]', '', 'g')) || '-' || substring(new.id::text, 1, 4);

  -- Insert into public.users
  insert into public.users (id, email)
  values (new.id, new.email);

  -- Insert into public.profiles
  insert into public.profiles (user_id, full_name, email, university, degree, graduation_year)
  values (new.id, split_part(new.email, '@', 1), new.email, '', '', '');

  -- Insert into public.portfolio_settings
  insert into public.portfolio_settings (user_id, slug, is_public, template, theme)
  values (new.id, clean_slug, false, 'minimal', 'minimal');

  -- Insert into public.subscriptions
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'Free', 'active');

  -- Insert into public.audit_logs
  insert into public.audit_logs (user_id, action, details)
  values (new.id, 'Login Activity', jsonb_build_object('event', 'Registration & Onboarding Initialized'));

  return new;
exception
  when others then
    return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ====================================================================
-- 15. STORAGE BUCKETS SETUP
-- ====================================================================
-- Enable storage if not already enabled, and create buckets
insert into storage.buckets (id, name, public)
values ('public-portfolio', 'public-portfolio', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('private-portfolio', 'private-portfolio', false)
on conflict (id) do nothing;


-- Drop existing policies if they exist to avoid conflict
drop policy if exists "Public Access to public-portfolio" on storage.objects;
drop policy if exists "Authenticated Users Can Insert to public-portfolio" on storage.objects;
drop policy if exists "Users Can Update Own public-portfolio Objects" on storage.objects;
drop policy if exists "Users Can Delete Own public-portfolio Objects" on storage.objects;

drop policy if exists "Authenticated Users Can Select from private-portfolio" on storage.objects;
drop policy if exists "Authenticated Users Can Insert to private-portfolio" on storage.objects;
drop policy if exists "Users Can Update Own private-portfolio Objects" on storage.objects;
drop policy if exists "Users Can Delete Own private-portfolio Objects" on storage.objects;

-- Create policies for public-portfolio
create policy "Public Access to public-portfolio"
  on storage.objects for select
  using (bucket_id = 'public-portfolio');

create policy "Authenticated Users Can Insert to public-portfolio"
  on storage.objects for insert
  with check (bucket_id = 'public-portfolio' and auth.role() = 'authenticated');

create policy "Users Can Update Own public-portfolio Objects"
  on storage.objects for update
  using (bucket_id = 'public-portfolio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users Can Delete Own public-portfolio Objects"
  on storage.objects for delete
  using (bucket_id = 'public-portfolio' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for private-portfolio
create policy "Authenticated Users Can Select from private-portfolio"
  on storage.objects for select
  using (bucket_id = 'private-portfolio' and auth.role() = 'authenticated');

create policy "Authenticated Users Can Insert to private-portfolio"
  on storage.objects for insert
  with check (bucket_id = 'private-portfolio' and auth.role() = 'authenticated');

create policy "Users Can Update Own private-portfolio Objects"
  on storage.objects for update
  using (bucket_id = 'private-portfolio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users Can Delete Own private-portfolio Objects"
  on storage.objects for delete
  using (bucket_id = 'private-portfolio' and auth.uid()::text = (storage.foldername(name))[1]);
