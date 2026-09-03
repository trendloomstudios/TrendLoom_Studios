import { getContacts } from "@/lib/data-service";
import { ContactsView } from "./contacts-view";

export const metadata = {
  title: "Contacts Directory | TrendLoom Studios CRM Workspace",
  description: "Manage client and stakeholder contact details",
};

export default async function ContactsPage() {
  const contacts = await getContacts();
  return <ContactsView initialContacts={contacts} />;
}
