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
  CreditCard, Download, Plus, TrendingUp, TrendingDown, AlertCircle,
  AlertTriangle, CheckCircle, Clock, Eye, Send, Ban
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── Types ──────────────────────────────────────────────────
interface Company { id: string; name: string; slug: string; is_active: boolean; }
interface Payment {
  id: string; company_id: string; plan_name: string; plan_status: string;
  amount: number | null; billing_cycle: string | null; notes: string | null;
  last_payment_date: string | null; start_date: string | null; end_date: string | null;
  seats_included: number | null; renewal_date: string | null;
  created_at: string; updated_at: string;
}
interface Invoice {
  id: string; invoice_number: string; company_id: string; payment_id: string | null;
  plan_name: string; amount: number; tax_amount: number; total_amount: number;
  due_date: string; payment_date: string | null; status: string; notes: string | null;
  created_at: string;
}

// ─── Plan definitions ───────────────────────────────────────
const PLANS = [
  { name: "Starter", price: 4999, label: "₹4,999/mo", seats: 30, features: ["Up to 30 users", "5 courses", "Basic reports", "Email support"] },
  { name: "Growth", price: 12999, label: "₹12,999/mo", seats: 100, features: ["Up to 100 users", "Unlimited courses", "Advanced analytics", "Priority support"] },
  { name: "Pro", price: 24999, label: "₹24,999/mo", seats: 250, features: ["Up to 250 users", "All modules", "Custom branding", "API access"] },
  { name: "Enterprise", price: 0, label: "Custom", seats: 9999, features: ["Unlimited users", "White-label", "Dedicated CSM", "SLA guarantee"] },
  { name: "Trial", price: 0, label: "Free · 30d", seats: 15, features: ["Up to 15 users", "Limited modules", "No credit card"] },
];

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  trial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const PLAN_BADGE: Record<string, string> = {
  Enterprise: "bg-indigo-100 text-indigo-700",
  Pro: "bg-violet-100 text-violet-700",
  Growth: "bg-teal-100 text-teal-700",
  Starter: "bg-emerald-100 text-emerald-700",
  Trial: "bg-amber-100 text-amber-700",
};

const INV_STATUS_BADGE: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
};

