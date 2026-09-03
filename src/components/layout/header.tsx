"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Database,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  isConfigured?: boolean;
  onOpenMobileMenu?: () => void;
}

export function Header({ isConfigured = true, onOpenMobileMenu }: HeaderProps) {
  const router = useRouter();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs gap-2">
      {/* Left: Hamburger Menu (Mobile) + Logo + Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand Monogram */}
        <div className="md:hidden flex items-center gap-1.5 shrink-0">
          <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="h-4 w-4 text-blue-100" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search CRM..."
            className="w-full pl-8 sm:pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400 truncate"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Database Connection Pill */}
        <Link
          href="/settings"
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium border transition-colors bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          title="Supabase PostgreSQL Connected & Active"
        >
          <Database className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <span className="hidden sm:inline">Supabase Live</span>
          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
        </Link>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="gap-1 px-2.5 sm:px-3 text-xs shadow-xs h-8"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create</span>
          </Button>

          {showQuickMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowQuickMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-40 text-xs animate-in fade-in zoom-in-95">
                <Link
                  href="/leads"
                  onClick={() => setShowQuickMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                  <span>New Lead</span>
                </Link>
                <Link
                  href="/deals"
                  onClick={() => setShowQuickMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <Plus className="h-3.5 w-3.5 text-indigo-600" />
                  <span>New Deal</span>
                </Link>
                <Link
                  href="/contacts"
                  onClick={() => setShowQuickMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <Plus className="h-3.5 w-3.5 text-emerald-600" />
                  <span>New Contact</span>
                </Link>
                <Link
                  href="/tasks"
                  onClick={() => setShowQuickMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-600" />
                  <span>New Task</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-0.5 sm:p-1 rounded-lg hover:bg-slate-100 transition"
            aria-label="User menu"
          >
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
              TL
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-40 text-xs">
                <div className="px-2 py-1.5 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">TrendLoom Account</p>
                  <p className="text-[11px] text-slate-500">Authenticated User</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>Account Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
