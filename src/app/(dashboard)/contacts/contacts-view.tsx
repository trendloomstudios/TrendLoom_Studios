"use client";

import { useState } from "react";
import { Contact } from "@/types/crm";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ContactsView({ initialContacts }: { initialContacts: Contact[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    title: "",
    company_name: "",
    is_primary: false,
  });

  const filteredContacts = contacts.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email} ${c.company_name || ""} ${c.title}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      id: `cont-${Date.now()}`,
      created_at: new Date().toISOString(),
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || undefined,
      title: formData.title,
      company_id: `comp-${Date.now()}`,
      company_name: formData.company_name,
      is_primary: formData.is_primary,
      status: "active",
      last_contacted_at: new Date().toISOString(),
    };
    setContacts([newContact, ...contacts]);
    setShowModal(false);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      title: "",
      company_name: "",
      is_primary: false,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Contacts Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain relationship histories with key decision makers and executives.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 shadow-xs w-full sm:w-auto h-9">
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs w-full sm:max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, company, role..."
            className="pl-8 sm:pl-9 text-xs"
          />
        </div>
      </div>

      {/* Contacts Table Card */}
      <Card className="shadow-2xs overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <Table className="min-w-[650px]">
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Title & Organization</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Interaction</TableHead>
                <TableHead className="text-right">Quick Reach</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                    No contacts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-slate-50/70">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                          {contact.first_name[0]}
                          {contact.last_name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>
                              {contact.first_name} {contact.last_name}
                            </span>
                            {contact.is_primary && (
                              <span title="Primary Decision Maker">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-[150px]">{contact.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-800">{contact.title}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Building className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{contact.company_name || "Independent"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.is_primary ? (
                        <Badge variant="warning" className="text-[10px]">
                          Primary Buyer
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Stakeholder
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="text-[10px] capitalize">
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {contact.last_contacted_at
                        ? formatDate(contact.last_contacted_at)
                        : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-emerald-600 transition"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Contact Responsive Modal / Bottom Sheet */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 animate-in slide-in-from-bottom sm:zoom-in-95">
            {/* Grab Handle for mobile */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-slate-300" />
            </div>

            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Add New Contact</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateContact} className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">First Name *</label>
                  <Input
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Last Name *</label>
                  <Input
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Job Title *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Company Name *</label>
                  <Input
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.is_primary}
                  onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-medium text-slate-700">
                  Primary Decision Maker
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Contact</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
