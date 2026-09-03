import { createClient as createServerClient } from "@/lib/supabase/server";
import {
  mockCompanies,
  mockContacts,
  mockDeals,
  mockLeads,
  mockTasks,
  mockActivities,
  mockDashboardMetrics,
} from "./mock-data";
import { Lead, Deal, Contact, Company, Task, Activity, DashboardMetrics } from "@/types/crm";

import { isSupabaseConfigured } from "./supabase/config";
export { isSupabaseConfigured };

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (!isSupabaseConfigured()) {
    return mockDashboardMetrics;
  }

  try {
    const supabase = await createServerClient();
    const [{ count: leadCount }, { count: dealCount }, { data: deals }, { count: taskCount }] =
      await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("deals").select("*", { count: "exact", head: true }),
        supabase.from("deals").select("stage, amount"),
        supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);

    const dealsByStage = {
      discovery: { count: 0, total_amount: 0 },
      proposal: { count: 0, total_amount: 0 },
      negotiation: { count: 0, total_amount: 0 },
      won: { count: 0, total_amount: 0 },
      lost: { count: 0, total_amount: 0 },
    };

    let totalRevenue = 0;
    let pipelineValue = 0;

    deals?.forEach((deal: { stage: keyof typeof dealsByStage; amount: number }) => {
      const amount = Number(deal.amount) || 0;
      if (dealsByStage[deal.stage]) {
        dealsByStage[deal.stage].count += 1;
        dealsByStage[deal.stage].total_amount += amount;
      }
      if (deal.stage === "won") {
        totalRevenue += amount;
      } else if (deal.stage !== "lost") {
        pipelineValue += amount;
      }
    });

    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      total_revenue: totalRevenue,
      pipeline_value: pipelineValue,
      active_deals_count: dealCount || 0,
      win_rate: deals?.length ? Math.round(((dealsByStage.won.count) / deals.length) * 100) : 0,
      active_leads_count: leadCount || 0,
      pending_tasks_count: taskCount || 0,
      deals_by_stage: dealsByStage,
      monthly_revenue_history: mockDashboardMetrics.monthly_revenue_history,
      recent_activities: (activities as Activity[]) || mockActivities,
    };
  } catch (err) {
    console.warn("Failed to fetch dashboard metrics from Supabase, using mock data:", err);
    return mockDashboardMetrics;
  }
}

export async function getLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured()) {
    return mockLeads;
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return mockLeads;
    }
    return data as Lead[];
  } catch {
    return mockLeads;
  }
}

export async function getDeals(): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    return mockDeals;
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("deals")
      .select("*, companies(name), contacts(first_name, last_name)")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return mockDeals;
    }

    return (data as Array<Deal & { companies?: { name: string }; contacts?: { first_name: string; last_name: string } }>).map((d) => ({
      ...d,
      company_name: d.companies?.name || "Unassigned",
      contact_name: d.contacts ? `${d.contacts.first_name} ${d.contacts.last_name}` : undefined,
    })) as Deal[];
  } catch {
    return mockDeals;
  }
}

export async function getContacts(): Promise<Contact[]> {
  if (!isSupabaseConfigured()) {
    return mockContacts;
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("contacts")
      .select("*, companies(name)")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return mockContacts;
    }

    return (data as Array<Contact & { companies?: { name: string } }>).map((c) => ({
      ...c,
      company_name: c.companies?.name,
    })) as Contact[];
  } catch {
    return mockContacts;
  }
}

export async function getCompanies(): Promise<Company[]> {
  if (!isSupabaseConfigured()) {
    return mockCompanies;
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*, contacts(count), deals(count)")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return mockCompanies;
    }

    return (data as Array<Company & { contacts?: { count: number }[]; deals?: { count: number }[] }>).map((c) => ({
      ...c,
      contact_count: c.contacts?.[0]?.count || 0,
      deal_count: c.deals?.[0]?.count || 0,
    })) as Company[];
  } catch {
    return mockCompanies;
  }
}

export async function getTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured()) {
    return mockTasks;
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true });

    if (error || !data?.length) {
      return mockTasks;
    }
    return data as Task[];
  } catch {
    return mockTasks;
  }
}
