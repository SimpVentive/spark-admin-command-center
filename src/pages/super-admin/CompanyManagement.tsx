import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2, Plus, Search, CheckCircle, UserCheck, BarChart3,
  Download, AlertTriangle, Eye, LogIn, ChevronLeft, ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CompanyCreationWizard from "@/components/super-admin/CompanyCreationWizard";
import CompanyDetailDrawer from "@/components/super-admin/CompanyDetailDrawer";

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  industry?: string | null;
  company_size?: string | null;
  gstin?: string | null;
  city?: string | null;
  state?: string | null;
  pin_code?: string | null;
  primary_domain?: string | null;
  subdomain?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  address_line_3?: string | null;
  website?: string | null;
  contact_person_name?: string | null;
  contact_person_email?: string | null;
  contact_person_phone?: string | null;
  billing_contact_name?: string | null;
  billing_contact_email?: string | null;
  billing_contact_phone?: string | null;
  billing_contact_designation?: string | null;
  csm_assigned?: string | null;
}

const PLAN_COLORS: Record<string, string> = {
  Enterprise: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Pro: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Growth: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Starter: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
  Trial: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-500",
  Trial: "bg-amber-400",
  Suspended: "bg-orange-400",
  Expired: "bg-red-400",
};

function healthColor(score: number) {
  if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400";
  return "text-red-600 bg-red-50 border-red-300 dark:bg-red-900/30 dark:text-red-400";
}

