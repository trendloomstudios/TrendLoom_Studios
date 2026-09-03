import { getDeals } from "@/lib/data-service";
import { DealsView } from "./deals-view";

export const metadata = {
  title: "Deal Pipeline Kanban | CEDO CRM",
  description: "Manage sales opportunities and track pipeline velocity",
};

export default async function DealsPage() {
  const deals = await getDeals();
  return <DealsView initialDeals={deals} />;
}
