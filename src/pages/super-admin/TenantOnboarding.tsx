import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Settings, Download, Plus, Clock, CheckCircle2, Eye,
  ChevronRight, ChevronLeft, Send, Rocket, Users, Activity
} from "lucide-react";

/* ─── pricing blocks (same as Subscription & Billing) ─── */
const BLOCKS = [
  { id: "B1", label: "Block 1", desc: "Starter tier", from: 1, to: 100, rate: 499, incrRate: 599 },
  { id: "B2", label: "Block 2", desc: "Growth tier", from: 101, to: 250, rate: 449, incrRate: 549 },
  { id: "B3", label: "Block 3", desc: "Pro tier", from: 251, to: 500, rate: 399, incrRate: 499 },
  { id: "B4", label: "Block 4", desc: "Enterprise tier", from: 501, to: 1000, rate: 349, incrRate: 449 },
  { id: "Trial", label: "Trial", desc: "30 days free", from: 1, to: 15, rate: 0, incrRate: 0 },
];

const STAGES = [
  { key: "invited", label: "Invited", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { key: "setup", label: "Account Setup", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { key: "configuring", label: "Configuring", color: "bg-sky-100 text-sky-800 border-sky-300" },
  { key: "training", label: "Training", color: "bg-violet-100 text-violet-800 border-violet-300" },
  { key: "live", label: "Live", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
];

const INDUSTRIES = ["Pharmaceuticals", "Manufacturing", "Engineering", "FMCG", "IT / Technology", "Healthcare", "Government / PSU"];
const SIZES = ["1–50", "51–200", "201–500", "500–1000", "1000+"];
const STATES = ["Andhra Pradesh", "Gujarat", "Karnataka", "Maharashtra", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh"];
const ROLES = ["Company Admin", "Training Manager", "HR Admin", "Compliance Admin"];
const CSMS = ["Auto-assign", "Ravi Sharma", "Priya Menon", "Arun Das"];
const CONTENT_TEMPLATES = [
  "Pharmaceutical Compliance Pack (8 courses)",
  "Manufacturing Safety Pack (10 courses)",
  "Generic Starter Pack (4 courses)",
  "No template — blank setup",
];

const fmtR = (n: number) => "₹" + n.toLocaleString("en-IN");

interface Tenant {
  id: string;
  company_id: string;
  stage: string;
  progress: number;
  days_in_pipeline: number;
  csm_assigned: string | null;
  company?: { id: string; name: string; slug: string; company_size: string | null; industry: string | null };
  payment?: { plan_name: string; block_seats: number | null };
}

interface CheckItem {
  id: string;
  onboarding_id: string;
  label: string;
  target_day: string | null;
  is_done: boolean;
  sort_order: number;
}

export default function TenantOnboarding() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [checklist, setChecklist] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizOpen, setWizOpen] = useState(false);
  const [wizStep, setWizStep] = useState(1);
  const [stageFilter, setStageFilter] = useState("all");
  const [blockFilter, setBlockFilter] = useState("all");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Wizard form state
  const [wiz, setWiz] = useState({
    coName: "", industry: "", size: "", gstin: "", address: "",
    city: "", state: "", pin: "", domain: "", subdomain: "",
    blockId: "", seats: "", billing: "monthly", discount: "", incrRate: "",
    adminName: "", adminEmail: "", adminDesignation: "", adminRole: "Company Admin",
    bcName: "", bcEmail: "", bcSameAsAdmin: false,
    csm: "Auto-assign", startDate: new Date().toISOString().split("T")[0],
    template: "", notes: "", autoConfigure: true,
    sendInvite: true, createChecklist: true, addToPipeline: true, genInvoice: true,
  });

  const selectedBlock = BLOCKS.find(b => b.id === wiz.blockId);

  // Price calculation
  const priceCalc = useMemo(() => {
    if (!selectedBlock || !wiz.seats) return null;
    const seats = parseInt(wiz.seats) || 0;
    const disc = parseInt(wiz.discount) || 0;
    const gross = selectedBlock.rate * seats;
    const discAmt = Math.round(gross * disc / 100);
    const net = gross - discAmt;
    const cycle = wiz.billing;
    const acv = cycle === "annual" ? net * 10 : cycle === "quarterly" ? net * 3 : net;
    return { seats, rate: selectedBlock.rate, gross, discAmt, disc, net, acv, cycle };
  }, [selectedBlock, wiz.seats, wiz.discount, wiz.billing]);

  useEffect(() => { fetchTenants(); }, []);

  async function fetchTenants() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("tenant_onboarding")
      .select("*, company:companies(id, name, slug, company_size, industry)")
      .order("created_at", { ascending: false });

    if (data) {
      // Also fetch payment info for each company
      const companyIds = data.map((t: any) => t.company_id);
      const { data: payments } = await (supabase as any)
        .from("company_payments")
        .select("company_id, plan_name, block_seats")
        .in("company_id", companyIds.length ? companyIds : ["none"]);

      const payMap = new Map((payments || []).map((p: any) => [p.company_id, p]));
      setTenants(data.map((t: any) => ({ ...t, payment: payMap.get(t.company_id) })));
    }
    setLoading(false);
  }

  async function fetchChecklist(onboardingId: string) {
    const { data } = await (supabase as any)
      .from("onboarding_checklist")
      .select("*")
      .eq("onboarding_id", onboardingId)
      .order("sort_order");
    setChecklist(data || []);
  }

  async function toggleCheck(item: CheckItem) {
    const newDone = !item.is_done;
    await (supabase as any)
      .from("onboarding_checklist")
      .update({ is_done: newDone, completed_at: newDone ? new Date().toISOString() : null })
      .eq("id", item.id);
    setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, is_done: newDone } : c));
    toast.success(newDone ? "Task marked complete" : "Task marked incomplete");
  }

  // Stats
  const stats = useMemo(() => {
    const byStage = (s: string) => tenants.filter(t => t.stage === s);
    const liveThisMonth = byStage("live").filter(t => {
      const d = new Date();
      const created = new Date((t as any).went_live_at || (t as any).created_at);
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
    });
    const avgDays = liveThisMonth.length
      ? Math.round(liveThisMonth.reduce((s, t) => s + t.days_in_pipeline, 0) / liveThisMonth.length * 10) / 10
      : 0;
    return [
      { label: "Invited (Pending)", count: byStage("invited").length, sub: "Awaiting first login", icon: Clock, iconColor: "text-amber-600" },
      { label: "In Setup", count: byStage("setup").length, sub: "Needs attention", icon: Settings, iconColor: "text-amber-600" },
      { label: "Configuring", count: byStage("configuring").length, sub: "Active setup", icon: Activity, iconColor: "text-sky-700" },
      { label: "Went Live (this month)", count: liveThisMonth.length, sub: avgDays ? `Avg. ${avgDays} days to live` : "No data yet", icon: CheckCircle2, iconColor: "text-emerald-600" },
    ];
  }, [tenants]);

  // Pipeline grouped by stage
  const pipeline = useMemo(() => {
    let filtered = tenants;
    if (blockFilter !== "all") filtered = filtered.filter(t => t.payment?.plan_name === blockFilter);
    const groups: Record<string, Tenant[]> = {};
    STAGES.forEach(s => { groups[s.key] = []; });
    filtered.forEach(t => { if (groups[t.stage]) groups[t.stage].push(t); });
    return groups;
  }, [tenants, blockFilter]);

  // List view filtering
  const listData = useMemo(() => {
    let filtered = tenants;
    if (stageFilter !== "all") filtered = filtered.filter(t => t.stage === stageFilter);
    if (blockFilter !== "all") filtered = filtered.filter(t => t.payment?.plan_name === blockFilter);
    return filtered;
  }, [tenants, stageFilter, blockFilter]);

  /* ─── wizard submit ─── */
  async function handleOnboard() {
    if (!wiz.coName || !wiz.adminEmail) {
      toast.error("Company name and admin email are required");
      return;
    }

    const slug = wiz.coName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // 1. Create company
    const { data: co, error: coErr } = await (supabase as any)
      .from("companies")
      .insert({
        name: wiz.coName, slug, industry: wiz.industry || null,
        company_size: wiz.size || null, gstin: wiz.gstin || null,
        address_line_1: wiz.address || null, city: wiz.city || null,
        state: wiz.state || null, pin_code: wiz.pin || null,
        primary_domain: wiz.domain || null, subdomain: wiz.subdomain || null,
        contact_person_name: wiz.adminName, contact_person_email: wiz.adminEmail,
        billing_contact_name: wiz.bcSameAsAdmin ? wiz.adminName : wiz.bcName || null,
        billing_contact_email: wiz.bcSameAsAdmin ? wiz.adminEmail : wiz.bcEmail || null,
        csm_assigned: wiz.csm === "Auto-assign" ? null : wiz.csm,
        is_active: true,
      })
      .select("id")
      .single();

    if (coErr || !co) { toast.error("Failed to create company: " + (coErr?.message || "Unknown error")); return; }

    // 2. Create payment record if block selected
    if (selectedBlock && wiz.seats) {
      await (supabase as any).from("company_payments").insert({
        company_id: co.id,
        plan_name: selectedBlock.id,
        block_id: selectedBlock.id,
        block_seats: parseInt(wiz.seats),
        seats_included: parseInt(wiz.seats),
        amount: priceCalc?.net || 0,
        billing_cycle: wiz.billing,
        discount_percent: parseInt(wiz.discount) || 0,
        incremental_rate: wiz.incrRate ? parseFloat(wiz.incrRate) : selectedBlock.incrRate,
        plan_status: selectedBlock.id === "Trial" ? "trial" : "active",
        contract_start_date: wiz.startDate || null,
      });
    }

    // 3. Create onboarding record
    const { data: ob } = await (supabase as any)
      .from("tenant_onboarding")
      .insert({
        company_id: co.id, stage: "invited", progress: 0, days_in_pipeline: 0,
        csm_assigned: wiz.csm === "Auto-assign" ? null : wiz.csm,
        content_template: wiz.template || null,
        admin_name: wiz.adminName, admin_email: wiz.adminEmail,
        admin_designation: wiz.adminDesignation || null,
        admin_role: wiz.adminRole,
        billing_contact_name: wiz.bcSameAsAdmin ? wiz.adminName : wiz.bcName || null,
        billing_contact_email: wiz.bcSameAsAdmin ? wiz.adminEmail : wiz.bcEmail || null,
        billing_same_as_admin: wiz.bcSameAsAdmin,
        contract_start_date: wiz.startDate || null,
        internal_notes: wiz.notes || null,
        auto_configure: wiz.autoConfigure,
        send_invite: wiz.sendInvite,
        create_checklist: wiz.createChecklist,
        add_to_pipeline: wiz.addToPipeline,
        generate_invoice: wiz.genInvoice,
      })
      .select("id")
      .single();

    // 4. Create default checklist items
    if (ob && wiz.createChecklist) {
      const { data: tmplItems } = await (supabase as any)
        .from("onboarding_template_items")
        .select("*, template:onboarding_checklist_templates!inner(is_default)")
        .eq("template.is_default", true)
        .order("sort_order");

      if (tmplItems?.length) {
        await (supabase as any).from("onboarding_checklist").insert(
          tmplItems.map((ti: any) => ({
            onboarding_id: ob.id, label: ti.label,
            target_day: ti.target_day, sort_order: ti.sort_order,
          }))
        );
      }
    }

    toast.success("Company created! Invite sent to admin.");
    setWizOpen(false);
    resetWiz();
    fetchTenants();
  }

  function resetWiz() {
    setWizStep(1);
    setWiz({
      coName: "", industry: "", size: "", gstin: "", address: "",
      city: "", state: "", pin: "", domain: "", subdomain: "",
      blockId: "", seats: "", billing: "monthly", discount: "", incrRate: "",
      adminName: "", adminEmail: "", adminDesignation: "", adminRole: "Company Admin",
      bcName: "", bcEmail: "", bcSameAsAdmin: false,
      csm: "Auto-assign", startDate: new Date().toISOString().split("T")[0],
      template: "", notes: "", autoConfigure: true,
      sendInvite: true, createChecklist: true, addToPipeline: true, genInvoice: true,
    });
  }

  const stepLabels = ["Company Info", "Block & Pricing", "Admin Setup", "Content", "Review & Send"];

  function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  }

  const stageBadge = (stage: string) => {
    const s = STAGES.find(st => st.key === stage);
    return s ? <Badge variant="outline" className={s.color}>{s.label}</Badge> : stage;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Tenant Onboarding
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track company setup progress from invitation to live deployment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Report downloaded")}>
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
          <Button size="sm" onClick={() => { resetWiz(); setWizOpen(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Onboard Company
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-muted ${s.iconColor}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold font-mono mt-1">{s.count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="board">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="board">Pipeline Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="checklist">Onboarding Checklist</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                {BLOCKS.map(b => <SelectItem key={b.id} value={b.id}>{b.label} ({b.from}–{b.to} seats)</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ─── PIPELINE BOARD ─── */}
        <TabsContent value="board">
          <Card>
            <CardContent className="p-4 overflow-x-auto">
              <div className="grid grid-cols-5 gap-3 min-w-[900px]">
                {STAGES.map(stage => (
                  <div key={stage.key}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stage.label}</span>
                      <Badge variant="secondary" className="text-[10px] h-5">{pipeline[stage.key]?.length || 0}</Badge>
                    </div>
                    <div className="space-y-2">
                      {(pipeline[stage.key] || []).map(t => (
                        <div
                          key={t.id}
                          className="border rounded-lg p-3 bg-card hover:shadow-md transition-all cursor-pointer"
                          onClick={() => { setSelectedTenant(t); fetchChecklist(t.id); }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                              {getInitials(t.company?.name || "?")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{t.company?.name}</p>
                              <p className="text-[10px] text-muted-foreground">{t.payment?.plan_name || "—"}</p>
                            </div>
                          </div>
                          <div className="mb-2">
                            <Progress value={t.progress} className="h-1" />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{t.progress}%</span>
                            <span>{t.days_in_pipeline}d</span>
                            <span>{t.csm_assigned || "Auto"}</span>
                          </div>
                        </div>
                      ))}
                      {(pipeline[stage.key] || []).length === 0 && (
                        <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-lg">No companies</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── LIST VIEW ─── */}
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="p-3 border-b">
                <span className="text-xs text-muted-foreground">{listData.length} companies in pipeline</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Days in Pipeline</TableHead>
                    <TableHead>CSM</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listData.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                            {getInitials(t.company?.name || "?")}
                          </div>
                          <span className="font-medium text-sm">{t.company?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{t.payment?.plan_name || "—"}</Badge></TableCell>
                      <TableCell>{stageBadge(t.stage)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={t.progress} className="h-1.5 w-16" />
                          <span className="text-xs">{t.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{t.days_in_pipeline}d</TableCell>
                      <TableCell className="text-sm">{t.csm_assigned || "Auto"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedTenant(t); fetchChecklist(t.id); }}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {listData.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No tenants found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CHECKLIST VIEW ─── */}
        <TabsContent value="checklist">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">{selectedTenant?.company?.name || "Select a company"}</CardTitle>
                    <CardDescription className="text-xs">
                      {selectedTenant ? `${selectedTenant.payment?.plan_name || "—"} · ${selectedTenant.payment?.block_seats || 0} seats · Started ${selectedTenant.days_in_pipeline} days ago` : "Click a company from the pipeline or list view"}
                    </CardDescription>
                  </div>
                  {selectedTenant && stageBadge(selectedTenant.stage)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {checklist.length > 0 ? checklist.map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleCheck(c)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${c.is_done ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/30"}`}>
                      {c.is_done && "✓"}
                    </div>
                    <span className={`text-sm flex-1 ${c.is_done ? "line-through text-muted-foreground" : ""}`}>{c.label}</span>
                    <span className="text-[10px] text-muted-foreground">{c.target_day}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    {selectedTenant ? "No checklist items found" : "Select a company to view its onboarding checklist"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Default Onboarding Template</CardTitle>
                    <CardDescription className="text-xs">Applied to all new Block 3+ tenants</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Template editor opened")}>Edit Template</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-medium mb-3">5 stages · 12 tasks · Target: 10 days</p>
                <div className="space-y-2">
                  {STAGES.map(s => (
                    <div key={s.key} className="flex items-center gap-2 text-xs">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.key === "invited" ? "bg-amber-500" : s.key === "setup" ? "bg-orange-500" : s.key === "configuring" ? "bg-sky-600" : s.key === "training" ? "bg-violet-500" : "bg-emerald-500"}`} />
                      {s.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── 5-STEP ONBOARDING WIZARD ─── */}
      <Dialog open={wizOpen} onOpenChange={v => { if (!v) setWizOpen(false); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Onboard New Company</DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-4">
            {stepLabels.map((label, i) => {
              const step = i + 1;
              const done = wizStep > step;
              const active = wizStep === step;
              return (
                <div key={step} className="flex items-center gap-1 flex-1">
                  <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {done ? "✓" : step}
                  </div>
                  <span className={`text-[10px] hidden sm:inline ${active ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
                  {i < 4 && <div className="flex-1 h-px bg-border mx-1" />}
                </div>
              );
            })}
          </div>

          {/* Step 1: Company Info */}
          {wizStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">Company Information</h3>
                <p className="text-xs text-muted-foreground">Basic identity and registration details for this tenant</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label className="text-xs">Company Name *</Label><Input value={wiz.coName} onChange={e => setWiz(p => ({ ...p, coName: e.target.value }))} /></div>
                <div>
                  <Label className="text-xs">Industry *</Label>
                  <Select value={wiz.industry} onValueChange={v => setWiz(p => ({ ...p, industry: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>{INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Company Size *</Label>
                  <Select value={wiz.size} onValueChange={v => setWiz(p => ({ ...p, size: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>{SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">GSTIN *</Label><Input value={wiz.gstin} onChange={e => setWiz(p => ({ ...p, gstin: e.target.value }))} /></div>
                <div className="col-span-2"><Label className="text-xs">Registered Address *</Label><Input value={wiz.address} onChange={e => setWiz(p => ({ ...p, address: e.target.value }))} /></div>
                <div><Label className="text-xs">City</Label><Input value={wiz.city} onChange={e => setWiz(p => ({ ...p, city: e.target.value }))} /></div>
                <div>
                  <Label className="text-xs">State</Label>
                  <Select value={wiz.state} onValueChange={v => setWiz(p => ({ ...p, state: v }))}>
                    <SelectTrigger><SelectValue placeholder="State…" /></SelectTrigger>
                    <SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">PIN Code</Label><Input value={wiz.pin} onChange={e => setWiz(p => ({ ...p, pin: e.target.value }))} /></div>
                <div><Label className="text-xs">Primary Domain</Label><Input value={wiz.domain} onChange={e => setWiz(p => ({ ...p, domain: e.target.value }))} /></div>
                <div className="col-span-2">
                  <Label className="text-xs">Platform Subdomain *</Label>
                  <div className="flex items-center gap-1">
                    <Input value={wiz.subdomain} onChange={e => setWiz(p => ({ ...p, subdomain: e.target.value }))} className="flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">.unitoltms.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Block & Pricing */}
          {wizStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">Block & Pricing Setup</h3>
                <p className="text-xs text-muted-foreground">Select the seat block and configure billing — this directly drives MRR in Subscription & Billing</p>
              </div>
              <p className="text-xs font-medium text-muted-foreground">Select Seat Block (Tiered Per-Seat Pricing)</p>
              <div className="space-y-2">
                {BLOCKS.map(b => (
                  <div
                    key={b.id}
                    onClick={() => setWiz(p => ({ ...p, blockId: b.id }))}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${wiz.blockId === b.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/40"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{b.from} – {b.to} seats</p>
                        <p className="text-xs text-muted-foreground">
                          {b.rate ? `₹${b.rate} / seat / month · ₹${b.rate * 10} annual` : "₹0 · Up to 15 users · No credit card"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {b.id} — {b.desc} {b.incrRate ? `· default incr. rate ₹${b.incrRate}/seat` : "· converts to a block on signup"}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${wiz.blockId === b.id ? "border-primary bg-primary" : "border-muted-foreground/30"}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Seat Count *</Label>
                  <Input type="number" value={wiz.seats} onChange={e => setWiz(p => ({ ...p, seats: e.target.value }))} />
                  {selectedBlock && <p className="text-[10px] text-muted-foreground mt-1">Must be within {selectedBlock.from}–{selectedBlock.to} seats</p>}
                </div>
                <div>
                  <Label className="text-xs">Billing Cycle</Label>
                  <Select value={wiz.billing} onValueChange={v => setWiz(p => ({ ...p, billing: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual (2 months free)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Discount % (if any)</Label>
                  <Input type="number" value={wiz.discount} onChange={e => setWiz(p => ({ ...p, discount: e.target.value }))} placeholder="%" />
                </div>
                <div>
                  <Label className="text-xs">Custom Incremental Rate (₹/seat/mo)</Label>
                  <Input type="number" value={wiz.incrRate} onChange={e => setWiz(p => ({ ...p, incrRate: e.target.value }))} placeholder="₹" />
                  <p className="text-[10px] text-muted-foreground mt-1">Rate for seats beyond this block, specific to this company</p>
                </div>
              </div>

              {priceCalc && (
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold mb-2">💰 Live Price Calculation</p>
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                      <span className="text-muted-foreground">Block rate</span><span className="font-mono text-right">₹{priceCalc.rate}/seat/mo</span>
                      <span className="text-muted-foreground">Seat count</span><span className="font-mono text-right">{priceCalc.seats} seats</span>
                      <span className="text-muted-foreground">Gross monthly charge</span><span className="font-mono text-right">{fmtR(priceCalc.gross)}/mo</span>
                      <span className="text-muted-foreground">Discount applied</span><span className="font-mono text-right">{priceCalc.discAmt ? `−${fmtR(priceCalc.discAmt)} (${priceCalc.disc}%)` : "None"}</span>
                      <span className="text-muted-foreground font-semibold">Net MRR</span><span className="font-mono text-right font-semibold">{fmtR(priceCalc.net)}/mo</span>
                      <span className="text-muted-foreground font-semibold">Annual contract value</span><span className="font-mono text-right font-semibold">{fmtR(priceCalc.acv)}{priceCalc.cycle === "annual" ? " (×10)" : priceCalc.cycle === "quarterly" ? " (×3)" : ""}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Admin Setup */}
          {wizStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">Admin Setup</h3>
                <p className="text-xs text-muted-foreground">Set up the primary company admin who will receive the invite email</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Admin Full Name *</Label><Input value={wiz.adminName} onChange={e => setWiz(p => ({ ...p, adminName: e.target.value }))} /></div>
                <div><Label className="text-xs">Admin Email *</Label><Input type="email" value={wiz.adminEmail} onChange={e => setWiz(p => ({ ...p, adminEmail: e.target.value }))} /></div>
                <div><Label className="text-xs">Designation</Label><Input value={wiz.adminDesignation} onChange={e => setWiz(p => ({ ...p, adminDesignation: e.target.value }))} /></div>
                <div>
                  <Label className="text-xs">Role</Label>
                  <Select value={wiz.adminRole} onValueChange={v => setWiz(p => ({ ...p, adminRole: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r === "Company Admin" ? `${r} (full access)` : r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs font-medium mb-2">Billing Contact</p>
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox checked={wiz.bcSameAsAdmin} onCheckedChange={v => setWiz(p => ({ ...p, bcSameAsAdmin: !!v }))} />
                  <Label className="text-xs">Same as primary admin</Label>
                </div>
                {!wiz.bcSameAsAdmin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Name</Label><Input value={wiz.bcName} onChange={e => setWiz(p => ({ ...p, bcName: e.target.value }))} /></div>
                    <div><Label className="text-xs">Email</Label><Input type="email" value={wiz.bcEmail} onChange={e => setWiz(p => ({ ...p, bcEmail: e.target.value }))} /></div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <Label className="text-xs">Assign CSM</Label>
                  <Select value={wiz.csm} onValueChange={v => setWiz(p => ({ ...p, csm: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CSMS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Contract Start Date</Label><Input type="date" value={wiz.startDate} onChange={e => setWiz(p => ({ ...p, startDate: e.target.value }))} /></div>
              </div>
            </div>
          )}

          {/* Step 4: Content & Features */}
          {wizStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">Content & Features</h3>
                <p className="text-xs text-muted-foreground">Pre-load content and configure initial settings for this company</p>
              </div>
              <div>
                <Label className="text-xs">Default Content Template</Label>
                <Select value={wiz.template} onValueChange={v => setWiz(p => ({ ...p, template: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select template…" /></SelectTrigger>
                  <SelectContent>{CONTENT_TEMPLATES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Internal Notes for CSM</Label>
                <Textarea value={wiz.notes} onChange={e => setWiz(p => ({ ...p, notes: e.target.value }))} rows={3} />
              </div>
              <div className="space-y-2 border-t pt-3">
                {[
                  { key: "autoConfigure" as const, label: "Auto-configure on account creation" },
                  { key: "sendInvite" as const, label: "Send invite email to admin immediately" },
                  { key: "createChecklist" as const, label: "Create 14-task onboarding checklist automatically" },
                  { key: "addToPipeline" as const, label: "Add to pipeline board (Invited stage)" },
                  { key: "genInvoice" as const, label: "Generate first invoice immediately" },
                ].map(opt => (
                  <div key={opt.key} className="flex items-center gap-2">
                    <Checkbox checked={wiz[opt.key]} onCheckedChange={v => setWiz(p => ({ ...p, [opt.key]: !!v }))} />
                    <Label className="text-xs">{opt.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {wizStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">Review & Launch</h3>
                <p className="text-xs text-muted-foreground">Confirm all details before creating the company and sending the admin invite</p>
              </div>
              <div className="space-y-3">
                <ReviewSection title="Company Info" items={[
                  ["Company", wiz.coName || "—"],
                  ["Industry / Size", `${wiz.industry || "—"} · ${wiz.size || "—"}`],
                  ["GSTIN", wiz.gstin || "—"],
                  ["Platform URL", wiz.subdomain ? `${wiz.subdomain}.unitoltms.com` : "—"],
                ]} />
                <ReviewSection title="Block & Billing" items={[
                  ["Block assigned", selectedBlock ? `${selectedBlock.label} (${selectedBlock.from}–${selectedBlock.to} seats)` : "Not selected"],
                  ["Seats / Rate", wiz.seats ? `${wiz.seats} seats @ ₹${selectedBlock?.rate || 0}/seat/mo` : "—"],
                  ["Billing cycle", wiz.billing.charAt(0).toUpperCase() + wiz.billing.slice(1)],
                  ["Discount", wiz.discount ? `${wiz.discount}% off block charge` : "No discount"],
                  ["Custom incr. rate", wiz.incrRate ? `₹${wiz.incrRate}/seat (custom)` : `Block default (₹${selectedBlock?.incrRate || "—"}/seat)`],
                  ["Net MRR", priceCalc ? `${fmtR(priceCalc.net)}/month` : "—"],
                  ["Annual Contract Value", priceCalc ? `${fmtR(priceCalc.acv)}${priceCalc.cycle === "annual" ? " (annual · 2 mo free)" : ""}` : "—"],
                ]} />
                <ReviewSection title="People" items={[
                  ["Primary Admin", wiz.adminName ? `${wiz.adminName} (${wiz.adminEmail})` : "—"],
                  ["Billing Contact", wiz.bcSameAsAdmin ? "Same as admin" : wiz.bcName || "—"],
                  ["CSM", wiz.csm],
                  ["Contract Start", wiz.startDate || "—"],
                ]} />
              </div>
              <Card className="bg-sky-50 dark:bg-sky-950/20 border-sky-200">
                <CardContent className="p-3 text-xs text-muted-foreground">
                  <strong>What happens next:</strong> Company account created instantly → Admin receives invite email → Admin sets password → Setup wizard with 12-task checklist → Tracked in pipeline board under "Invited" stage.
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-3 mt-2">
            <span className="text-[10px] text-muted-foreground">Step {wizStep} of 5 — {stepLabels[wizStep - 1]}</span>
            <div className="flex gap-2">
              {wizStep > 1 && <Button variant="outline" size="sm" onClick={() => setWizStep(s => s - 1)}><ChevronLeft className="w-3 h-3 mr-1" /> Back</Button>}
              <Button variant="outline" size="sm" onClick={() => setWizOpen(false)}>Cancel</Button>
              {wizStep < 5 ? (
                <Button size="sm" onClick={() => setWizStep(s => s + 1)}>Next <ChevronRight className="w-3 h-3 ml-1" /></Button>
              ) : (
                <Button size="sm" onClick={handleOnboard}><Rocket className="w-3 h-3 mr-1" /> Create & Send Invite</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── small review section ─── */
function ReviewSection({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="border rounded-lg p-3">
      <p className="text-xs font-semibold mb-2">{title}</p>
      <div className="grid grid-cols-2 gap-y-1 text-xs">
        {items.map(([label, value]) => (
          <div key={label} className="contents">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
