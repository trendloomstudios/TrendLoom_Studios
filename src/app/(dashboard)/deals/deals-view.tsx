"use client";

import { useState } from "react";
import { Deal, DealStage } from "@/types/crm";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Building,
  User,
  Calendar,
  X,
  Kanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const STAGES: { id: DealStage; label: string; color: string; badgeColor: string }[] = [
  { id: "discovery", label: "Discovery", color: "border-t-blue-500", badgeColor: "bg-blue-100 text-blue-800" },
  { id: "proposal", label: "Proposal", color: "border-t-indigo-500", badgeColor: "bg-indigo-100 text-indigo-800" },
  { id: "negotiation", label: "Negotiation", color: "border-t-purple-500", badgeColor: "bg-purple-100 text-purple-800" },
  { id: "won", label: "Closed Won", color: "border-t-emerald-500", badgeColor: "bg-emerald-100 text-emerald-800" },
  { id: "lost", label: "Closed Lost", color: "border-t-slate-400", badgeColor: "bg-slate-100 text-slate-800" },
];

export function DealsView({ initialDeals }: { initialDeals: Deal[] }) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [activeMobileStage, setActiveMobileStage] = useState<DealStage | "all">("all");
  const [showModal, setShowModal] = useState(false);

  // New Deal State with lazy initialization to adhere to React pure render rules
  const [formData, setFormData] = useState(() => ({
    title: "",
    amount: 50000,
    company_name: "",
    contact_name: "",
    stage: "discovery" as DealStage,
    probability: 25,
    expected_close_date: "2026-04-15",
  }));

  const moveDeal = (dealId: string, direction: "next" | "prev") => {
    const stageOrder: DealStage[] = [
      "discovery",
      "proposal",
      "negotiation",
      "won",
    ];
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;
        const currentIndex = stageOrder.indexOf(deal.stage);
        if (direction === "next" && currentIndex < stageOrder.length - 1) {
          const nextStage = stageOrder[currentIndex + 1];
          return {
            ...deal,
            stage: nextStage,
            probability:
              nextStage === "won"
                ? 100
                : nextStage === "negotiation"
                ? 80
                : 50,
          };
        }
        if (direction === "prev" && currentIndex > 0) {
          const prevStage = stageOrder[currentIndex - 1];
          return {
            ...deal,
            stage: prevStage,
            probability: prevStage === "discovery" ? 25 : 50,
          };
        }
        return deal;
      })
    );
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      created_at: new Date().toISOString(),
      title: formData.title,
      amount: Number(formData.amount) || 0,
      stage: formData.stage,
      probability: Number(formData.probability) || 20,
      expected_close_date: formData.expected_close_date,
      company_id: `comp-${Date.now()}`,
      company_name: formData.company_name || "Enterprise Client",
      contact_name: formData.contact_name || undefined,
    };
    setDeals([newDeal, ...deals]);
    setShowModal(false);
    setFormData({
      title: "",
      amount: 50000,
      company_name: "",
      contact_name: "",
      stage: "discovery",
      probability: 25,
      expected_close_date: "2026-04-15",
    });
  };

  const totalPipeline = deals
    .filter((d) => d.stage !== "lost")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const displayedStages =
    activeMobileStage === "all"
      ? STAGES
      : STAGES.filter((s) => s.id === activeMobileStage);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Deal Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active opportunities: <span className="font-semibold text-slate-700">{deals.length} deals</span> totaling{" "}
            <span className="font-bold text-blue-600">{formatCurrency(totalPipeline)}</span>
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 shadow-xs w-full sm:w-auto h-9">
          <Plus className="h-4 w-4" />
          <span>New Opportunity</span>
        </Button>
      </div>

      {/* Mobile Stage Filter Tabs */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1.5 -mx-3 px-3 touch-pan-x no-scrollbar">
        <button
          onClick={() => setActiveMobileStage("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
            activeMobileStage === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All Stages ({deals.length})
        </button>
        {STAGES.map((st) => {
          const count = deals.filter((d) => d.stage === st.id).length;
          return (
            <button
              key={st.id}
              onClick={() => setActiveMobileStage(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5 ${
                activeMobileStage === st.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeMobileStage === st.id
                    ? "bg-blue-700 text-blue-100"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Grid */}
      <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 items-start overflow-x-auto snap-x snap-mandatory pb-4 -mx-3 px-3 sm:mx-0 sm:px-0">
        {displayedStages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div
              key={stage.id}
              className={`bg-slate-100/80 rounded-xl p-3 flex flex-col border border-slate-200/90 border-t-4 ${stage.color} min-w-[82vw] sm:min-w-[280px] md:min-w-0 snap-center shrink-0 md:shrink`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    {stage.label}
                  </h3>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {formatCurrency(stageTotal)}
                  </p>
                </div>
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-slate-200/80 text-slate-700 font-bold text-[11px] flex items-center justify-center">
                  {stageDeals.length}
                </span>
              </div>

              {/* Deals in this Stage */}
              <div className="space-y-2.5">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs hover:shadow-xs transition space-y-2.5 group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {deal.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Building className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{deal.company_name}</span>
                      </div>
                      {deal.contact_name && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <User className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{deal.contact_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatCurrency(deal.amount)}
                      </span>
                      <Badge
                        variant={
                          deal.stage === "won"
                            ? "success"
                            : deal.stage === "lost"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-[10px] px-1.5 py-0 h-4 font-semibold"
                      >
                        {deal.probability}% win
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>Close: {deal.expected_close_date}</span>
                      </div>

                      {/* Stage Advancement Controls */}
                      <div className="flex items-center gap-1.5">
                        {deal.stage !== "discovery" && deal.stage !== "lost" && (
                          <button
                            title="Move to previous stage"
                            onClick={() => moveDeal(deal.id, "prev")}
                            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-slate-900 active:bg-slate-200 transition"
                            aria-label="Previous Stage"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {deal.stage !== "won" && deal.stage !== "lost" && (
                          <button
                            title="Advance to next stage"
                            onClick={() => moveDeal(deal.id, "next")}
                            className="p-1.5 hover:bg-blue-50 rounded-md text-blue-600 hover:text-blue-800 active:bg-blue-100 transition"
                            aria-label="Next Stage"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-6 px-2 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg bg-white/40">
                    No deals in {stage.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Responsive Modal / Bottom Sheet */}
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
              <h2 className="text-base font-bold text-slate-900">Create Deal Opportunity</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDeal} className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Deal Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Acme Corp - Enterprise Cloud License"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Company Name *</label>
                  <Input
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Contact Person</label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Deal Value ($) *</label>
                  <Input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    placeholder="75000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Starting Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="discovery">Discovery</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Closed Won</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Win Probability (%)</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Target Close Date</label>
                  <Input
                    type="date"
                    required
                    value={formData.expected_close_date}
                    onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Deal</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
