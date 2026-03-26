import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CreditCard, Download, Plus, TrendingUp, AlertCircle,
  AlertTriangle, CheckCircle, Clock, Eye, Send, Ban, FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Types ──────────────────────────────────────────────────
interface Company { id: string; name: string; slug: string; is_active: boolean; }
interface Payment {
  id: string; company_id: string; plan_name: string; plan_status: string;
  amount: number | null; billing_cycle: string | null; notes: string | null;
  last_payment_date: string | null; start_date: string | null; end_date: string | null;
  seats_included: number | null; renewal_date: string | null;
  block_id: string | null; block_seats: number | null; incremental_seats: number | null;
  incremental_rate: number | null; discount_percent: number | null; change_reason: string | null;
  created_at: string; updated_at: string;
}
interface Invoice {
  id: string; invoice_number: string; company_id: string; payment_id: string | null;
  plan_name: string; amount: number; tax_amount: number; total_amount: number;
  due_date: string; payment_date: string | null; status: string; notes: string | null;
  block_id: string | null; block_charge: number | null; incremental_charge: number | null;
  discount_amount: number | null; created_at: string;
}

// ─── Block definitions (tiered per-seat pricing) ────────────
const BLOCKS = [
  { id: "block_1", label: "Block 1 — Starter", range: "1 – 100 seats", min: 1, max: 100, rate: 499, incrRate: 549, annualRate: 4990, count: 18 },
  { id: "block_2", label: "Block 2 — Growth", range: "101 – 250 seats", min: 101, max: 250, rate: 449, incrRate: 499, annualRate: 4490, count: 14 },
  { id: "block_3", label: "Block 3 — Pro", range: "251 – 500 seats", min: 251, max: 500, rate: 399, incrRate: 449, annualRate: 3990, count: 9 },
  { id: "block_4", label: "Block 4 — Enterprise", range: "501 – 1000 seats", min: 501, max: 1000, rate: 349, incrRate: 399, annualRate: 3490, count: 4 },
];

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  trial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Trial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const BLOCK_BADGE: Record<string, string> = {
  block_1: "bg-emerald-100 text-emerald-700",
  block_2: "bg-teal-100 text-teal-700",
  block_3: "bg-violet-100 text-violet-700",
  block_4: "bg-indigo-100 text-indigo-700",
};

const INV_STATUS_BADGE: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  Paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  Pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  Overdue: "bg-red-100 text-red-700",
};

function avatarBg(name: string) {
  const colors = ["bg-rose-600", "bg-blue-600", "bg-violet-600", "bg-teal-600", "bg-amber-600", "bg-indigo-600", "bg-emerald-600", "bg-orange-600"];
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}
function initials(name: string) { return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase(); }
function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }
function fmtDate(d: string | null) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }); }

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function getBlock(blockId: string | null) {
  return BLOCKS.find(b => b.id === blockId) || BLOCKS[0];
}

function getMRR(p: Payment) {
  const blk = getBlock(p.block_id);
  const blockSeats = p.block_seats || 0;
  const incrSeats = p.incremental_seats || 0;
  const disc = p.discount_percent || 0;
  const effIncrRate = p.incremental_rate || blk.incrRate;
  const blockCharge = blockSeats * blk.rate;
  const incrCharge = incrSeats * effIncrRate;
  const discAmt = Math.round(blockCharge * disc / 100);
  return { block: blockCharge, incr: incrCharge, disc: discAmt, net: blockCharge + incrCharge - discAmt };
}

