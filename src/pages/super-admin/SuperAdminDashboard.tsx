import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  Building2, Users, Activity, CreditCard, MessageSquare, TrendingUp,
  Globe, BarChart3, AlertCircle, CheckCircle2, Clock, Plus,
  Send, Pin, FileText, Headphones, Receipt, Megaphone
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const CHART_COLORS = [
  "hsl(220, 90%, 56%)", "hsl(160, 70%, 40%)", "hsl(30, 95%, 55%)",
  "hsl(280, 70%, 55%)", "hsl(340, 75%, 55%)", "hsl(190, 80%, 45%)",
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  trial: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  expired: "bg-destructive/10 text-destructive",
  suspended: "bg-muted text-muted-foreground",
};

const NOTE_ICONS: Record<string, any> = {
  general: FileText,
  support: Headphones,
  billing: Receipt,
  onboarding: CheckCircle2,
  announcement: Megaphone,
};

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch companies
  const { data: companies = [] } = useQuery({
    queryKey: ["sa-companies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch employee counts per company
  const { data: employeeCounts = [] } = useQuery({
    queryKey: ["sa-employee-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("company_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data?.forEach((p) => {
        if (p.company_id) counts[p.company_id] = (counts[p.company_id] || 0) + 1;
      });
      return Object.entries(counts).map(([company_id, count]) => ({ company_id, count }));
    },
  });

  // Fetch total profiles
  const { data: totalProfiles = 0 } = useQuery({
    queryKey: ["sa-total-profiles"],
    queryFn: async () => {
      const { count, error } = await supabase.from("profiles").select("id", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch programs count
  const { data: totalPrograms = 0 } = useQuery({
    queryKey: ["sa-total-programs"],
    queryFn: async () => {
      const { count, error } = await supabase.from("training_programs").select("id", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch events count
  const { data: totalEvents = 0 } = useQuery({
    queryKey: ["sa-total-events"],
    queryFn: async () => {
      const { count, error } = await supabase.from("events").select("id", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch assessments count
  const { data: totalAssessments = 0 } = useQuery({
    queryKey: ["sa-total-assessments"],
    queryFn: async () => {
      const { count, error } = await supabase.from("assessments").select("id", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch payments
  const { data: payments = [], refetch: refetchPayments } = useQuery({
    queryKey: ["sa-payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_payments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch CRM notes
  const { data: notes = [], refetch: refetchNotes } = useQuery({
    queryKey: ["sa-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_notes")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  // Fetch recent audit logs for activity
  const { data: recentActivity = [] } = useQuery({
    queryKey: ["sa-recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, action, action_description, user_email, created_at, table_name")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  // Build chart data
  const companyChartData = companies.map((c) => {
    const ec = employeeCounts.find((e) => e.company_id === c.id);
    return { name: c.name, employees: ec?.count || 0 };
  });

  const activeCompanies = companies.filter((c) => c.is_active).length;
  const inactiveCompanies = companies.length - activeCompanies;
  const statusPieData = [
    { name: "Active", value: activeCompanies },
    { name: "Inactive", value: inactiveCompanies },
  ].filter((d) => d.value > 0);

  // Feature adoption (approximate from data)
  const featureData = [
    { feature: "Programs", count: totalPrograms },
    { feature: "Events", count: totalEvents },
    { feature: "Assessments", count: totalAssessments },
  ];

  const totalRevenue = payments
    .filter((p) => p.plan_status === "active")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          Super Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Global platform oversight across all tenants</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard icon={Building2} label="Companies" value={companies.length} sub={`${activeCompanies} active`} color="text-primary" />
        <StatCard icon={Users} label="Total Employees" value={totalProfiles} sub="Across all tenants" color="text-emerald-600" />
        <StatCard icon={BarChart3} label="Programs" value={totalPrograms} sub="All companies" color="text-amber-600" />
        <StatCard icon={Activity} label="Events" value={totalEvents} sub="Platform-wide" color="text-violet-600" />
        <StatCard icon={CreditCard} label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub={`${payments.filter(p => p.plan_status === 'active').length} active plans`} color="text-emerald-600" />
        <StatCard icon={MessageSquare} label="CRM Notes" value={notes.length} sub="Communication log" color="text-sky-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employees by Company */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Employees by Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="hsl(220, 90%, 56%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Company Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Company Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              {statusPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusPieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Adoption & Company Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Adoption */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Feature Adoption
            </CardTitle>
            <CardDescription>Platform-wide feature usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="feature" width={90} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(160, 70%, 40%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Company Overview Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[250px] overflow-auto">
              {companies.length === 0 ? (
                <p className="text-muted-foreground text-sm">No companies registered yet.</p>
              ) : (
                companies.map((c) => {
                  const ec = employeeCounts.find((e) => e.company_id === c.id);
                  const payment = payments.find((p) => p.company_id === c.id);
                  return (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${c.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                        <div>
                          <p className="font-medium text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{ec?.count || 0} employees</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={STATUS_COLORS[payment?.plan_status || 'active']}>
                        {payment?.plan_name || 'No plan'}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Tracker & CRM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Tracker */}
        <PaymentTracker
          companies={companies}
          payments={payments}
          onRefresh={refetchPayments}
        />

        {/* CRM Notes */}
        <CRMNotes
          companies={companies}
          notes={notes}
          userId={user?.id || ""}
          onRefresh={refetchNotes}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Platform Activity
          </CardTitle>
          <CardDescription>Latest actions across all tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[300px] overflow-auto">
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent activity logged.</p>
            ) : (
              recentActivity.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{log.action_description || log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.user_email} • {log.table_name && `${log.table_name} • `}
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub: string; color: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-muted ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Payment Tracker Component
function PaymentTracker({ companies, payments, onRefresh }: { companies: any[]; payments: any[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    company_id: "", plan_name: "Starter", plan_status: "active",
    amount: "", billing_cycle: "monthly", notes: "",
  });

  const handleSave = async () => {
    if (!form.company_id) { toast({ title: "Select a company", variant: "destructive" }); return; }
    const { error } = await supabase.from("company_payments").insert({
      company_id: form.company_id,
      plan_name: form.plan_name,
      plan_status: form.plan_status as any,
      amount: Number(form.amount) || 0,
      billing_cycle: form.billing_cycle,
      notes: form.notes || null,
      last_payment_date: new Date().toISOString().split("T")[0],
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Payment record added" });
    setOpen(false);
    setForm({ company_id: "", plan_name: "Starter", plan_status: "active", amount: "", billing_cycle: "monthly", notes: "" });
    onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Tracker
          </CardTitle>
          <CardDescription>Manual subscription & payment tracking</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Payment Record</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Company</Label>
                <Select value={form.company_id} onValueChange={(v) => setForm({ ...form, company_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Plan Name</Label>
                  <Input value={form.plan_name} onChange={(e) => setForm({ ...form, plan_name: e.target.value })} />
                </div>
                <div>
                  <Label>Amount (₹)</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select value={form.plan_status} onValueChange={(v) => setForm({ ...form, plan_status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Billing Cycle</Label>
                  <Select value={form.billing_cycle} onValueChange={(v) => setForm({ ...form, billing_cycle: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
              </div>
              <Button className="w-full" onClick={handleSave}>Save Payment Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[250px] overflow-auto">
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No payment records yet. Click Add to create one.</p>
          ) : (
            payments.map((p) => {
              const company = companies.find((c) => c.id === p.company_id);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium text-sm">{company?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{p.plan_name} • {p.billing_cycle} • ₹{Number(p.amount).toLocaleString()}</p>
                  </div>
                  <Badge variant="outline" className={STATUS_COLORS[p.plan_status]}>{p.plan_status}</Badge>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// CRM Notes Component
function CRMNotes({ companies, notes, userId, onRefresh }: { companies: any[]; notes: any[]; userId: string; onRefresh: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    company_id: "", note_type: "general", subject: "", content: "",
  });

  const handleSave = async () => {
    if (!form.company_id || !form.content.trim()) {
      toast({ title: "Company and content required", variant: "destructive" }); return;
    }
    const { error } = await supabase.from("company_notes").insert({
      company_id: form.company_id,
      author_id: userId,
      note_type: form.note_type as any,
      subject: form.subject || null,
      content: form.content,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Note added" });
    setOpen(false);
    setForm({ company_id: "", note_type: "general", subject: "", content: "" });
    onRefresh();
  };

  const togglePin = async (noteId: string, currentPin: boolean) => {
    await supabase.from("company_notes").update({ is_pinned: !currentPin }).eq("id", noteId);
    onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            CRM Notes
          </CardTitle>
          <CardDescription>Communication log with companies</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Note</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add CRM Note</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Company</Label>
                <Select value={form.company_id} onValueChange={(v) => setForm({ ...form, company_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.note_type} onValueChange={(v) => setForm({ ...form, note_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief subject..." />
                </div>
              </div>
              <div>
                <Label>Content</Label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Note details..." rows={4} />
              </div>
              <Button className="w-full" onClick={handleSave}>Save Note</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[250px] overflow-auto">
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No notes yet. Start your CRM log.</p>
          ) : (
            notes.map((n: any) => {
              const company = companies.find((c) => c.id === n.company_id);
              const NoteIcon = NOTE_ICONS[n.note_type] || FileText;
              return (
                <div key={n.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <NoteIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{n.subject || n.note_type}</p>
                          {n.is_pinned && <Pin className="h-3 w-3 text-amber-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{company?.name} • {new Date(n.created_at).toLocaleDateString()}</p>
                        <p className="text-sm mt-1 text-foreground/80 line-clamp-2">{n.content}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7" onClick={() => togglePin(n.id, n.is_pinned)}>
                      <Pin className={`h-3.5 w-3.5 ${n.is_pinned ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
