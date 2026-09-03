"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Plus,
  Database,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isConfigured?: boolean;
}

export function Header({ isConfigured = false }: HeaderProps) {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Search Bar */}
      <div className="flex items-center gap-4 w-96 max-w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search deals, leads, contacts..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Database Connection Pill */}
        <Link
          href="/settings"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            isConfigured
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100"
          }`}
          title={
            isConfigured
              ? "Supabase connected and active"
              : "Running in interactive demo mode with mock data"
          }
        >
          <Database className="h-3.5 w-3.5" />
          <span>{isConfigured ? "Supabase Live" : "Demo Mode"}</span>
          {isConfigured ? (
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          ) : (
            <AlertCircle className="h-3 w-3 text-amber-600" />
          )}
        </Link>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create</span>
          </Button>

          {showQuickMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowQuickMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-40 text-xs animate-in fade-in zoom-in-95">
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
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
              AM
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-40 text-xs">
                <div className="px-2 py-1.5 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">Alex Morgan</p>
                  <p className="text-[11px] text-slate-500">alex@cedo.io</p>
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
                  <Link
                    href="/login"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign out</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