function avatarBg(name: string) {
  const colors = ["bg-rose-600", "bg-blue-600", "bg-violet-600", "bg-teal-600", "bg-amber-600", "bg-indigo-600", "bg-emerald-600", "bg-orange-600"];
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function initials(name: string) { return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase(); }

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

// ─── Component ──────────────────────────────────────────────
export default function SubscriptionBilling() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [mainTab, setMainTab] = useState("subs");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [renewalFilter, setRenewalFilter] = useState("any");
  const [invStatusFilter, setInvStatusFilter] = useState("all");

  // Modals
  const [assignOpen, setAssignOpen] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState<Invoice | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<{ company: Company; payment: Payment } | null>(null);

  // Assign form
  const [assignForm, setAssignForm] = useState({
    company_id: "", plan_name: "Growth", seats: 50, billing_cycle: "Annual",
    start_date: new Date().toISOString().split("T")[0], custom_amount: "", notes: ""
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

  const { data: employeeCounts = {} } = useQuery({
    queryKey: ["sa-emp-counts-billing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("company_id");
      if (error) throw error;
      const c: Record<string, number> = {};
      data?.forEach(p => { if (p.company_id) c[p.company_id] = (c[p.company_id] || 0) + 1; });
      return c;
    },
  });

  // ─── Mutations ───────────────────────────────────────────
  const assignPlanMutation = useMutation({
    mutationFn: async (form: typeof assignForm) => {
      const plan = PLANS.find(p => p.name === form.plan_name);
      const amount = form.custom_amount ? Number(form.custom_amount) : (plan?.price || 0);
      const { error } = await supabase.from("company_payments").insert({
        company_id: form.company_id,
        plan_name: form.plan_name,
        plan_status: form.plan_name === "Trial" ? "trial" : "active",
        amount,
        billing_cycle: form.billing_cycle,
        seats_included: form.seats,
        start_date: form.start_date,
        renewal_date: calculateRenewal(form.start_date, form.billing_cycle),
        notes: form.notes || null,
        last_payment_date: new Date().toISOString().split("T")[0],
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sa-payments-billing"] });
      toast({ title: "Plan assigned successfully" });
      setAssignOpen(false);
      setAssignForm({ company_id: "", plan_name: "Growth", seats: 50, billing_cycle: "Annual", start_date: new Date().toISOString().split("T")[0], custom_amount: "", notes: "" });
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

  // ─── Computed ────────────────────────────────────────────
  const getPayment = (companyId: string) => payments.find(p => p.company_id === companyId);
  const getCompany = (companyId: string) => companies.find(c => c.id === companyId);

  const activePayments = payments.filter(p => p.plan_status === "active");
  const mrr = activePayments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const renewalsDue = payments.filter(p => {
    const d = daysUntil(p.renewal_date);
    return d !== null && d >= 0 && d <= 30;
  }).length;
  const overdueCount = payments.filter(p => p.plan_status === "suspended" || p.plan_status === "expired").length;

  // Revenue chart: monthly aggregation from payments
  const revenueChart = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      months[key] = 0;
    }
    payments.forEach(p => {
      if (p.last_payment_date) {
        const d = new Date(p.last_payment_date);
        const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
        if (key in months) months[key] += Number(p.amount || 0);
      }
    });
    return Object.entries(months).map(([month, revenue]) => ({ month, revenue: revenue / 100000 }));
  }, [payments]);

  // Filtered subscriptions
  const filteredSubs = useMemo(() => {
    return companies.filter(c => {
      const p = getPayment(c.id);
      if (planFilter !== "all" && (!p || p.plan_name.toLowerCase() !== planFilter)) return false;
      if (statusFilter !== "all" && (!p || p.plan_status !== statusFilter)) return false;
      if (renewalFilter === "week") {
        const d = daysUntil(p?.renewal_date || null);
        if (d === null || d < 0 || d > 7) return false;
      }
      if (renewalFilter === "month") {
        const d = daysUntil(p?.renewal_date || null);
        if (d === null || d < 0 || d > 30) return false;
      }
      if (renewalFilter === "overdue") {
        const d = daysUntil(p?.renewal_date || null);
        if (d === null || d >= 0) return false;
      }
      return true;
    });
  }, [companies, payments, planFilter, statusFilter, renewalFilter]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (invStatusFilter !== "all" && inv.status !== invStatusFilter) return false;
      return true;
    });
  }, [invoices, invStatusFilter]);

  const overdueInvoices = invoices.filter(i => i.status === "overdue").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Subscription & Billing
          </h1>
          <p className="text-muted-foreground">Manage tenant plans, invoices, and payment status across all companies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={() => setAssignOpen(true)}><Plus className="h-4 w-4 mr-2" />Assign Plan</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CreditCard className="h-4 w-4 text-blue-600" />} iconBg="bg-blue-50 dark:bg-blue-900/30"
          label="Monthly Recurring Revenue" value={`₹${(mrr / 100000).toFixed(1)}L`}
          trend={<span className="text-emerald-600 text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" />vs last month</span>} />
        <StatCard icon={<CheckCircle className="h-4 w-4 text-emerald-600" />} iconBg="bg-emerald-50 dark:bg-emerald-900/30"
          label="Active Subscriptions" value={`${activePayments.length}`}
          trend={<span className="text-emerald-600 text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" />{payments.filter(p => {
            const d = new Date(p.created_at);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length} new this month</span>} />
        <StatCard icon={<Clock className="h-4 w-4 text-amber-600" />} iconBg="bg-amber-50 dark:bg-amber-900/30"
          label="Renewals Due (30 days)" value={`${renewalsDue}`}
          trend={<span className="text-amber-600 text-xs flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Action needed</span>} />
        <StatCard icon={<AlertCircle className="h-4 w-4 text-red-600" />} iconBg="bg-red-50 dark:bg-red-900/30"
          label="Overdue / Suspended" value={`${overdueCount}`}
          trend={<span className="text-red-600 text-xs flex items-center gap-1"><TrendingDown className="h-3 w-3" />Immediate action needed</span>} />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-sm">Revenue Trend (₹ Lakhs)</p>
              <p className="text-xs text-muted-foreground">Monthly billed — last 8 months</p>
            </div>
            <Badge variant="secondary" className="text-xs">FY 2024–25</Badge>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`₹${v.toFixed(1)}L`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(220, 90%, 56%)" radius={[4, 4, 0, 0]} />
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
          <TabsTrigger value="plans">Plan Configuration</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ─── Subscriptions Tab ─── */}
      {mainTab === "subs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="All Plans" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {PLANS.map(p => <SelectItem key={p.name} value={p.name.toLowerCase()}>{p.name}</SelectItem>)}
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
                <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Any renewal" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any renewal</SelectItem>
                  <SelectItem value="week">Due this week</SelectItem>
                  <SelectItem value="month">Due this month</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filteredSubs.length} of {companies.length}</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Company</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Plan</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Status</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Seats</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Billing</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">MRR</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Next Renewal</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubs.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No subscriptions match filters</TableCell></TableRow>
                  ) : filteredSubs.map(company => {
                    const p = getPayment(company.id);
                    const empCount = employeeCounts[company.id] || 0;
                    const planName = p?.plan_name || "—";
                    const status = p?.plan_status || "active";
                    const renewDays = daysUntil(p?.renewal_date || null);

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
                          <Badge className={`text-xs border-0 ${PLAN_BADGE[planName] || "bg-muted"}`}>{planName}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${status === "active" ? "bg-emerald-500" : status === "trial" ? "bg-blue-500" : status === "suspended" ? "bg-amber-500" : "bg-red-500"}`} />
                            <span className="text-sm capitalize">{status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-sm">{empCount}</span>
                          <span className="text-muted-foreground text-xs"> / {p?.seats_included || 50}</span>
                        </TableCell>
                        <TableCell><span className="text-sm">{p?.billing_cycle || "—"}</span></TableCell>
                        <TableCell><span className="font-mono text-sm font-medium">{p ? fmt(Number(p.amount || 0)) : "—"}</span></TableCell>
                        <TableCell>
                          {p?.renewal_date ? (
                            <div>
                              <p className="text-sm">{new Date(p.renewal_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</p>
                              {renewDays !== null && renewDays <= 30 && renewDays >= 0 && (
                                <p className="text-xs text-amber-600">{renewDays}d left</p>
                              )}
                              {renewDays !== null && renewDays < 0 && (
                                <p className="text-xs text-red-600">{Math.abs(renewDays)}d overdue</p>
                              )}
                            </div>
                          ) : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                              setAssignForm(prev => ({ ...prev, company_id: company.id, plan_name: p?.plan_name || "Growth" }));
                              setAssignOpen(true);
                            }}>Change Plan</Button>
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
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Plan</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Amount</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Due Date</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Status</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No invoices yet. Invoices will appear here when plans are assigned.</TableCell></TableRow>
                  ) : filteredInvoices.map(inv => {
                    const company = getCompany(inv.company_id);
                    return (
                      <TableRow key={inv.id} className={inv.status === "overdue" ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                        <TableCell><span className="font-mono text-sm">{inv.invoice_number}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded flex items-center justify-center text-white text-[10px] font-bold ${avatarBg(company?.name || "")}`}>
                              {initials(company?.name || "?")}
                            </div>
                            <span className="text-sm">{company?.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell><span className="text-sm">{inv.plan_name}</span></TableCell>
                        <TableCell><span className="font-mono text-sm">{fmt(inv.total_amount)}</span></TableCell>
                        <TableCell><span className="text-sm">{new Date(inv.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</span></TableCell>
                        <TableCell>
                          <Badge className={`text-xs border-0 capitalize ${INV_STATUS_BADGE[inv.status] || "bg-muted"}`}>{inv.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setInvoiceDetail(inv)}>
                              <Eye className="h-3 w-3 mr-1" />View
                            </Button>
                            {inv.status !== "paid" && (
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                <Send className="h-3 w-3 mr-1" />Remind
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

      {/* ─── Plan Configuration Tab ─── */}
      {mainTab === "plans" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLANS.map(plan => {
            const count = payments.filter(p => p.plan_name === plan.name && (p.plan_status === "active" || p.plan_status === "trial")).length;
            return (
              <Card key={plan.name} className="overflow-hidden">
                <CardContent className="pt-5">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-1">{plan.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{count} active companies</p>
                  <div className="mt-4 space-y-2">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs flex-1">Edit</Button>
                    <Button variant="outline" size="sm" className="text-xs flex-1" onClick={() => {
                      setAssignForm(prev => ({ ...prev, plan_name: plan.name, seats: plan.seats }));
                      setAssignOpen(true);
                    }}>Assign</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Assign Plan Modal ─── */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Assign / Change Plan</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Company</Label>
              <Select value={assignForm.company_id} onValueChange={v => setAssignForm(prev => ({ ...prev, company_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select company..." /></SelectTrigger>
                <SelectContent>
                  {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Plan</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {PLANS.map(plan => (
                  <button key={plan.name} onClick={() => setAssignForm(prev => ({ ...prev, plan_name: plan.name, seats: plan.seats }))}
                    className={`p-3 rounded-lg border text-center transition-colors ${assignForm.plan_name === plan.name ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}>
                    <p className="font-medium text-sm">{plan.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{plan.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Seats Included</Label>
                <Input type="number" value={assignForm.seats} onChange={e => setAssignForm(prev => ({ ...prev, seats: Number(e.target.value) }))} />
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={assignForm.start_date} onChange={e => setAssignForm(prev => ({ ...prev, start_date: e.target.value }))} />
              </div>
              <div>
                <Label>Custom Amount (₹)</Label>
                <Input type="number" placeholder="Leave blank for default" value={assignForm.custom_amount} onChange={e => setAssignForm(prev => ({ ...prev, custom_amount: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Internal Notes</Label>
              <Textarea value={assignForm.notes} onChange={e => setAssignForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Optional..." rows={2} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
              <Button onClick={() => assignPlanMutation.mutate(assignForm)} disabled={!assignForm.company_id || assignPlanMutation.isPending}>
                {assignPlanMutation.isPending ? "Assigning..." : "Assign Plan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Invoice Detail Modal ─── */}
      <Dialog open={!!invoiceDetail} onOpenChange={open => !open && setInvoiceDetail(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Invoice #{invoiceDetail?.invoice_number}</DialogTitle></DialogHeader>
          {invoiceDetail && (() => {
            const company = getCompany(invoiceDetail.company_id);
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{company?.name}</p>
                    <p className="text-xs text-muted-foreground">{invoiceDetail.plan_name}</p>
                  </div>
                  <Badge className={`text-xs border-0 capitalize ${INV_STATUS_BADGE[invoiceDetail.status] || "bg-muted"}`}>{invoiceDetail.status}</Badge>
                </div>
                <div className="space-y-2 border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan amount</span>
                    <span className="font-mono">{fmt(invoiceDetail.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-mono">{fmt(invoiceDetail.tax_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t pt-2">
                    <span>Total</span>
                    <span className="font-mono">{fmt(invoiceDetail.total_amount)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p>{new Date(invoiceDetail.due_date).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Date</p>
                    <p>{invoiceDetail.payment_date ? new Date(invoiceDetail.payment_date).toLocaleDateString("en-IN") : "—"}</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setInvoiceDetail(null)}>Close</Button>
                  {invoiceDetail.status !== "paid" && <Button variant="outline" size="sm"><Send className="h-3 w-3 mr-1" />Send Reminder</Button>}
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
          Suspending <strong>{target.company.name}</strong> will immediately revoke access for all users. Reversible at any time.
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
