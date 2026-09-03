"use client";

import { useState } from "react";
import { Company, CompanyTier } from "@/types/crm";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Plus,
  Building2,
  Globe,
  MapPin,
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

export function CompaniesView({ initialCompanies }: { initialCompanies: Company[] }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    industry: "Enterprise SaaS",
    size: "51-200" as const,
    tier: "Mid-Market" as CompanyTier,
    annual_revenue: 10000000,
    city: "San Francisco",
    country: "USA",
  });

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = `${c.name} ${c.industry} ${c.domain || ""} ${c.city || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === "all" ? true : c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const newComp: Company = {
      id: `comp-${Date.now()}`,
      created_at: new Date().toISOString(),
      name: formData.name,
      domain: formData.domain || undefined,
      industry: formData.industry,
      size: formData.size,
      tier: formData.tier,
      annual_revenue: Number(formData.annual_revenue) || 0,
      city: formData.city,
      country: formData.country,
      status: "active",
      contact_count: 0,
      deal_count: 0,
    };
    setCompanies([newComp, ...companies]);
    setShowModal(false);
    setFormData({
      name: "",
      domain: "",
      industry: "Enterprise SaaS",
      size: "51-200",
      tier: "Mid-Market",
      annual_revenue: 10000000,
      city: "San Francisco",
      country: "USA",
    });
  };

  const getTierBadge = (tier: CompanyTier) => {
    switch (tier) {
      case "Enterprise":
        return <Badge variant="purple">Enterprise</Badge>;
      case "Mid-Market":
        return <Badge variant="default">Mid-Market</Badge>;
      case "SMB":
        return <Badge variant="secondary">SMB</Badge>;
      case "Startup":
        return <Badge variant="warning">Startup</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Accounts & Companies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track client accounts, tier classifications, and organization revenue.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Add Account</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies by name, domain, industry..."
            className="pl-9 text-xs"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
          {["all", "Enterprise", "Mid-Market", "SMB", "Startup"].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                tierFilter === tier
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Table */}
      <Card className="shadow-2xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Industry & Size</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Annual Revenue</TableHead>
              <TableHead>Headquarters</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Contacts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  No accounts found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company.id} className="hover:bg-slate-50/70">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                        <Building2 className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">
                          {company.name}
                        </span>
                        {company.domain && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                            <Globe className="h-3 w-3" />
                            <span>{company.domain}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-800">{company.industry}</p>
                    <p className="text-xs text-slate-400">{company.size} employees</p>
                  </TableCell>
                  <TableCell>{getTierBadge(company.tier)}</TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {formatCurrency(company.annual_revenue)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>
                        {company.city}, {company.country}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {company.deal_count || 0} active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {company.contact_count || 0} people
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add Company Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Add Corporate Account</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Company Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Global Corp"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Website Domain</label>
                  <Input
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="apexcloud.io"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Industry</label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Account Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as CompanyTier })}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Mid-Market">Mid-Market</option>
                    <option value="SMB">SMB</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Annual Revenue ($)</label>
                  <Input
                    type="number"
                    value={formData.annual_revenue}
                    onChange={(e) => setFormData({ ...formData, annual_revenue: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Country</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Account</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
