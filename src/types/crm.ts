export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'other';

export interface Lead {
  id: string;
  created_at: string;
  updated_at?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company: string;
  title?: string;
  status: LeadStatus;
  source: LeadSource;
  score: number; // 0 - 100
  estimated_value: number;
  notes?: string;
  assigned_to?: string;
}

export type CompanyTier = 'Enterprise' | 'Mid-Market' | 'SMB' | 'Startup';
export type CompanyStatus = 'active' | 'prospect' | 'churned';

export interface Company {
  id: string;
  created_at: string;
  name: string;
  domain?: string;
  industry: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  tier: CompanyTier;
  annual_revenue: number;
  phone?: string;
  city?: string;
  country?: string;
  status: CompanyStatus;
  contact_count?: number;
  deal_count?: number;
}

export interface Contact {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  title: string;
  company_id: string;
  company_name?: string;
  is_primary?: boolean;
  status: 'active' | 'inactive';
  last_contacted_at?: string;
}

export type DealStage = 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: string;
  created_at: string;
  title: string;
  amount: number;
  stage: DealStage;
  probability: number; // 0 - 100
  expected_close_date: string;
  company_id: string;
  company_name?: string;
  contact_id?: string;
  contact_name?: string;
  assigned_to?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  related_to_type?: 'lead' | 'deal' | 'company' | 'contact';
  related_to_id?: string;
  related_to_title?: string;
  assigned_to?: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'deal_stage_changed' | 'lead_converted';

export interface Activity {
  id: string;
  created_at: string;
  type: ActivityType;
  title: string;
  description?: string;
  user_name: string;
  entity_type?: 'lead' | 'deal' | 'company' | 'contact';
  entity_id?: string;
}

export interface DashboardMetrics {
  total_revenue: number;
  pipeline_value: number;
  active_deals_count: number;
  win_rate: number;
  active_leads_count: number;
  pending_tasks_count: number;
  deals_by_stage: Record<DealStage, { count: number; total_amount: number }>;
  monthly_revenue_history: { month: string; won: number; pipeline: number }[];
  recent_activities: Activity[];
}
