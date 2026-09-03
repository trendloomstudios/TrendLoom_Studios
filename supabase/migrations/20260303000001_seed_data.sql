-- ==============================================================================
-- CEDO CRM - Seed Data for Supabase PostgreSQL Database
-- ==============================================================================

-- 1. Insert Companies
INSERT INTO public.companies (id, name, domain, industry, size, tier, annual_revenue, phone, city, country, status)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Apex Global Cloud', 'apexcloud.io', 'Enterprise SaaS', '500+', 'Enterprise', 45000000, '+1 (555) 234-5678', 'San Francisco', 'USA', 'active'),
  ('c1000000-0000-0000-0000-000000000002', 'FinPulse Analytics', 'finpulse.ai', 'Financial Technology', '51-200', 'Mid-Market', 12500000, '+1 (555) 345-6789', 'New York', 'USA', 'active'),
  ('c1000000-0000-0000-0000-000000000003', 'Novus Health Systems', 'novushealth.org', 'Healthcare / MedTech', '201-500', 'Enterprise', 28000000, '+1 (555) 456-7890', 'Boston', 'USA', 'active'),
  ('c1000000-0000-0000-0000-000000000004', 'Vanguard Robotics', 'vanguardrobotics.com', 'Industrial Automation', '51-200', 'Mid-Market', 8500000, '+1 (555) 567-8901', 'Austin', 'USA', 'prospect'),
  ('c1000000-0000-0000-0000-000000000005', 'Starlight Cyber', 'starlightcyber.security', 'Cybersecurity', '11-50', 'Startup', 3200000, '+1 (555) 678-9012', 'Seattle', 'USA', 'prospect')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Contacts
INSERT INTO public.contacts (id, first_name, last_name, email, phone, title, company_id, is_primary, status)
VALUES
  ('c2000000-0000-0000-0000-000000000001', 'Sarah', 'Chen', 'schen@apexcloud.io', '+1 (555) 234-5679', 'VP of Engineering', 'c1000000-0000-0000-0000-000000000001', true, 'active'),
  ('c2000000-0000-0000-0000-000000000002', 'David', 'Kowalski', 'dkowalski@apexcloud.io', '+1 (555) 234-5680', 'Director of Cloud Ops', 'c1000000-0000-0000-0000-000000000001', false, 'active'),
  ('c2000000-0000-0000-0000-000000000003', 'Elena', 'Rostova', 'elena@finpulse.ai', '+1 (555) 345-6790', 'Chief Risk Officer', 'c1000000-0000-0000-0000-000000000002', true, 'active'),
  ('c2000000-0000-0000-0000-000000000004', 'Marcus', 'Brody', 'mbrody@novushealth.org', '+1 (555) 456-7891', 'Head of Clinical IT', 'c1000000-0000-0000-0000-000000000003', true, 'active'),
  ('c2000000-0000-0000-0000-000000000005', 'Rachel', 'Kim', 'rkim@vanguardrobotics.com', '+1 (555) 567-8902', 'VP Supply Chain', 'c1000000-0000-0000-0000-000000000004', true, 'active')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Deals
INSERT INTO public.deals (id, title, amount, stage, probability, expected_close_date, company_id, contact_id)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Apex Cloud Global License Expansion', 420000, 'negotiation', 85, '2026-03-31', 'c1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000002', 'FinPulse Compliance Engine Rollout', 185000, 'proposal', 60, '2026-04-15', 'c1000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000003'),
  ('d1000000-0000-0000-0000-000000000003', 'Novus Health Multi-Hospital Integration', 650000, 'discovery', 30, '2026-05-30', 'c1000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000004'),
  ('d1000000-0000-0000-0000-000000000004', 'Vanguard Robotics Edge Intelligence Suite', 95000, 'won', 100, '2026-02-28', 'c1000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000005'),
  ('d1000000-0000-0000-0000-000000000005', 'Starlight Cyber SOC Platform Pilot', 45000, 'discovery', 25, '2026-04-20', 'c1000000-0000-0000-0000-000000000005', null)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Leads
INSERT INTO public.leads (id, first_name, last_name, email, phone, company, title, status, source, score, estimated_value, notes)
VALUES
  ('e1000000-0000-0000-0000-000000000001', 'Jonathan', 'Hayes', 'j.hayes@quantumlogix.io', '+1 (555) 789-0123', 'QuantumLogix', 'Chief Technology Officer', 'qualified', 'website', 92, 120000, 'Looking for replacement CRM with high customization and Supabase backend.'),
  ('e1000000-0000-0000-0000-000000000002', 'Aisha', 'Patel', 'aisha.p@zenithenergy.co', '+1 (555) 890-1234', 'Zenith Renewable Energy', 'Head of Business Development', 'contacted', 'linkedin', 78, 85000, 'Met at CleanTech Summit 2026. Requested demo for 25 sales reps.'),
  ('e1000000-0000-0000-0000-000000000003', 'Liam', 'O''Connor', 'liam@auroraaerospace.com', '+1 (555) 901-2345', 'Aurora Aerospace', 'VP Procurement', 'new', 'referral', 64, 250000, 'Inbound referral from Apex Global team.'),
  ('e1000000-0000-0000-0000-000000000004', 'Camila', 'Morales', 'cmorales@solarisbio.com', '+1 (555) 012-3456', 'Solaris BioPharm', 'Director of Clinical Ops', 'contacted', 'conference', 81, 175000, 'Reviewing compliance & HIPAA requirements for enterprise tier.')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Tasks
INSERT INTO public.tasks (id, title, description, due_date, priority, status, related_to_type, related_to_id)
VALUES
  ('f1000000-0000-0000-0000-000000000001', 'Finalize Apex Cloud MSA Redlines', 'Review legal revisions with General Counsel and prepare countersignature package.', NOW() + INTERVAL '2 days', 'urgent', 'pending', 'deal', 'd1000000-0000-0000-0000-000000000001'),
  ('f1000000-0000-0000-0000-000000000002', 'Prepare FinPulse Executive Pitch Deck', 'Tailor slides with ROI calculations and customer references.', NOW() + INTERVAL '4 days', 'high', 'in_progress', 'deal', 'd1000000-0000-0000-0000-000000000002'),
  ('f1000000-0000-0000-0000-000000000003', 'Novus Health Technical Architecture Call', 'Join solutions architect on technical deep dive call.', NOW() + INTERVAL '6 days', 'medium', 'pending', 'company', 'c1000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Activities
INSERT INTO public.activities (id, type, title, description, user_name, entity_type, entity_id, created_at)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'meeting', 'Product Demo with QuantumLogix CTO', 'Demonstrated pipeline automation and analytics. Great positive feedback.', 'Alex Morgan', 'lead', 'e1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 hours'),
  ('a1000000-0000-0000-0000-000000000002', 'deal_stage_changed', 'Apex Cloud deal moved to Negotiation', 'Advanced from Proposal ($420,000 ARR). Probability increased to 85%.', 'Jordan Lee', 'deal', 'd1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 hours'),
  ('a1000000-0000-0000-0000-000000000003', 'call', 'Follow-up Call with Elena Rostova (FinPulse)', 'Discussed pricing tiers and SOC2 compliance timeline.', 'Alex Morgan', 'contact', 'c2000000-0000-0000-0000-000000000003', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
