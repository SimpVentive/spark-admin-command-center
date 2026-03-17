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
import { Building2, Plus, Edit, Users, Search, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
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
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompanyForAdmin, setSelectedCompanyForAdmin] = useState<Company | null>(null);
  const [companyForm, setCompanyForm] = useState({ name: "", slug: "", logo_url: "" });
  const [adminEmail, setAdminEmail] = useState("");

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

  // Create / update company
  const companyMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string; logo_url: string; id?: string }) => {
      if (data.id) {
        const { error } = await (supabase as any)
          .from("companies")
          .update({ name: data.name, slug: data.slug, logo_url: data.logo_url || null })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("companies")
          .insert([{ name: data.name, slug: data.slug, logo_url: data.logo_url || null }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Success", description: editingCompany ? "Company updated" : "Company created" });
      closeCompanyDialog();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Toggle active
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await (supabase as any)
        .from("companies")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Status updated" });
    },
  });

  // Assign admin to company
  const assignAdminMutation = useMutation({
    mutationFn: async ({ email, companyId }: { email: string; companyId: string }) => {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();
      if (profileError || !profile) throw new Error("User not found with that email");

      // Check if already has admin role for this company
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", profile.id)
        .eq("role", "admin")
        .eq("company_id", companyId);

      if (existing && existing.length > 0) throw new Error("User already has admin role for this company");

      // Assign admin role with company_id
      const { error } = await supabase.from("user_roles").insert([{
        user_id: profile.id,
        role: "admin" as any,
        company_id: companyId,
      }]);
      if (error) throw error;

      // Update user's profile company_id
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ company_id: companyId })
        .eq("id", profile.id);
      if (profileUpdateError) throw profileUpdateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-admins"] });
      toast({ title: "Success", description: "Admin assigned to company" });
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

  const closeCompanyDialog = () => {
    setIsCompanyDialogOpen(false);
    setEditingCompany(null);
    setCompanyForm({ name: "", slug: "", logo_url: "" });
  };

  const openEditCompany = (company: Company) => {
    setEditingCompany(company);
    setCompanyForm({ name: company.name, slug: company.slug, logo_url: company.logo_url || "" });
    setIsCompanyDialogOpen(true);
  };

  const openAssignAdmin = (company: Company) => {
    setSelectedCompanyForAdmin(company);
    setAdminEmail("");
    setIsAdminDialogOpen(true);
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdminsForCompany = (companyId: string) =>
    companyAdmins.filter((a) => a.company_id === companyId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Company Management
          </h1>
          <p className="text-muted-foreground">Manage tenant companies and their administrators</p>
        </div>
        <Button onClick={() => setIsCompanyDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="text-2xl font-bold">{companyAdmins.filter((a) => a.role === "admin").length}</div>
            <p className="text-sm text-muted-foreground">Total Company Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
        </CardHeader>
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
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admins</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => {
                  const admins = getAdminsForCompany(company.id);
                  return (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{company.slug}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={company.is_active}
                            onCheckedChange={(checked) =>
                              toggleActiveMutation.mutate({ id: company.id, is_active: checked })
                            }
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
                            admins.map((admin) => (
                              <div key={admin.id} className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {(admin.profiles as any)?.full_name || (admin.profiles as any)?.email}
                                </Badge>
                                <button
                                  onClick={() => removeAdminMutation.mutate(admin.id)}
                                  className="text-xs text-destructive hover:underline"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(company.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditCompany(company)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openAssignAdmin(company)}>
                            <Users className="h-4 w-4" />
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

      {/* Create/Edit Company Dialog */}
      <Dialog open={isCompanyDialogOpen} onOpenChange={(open) => !open && closeCompanyDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Edit Company" : "Create Company"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input
                value={companyForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCompanyForm((prev) => ({
                    ...prev,
                    name,
                    slug: editingCompany ? prev.slug : generateSlug(name),
                  }));
                }}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <Label>Slug (URL-friendly identifier)</Label>
              <Input
                value={companyForm.slug}
                onChange={(e) => setCompanyForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="acme-corp"
              />
            </div>
            <div>
              <Label>Logo URL (optional)</Label>
              <Input
                value={companyForm.logo_url}
                onChange={(e) => setCompanyForm((prev) => ({ ...prev, logo_url: e.target.value }))}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <Button
              className="w-full"
              onClick={() =>
                companyMutation.mutate({
                  ...companyForm,
                  id: editingCompany?.id,
                })
              }
              disabled={!companyForm.name.trim() || !companyForm.slug.trim()}
            >
              {editingCompany ? "Update Company" : "Create Company"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Admin Dialog */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Admin to {selectedCompanyForAdmin?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User Email</Label>
              <Input
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@company.com"
                type="email"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The user must already have an account in the system.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() =>
                selectedCompanyForAdmin &&
                assignAdminMutation.mutate({
                  email: adminEmail,
                  companyId: selectedCompanyForAdmin.id,
                })
              }
              disabled={!adminEmail.trim() || assignAdminMutation.isPending}
            >
              {assignAdminMutation.isPending ? "Assigning..." : "Assign as Company Admin"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
