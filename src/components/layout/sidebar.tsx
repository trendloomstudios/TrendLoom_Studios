"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Kanban,
  Users,
  Building2,
  CheckSquare,
  Settings,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: UserCheck, badge: "5" },
  { name: "Deal Pipeline", href: "/deals", icon: Kanban, badge: "$472k" },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, badge: "4" },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen",
        isMobile
          ? "w-72 shadow-2xl z-50 fixed inset-y-0 left-0"
          : "hidden md:flex md:w-64 border-r border-slate-800 sticky top-0"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="h-5 w-5 text-blue-100" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-bold tracking-tight text-sm flex items-center gap-1.5 truncate">
              TrendLoom <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold uppercase">CRM</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">Studios CRM Workspace</p>
          </div>
        </div>

        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </div>
        {navigation.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-900/40 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded-md font-semibold",
                    isActive
                      ? "bg-blue-700 text-blue-100"
                      : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Workspace / Current User Card */}
      <div className="p-3 border-t border-slate-800">
        <Link
          href="/settings"
          onClick={isMobile ? onClose : undefined}
          className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition cursor-pointer"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-medium flex items-center justify-center text-xs ring-2 ring-slate-700">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">Alex Morgan</p>
            <p className="text-[10px] text-slate-400 truncate">Sales Director</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
