-- ==============================================================================
-- TrendLoom Studios CRM Workspace - Supabase Database Schema
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'sales_rep');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'lost');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_source AS ENUM ('website', 'referral', 'linkedin', 'cold_outreach', 'conference', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE company_tier AS ENUM ('Enterprise', 'Mid-Market', 'SMB', 'Startup');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE deal_stage AS ENUM ('discovery', 'proposal', 'negotiation', 'won', 'lost');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_type AS ENUM ('call', 'email', 'meeting', 'note', 'deal_stage_changed', 'lead_converted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'sales_rep',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT,
    industry TEXT NOT NULL DEFAULT 'Technology',
    size TEXT DEFAULT '11-50',
    tier company_tier DEFAULT 'SMB',
    annual_revenue NUMERIC(14,2) DEFAULT 0,
    phone TEXT,
    city TEXT,
    country TEXT,
    status TEXT DEFAULT 'prospect',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    title TEXT NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    last_contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT NOT NULL,
    title TEXT,
    status lead_status DEFAULT 'new',
    source lead_source DEFAULT 'website',
    score INT DEFAULT 50 CHECK (score >= 0 AND score <= 100),
    estimated_value NUMERIC(12,2) DEFAULT 0,
    notes TEXT,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 7. Deals Table
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    stage deal_stage DEFAULT 'discovery',
    probability INT DEFAULT 20 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'pending',
    related_to_type TEXT,
    related_to_id UUID,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 9. Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type activity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    user_name TEXT NOT NULL DEFAULT 'System',
    entity_type TEXT,
    entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 11. Create Permissive Policies for Authenticated Team Members
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated read on profiles" ON public.profiles;
    CREATE POLICY "Allow authenticated read on profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow user to update own profile" ON public.profiles;
    CREATE POLICY "Allow user to update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated access to companies" ON public.companies;
    CREATE POLICY "Allow authenticated access to companies" ON public.companies FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated access to contacts" ON public.contacts;
    CREATE POLICY "Allow authenticated access to contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated access to leads" ON public.leads;
    CREATE POLICY "Allow authenticated access to leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated access to deals" ON public.deals;
    CREATE POLICY "Allow authenticated access to deals" ON public.deals FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated access to tasks" ON public.tasks;
    CREATE POLICY "Allow authenticated access to tasks" ON public.tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated access to activities" ON public.activities;
    CREATE POLICY "Allow authenticated access to activities" ON public.activities FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN others THEN null; END $$;

-- Also allow anon access for demo if needed
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow anon read companies" ON public.companies;
    CREATE POLICY "Allow anon read companies" ON public.companies FOR SELECT TO anon USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow anon read contacts" ON public.contacts;
    CREATE POLICY "Allow anon read contacts" ON public.contacts FOR SELECT TO anon USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow anon read leads" ON public.leads;
    CREATE POLICY "Allow anon read leads" ON public.leads FOR SELECT TO anon USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow anon read deals" ON public.deals;
    CREATE POLICY "Allow anon read deals" ON public.deals FOR SELECT TO anon USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow anon read tasks" ON public.tasks;
    CREATE POLICY "Allow anon read tasks" ON public.tasks FOR SELECT TO anon USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow anon read activities" ON public.activities;
    CREATE POLICY "Allow anon read activities" ON public.activities FOR SELECT TO anon USING (true);
EXCEPTION WHEN others THEN null; END $$;

-- 12. Trigger to automatically create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        'sales_rep'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
