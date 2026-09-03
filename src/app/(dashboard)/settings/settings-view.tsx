"use client";

import { useState } from "react";
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SettingsView({ isConfigured }: { isConfigured: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyEnvTemplate = () => {
    const text = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\nSUPABASE_SERVICE_ROLE_KEY=your-service-role-key`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Settings & Environment
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage Supabase database credentials, organization parameters, and system security.
        </p>
      </div>

      {/* Database Connection Card */}
      <Card className="shadow-2xs border border-slate-200">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm font-semibold">
                Supabase PostgreSQL Connection
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Integration status with your Supabase cloud backend
            </CardDescription>
          </div>
          <div className="self-start sm:self-auto">
            <Badge variant="success" className="gap-1 px-2.5 py-1">
              <CheckCircle2 className="h-3 w-3" /> Live Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Connection Setup Guide
            </h4>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside">
              <li>
                Create a project on{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-medium"
                >
                  supabase.com
                </a>
                .
              </li>
              <li>
                Navigate to your Supabase Project: <strong>Settings &rarr; API</strong>.
              </li>
              <li>
                Copy the <strong>Project URL</strong> and <strong>Publishable / Anon API Key</strong>.
              </li>
              <li>
                Open <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-900 font-mono text-[11px]">.env.local</code> in your CEDO_CRM root directory and paste them.
              </li>
              <li>
                Open the Supabase <strong>SQL Editor</strong> and run the schema script located at:{" "}
                <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-900 font-mono text-[11px]">supabase/schema.sql</code>.
              </li>
            </ol>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Required Environment Variables (.env.local)
              </span>
              <button
                onClick={copyEnvTemplate}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Format
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-blue-300 break-all text-[11px] sm:text-xs">NEXT_PUBLIC_SUPABASE_URL</span>
                <span className="text-slate-400 font-sans text-[10px] sm:text-[11px]">
                  {isConfigured ? "Configured ✓" : "Pending setup in .env.local"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-blue-300 break-all text-[11px] sm:text-xs">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</span>
                <span className="text-slate-400 font-sans text-[10px] sm:text-[11px]">
                  {isConfigured ? "Configured ✓" : "Pending setup in .env.local"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-400 break-all text-[11px] sm:text-xs">SUPABASE_SERVICE_ROLE_KEY</span>
                <span className="text-slate-400 font-sans text-[10px] sm:text-[11px]">
                  Optional (Server admin tasks)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Settings */}
      <Card className="shadow-2xs border border-slate-200">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold">
            Organization Profile
          </CardTitle>
          <CardDescription className="text-xs">
            General workspace preferences and localization
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Workspace Name</label>
              <Input defaultValue="CEDO B2B Enterprise" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Base Currency</label>
              <Input defaultValue="USD ($)" disabled className="bg-slate-50" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Fiscal Year Start</label>
              <Input defaultValue="January 1" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Timezone</label>
              <Input defaultValue="America/New_York (UTC-5)" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="shadow-2xs border border-slate-200">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold">Team Members</CardTitle>
            <CardDescription className="text-xs">Active sales seats and access permissions</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="text-xs self-start sm:self-auto h-8">
            Invite Colleague
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-2.5">
          {[
            { name: "Alex Morgan", email: "alex@cedo.io", role: "Admin", initials: "AM" },
            { name: "Jordan Lee", email: "jordan@cedo.io", role: "Sales Rep", initials: "JL" },
            { name: "Taylor Rivera", email: "taylor@cedo.io", role: "Sales Rep", initials: "TR" },
          ].map((user) => (
            <div
              key={user.email}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200/70 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                  {user.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {user.role}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
