"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Info,
  ArrowRight,
  LayoutDashboard,
  Kanban,
  UserCheck,
  CheckSquare,
  Users,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileBottomNav = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Deals", href: "/deals", icon: Kanban },
  { name: "Leads", href: "/leads", icon: UserCheck },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Contacts", href: "/contacts", icon: Users },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Desktop Persistent Left Sidebar */}
      <Sidebar />

      {/* Mobile Sliding Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sidebar */}
          <div className="relative z-50 animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} isMobile />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isConfigured={isConfigured}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Demo Mode Notice Banner (Only shown if Supabase credentials are not set) */}
        {!isConfigured && (
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white px-4 sm:px-6 py-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/40">
            <div className="flex items-start sm:items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse mt-1 sm:mt-0 shrink-0" />
              <Info className="h-3.5 w-3.5 text-blue-300 shrink-0 mt-0.5 sm:mt-0" />
              <span className="leading-tight">
                <strong>Demo Mode:</strong> Connect Supabase in{" "}
                <code className="bg-black/40 px-1 py-0.5 rounded text-blue-200">.env.local</code> to activate live PostgreSQL sync.
              </span>
            </div>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 font-semibold text-blue-300 hover:text-white underline underline-offset-2 shrink-0 transition text-xs self-start sm:self-auto pl-5 sm:pl-0"
            >
              Configure Database <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* Page Content Container - bottom padded on mobile for bottom bar */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phone viewports) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 flex items-center justify-around py-1.5 px-2 shadow-lg safe-area-bottom"
      >
        {mobileBottomNav.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors min-w-[56px]",
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-blue-600 stroke-[2.2]" : "text-slate-500")} />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}

        {/* More / Menu Drawer trigger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-500 hover:text-slate-900 transition-colors min-w-[56px]"
        >
          <MoreHorizontal className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>
    </div>
  );
}