function healthLabel(score: number) {
  if (score >= 80) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

function avatarBg(name: string) {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500",
    "bg-rose-500", "bg-teal-500", "bg-indigo-500", "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const PAGE_SIZE = 12;

export default function CompanyManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerCompany, setDrawerCompany] = useState<Company | null>(null);

  // Fetch companies
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("companies").select("*").order("name");
      if (error) throw error;
      return data as Company[];
    },
  });

  // Fetch admins
  const { data: companyAdmins = [] } = useQuery({
    queryKey: ["company-admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id, user_id, role, company_id, profiles(email, full_name)")
        .in("role", ["admin", "location_admin"])
        .order("role");
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // Fetch employee counts
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

  // Fetch payments
  const { data: payments = [] } = useQuery({
    queryKey: ["company-payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_payments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch features
  const { data: companyFeatures = [] } = useQuery({
    queryKey: ["company-features"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("company_features").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const getAdminsForCompany = (companyId: string) => companyAdmins.filter((a: any) => a.company_id === companyId);
  const getPaymentForCompany = (companyId: string) => payments.find((p: any) => p.company_id === companyId);
  const getFeaturesForCompany = (companyId: string) => (companyFeatures as any[]).filter((f: any) => f.company_id === companyId && f.is_enabled);
  const totalAdmins = companyAdmins.filter((a: any) => a.role === "admin").length;

  const getCompanyStatus = (company: Company) => {
    const payment = getPaymentForCompany(company.id);
    if (!company.is_active) return "Suspended";
    if (payment?.plan_status === "expired") return "Expired";
    if (payment?.plan_name?.toLowerCase() === "trial" || payment?.plan_status === "trial") return "Trial";
    return "Active";
  };

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

  // Unique industries
  const industries = useMemo(() => {
    const set = new Set<string>();
    companies.forEach(c => { if ((c as any).industry) set.add((c as any).industry); });
    return Array.from(set).sort();
  }, [companies]);

  // Filtered & sorted
  const filteredCompanies = useMemo(() => {
    let list = companies.filter(
      c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((c as any).subdomain || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((c as any).industry || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeTab === "active") list = list.filter(c => c.is_active && getCompanyStatus(c) === "Active");
    if (activeTab === "trial") list = list.filter(c => getCompanyStatus(c) === "Trial");
    if (activeTab === "attention") list = list.filter(c => getHealthScore(c.id) < 50 || getCompanyStatus(c) === "Suspended" || getCompanyStatus(c) === "Expired");

    if (planFilter !== "all") {
      list = list.filter(c => {
        const p = getPaymentForCompany(c.id);
        return p?.plan_name?.toLowerCase() === planFilter.toLowerCase();
      });
    }

    if (industryFilter !== "all") {
      list = list.filter(c => (c as any).industry === industryFilter);
    }

    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "seats") list.sort((a, b) => (employeeCounts[b.id] || 0) - (employeeCounts[a.id] || 0));
    if (sortBy === "health") list.sort((a, b) => getHealthScore(b.id) - getHealthScore(a.id));
    if (sortBy === "recent") list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return list;
  }, [companies, searchTerm, activeTab, planFilter, industryFilter, sortBy, employeeCounts, payments, companyAdmins]);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / PAGE_SIZE));
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCount = companies.filter(c => c.is_active && getCompanyStatus(c) === "Active").length;
  const trialCount = companies.filter(c => getCompanyStatus(c) === "Trial").length;
  const attentionCount = companies.filter(c => getHealthScore(c.id) < 50 || getCompanyStatus(c) === "Suspended" || getCompanyStatus(c) === "Expired").length;

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
          <p className="text-muted-foreground">Manage all tenant companies — plans, feature access, admins, health and bandwidth</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />Export
          </Button>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Company
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
              ↑ {companies.filter(c => {
                const d = new Date(c.created_at); const now = new Date();
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
            <p className="text-xs text-muted-foreground mt-1">{companies.length > 0 ? ((activeCount / companies.length) * 100).toFixed(1) : 0}% of fleet</p>
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
            <p className="text-xs text-muted-foreground mt-1">Avg. {companies.length > 0 ? (totalAdmins / companies.length).toFixed(0) : 0} per company</p>
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
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentPage(1); }}>
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
      </Tabs>

      {/* Filters Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setCurrentPage(1); }}>
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
          <Select value={industryFilter} onValueChange={(v) => { setIndustryFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="All Industries" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px] h-9"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort: Company Name</SelectItem>
              <SelectItem value="seats">Sort: Seats</SelectItem>
              <SelectItem value="health">Sort: Health Score</SelectItem>
              <SelectItem value="recent">Sort: Recently Added</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
          ) : paginatedCompanies.length === 0 ? (
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
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Features</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Last Active</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.map((company) => {
                  const empCount = employeeCounts[company.id] || 0;
                  const payment = getPaymentForCompany(company.id);
                  const planName = payment?.plan_name || "Starter";
                  const healthScore = getHealthScore(company.id);
                  const status = getCompanyStatus(company);
                  const featCount = getFeaturesForCompany(company.id).length;
                  const seatsAllowed = (payment as any)?.seats_included || Math.max(empCount, 20);

                  return (
                    <TableRow key={company.id} className="cursor-pointer" onClick={() => setDrawerCompany(company)}>
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
                            <p className="text-xs text-muted-foreground">{(company as any).subdomain || company.slug}.unitoltms.com</p>
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
                          <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[status] || "bg-gray-400"}`} />
                          <span className="text-sm">{status}</span>
                        </div>
                      </TableCell>

                      {/* Seats */}
                      <TableCell>
                        <span className="font-bold text-sm">{empCount}</span>
                        <span className="text-muted-foreground text-xs"> / {seatsAllowed} active</span>
                      </TableCell>

                      {/* Health */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${healthColor(healthScore)}`}>
                            {healthScore}
                          </div>
                          <span className="text-xs font-medium">{healthLabel(healthScore)}</span>
                        </div>
                      </TableCell>

                      {/* Features */}
                      <TableCell>
                        <span className="text-sm">{featCount > 0 ? `${featCount} features` : "—"}</span>
                      </TableCell>

                      {/* Last Active */}
                      <TableCell>
                        <span className="text-sm text-muted-foreground">Today</span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setDrawerCompany(company)}>
                            <Eye className="h-3 w-3" /> View
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toast({ title: "Impersonation started" })}>
                            <LogIn className="h-3 w-3" /> Login As
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredCompanies.length)} of {filteredCompanies.length} companies
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 p-0 text-xs"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Company Detail Drawer */}
      <CompanyDetailDrawer
        company={drawerCompany}
        onClose={() => setDrawerCompany(null)}
        companyAdmins={companyAdmins}
        employeeCounts={employeeCounts}
        payments={payments}
        companyFeatures={companyFeatures as any[]}
      />
    </div>
  );
}
