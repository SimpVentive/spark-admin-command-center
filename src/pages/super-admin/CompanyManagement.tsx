import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2, Plus, Edit, Users, Search, Shield, Eye, UserCheck,
  CheckCircle, BarChart3, Download, AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CompanyCreationWizard from "@/components/super-admin/CompanyCreationWizard";
import CompanyChangeTracker from "@/components/super-admin/CompanyChangeTracker";

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  address_line_1?: string | null;
  address_line_2?: string | null;
  address_line_3?: string | null;
  website?: string | null;
  contact_person_name?: string | null;
  contact_person_email?: string | null;
  contact_person_phone?: string | null;
}

interface CompanyAdmin {
  id: string;
  user_id: string;
  role: string;
  company_id: string | null;
  profiles: { email: string; full_name: string } | null;
}

// Color mapping for plan badges
const PLAN_COLORS: Record<string, string> = {
  Enterprise: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Pro: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Growth: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Starter: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
  Trial: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

// Health score color
function healthColor(score: number) {
  if (score >= 80) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400";
  return "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400";
}

function healthLabel(score: number) {
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  return "Poor";
}

// Avatar initials from name
function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

// Random-ish but deterministic color from string
function avatarBg(name: string) {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500",
    "bg-rose-500", "bg-teal-500", "bg-indigo-500", "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function CompanyManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompanyForAdmin, setSelectedCompanyForAdmin] = useState<Company | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [editForm, setEditForm] = useState({ name: "", slug: "", logo_url: "" });

  // Fetch companies
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("companies").select("*").order("name");
      if (error) throw error;
      return data as Company[];
    },
  });

  // Fetch admins per company
  const { data: companyAdmins = [] } = useQuery({
    queryKey: ["company-admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id, user_id, role, company_id, profiles(email, full_name)")
        .in("role", ["admin", "location_admin"])
        .order("role");
      if (error) throw error;
      return (data || []) as unknown as CompanyAdmin[];
    },
  });

  // Fetch employee counts per company
  const { data: employeeCounts = {} } = useQuery({
    queryKey: ["company-employee-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("company_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data?.forEach((p) => { if (p.company_id) counts[p.company_id] = (counts[p.company_id] || 0) + 1; });
      return counts;
    },
  });

  // Fetch payments for plan info
  const { data: payments = [] } = useQuery({
    queryKey: ["company-payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_payments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Mutations
  const companyMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string; logo_url: string; id: string }) => {
      const { error } = await (supabase as any)
        .from("companies").update({ name: data.name, slug: data.slug, logo_url: data.logo_url || null }).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company updated" });
      setIsEditDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await (supabase as any).from("companies").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });

  const assignAdminMutation = useMutation({
    mutationFn: async ({ email, companyId }: { email: string; companyId: string }) => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles").select("id").eq("email", email).single();
      if (profileError || !profile) throw new Error("User not found with that email");
      const { data: existing } = await supabase
        .from("user_roles").select("id").eq("user_id", profile.id).eq("role", "admin").eq("company_id", companyId);
      if (existing && existing.length > 0) throw new Error("User already has admin role for this company");
      const { error } = await supabase.from("user_roles").insert([{ user_id: profile.id, role: "admin" as any, company_id: companyId }]);
      if (error) throw error;
      await supabase.from("profiles").update({ company_id: companyId }).eq("id", profile.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-admins"] });
      toast({ title: "Admin assigned" });
      setIsAdminDialogOpen(false);
      setAdminEmail("");
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-admins"] });
      toast({ title: "Admin removed" });
    },
  });

  // Helpers
  const getAdminsForCompany = (companyId: string) => companyAdmins.filter((a) => a.company_id === companyId);
  const getPaymentForCompany = (companyId: string) => payments.find((p: any) => p.company_id === companyId);
  const totalAdmins = companyAdmins.filter((a) => a.role === "admin").length;

  // Compute a basic "health" score per company based on available data
  const getHealthScore = (companyId: string) => {
    const empCount = employeeCounts[companyId] || 0;
    const hasAdmins = getAdminsForCompany(companyId).length > 0;
    const payment = getPaymentForCompany(companyId);
    let score = 50;
    if (empCount > 0) score += 20;
    if (empCount > 10) score += 10;
    if (hasAdmins) score += 15;
    if (payment && payment.plan_status === "active") score += 5;
    return Math.min(score, 100);
  };

  // Filtered & sorted companies
  const filteredCompanies = useMemo(() => {
    let list = companies.filter(
      (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tab filtering
    if (activeTab === "active") list = list.filter(c => c.is_active);
    if (activeTab === "trial") list = list.filter(c => {
      const p = getPaymentForCompany(c.id);
      return p?.plan_name?.toLowerCase() === "trial";
    });
    if (activeTab === "attention") list = list.filter(c => getHealthScore(c.id) < 60);

    // Plan filter
    if (planFilter !== "all") {
      list = list.filter(c => {
        const p = getPaymentForCompany(c.id);
        return p?.plan_name?.toLowerCase() === planFilter.toLowerCase();
      });
    }

    // Sort
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "seats") list.sort((a, b) => (employeeCounts[b.id] || 0) - (employeeCounts[a.id] || 0));
    if (sortBy === "health") list.sort((a, b) => getHealthScore(b.id) - getHealthScore(a.id));
    if (sortBy === "recent") list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return list;
  }, [companies, searchTerm, activeTab, planFilter, sortBy, employeeCounts, payments, companyAdmins]);

  const activeCount = companies.filter(c => c.is_active).length;
  const trialCount = companies.filter(c => {
    const p = getPaymentForCompany(c.id);
    return p?.plan_name?.toLowerCase() === "trial";
  }).length;
  const attentionCount = companies.filter(c => getHealthScore(c.id) < 60).length;

  const openEditCompany = (company: Company) => {
    setEditingCompany(company);
    setEditForm({ name: company.name, slug: company.slug, logo_url: company.logo_url || "" });
    setIsEditDialogOpen(true);
  };

  const openAssignAdmin = (company: Company) => {
    setSelectedCompanyForAdmin(company);
    setAdminEmail("");
    setIsAdminDialogOpen(true);
  };

  if (showWizard) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Add New Company
          </h1>
          <p className="text-muted-foreground">Complete the steps below to onboard a new organization</p>
        </div>
        <CompanyCreationWizard
          onComplete={() => { setShowWizard(false); queryClient.invalidateQueries({ queryKey: ["companies"] }); }}
          onCancel={() => setShowWizard(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Company Management
          </h1>
          <p className="text-muted-foreground">Manage all tenant companies — plans, feature access, admins, health and usage</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Companies</p>
            <p className="text-3xl font-bold mt-1">{companies.length}</p>
            <p className="text-xs text-emerald-600 mt-1">
              {companies.filter(c => {
                const d = new Date(c.created_at);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length} added this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
            <p className="text-3xl font-bold mt-1">{activeCount}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {companies.length > 0 ? ((activeCount / companies.length) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                <UserCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Admins</p>
            <p className="text-3xl font-bold mt-1">{totalAdmins}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Avg. {companies.length > 0 ? (totalAdmins / companies.length).toFixed(0) : 0} per company
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30">
                <BarChart3 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Seats</p>
            <p className="text-3xl font-bold mt-1">{Object.values(employeeCounts).reduce((a: number, b: number) => a + b, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all tenants</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              All Companies <Badge variant="secondary" className="ml-1 text-xs">{companies.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-1.5">
              Active <Badge variant="secondary" className="ml-1 text-xs">{activeCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="trial" className="gap-1.5">
              Trial <Badge variant="secondary" className="ml-1 text-xs">{trialCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="attention" className="gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Needs Attention <Badge variant="secondary" className="ml-1 text-xs">{attentionCount}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* Filters Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="All Plans" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort: Name</SelectItem>
              <SelectItem value="seats">Sort: Seats</SelectItem>
              <SelectItem value="health">Sort: Health</SelectItem>
              <SelectItem value="recent">Sort: Recently Added</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 w-[220px]"
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Showing {filteredCompanies.length} of {companies.length}</p>
      </div>

      {/* Companies Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading companies...</div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {companies.length === 0 ? "No companies created yet. Click '+ Add Company' to get started." : "No companies match your filters."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Company</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Plan</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Status</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Seats</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Health</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Admins</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Created</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => {
                  const admins = getAdminsForCompany(company.id);
                  const empCount = employeeCounts[company.id] || 0;
                  const payment = getPaymentForCompany(company.id);
                  const planName = payment?.plan_name || "Starter";
                  const healthScore = getHealthScore(company.id);

                  return (
                    <TableRow key={company.id}>
                      {/* Company */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {company.logo_url ? (
                            <img src={company.logo_url} alt="" className="w-9 h-9 rounded-lg object-contain" />
                          ) : (
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold ${avatarBg(company.name)}`}>
                              {getInitials(company.name)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{company.name}</p>
                            <p className="text-xs text-muted-foreground">{company.slug}.unitoltms.com</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Plan */}
                      <TableCell>
                        <Badge className={`text-xs font-medium border-0 ${PLAN_COLORS[planName] || PLAN_COLORS.Starter}`}>
                          {planName}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${company.is_active ? 'bg-emerald-500' : 'bg-red-400'}`} />
                          <span className={`text-sm ${company.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                            {company.is_active ? "Active" : "Suspended"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Seats */}
                      <TableCell>
                        <div>
                          <span className="font-bold text-sm">{empCount}</span>
                          <span className="text-muted-foreground text-xs"> / {empCount > 0 ? Math.max(empCount, 20) : 20}</span>
                        </div>
                      </TableCell>

                      {/* Health */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${healthColor(healthScore)}`}>
                            {healthScore}
                          </div>
                          <span className={`text-sm font-medium ${healthScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : healthScore >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                            {healthLabel(healthScore)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Admins */}
                      <TableCell>
                        <span className="text-sm">{admins.filter(a => a.role === "admin").length} admin{admins.filter(a => a.role === "admin").length !== 1 ? "s" : ""}</span>
                      </TableCell>

                      {/* Created */}
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(company.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setViewingCompany(company)}>
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openEditCompany(company)}>
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openAssignAdmin(company)}>
                            <Users className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Company Detail Dialog */}
      <Dialog open={!!viewingCompany} onOpenChange={(open) => !open && setViewingCompany(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Company Details — {viewingCompany?.name}</DialogTitle></DialogHeader>
          {viewingCompany && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Slug</p>
                  <p className="font-medium">{viewingCompany.slug}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Switch
                      checked={viewingCompany.is_active}
                      onCheckedChange={(checked) => {
                        toggleActiveMutation.mutate({ id: viewingCompany.id, is_active: checked });
                        setViewingCompany({ ...viewingCompany, is_active: checked });
                      }}
                    />
                    <Badge variant={viewingCompany.is_active ? "default" : "secondary"}>
                      {viewingCompany.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <p>{viewingCompany.website || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p>{viewingCompany.contact_person_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{viewingCompany.contact_person_email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p>{viewingCompany.address_line_1 || "—"}</p>
                  {viewingCompany.address_line_2 && <p>{viewingCompany.address_line_2}</p>}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Admins</p>
                {getAdminsForCompany(viewingCompany.id).length === 0 ? (
                  <p className="text-muted-foreground text-xs">No admins assigned</p>
                ) : (
                  <div className="space-y-1">
                    {getAdminsForCompany(viewingCompany.id).map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-2 rounded border">
                        <div>
                          <p className="text-sm font-medium">{(admin.profiles as any)?.full_name || (admin.profiles as any)?.email}</p>
                          <p className="text-xs text-muted-foreground">{admin.role}</p>
                        </div>
                        <button onClick={() => removeAdminMutation.mutate(admin.id)} className="text-xs text-destructive hover:underline">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <CompanyChangeTracker companyId={viewingCompany.id} companyName={viewingCompany.name} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Company</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Company Name</Label><Input value={editForm.name} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} /></div>
            <div><Label>Slug</Label><Input value={editForm.slug} onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))} /></div>
            <div><Label>Logo URL</Label><Input value={editForm.logo_url} onChange={(e) => setEditForm(prev => ({ ...prev, logo_url: e.target.value }))} /></div>
            <Button className="w-full" onClick={() => editingCompany && companyMutation.mutate({ ...editForm, id: editingCompany.id })} disabled={!editForm.name.trim() || !editForm.slug.trim()}>
              Update Company
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Admin Dialog */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Admin to {selectedCompanyForAdmin?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User Email</Label>
              <Input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@company.com" type="email" />
              <p className="text-xs text-muted-foreground mt-1">The user must already have an account.</p>
            </div>
            <Button className="w-full" onClick={() => selectedCompanyForAdmin && assignAdminMutation.mutate({ email: adminEmail, companyId: selectedCompanyForAdmin.id })} disabled={!adminEmail.trim() || assignAdminMutation.isPending}>
              {assignAdminMutation.isPending ? "Assigning..." : "Assign as Company Admin"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
