import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Target, Edit, Trash2, Link2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface KpiDefinition {
  id: string;
  name: string;
  description: string | null;
  unit: string;
  measurement_frequency: string;
  category: string | null;
  is_active: boolean;
}

interface RoleKpiMapping {
  id: string;
  job_role_id: string;
  kpi_id: string;
  target_value: number;
  threshold_warning: number;
  threshold_critical: number;
  comparison_operator: string;
  job_roles?: { title: string };
  laser_kpi_definitions?: { name: string };
}

const KpiConfiguration = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KpiDefinition[]>([]);
  const [mappings, setMappings] = useState<RoleKpiMapping[]>([]);
  const [jobRoles, setJobRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKpiDialog, setShowKpiDialog] = useState(false);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KpiDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<"kpis" | "mappings">("kpis");

  // KPI Form state
  const [kpiForm, setKpiForm] = useState({
    name: "", description: "", unit: "percent", measurement_frequency: "daily", category: "",
  });

  // Mapping form state
  const [mappingForm, setMappingForm] = useState({
    job_role_id: "", kpi_id: "", target_value: "", threshold_warning: "", threshold_critical: "", comparison_operator: "greater_is_better",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [kpisRes, mappingsRes, rolesRes] = await Promise.all([
      supabase.from("laser_kpi_definitions").select("*").order("name"),
      supabase.from("laser_role_kpi_mappings").select("*, job_roles(title), laser_kpi_definitions(name)").order("created_at", { ascending: false }),
      supabase.from("job_roles").select("id, title").eq("is_active", true).order("title"),
    ]);
    setKpis(kpisRes.data || []);
    setMappings(mappingsRes.data || []);
    setJobRoles(rolesRes.data || []);
    setLoading(false);
  };

  const handleSaveKpi = async () => {
    if (!kpiForm.name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    const payload = { ...kpiForm, is_active: true };
    let error;
    if (editingKpi) {
      ({ error } = await supabase.from("laser_kpi_definitions").update(payload).eq("id", editingKpi.id));
    } else {
      ({ error } = await supabase.from("laser_kpi_definitions").insert(payload));
    }
    if (error) { toast({ title: "Error saving KPI", description: error.message, variant: "destructive" }); return; }
    toast({ title: editingKpi ? "KPI updated" : "KPI created" });
    setShowKpiDialog(false);
    setEditingKpi(null);
    setKpiForm({ name: "", description: "", unit: "percent", measurement_frequency: "daily", category: "" });
    fetchData();
  };

  const handleDeleteKpi = async (id: string) => {
    const { error } = await supabase.from("laser_kpi_definitions").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "KPI deleted" });
    fetchData();
  };

  const handleSaveMapping = async () => {
    if (!mappingForm.job_role_id || !mappingForm.kpi_id || !mappingForm.target_value) {
      toast({ title: "All fields required", variant: "destructive" }); return;
    }
    const { error } = await supabase.from("laser_role_kpi_mappings").insert({
      job_role_id: mappingForm.job_role_id,
      kpi_id: mappingForm.kpi_id,
      target_value: parseFloat(mappingForm.target_value),
      threshold_warning: parseFloat(mappingForm.threshold_warning),
      threshold_critical: parseFloat(mappingForm.threshold_critical),
      comparison_operator: mappingForm.comparison_operator,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Role-KPI mapping created" });
    setShowMappingDialog(false);
    setMappingForm({ job_role_id: "", kpi_id: "", target_value: "", threshold_warning: "", threshold_critical: "", comparison_operator: "greater_is_better" });
    fetchData();
  };

  const handleDeleteMapping = async (id: string) => {
    const { error } = await supabase.from("laser_role_kpi_mappings").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Mapping deleted" });
    fetchData();
  };

  const openEditKpi = (kpi: KpiDefinition) => {
    setEditingKpi(kpi);
    setKpiForm({ name: kpi.name, description: kpi.description || "", unit: kpi.unit, measurement_frequency: kpi.measurement_frequency, category: kpi.category || "" });
    setShowKpiDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/laser")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" /> KPI Configuration
          </h1>
          <p className="text-muted-foreground text-sm">Define KPIs and map them to job roles with thresholds</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <Button variant={activeTab === "kpis" ? "default" : "outline"} onClick={() => setActiveTab("kpis")}>
          KPI Definitions ({kpis.length})
        </Button>
        <Button variant={activeTab === "mappings" ? "default" : "outline"} onClick={() => setActiveTab("mappings")}>
          Role-KPI Mappings ({mappings.length})
        </Button>
      </div>

      {activeTab === "kpis" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>KPI Definitions</CardTitle>
            <Dialog open={showKpiDialog} onOpenChange={(o) => { setShowKpiDialog(o); if (!o) { setEditingKpi(null); setKpiForm({ name: "", description: "", unit: "percent", measurement_frequency: "daily", category: "" }); } }}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add KPI</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingKpi ? "Edit KPI" : "Add KPI Definition"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>KPI Name *</Label>
                    <Input value={kpiForm.name} onChange={(e) => setKpiForm({ ...kpiForm, name: e.target.value })} placeholder="e.g. Rejection Rate" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={kpiForm.description} onChange={(e) => setKpiForm({ ...kpiForm, description: e.target.value })} placeholder="What this KPI measures..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Unit</Label>
                      <Select value={kpiForm.unit} onValueChange={(v) => setKpiForm({ ...kpiForm, unit: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">Percentage (%)</SelectItem>
                          <SelectItem value="count">Count</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="currency">Currency</SelectItem>
                          <SelectItem value="ratio">Ratio</SelectItem>
                          <SelectItem value="score">Score</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Frequency</Label>
                      <Select value={kpiForm.measurement_frequency} onValueChange={(v) => setKpiForm({ ...kpiForm, measurement_frequency: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input value={kpiForm.category} onChange={(e) => setKpiForm({ ...kpiForm, category: e.target.value })} placeholder="e.g. Production, Quality, Safety" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowKpiDialog(false)}>Cancel</Button>
                  <Button onClick={handleSaveKpi}>{editingKpi ? "Update" : "Create"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {kpis.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No KPIs defined yet</p>
                <p className="text-sm">Create your first KPI to start monitoring performance.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpis.map((kpi) => (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium">{kpi.name}</TableCell>
                      <TableCell><Badge variant="outline">{kpi.unit}</Badge></TableCell>
                      <TableCell className="capitalize">{kpi.measurement_frequency}</TableCell>
                      <TableCell>{kpi.category || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={kpi.is_active ? "default" : "secondary"}>
                          {kpi.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditKpi(kpi)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteKpi(kpi.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "mappings" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Role-KPI Mappings</CardTitle>
            <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
              <DialogTrigger asChild>
                <Button size="sm"><Link2 className="h-4 w-4 mr-1" /> Map KPI to Role</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Map KPI to Job Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Job Role *</Label>
                    <Select value={mappingForm.job_role_id} onValueChange={(v) => setMappingForm({ ...mappingForm, job_role_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                      <SelectContent>
                        {jobRoles.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>KPI *</Label>
                    <Select value={mappingForm.kpi_id} onValueChange={(v) => setMappingForm({ ...mappingForm, kpi_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select KPI" /></SelectTrigger>
                      <SelectContent>
                        {kpis.map((k) => (
                          <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Value *</Label>
                    <Input type="number" value={mappingForm.target_value} onChange={(e) => setMappingForm({ ...mappingForm, target_value: e.target.value })} placeholder="e.g. 95" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Warning Threshold</Label>
                      <Input type="number" value={mappingForm.threshold_warning} onChange={(e) => setMappingForm({ ...mappingForm, threshold_warning: e.target.value })} placeholder="e.g. 90" />
                    </div>
                    <div>
                      <Label>Critical Threshold</Label>
                      <Input type="number" value={mappingForm.threshold_critical} onChange={(e) => setMappingForm({ ...mappingForm, threshold_critical: e.target.value })} placeholder="e.g. 80" />
                    </div>
                  </div>
                  <div>
                    <Label>Comparison</Label>
                    <Select value={mappingForm.comparison_operator} onValueChange={(v) => setMappingForm({ ...mappingForm, comparison_operator: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greater_is_better">Higher is better (e.g. Output/hr)</SelectItem>
                        <SelectItem value="lower_is_better">Lower is better (e.g. Rejection %)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowMappingDialog(false)}>Cancel</Button>
                  <Button onClick={handleSaveMapping}>Create Mapping</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {mappings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Link2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No mappings yet</p>
                <p className="text-sm">Map KPIs to job roles to define performance thresholds.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Role</TableHead>
                    <TableHead>KPI</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Warning</TableHead>
                    <TableHead>Critical</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{(m as any).job_roles?.title || "—"}</TableCell>
                      <TableCell>{(m as any).laser_kpi_definitions?.name || "—"}</TableCell>
                      <TableCell>{m.target_value}</TableCell>
                      <TableCell className="text-amber-600">{m.threshold_warning}</TableCell>
                      <TableCell className="text-destructive">{m.threshold_critical}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{m.comparison_operator === "greater_is_better" ? "↑ Higher" : "↓ Lower"}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMapping(m.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KpiConfiguration;
