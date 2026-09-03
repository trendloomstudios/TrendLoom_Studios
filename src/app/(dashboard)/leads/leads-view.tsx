"use client";

import { useState } from "react";
import { Lead, LeadStatus } from "@/types/crm";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  Plus,
  Filter,
  Mail,
  Phone,
  Building,
  Sparkles,
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

export function LeadsView({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  // New Lead Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    estimated_value: 50000,
    source: "website",
    score: 75,
    notes: "",
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      `${lead.first_name} ${lead.last_name} ${lead.company} ${lead.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      created_at: new Date().toISOString(),
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || undefined,
      company: formData.company,
      title: formData.title || undefined,
      status: "new",
      source: formData.source as Lead["source"],
      score: Number(formData.score) || 60,
      estimated_value: Number(formData.estimated_value) || 0,
      notes: formData.notes || undefined,
    };

    setLeads([newLead, ...leads]);
    setShowModal(false);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      title: "",
      estimated_value: 50000,
      source: "website",
      score: 75,
      notes: "",
    });
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>;
      case "contacted":
        return <Badge variant="warning">Contacted</Badge>;
      case "qualified":
        return <Badge variant="success">Qualified</Badge>;
      case "lost":
        return <Badge variant="secondary">Lost</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-blue-700 bg-blue-50 border-blue-200";
    return "text-slate-600 bg-slate-100 border-slate-200";
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Leads Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture, score, and qualify inbound and outbound B2B prospects.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 shadow-xs w-full sm:w-auto h-9">
          <Plus className="h-4 w-4" />
          <span>Add Lead</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, company..."
            className="pl-8 sm:pl-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 touch-pan-x no-scrollbar">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-1 hidden sm:inline" />
          {["all", "new", "contacted", "qualified", "lost"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                statusFilter === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 border border-slate-200 sm:border-transparent"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table Card with horizontal scroll support */}
      <Card className="shadow-2xs overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Company & Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Estimated Value</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    No leads found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-slate-50/70">
                    <TableCell>
                      <div className="font-semibold text-slate-900">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{lead.email}</span>
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{lead.company}</span>
                      </div>
                      {lead.title && (
                        <p className="text-xs text-slate-500">{lead.title}</p>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getScoreColor(
                          lead.score
                        )}`}
                      >
                        <Sparkles className="h-3 w-3" />
                        {lead.score}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {formatCurrency(lead.estimated_value)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-600 capitalize bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {lead.source.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Lead Responsive Modal / Bottom Sheet */}
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
              <h2 className="text-base font-bold text-slate-900">Create New Lead</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">First Name *</label>
                  <Input
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Last Name *</label>
                  <Input
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@company.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Company Name *</label>
                  <Input
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Job Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VP of Growth"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Estimated Value ($)</label>
                  <Input
                    type="number"
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({ ...formData, estimated_value: Number(e.target.value) })}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Lead Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="website">Website Form</option>
                    <option value="referral">Referral</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="cold_outreach">Outreach</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Qualification Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Key requirements, budget timeline..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Lead</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
