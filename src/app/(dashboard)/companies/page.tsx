import { getCompanies } from "@/lib/data-service";
import { CompaniesView } from "./companies-view";

export const metadata = {
  title: "Companies & Accounts | TrendLoom Studios CRM Workspace",
  description: "Track enterprise accounts, company details, and customer tiers",
};

export default async function CompaniesPage() {
  const companies = await getCompanies();
  return <CompaniesView initialCompanies={companies} />;
}
