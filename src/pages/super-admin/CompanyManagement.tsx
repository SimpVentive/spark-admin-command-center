import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, Edit, Users, Search, Shield, HardDrive, UserCheck, Eye, ChevronDown, ChevronUp } from "lucide-react";
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

export default function CompanyManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompanyForAdmin, setSelectedCompanyForAdmin] = useState<Company | null>(null);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [editForm, setEditForm] = useState({ name: "", slug: "", logo_url: "" });

  // Fetch companies
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("companies")
        .select("*")
        .order("name");
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

  // Fetch content counts per company (digital learning usage proxy)
  const { data: contentCounts = {} } = useQuery({
    queryKey: ["company-content-counts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("content_items").select("company_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((c: any) => { if (c.company_id) counts[c.company_id] = (counts[c.company_id] || 0) + 1; });
      return counts;
    },
  });

  // Update company
  const companyMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string; logo_url: string; id: string }) => {
      const { error } = await (supabase as any)
        .from("companies")
        .update({ name: data.name, slug: data.slug, logo_url: data.logo_url || null })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company updated" });
      setIsEditDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Toggle active
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await (supabase as any).from("companies").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  // Assign admin
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

  // Remove admin
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

  const filteredCompanies = companies.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdminsForCompany = (companyId: string) => companyAdmins.filter((a) => a.company_id === companyId);
  const totalAdmins = companyAdmins.filter((a) => a.role === "admin").length;
  const totalLocationAdmins = companyAdmins.filter((a) => a.role === "location_admin").length;

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
          onComplete={() => {
            setShowWizard(false);
            queryClient.invalidateQueries({ queryKey: ["companies"] });
          }}
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
            <Shield className="h-6 w-6 text-primary" />
            Company Management
          </h1>
          <p className="text-muted-foreground">Manage tenant companies, administrators, and usage</p>
        </div>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-sm text-muted-foreground">Total Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{companies.filter((c) => c.is_active).length}</div>
            <p className="text-sm text-muted-foreground">Active Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{totalAdmins}</div>
            </div>
            <p className="text-sm text-muted-foreground">Company Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{totalLocationAdmins}</div>
            </div>
            <p className="text-sm text-muted-foreground">Location Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{Object.values(contentCounts).reduce((a: number, b: number) => a + b, 0)}</div>
            </div>
            <p className="text-sm text-muted-foreground">Total Content Items</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search companies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader><CardTitle>All Companies</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {companies.length === 0 ? "No companies created yet." : "No matches."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admins</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Content Items</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => {
                  const admins = getAdminsForCompany(company.id);
                  const empCount = employeeCounts[company.id] || 0;
                  const contCount = contentCounts[company.id] || 0;
                  const isExpanded = expandedCompany === company.id;
                  return (
                    <>
                      <TableRow key={company.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {company.logo_url ? (
                              <img src={company.logo_url} alt="" className="w-8 h-8 rounded-lg object-contain" />
                            ) : (
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div>
                              <span className="font-medium">{company.name}</span>
                              <p className="text-xs text-muted-foreground">{company.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={company.is_active}
                              onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: company.id, is_active: checked })}
                            />
                            <Badge variant={company.is_active ? "default" : "secondary"}>
                              {company.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {admins.length === 0 ? (
                              <span className="text-xs text-muted-foreground">No admins</span>
                            ) : (
                              <>
                                <Badge variant="outline" className="text-xs">{admins.filter(a => a.role === 'admin').length} Admin{admins.filter(a => a.role === 'admin').length !== 1 ? 's' : ''}</Badge>
                                {admins.filter(a => a.role === 'location_admin').length > 0 && (
                                  <Badge variant="outline" className="text-xs ml-1">{admins.filter(a => a.role === 'location_admin').length} Loc. Admin</Badge>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{empCount}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3 text-muted-foreground" />
                            <span>{contCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {company.contact_person_name ? (
                            <div>
                              <p className="text-sm">{company.contact_person_name}</p>
                              <p className="text-xs text-muted-foreground">{company.contact_person_email}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditCompany(company)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openAssignAdmin(company)}>
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setExpandedCompany(isExpanded ? null : company.id)}>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow key={`${company.id}-detail`}>
                          <TableCell colSpan={7} className="bg-muted/30 p-4">
                            <div className="space-y-4">
                              {/* Company details */}
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground text-xs">Address</p>
                                  <p>{company.address_line_1 || "—"}</p>
                                  {company.address_line_2 && <p>{company.address_line_2}</p>}
                                  {company.address_line_3 && <p>{company.address_line_3}</p>}
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs">Website</p>
                                  <p>{company.website || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs">Admins Detail</p>
                                  {admins.map((admin) => (
                                    <div key={admin.id} className="flex items-center gap-1 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {admin.role === 'admin' ? '👤' : '📍'} {(admin.profiles as any)?.full_name || (admin.profiles as any)?.email}
                                      </Badge>
                                      <button onClick={() => removeAdminMutation.mutate(admin.id)} className="text-xs text-destructive hover:underline">×</button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* Change tracker */}
                              <CompanyChangeTracker companyId={company.id} companyName={company.name} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
