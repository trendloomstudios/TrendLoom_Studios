import { getLeads } from "@/lib/data-service";
import { LeadsView } from "./leads-view";

export const metadata = {
  title: "Leads Management | TrendLoom Studios CRM Workspace",
  description: "Manage and qualify inbound and outbound B2B leads",
};

export default async function LeadsPage() {
  const leads = await getLeads();
  return <LeadsView initialLeads={leads} />;
}
