import { isSupabaseConfigured } from "@/lib/data-service";
import { SettingsView } from "./settings-view";

export const metadata = {
  title: "Settings & Setup | TrendLoom Studios CRM Workspace",
  description: "Configure Supabase database, organization profiles, and team members",
};

export default function SettingsPage() {
  const isConfigured = isSupabaseConfigured();
  return <SettingsView isConfigured={isConfigured} />;
}
