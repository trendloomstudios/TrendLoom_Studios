import { getDashboardMetrics, getTasks } from "@/lib/data-service";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Kanban,
  UserCheck,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Users,
  FileText,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Executive Dashboard | CEDO CRM",
  description: "B2B CRM Pipeline and Performance Analytics",
};

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const tasks = await getTasks();
  const urgentTasks = tasks.filter((t) => t.status !== "completed").slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Executive Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline metrics, conversion velocity, and team performance.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Q1 2026 (Live)</span>
          </div>
          <Link href="/deals">
            <Button size="sm" className="shadow-xs">
              View Deal Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Closed Revenue */}
        <Card className="hover:border-blue-200 transition-colors shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Closed Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(metrics.total_revenue)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+18.4%</span>
              <span className="text-slate-400 font-normal ml-1">vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Active Pipeline */}
        <Card className="hover:border-blue-200 transition-colors shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Pipeline
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Kanban className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(metrics.pipeline_value)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium">
              <span>{metrics.active_deals_count} active opportunities</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Win Rate */}
        <Card className="hover:border-blue-200 transition-colors shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Win Rate
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">
              {metrics.win_rate}%
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-indigo-600 font-medium">
              <ArrowUpRight className="h-3 w-3" />
              <span>+4.2%</span>
              <span className="text-slate-400 font-normal ml-1">benchmark 62%</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Active Leads */}
        <Card className="hover:border-blue-200 transition-colors shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Leads
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">
              {metrics.active_leads_count}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <span className="font-medium text-amber-600">85 avg score</span>
              <span className="text-slate-400 ml-1">in qualification</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Pipeline Breakdown & Monthly Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Stage Distribution (2 cols on large) */}
        <Card className="lg:col-span-2 shadow-2xs">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Deal Pipeline Stages</CardTitle>
              <CardDescription>Value and deal volume progression across the sales cycle</CardDescription>
            </div>
            <Link href="/deals" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Open Kanban <ExternalLink className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* Stage Progress Bars */}
            {[
              {
                stage: "Discovery",
                amount: metrics.deals_by_stage.discovery.total_amount,
                count: metrics.deals_by_stage.discovery.count,
                color: "bg-blue-500",
                pct: Math.round((metrics.deals_by_stage.discovery.total_amount / metrics.pipeline_value) * 100) || 15,
              },
              {
                stage: "Proposal",
                amount: metrics.deals_by_stage.proposal.total_amount,
                count: metrics.deals_by_stage.proposal.count,
                color: "bg-indigo-500",
                pct: Math.round((metrics.deals_by_stage.proposal.total_amount / metrics.pipeline_value) * 100) || 30,
              },
              {
                stage: "Negotiation",
                amount: metrics.deals_by_stage.negotiation.total_amount,
                count: metrics.deals_by_stage.negotiation.count,
                color: "bg-purple-500",
                pct: Math.round((metrics.deals_by_stage.negotiation.total_amount / metrics.pipeline_value) * 100) || 35,
              },
              {
                stage: "Closed Won",
                amount: metrics.deals_by_stage.won.total_amount,
                count: metrics.deals_by_stage.won.count,
                color: "bg-emerald-500",
                pct: 100,
              },
            ].map((item) => (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{item.stage}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {item.count} {item.count === 1 ? "deal" : "deals"}
                    </Badge>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(item.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Monthly Trend Visual Indicator */}
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                Monthly Pipeline & Revenue Velocity
              </div>
              <div className="grid grid-cols-5 gap-3">
                {metrics.monthly_revenue_history.map((m) => (
                  <div key={m.month} className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">{m.month}</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{formatCurrency(m.won)}</p>
                    <p className="text-[10px] text-blue-600 font-medium">Pipe: {formatCurrency(m.pipeline)}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Action Tasks */}
        <Card className="shadow-2xs">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Priority Tasks</CardTitle>
              <CardDescription>{metrics.pending_tasks_count} pending deliverables</CardDescription>
            </div>
            <Link href="/tasks" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {task.title}
                  </span>
                  <Badge
                    variant={
                      task.priority === "urgent"
                        ? "destructive"
                        : task.priority === "high"
                        ? "warning"
                        : "secondary"
                    }
                    className="text-[10px] px-1.5 py-0 h-4 uppercase shrink-0"
                  >
                    {task.priority}
                  </Badge>
                </div>
                {task.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <Clock className="h-3 w-3" />
                  <span>Due {formatDate(task.due_date)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline & High Score Inbound Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-2xs">
          <CardHeader className="p-5 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold">Recent Sales Activity</CardTitle>
            <CardDescription>Live log of client communications and deal stage movements</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              {metrics.recent_activities.map((act) => {
                const getIcon = () => {
                  switch (act.type) {
                    case "call":
                      return <Phone className="h-3.5 w-3.5 text-blue-600" />;
                    case "email":
                      return <Mail className="h-3.5 w-3.5 text-purple-600" />;
                    case "meeting":
                      return <Users className="h-3.5 w-3.5 text-emerald-600" />;
                    case "deal_stage_changed":
                      return <TrendingUp className="h-3.5 w-3.5 text-amber-600" />;
                    default:
                      return <FileText className="h-3.5 w-3.5 text-slate-600" />;
                  }
                };

                return (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                      {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800">{act.title}</p>
                        <span className="text-[11px] text-slate-400">
                          {formatRelativeTime(act.created_at)}
                        </span>
                      </div>
                      {act.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {act.description}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">
                        By <span className="font-medium text-slate-600">{act.user_name}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Launchpad & Tech Stack Overview */}
        <Card className="shadow-2xs">
          <CardHeader className="p-5 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold">CEDO CRM Architecture</CardTitle>
            <CardDescription>Enterprise deployment & stack configuration</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="p-3.5 rounded-lg border border-blue-100 bg-blue-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-950">Next.js App Router (v16)</span>
                <Badge variant="default" className="text-[10px]">Active</Badge>
              </div>
              <p className="text-slate-600 text-[11px]">
                Server Components with React 19, client interactivity, and streaming layouts.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-950">Supabase PostgreSQL & Auth</span>
                <Badge variant="indigo" className="text-[10px]">Ready</Badge>
              </div>
              <p className="text-slate-600 text-[11px]">
                Schema defined in <code className="bg-white/80 px-1 py-0.5 rounded border border-indigo-200">supabase/schema.sql</code> with Row Level Security and RBAC triggers.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Tailwind CSS & Radix UI</span>
                <Badge variant="secondary" className="text-[10px]">Styled</Badge>
              </div>
              <p className="text-slate-600 text-[11px]">
                Accessible UI component foundation with high performance and responsive layout.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/leads">
                <Button size="sm" variant="outline" className="text-xs">
                  Manage Leads
                </Button>
              </Link>
              <Link href="/settings">
                <Button size="sm" className="text-xs">
                  Configure Database
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
