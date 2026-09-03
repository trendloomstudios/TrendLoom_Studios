-- ==============================================================================
-- Reset Entire Database to Fresh Empty State
-- ==============================================================================

TRUNCATE TABLE public.activities CASCADE;
TRUNCATE TABLE public.tasks CASCADE;
TRUNCATE TABLE public.deals CASCADE;
TRUNCATE TABLE public.leads CASCADE;
TRUNCATE TABLE public.contacts CASCADE;
TRUNCATE TABLE public.companies CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- Delete all users in auth schema to allow clean initial registration
DO $$ BEGIN
    DELETE FROM auth.users;
EXCEPTION WHEN others THEN null; END $$;
