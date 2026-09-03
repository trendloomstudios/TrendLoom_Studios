import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { isSupabaseConfigured } from "@/lib/data-service";
import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const isConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header isConfigured={isConfigured} />

        {/* Demo Mode Notice Banner (Only shown if Supabase credentials are not set) */}
        {!isConfigured && (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-6 py-2.5 text-xs flex items-center justify-between border-b border-indigo-800/50">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <Info className="h-3.5 w-3.5 text-blue-300 shrink-0" />
              <span>
                <strong>Running in Interactive Demo Mode:</strong> Viewing full B2B dataset. Connect your Supabase project in <code className="bg-black/30 px-1 py-0.5 rounded text-blue-200">.env.local</code> to activate live PostgreSQL sync.
              </span>
            </div>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 font-semibold text-blue-300 hover:text-white underline underline-offset-2 ml-4 shrink-0 transition"
            >
              Configure Database <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* Page Content Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
