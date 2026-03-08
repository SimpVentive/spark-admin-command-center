import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { BarChart3, ArrowLeft, Plus, Upload, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const PerformanceData = () => {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<any[]>([]);
  const [deviations, setDeviations] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"signals" | "deviations">("signals");

  const [signalForm, setSignalForm] = useState({
    employee_id: "", kpi_id: "", kpi_value: "", measurement_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [signalsRes, deviationsRes, kpisRes, employeesRes] = await Promise.all([
      supabase.from("laser_performance_signals").select("*, laser_kpi_definitions(name, unit), profiles(full_name)").order("measurement_date", { ascending: false }).limit(100),
      supabase.from("laser_deviations").select("*, laser_kpi_definitions(name, unit), profiles(full_name)").order("detected_at", { ascending: false }).limit(50),
      supabase.from("laser_kpi_definitions").select("id, name, unit").eq("is_active", true),
      supabase.from("profiles").select("id, full_name, employee_id").order("full_name").limit(500),
    ]);
    setSignals(signalsRes.data || []);
    setDeviations(deviationsRes.data || []);
    setKpis(kpisRes.data || []);
    setEmployees(employeesRes.data || []);
    setLoading(false);
  };

  const handleAddSignal = async () => {
    if (!signalForm.employee_id || !signalForm.kpi_id || !signalForm.kpi_value) {
      toast({ title: "All fields required", variant: "destructive" }); return;
    }
    const { error } = await supabase.from("laser_performance_signals").insert({
      employee_id: signalForm.employee_id,
      kpi_id: signalForm.kpi_id,
      kpi_value: parseFloat(signalForm.kpi_value),
      measurement_date: signalForm.measurement_date,
      source: "manual",
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Performance signal recorded" });

    // Check for deviation
    await checkForDeviation(signalForm.employee_id, signalForm.kpi_id, parseFloat(signalForm.kpi_value));

    setShowAddDialog(false);
    setSignalForm({ employee_id: "", kpi_id: "", kpi_value: "", measurement_date: new Date().toISOString().split("T")[0] });
    fetchData();
  };

  const checkForDeviation = async (employeeId: string, kpiId: string, value: number) => {
    // Get employee's role to find applicable thresholds
    const { data: profile } = await supabase.from("profiles").select("position").eq("id", employeeId).single();
    
    // Find role-KPI mapping
    const { data: mappings } = await supabase
      .from("laser_role_kpi_mappings")
      .select("*, job_roles(title)")
      .eq("kpi_id", kpiId)
      .eq("is_active", true);

    if (!mappings || mappings.length === 0) return;

    // Use first applicable mapping (simplified; production would match by role)
    const mapping = mappings[0];
    let isDeviation = false;
    let severity = "warning";
    let deviationPct = 0;

    if (mapping.comparison_operator === "greater_is_better") {
      if (value < mapping.threshold_critical) { isDeviation = true; severity = "critical"; }
      else if (value < mapping.threshold_warning) { isDeviation = true; severity = "warning"; }
      deviationPct = ((mapping.target_value - value) / mapping.target_value) * 100;
    } else {
      if (value > mapping.threshold_critical) { isDeviation = true; severity = "critical"; }
      else if (value > mapping.threshold_warning) { isDeviation = true; severity = "warning"; }
      deviationPct = ((value - mapping.target_value) / mapping.target_value) * 100;
    }

    if (isDeviation) {
      await supabase.from("laser_deviations").insert({
        employee_id: employeeId,
        kpi_id: kpiId,
        role_kpi_mapping_id: mapping.id,
        actual_value: value,
        target_value: mapping.target_value,
        deviation_percentage: Math.abs(deviationPct),
        severity,
        status: "open",
      });

      // Auto-run RCA
      await autoRunRCA(kpiId, employeeId);

      toast({
        title: `⚠️ Deviation Detected (${severity})`,
        description: `KPI value ${value} deviates ${Math.abs(deviationPct).toFixed(1)}% from target ${mapping.target_value}`,
        variant: "destructive",
      });
    }
  };

  const autoRunRCA = async (kpiId: string, employeeId: string) => {
    // Get causes for this KPI
    const { data: causes } = await supabase
      .from("laser_cause_definitions")
      .select("*")
      .eq("kpi_id", kpiId)
      .eq("is_active", true)
      .order("default_weight", { ascending: false });

    if (!causes || causes.length === 0) return;

    // Get latest deviation
    const { data: deviations } = await supabase
      .from("laser_deviations")
      .select("id")
      .eq("employee_id", employeeId)
      .eq("kpi_id", kpiId)
      .eq("status", "open")
      .order("detected_at", { ascending: false })
      .limit(1);

    if (!deviations || deviations.length === 0) return;
    const deviationId = deviations[0].id;

    // Check pattern repository for refined weights
    const { data: patterns } = await supabase
      .from("laser_pattern_repository")
      .select("*")
      .eq("kpi_id", kpiId);

    // Calculate probability scores (use refined weights if available)
    const totalWeight = causes.reduce((sum: number, c: any) => {
      const pattern = patterns?.find((p: any) => p.cause_id === c.id);
      return sum + (pattern?.refined_weight || c.default_weight);
    }, 0);

    let primaryCauseId = causes[0].id;
    let maxScore = 0;

    const rcaInserts = causes.map((cause: any) => {
      const pattern = patterns?.find((p: any) => p.cause_id === cause.id);
      const weight = pattern?.refined_weight || cause.default_weight;
      const score = totalWeight > 0 ? weight / totalWeight : 1 / causes.length;
      if (score > maxScore) { maxScore = score; primaryCauseId = cause.id; }
      return {
        deviation_id: deviationId,
        cause_id: cause.id,
        probability_score: parseFloat(score.toFixed(3)),
        is_primary_cause: false,
      };
    });

    // Mark primary cause
    rcaInserts.forEach(r => { if (r.cause_id === primaryCauseId) r.is_primary_cause = true; });

    await supabase.from("laser_rca_results").insert(rcaInserts);

    // Auto-assign intervention for primary cause
    const { data: interventions } = await supabase
      .from("laser_cause_interventions")
      .select("*")
      .eq("cause_id", primaryCauseId)
      .eq("is_active", true)
      .order("priority")
      .limit(1);

    if (interventions && interventions.length > 0) {
      const intervention = interventions[0];
      const { data: rcaResults } = await supabase
        .from("laser_rca_results")
        .select("id")
        .eq("deviation_id", deviationId)
        .eq("cause_id", primaryCauseId)
        .limit(1);

      if (rcaResults && rcaResults.length > 0) {
        await supabase.from("laser_assigned_interventions").insert({
          deviation_id: deviationId,
          rca_result_id: rcaResults[0].id,
          employee_id: employeeId,
          cause_intervention_id: intervention.id,
          intervention_type: intervention.intervention_type,
          learning_path_id: intervention.learning_path_id,
          program_id: intervention.program_id,
          micro_intervention_title: intervention.micro_intervention_title,
          micro_intervention_content: intervention.micro_intervention_content,
          status: "assigned",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/laser")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Performance Data
          </h1>
          <p className="text-muted-foreground text-sm">Import KPI performance signals and view detected deviations</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Signal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Performance Signal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employee *</Label>
                <Select value={signalForm.employee_id} onValueChange={(v) => setSignalForm({ ...signalForm, employee_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.full_name} {e.employee_id ? `(${e.employee_id})` : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>KPI *</Label>
                <Select value={signalForm.kpi_id} onValueChange={(v) => setSignalForm({ ...signalForm, kpi_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select KPI" /></SelectTrigger>
                  <SelectContent>
                    {kpis.map(k => <SelectItem key={k.id} value={k.id}>{k.name} ({k.unit})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Value *</Label>
                  <Input type="number" value={signalForm.kpi_value} onChange={(e) => setSignalForm({ ...signalForm, kpi_value: e.target.value })} placeholder="e.g. 85.5" />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={signalForm.measurement_date} onChange={(e) => setSignalForm({ ...signalForm, measurement_date: e.target.value })} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                The system will automatically check for deviations and trigger RCA if thresholds are breached.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddSignal}>Record Signal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <Button variant={activeTab === "signals" ? "default" : "outline"} onClick={() => setActiveTab("signals")}>
          Performance Signals ({signals.length})
        </Button>
        <Button variant={activeTab === "deviations" ? "default" : "outline"} onClick={() => setActiveTab("deviations")}>
          Detected Deviations ({deviations.length})
        </Button>
      </div>

      {activeTab === "signals" && (
        <Card>
          <CardContent className="pt-6">
            {signals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No performance data yet</p>
                <p className="text-sm">Add signals manually or configure a data source for automated import.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>KPI</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signals.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.profiles?.full_name || "—"}</TableCell>
                      <TableCell>{s.laser_kpi_definitions?.name || "—"}</TableCell>
                      <TableCell>{s.kpi_value} {s.laser_kpi_definitions?.unit || ""}</TableCell>
                      <TableCell>{s.measurement_date}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs capitalize">{s.source}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "deviations" && (
        <Card>
          <CardContent className="pt-6">
            {deviations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No deviations detected</p>
                <p className="text-sm">Deviations are auto-detected when KPI values breach thresholds.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>KPI</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Deviation</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Detected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviations.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.profiles?.full_name || "—"}</TableCell>
                      <TableCell>{d.laser_kpi_definitions?.name || "—"}</TableCell>
                      <TableCell>{d.actual_value}</TableCell>
                      <TableCell>{d.target_value}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3 text-destructive" />
                          {d.deviation_percentage?.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.severity === "critical" ? "destructive" : "secondary"}>
                          {d.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.status === "open" ? "destructive" : d.status === "resolved" ? "default" : "secondary"}>
                          {d.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(d.detected_at).toLocaleDateString()}
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

export default PerformanceData;