// ─── Component ──────────────────────────────────────────────
export default function SubscriptionBilling() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [mainTab, setMainTab] = useState("subs");
  const [blockFilter, setBlockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [renewalFilter, setRenewalFilter] = useState("any");
  const [invStatusFilter, setInvStatusFilter] = useState("all");
  const [invPeriodFilter, setInvPeriodFilter] = useState("3m");

  // Modals
  const [assignOpen, setAssignOpen] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState<{ payment: Payment; company: Company } | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<{ company: Company; payment: Payment } | null>(null);

  // Assign form
  const [assignForm, setAssignForm] = useState({
    company_id: "", block_id: "", seats: 0, billing_cycle: "Monthly",
    discount: 0, effective_date: new Date().toISOString().split("T")[0],
    change_reason: "New signup"
  });

  // ─── Data fetching ───────────────────────────────────────
  const { data: companies = [] } = useQuery({
    queryKey: ["sa-companies"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("companies").select("*").order("name");
      if (error) throw error;
      return data as Company[];
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["sa-payments-billing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_payments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Payment[];
    },
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["sa-invoices"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("subscription_invoices").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Invoice[];
    },
  });

  // ─── Mutations ───────────────────────────────────────────
  const assignBlockMutation = useMutation({
    mutationFn: async (form: typeof assignForm) => {
      const blk = getBlock(form.block_id);
      const blockCharge = form.seats * blk.rate;
      const discAmt = Math.round(blockCharge * form.discount / 100);
      const netMRR = blockCharge - discAmt;
      const { error } = await supabase.from("company_payments").insert({
        company_id: form.company_id,
        plan_name: blk.label,
        plan_status: "active",
        amount: netMRR,
        billing_cycle: form.billing_cycle,
        seats_included: form.seats,
        block_id: form.block_id,
        block_seats: form.seats,
        incremental_seats: 0,
        discount_percent: form.discount,
        change_reason: form.change_reason,
        start_date: form.effective_date,
        renewal_date: calculateRenewal(form.effective_date, form.billing_cycle),
        last_payment_date: new Date().toISOString().split("T")[0],
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sa-payments-billing"] });
      toast({ title: "Block assigned successfully" });
      setAssignOpen(false);
      resetAssignForm();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const suspendMutation = useMutation({
    mutationFn: async ({ paymentId, reason }: { paymentId: string; reason: string }) => {
      const { error } = await supabase.from("company_payments").update({ plan_status: "suspended", notes: reason } as any).eq("id", paymentId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sa-payments-billing"] });
      toast({ title: "Subscription suspended" });
      setSuspendTarget(null);
    },
  });

  function resetAssignForm() {
    setAssignForm({ company_id: "", block_id: "", seats: 0, billing_cycle: "Monthly", discount: 0, effective_date: new Date().toISOString().split("T")[0], change_reason: "New signup" });
  }

  // ─── Computed ────────────────────────────────────────────
  const getPayment = (companyId: string) => payments.find(p => p.company_id === companyId);
  const getCompany = (companyId: string) => companies.find(c => c.id === companyId);

  const activePayments = payments.filter(p => p.plan_status === "active");
  const totalMRR = activePayments.reduce((s, p) => s + getMRR(p).net, 0);
  const incrMRR = activePayments.reduce((s, p) => s + getMRR(p).incr, 0);
  const incrCompanies = activePayments.filter(p => (p.incremental_seats || 0) > 0).length;
  const renewalsDue = payments.filter(p => { const d = daysUntil(p.renewal_date); return d !== null && d >= 0 && d <= 30; }).length;
  const renewalAtRisk = payments.filter(p => { const d = daysUntil(p.renewal_date); return d !== null && d >= 0 && d <= 30; }).reduce((s, p) => s + getMRR(p).net, 0);

  // Revenue chart (stacked)
  const revenueChart = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1);
      const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      // Aggregate from payments
      let block = 0, incr = 0, disc = 0;
      payments.forEach(p => {
        if (p.last_payment_date) {
          const pd = new Date(p.last_payment_date);
          if (pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear()) {
            const mrr = getMRR(p);
            block += mrr.block;
            incr += mrr.incr;
            disc += mrr.disc;
          }
        }
      });
      return { month: label, Block: +(block / 100000).toFixed(2), Incremental: +(incr / 100000).toFixed(2), Discount: +(disc / 100000).toFixed(2) };
    });
  }, [payments]);

  // Filtered subscriptions
  const filteredSubs = useMemo(() => {
    return companies.filter(c => {
      const p = getPayment(c.id);
      if (blockFilter !== "all" && (!p || p.block_id !== blockFilter)) return false;
      if (statusFilter !== "all" && (!p || p.plan_status !== statusFilter)) return false;
      if (renewalFilter === "week") { const d = daysUntil(p?.renewal_date || null); if (d === null || d < 0 || d > 7) return false; }
      if (renewalFilter === "month") { const d = daysUntil(p?.renewal_date || null); if (d === null || d < 0 || d > 30) return false; }
      if (renewalFilter === "overdue") { const d = daysUntil(p?.renewal_date || null); if (d === null || d >= 0) return false; }
      return true;
    });
  }, [companies, payments, blockFilter, statusFilter, renewalFilter]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (invStatusFilter !== "all" && inv.status.toLowerCase() !== invStatusFilter) return false;
      return true;
    });
  }, [invoices, invStatusFilter]);

  const overdueInvoices = invoices.filter(i => i.status.toLowerCase() === "overdue").length;
  const withIncr = useMemo(() => payments.filter(p => (p.incremental_seats || 0) > 0), [payments]);

  // Assign form live calc
  const assignCalc = useMemo(() => {
    if (!assignForm.block_id || !assignForm.seats) return null;
    const blk = getBlock(assignForm.block_id);
    const gross = blk.rate * assignForm.seats;
    const discAmt = Math.round(gross * assignForm.discount / 100);
    const net = gross - discAmt;
    const multiplier = assignForm.billing_cycle === "Annual" ? 10 : assignForm.billing_cycle === "Quarterly" ? 3 : 1;
    const acv = net * multiplier;
    const acvNote = assignForm.billing_cycle === "Annual" ? "×10 — 2mo free" : assignForm.billing_cycle === "Quarterly" ? "×3" : "×1";
    return { rate: blk.rate, seats: assignForm.seats, gross, discAmt, net, acv, acvNote };
  }, [assignForm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Subscription & Billing
          </h1>
          <p className="text-muted-foreground text-sm">Block-based MRR, invoices with seat breakdowns, renewal tracking and discount visibility</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={() => setAssignOpen(true)}><Plus className="h-4 w-4 mr-2" />Assign Block</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CreditCard className="h-4 w-4 text-blue-600" />} iconBg="bg-blue-50 dark:bg-blue-900/30"
          label="Total MRR" value={totalMRR ? fmt(totalMRR) : "—"}
          trend={<span className="text-emerald-600 text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" />↑ 11.2% vs last month</span>} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-violet-600" />} iconBg="bg-violet-50 dark:bg-violet-900/30"
          label="Incremental MRR" value={incrMRR ? fmt(incrMRR) : "—"}
          trend={<span className="text-muted-foreground text-xs">From {incrCompanies} companies with incr. seats</span>} />
        <StatCard icon={<CheckCircle className="h-4 w-4 text-emerald-600" />} iconBg="bg-emerald-50 dark:bg-emerald-900/30"
          label="Active Subscriptions" value={`${activePayments.length}`}
          trend={<span className="text-emerald-600 text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" />{payments.filter(p => {
            const d = new Date(p.created_at); const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length} new this month</span>} />
        <StatCard icon={<Clock className="h-4 w-4 text-amber-600" />} iconBg="bg-amber-50 dark:bg-amber-900/30"
          label="Renewals Due (30d)" value={`${renewalsDue}`}
          trend={<span className="text-amber-600 text-xs flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{renewalAtRisk ? `₹${(renewalAtRisk / 100000).toFixed(1)}L at risk` : "Action needed"}</span>} />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-sm">MRR Trend — Block vs Incremental vs Discount</p>
              <p className="text-xs text-muted-foreground">Monthly billed (₹ Lakhs) — last 8 months</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number, name: string) => [`₹${v.toFixed(2)}L`, name]} />
                <Legend />
                <Bar dataKey="Block" stackId="a" fill="hsl(220, 90%, 56%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Incremental" stackId="a" fill="hsl(270, 70%, 60%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Discount" fill="hsl(0, 70%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="subs" className="gap-1.5">
            Subscriptions <Badge variant="secondary" className="ml-1 text-xs">{companies.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inv" className="gap-1.5">
            Invoices {overdueInvoices > 0 && <Badge variant="destructive" className="ml-1 text-xs">{overdueInvoices} overdue</Badge>}
          </TabsTrigger>
          <TabsTrigger value="incr" className="gap-1.5">
            Incremental Billing <Badge variant="secondary" className="ml-1 text-xs">{withIncr.length} companies</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ─── Subscriptions Tab ─── */}
      {mainTab === "subs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Select value={blockFilter} onValueChange={setBlockFilter}>
                <SelectTrigger className="w-[170px] h-9"><SelectValue placeholder="All Blocks" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blocks</SelectItem>
                  {BLOCKS.map(b => <SelectItem key={b.id} value={b.id}>{b.label.split(" — ")[0]} ({b.range.split(" ")[0]}–{b.range.split("–")[1]?.trim().split(" ")[0]})</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={renewalFilter} onValueChange={setRenewalFilter}>
                <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Renewal: Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Renewal: Any</SelectItem>
                  <SelectItem value="week">Due this week</SelectItem>
                  <SelectItem value="month">Due this month</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">{filteredSubs.length} companies</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Company</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Block</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Status</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Seats</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Billing Cycle</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">MRR (computed)</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Next Renewal</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubs.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No subscriptions match filters</TableCell></TableRow>
                  ) : filteredSubs.map(company => {
                    const p = getPayment(company.id);
                    const blk = getBlock(p?.block_id || null);
                    const status = p?.plan_status || "active";
                    const renewDays = daysUntil(p?.renewal_date || null);
                    const mrr = p ? getMRR(p) : null;
                    const blockSeats = p?.block_seats || 0;
                    const incrSeats = p?.incremental_seats || 0;

                    return (
                      <TableRow key={company.id} className={status === "suspended" ? "bg-amber-50/50 dark:bg-amber-900/10" : status === "expired" ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${avatarBg(company.name)}`}>
                              {initials(company.name)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{company.name}</p>
                              <p className="text-xs text-muted-foreground">{company.slug}.unitoltms.com</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {p?.block_id ? (
                            <div>
                              <Badge className={`text-xs border-0 ${BLOCK_BADGE[p.block_id] || "bg-muted"}`}>{blk.label.split(" — ")[0]}</Badge>
                              <p className="text-[10px] text-muted-foreground mt-0.5">@₹{blk.rate}/seat</p>
                              {incrSeats > 0 && <p className="text-[10px] text-violet-600">+incr @₹{p.incremental_rate || blk.incrRate}</p>}
                            </div>
                          ) : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${status === "active" ? "bg-emerald-500" : status === "trial" ? "bg-blue-500" : status === "suspended" ? "bg-amber-500" : "bg-red-500"}`} />
                            <span className="text-sm capitalize">{status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-sm">{blockSeats}</span>
                          {incrSeats > 0 && <span className="text-violet-600 text-xs ml-1">+{incrSeats}</span>}
                        </TableCell>
                        <TableCell><span className="text-sm">{p?.billing_cycle || "—"}</span></TableCell>
                        <TableCell>
                          {mrr ? (
                            <div>
                              <p className="font-mono text-sm font-medium">{fmt(mrr.net)}</p>
                              <div className="text-[10px] text-muted-foreground space-x-1">
                                {mrr.block > 0 && <span>B: {fmt(mrr.block)}</span>}
                                {mrr.incr > 0 && <span className="text-violet-600">+I: {fmt(mrr.incr)}</span>}
                                {mrr.disc > 0 && <span className="text-red-500">−D: {fmt(mrr.disc)}</span>}
                              </div>
                            </div>
                          ) : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell>
                          {p?.renewal_date ? (
                            <div>
                              <p className="text-sm">{fmtDate(p.renewal_date)}</p>
                              {renewDays !== null && renewDays <= 30 && renewDays >= 0 && <p className="text-xs text-amber-600">{renewDays}d left</p>}
                              {renewDays !== null && renewDays < 0 && <p className="text-xs text-red-600">{Math.abs(renewDays)}d overdue</p>}
                            </div>
                          ) : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                              setAssignForm(prev => ({ ...prev, company_id: company.id, block_id: p?.block_id || "", seats: p?.block_seats || 0 }));
                              setAssignOpen(true);
                            }}>Change Block</Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => p && setInvoiceDetail({ payment: p, company })}>
                              <FileText className="h-3 w-3" />
                            </Button>
                            {status !== "suspended" && (
                              <Button variant="outline" size="sm" className="h-7 text-xs text-amber-600 hover:text-amber-700" onClick={() => p && setSuspendTarget({ company, payment: p })}>
                                <Ban className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Invoices Tab ─── */}
      {mainTab === "inv" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Select value={invStatusFilter} onValueChange={setInvStatusFilter}>
                <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={invPeriodFilter} onValueChange={setInvPeriodFilter}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="fy">This FY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">{filteredInvoices.length} invoices</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Invoice #</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Company</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Block</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Block Charge</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Incr. Charge</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Discount</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Total</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Due Date</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Status</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No invoices yet.</TableCell></TableRow>
                  ) : filteredInvoices.map(inv => {
                    const company = getCompany(inv.company_id);
                    const blk = getBlock(inv.block_id);
                    return (
                      <TableRow key={inv.id} className={inv.status.toLowerCase() === "overdue" ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                        <TableCell><span className="font-mono text-sm">{inv.invoice_number}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded flex items-center justify-center text-white text-[10px] font-bold ${avatarBg(company?.name || "")}`}>
                              {initials(company?.name || "?")}
                            </div>
                            <span className="text-sm">{company?.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge className={`text-xs border-0 ${BLOCK_BADGE[inv.block_id || ""] || "bg-muted"}`}>{blk.label.split(" — ")[0]}</Badge></TableCell>
                        <TableCell><span className="font-mono text-sm">{inv.block_charge ? fmt(inv.block_charge) : "—"}</span></TableCell>
                        <TableCell><span className="font-mono text-sm">{inv.incremental_charge ? fmt(inv.incremental_charge) : "None"}</span></TableCell>
                        <TableCell><span className="font-mono text-sm text-red-500">{inv.discount_amount ? `−${fmt(inv.discount_amount)}` : "—"}</span></TableCell>
                        <TableCell>
                          <span className="font-mono text-sm font-medium">{fmt(inv.total_amount)}</span>
                          <p className="text-[10px] text-muted-foreground">incl. GST 18%</p>
                        </TableCell>
                        <TableCell><span className="text-sm">{fmtDate(inv.due_date)}</span></TableCell>
                        <TableCell>
                          <Badge className={`text-xs border-0 capitalize ${INV_STATUS_BADGE[inv.status] || "bg-muted"}`}>{inv.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                              const p = payments.find(pp => pp.id === inv.payment_id);
                              if (p && company) setInvoiceDetail({ payment: p, company });
                            }}>
                              <Eye className="h-3 w-3 mr-1" />View
                            </Button>
                            {inv.status.toLowerCase() !== "paid" && (
                              <Button variant="outline" size="sm" className="h-7 text-xs"><Send className="h-3 w-3 mr-1" />Remind</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Incremental Billing Tab ─── */}
      {mainTab === "incr" && (
        <div className="space-y-4">
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 border border-violet-200 dark:border-violet-800">
            <p className="text-sm text-violet-800 dark:text-violet-300">
              These companies have incremental seats billed on top of their block allocation this month. Total incremental MRR: <strong>{incrMRR ? fmt(incrMRR) : "—"}</strong>
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Company</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Block</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Block Seats</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Incr. Seats</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Incr. Rate</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Block Charge/mo</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Incr. Charge/mo</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Total MRR</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withIncr.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No companies with incremental billing</TableCell></TableRow>
                  ) : withIncr.map(p => {
                    const company = getCompany(p.company_id);
                    const blk = getBlock(p.block_id);
                    const mrr = getMRR(p);
                    const effRate = p.incremental_rate || blk.incrRate;
                    return (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded flex items-center justify-center text-white text-[10px] font-bold ${avatarBg(company?.name || "")}`}>
                              {initials(company?.name || "?")}
                            </div>
                            <span className="text-sm font-medium">{company?.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge className={`text-xs border-0 ${BLOCK_BADGE[p.block_id || ""] || "bg-muted"}`}>{blk.label.split(" — ")[0]}</Badge></TableCell>
                        <TableCell><span className="text-sm">{p.block_seats}</span></TableCell>
                        <TableCell><span className="text-sm font-bold text-violet-600">+{p.incremental_seats}</span></TableCell>
                        <TableCell>
                          <div>
                            <span className="text-sm">₹{effRate}/seat</span>
                            <p className="text-[10px] text-muted-foreground">{p.incremental_rate ? "custom" : "block default"}</p>
                          </div>
                        </TableCell>
                        <TableCell><span className="font-mono text-sm">{fmt(mrr.block)}</span></TableCell>
                        <TableCell><span className="font-mono text-sm text-violet-600">{fmt(mrr.incr)}</span></TableCell>
                        <TableCell>
                          <span className="font-mono text-sm font-medium">{fmt(mrr.net)}</span>
                          {mrr.disc > 0 && <p className="text-[10px] text-red-500">disc: −{fmt(mrr.disc)}</p>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => company && setInvoiceDetail({ payment: p, company })}>Invoice</Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                              setAssignForm(prev => ({ ...prev, company_id: p.company_id, block_id: p.block_id || "", seats: p.block_seats || 0 }));
                              setAssignOpen(true);
                            }}>Change Block</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Assign / Change Block Modal ─── */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Assign / Change Block</DialogTitle></DialogHeader>
          <div className="space-y-5">
            {/* Company */}
            <div>
              <Label>Company *</Label>
              <Select value={assignForm.company_id} onValueChange={v => setAssignForm(prev => ({ ...prev, company_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select company…" /></SelectTrigger>
                <SelectContent>
                  {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Block Selection */}
            <div>
              <Label>Select Block (Tiered Per-Seat Pricing) *</Label>
              <div className="space-y-2 mt-2">
                {BLOCKS.map(blk => (
                  <button key={blk.id} onClick={() => setAssignForm(prev => ({ ...prev, block_id: blk.id, seats: Math.max(prev.seats || blk.min, blk.min) }))}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${assignForm.block_id === blk.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{blk.range}</p>
                        <p className="text-xs text-muted-foreground">₹{blk.rate} / seat / month</p>
                        <p className="text-xs text-muted-foreground">{blk.label} · {blk.count} companies</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Annual rate</p>
                        <p className="text-sm font-medium">₹{blk.annualRate.toLocaleString("en-IN")}/seat</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seats & Billing */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Seat Count *</Label>
                <Input type="number" value={assignForm.seats || ""} onChange={e => setAssignForm(prev => ({ ...prev, seats: Number(e.target.value) }))} />
                {assignForm.block_id && (
                  <p className="text-[10px] text-muted-foreground mt-1">Must fall within the selected block's range</p>
                )}
              </div>
              <div>
                <Label>Billing Cycle</Label>
                <Select value={assignForm.billing_cycle} onValueChange={v => setAssignForm(prev => ({ ...prev, billing_cycle: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Discount & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Discount % (if any)</Label>
                <div className="relative">
                  <Input type="number" value={assignForm.discount || ""} onChange={e => setAssignForm(prev => ({ ...prev, discount: Number(e.target.value) }))} className="pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </div>
              <div>
                <Label>Effective Date</Label>
                <Input type="date" value={assignForm.effective_date} onChange={e => setAssignForm(prev => ({ ...prev, effective_date: e.target.value }))} />
              </div>
            </div>

            {/* Live Price Calculation */}
            {assignCalc && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-1.5">
                <p className="font-semibold text-sm mb-2">Live Price Calculation</p>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Block rate</span><span className="font-mono">₹{assignCalc.rate}/seat/mo</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Seat count</span><span className="font-mono">{assignCalc.seats} seats</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gross monthly charge</span><span className="font-mono">{fmt(assignCalc.gross)}/mo</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount applied</span><span className="font-mono">{assignCalc.discAmt ? `−${fmt(assignCalc.discAmt)}/mo (${assignForm.discount}%)` : "None"}</span></div>
                <div className="flex justify-between text-sm font-semibold border-t pt-1.5"><span>Net MRR</span><span className="font-mono">{fmt(assignCalc.net)}/mo</span></div>
                <div className="flex justify-between text-sm font-semibold"><span>Annual contract value</span><span className="font-mono">{fmt(assignCalc.acv)} ({assignCalc.acvNote})</span></div>
              </div>
            )}

            {/* Reason */}
            <div>
              <Label>Reason for Change</Label>
              <Select value={assignForm.change_reason} onValueChange={v => setAssignForm(prev => ({ ...prev, change_reason: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="New signup">New signup</SelectItem>
                  <SelectItem value="Upgrade — company request">Upgrade — company request</SelectItem>
                  <SelectItem value="Downgrade — non-renewal">Downgrade — non-renewal</SelectItem>
                  <SelectItem value="Trial conversion">Trial conversion</SelectItem>
                  <SelectItem value="Contract renegotiation">Contract renegotiation</SelectItem>
                  <SelectItem value="Admin override">Admin override</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setAssignOpen(false); resetAssignForm(); }}>Cancel</Button>
              <Button onClick={() => assignBlockMutation.mutate(assignForm)} disabled={!assignForm.company_id || !assignForm.block_id || !assignForm.seats || assignBlockMutation.isPending}>
                {assignBlockMutation.isPending ? "Assigning..." : "Assign & Update Billing"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Invoice Detail Modal ─── */}
      <Dialog open={!!invoiceDetail} onOpenChange={open => !open && setInvoiceDetail(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Invoice — {invoiceDetail?.company.name}</DialogTitle></DialogHeader>
          {invoiceDetail && (() => {
            const { payment: p, company } = invoiceDetail;
            const blk = getBlock(p.block_id);
            const mrr = getMRR(p);
            const gst = Math.round(mrr.net * 0.18);
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{blk.label} · {p.block_seats} seats{(p.incremental_seats || 0) > 0 ? ` + ${p.incremental_seats} incr.` : ""}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs border-0">Paid</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Invoice Date</p><p>{fmtDate(p.start_date)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Due Date</p><p>{fmtDate(p.renewal_date)}</p></div>
                </div>
                <div className="space-y-2 border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Block charge ({p.block_seats} seats × ₹{blk.rate})</span>
                    <span className="font-mono">{fmt(mrr.block)}</span>
                  </div>
                  {mrr.incr > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Incremental ({p.incremental_seats} × ₹{p.incremental_rate || blk.incrRate})</span>
                      <span className="font-mono">{fmt(mrr.incr)}</span>
                    </div>
                  )}
                  {mrr.disc > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount ({p.discount_percent}% on block)</span>
                      <span className="font-mono text-red-500">−{fmt(mrr.disc)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">{fmt(mrr.net)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-mono">{fmt(gst)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="font-mono">{fmt(mrr.net + gst)}</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setInvoiceDetail(null)}>Close</Button>
                  <Button variant="outline" size="sm"><FileText className="h-3 w-3 mr-1" />PDF</Button>
                  <Button variant="outline" size="sm"><Send className="h-3 w-3 mr-1" />Send Reminder</Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ─── Suspend Modal ─── */}
      <SuspendModal target={suspendTarget} onClose={() => setSuspendTarget(null)} onConfirm={(reason) => {
        if (suspendTarget) suspendMutation.mutate({ paymentId: suspendTarget.payment.id, reason });
      }} />
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────
function StatCard({ icon, iconBg, label, value, trend }: { icon: React.ReactNode; iconBg: string; label: string; value: string; trend: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}>{icon}</div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        <div className="mt-1">{trend}</div>
      </CardContent>
    </Card>
  );
}

function SuspendModal({ target, onClose, onConfirm }: { target: { company: Company; payment: Payment } | null; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("Non-payment");
  const [note, setNote] = useState("");
  if (!target) return null;
  return (
    <Dialog open={!!target} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2 text-amber-600"><AlertTriangle className="h-5 w-5" />Suspend Subscription</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">
          Suspending <strong>{target.company.name}</strong> will immediately revoke access for all users.
        </p>
        <div className="space-y-3">
          <div>
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Non-payment">Non-payment</SelectItem>
                <SelectItem value="Policy violation">Policy violation</SelectItem>
                <SelectItem value="Account review">Account review</SelectItem>
                <SelectItem value="Client request">Client request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Internal Note</Label>
            <Textarea value={note} onChange={e => setNote(e.target.value)} rows={2} />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => onConfirm(`${reason}${note ? ": " + note : ""}`)}>Suspend Access</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function calculateRenewal(startDate: string, cycle: string): string {
  const d = new Date(startDate);
  if (cycle === "Monthly") d.setMonth(d.getMonth() + 1);
  else if (cycle === "Quarterly") d.setMonth(d.getMonth() + 3);
  else d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}
