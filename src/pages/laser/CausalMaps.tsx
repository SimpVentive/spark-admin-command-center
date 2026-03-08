import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Brain, ArrowLeft, Trash2, Link2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CausalMaps = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<any[]>([]);
  const [causes, setCauses] = useState<any[]>([]);
  const [interventionLinks, setInterventionLinks] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCauseDialog, setShowCauseDialog] = useState(false);
  const [showInterventionDialog, setShowInterventionDialog] = useState(false);
  const [selectedKpiId, setSelectedKpiId] = useState("");
  const [selectedCauseId, setSelectedCauseId] = useState("");

  const [causeForm, setCauseForm] = useState({
    kpi_id: "", cause_name: "", cause_category: "skill_gap", description: "", default_weight: "0.25", requires_training: true, escalation_target: "",
  });

  const [interventionForm, setInterventionForm] = useState({
    cause_id: "", intervention_type: "learning_path", learning_path_id: "", program_id: "",
    micro_intervention_title: "", micro_intervention_content: "", micro_intervention_type: "checklist",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [kpisRes, causesRes, linksRes, pathsRes, progsRes] = await Promise.all([
      supabase.from("laser_kpi_definitions").select("*").eq("is_active", true).order("name"),
      supabase.from("laser_cause_definitions").select("*, laser_kpi_definitions(name)").order("kpi_id, default_weight", { ascending: false }),
      supabase.from("laser_cause_interventions").select("*, laser_cause_definitions(cause_name, kpi_id), learning_paths(title), training_programs(title)").order("priority"),
      supabase.from("learning_paths").select("id, title").order("title"),
      supabase.from("training_programs").select("id, title").eq("is_active", true).order("title"),
    ]);
    setKpis(kpisRes.data || []);
    setCauses(causesRes.data || []);
    setInterventionLinks(linksRes.data || []);
    setLearningPaths(pathsRes.data || []);
    setPrograms(progsRes.data || []);
    setLoading(false);
  };

  const handleSaveCause = async () => {
    if (!causeForm.kpi_id || !causeForm.cause_name.trim()) {
      toast({ title: "KPI and cause name required", variant: "destructive" }); return;
    }
    const { error } = await supabase.from("laser_cause_definitions").insert({
      ...causeForm, default_weight: parseFloat(causeForm.default_weight),
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Cause added to causal map" });
    setShowCauseDialog(false);
    setCauseForm({ kpi_id: "", cause_name: "", cause_category: "skill_gap", description: "", default_weight: "0.25", requires_training: true, escalation_target: "" });
    fetchData();
  };

  const handleDeleteCause = async (id: string) => {
    const { error } = await supabase.from("laser_cause_definitions").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Cause removed" }); fetchData();
  };

  const handleSaveIntervention = async () => {
    if (!interventionForm.cause_id) { toast({ title: "Select a cause", variant: "destructive" }); return; }
    const payload: any = {
      cause_id: interventionForm.cause_id,
      intervention_type: interventionForm.intervention_type,
    };
    if (interventionForm.intervention_type === "learning_path" && interventionForm.learning_path_id) {
      payload.learning_path_id = interventionForm.learning_path_id;
    } else if (interventionForm.intervention_type === "program" && interventionForm.program_id) {
      payload.program_id = interventionForm.program_id;
    } else if (interventionForm.intervention_type === "micro") {
      payload.micro_intervention_title = interventionForm.micro_intervention_title;
      payload.micro_intervention_content = interventionForm.micro_intervention_content;
      payload.micro_intervention_type = interventionForm.micro_intervention_type;
    }
    const { error } = await supabase.from("laser_cause_interventions").insert(payload);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Intervention linked" });
    setShowInterventionDialog(false);
    setInterventionForm({ cause_id: "", intervention_type: "learning_path", learning_path_id: "", program_id: "", micro_intervention_title: "", micro_intervention_content: "", micro_intervention_type: "checklist" });
    fetchData();
  };

  const handleDeleteIntervention = async (id: string) => {
    await supabase.from("laser_cause_interventions").delete().eq("id", id);
    toast({ title: "Intervention unlinked" }); fetchData();
  };

  const causesByKpi = kpis.map(kpi => ({
    ...kpi,
    causes: causes.filter(c => c.kpi_id === kpi.id),
  }));

  const categoryColors: Record<string, string> = {
    skill_gap: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    equipment: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    process: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    material: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    environment: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    human_error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/laser")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" /> Causal Map Builder
          </h1>
          <p className="text-muted-foreground text-sm">Define probable causes for each KPI deviation and link interventions</p>
        </div>
        <Dialog open={showCauseDialog} onOpenChange={setShowCauseDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Cause</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Probable Cause</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>KPI *</Label>
                <Select value={causeForm.kpi_id} onValueChange={(v) => setCauseForm({ ...causeForm, kpi_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select KPI" /></SelectTrigger>
                  <SelectContent>
                    {kpis.map(k => <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cause Name *</Label>
                <Input value={causeForm.cause_name} onChange={(e) => setCauseForm({ ...causeForm, cause_name: e.target.value })} placeholder="e.g. Machine calibration error" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={causeForm.cause_category} onValueChange={(v) => setCauseForm({ ...causeForm, cause_category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skill_gap">Skill Gap</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="process">Process</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="human_error">Human Error</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Default Weight (0-1)</Label>
                  <Input type="number" step="0.05" min="0" max="1" value={causeForm.default_weight} onChange={(e) => setCauseForm({ ...causeForm, default_weight: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={causeForm.description} onChange={(e) => setCauseForm({ ...causeForm, description: e.target.value })} placeholder="Describe this cause..." />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={causeForm.requires_training} onCheckedChange={(v) => setCauseForm({ ...causeForm, requires_training: v })} />
                <Label>Requires training intervention</Label>
              </div>
              {!causeForm.requires_training && (
                <div>
                  <Label>Escalation Target</Label>
                  <Input value={causeForm.escalation_target} onChange={(e) => setCauseForm({ ...causeForm, escalation_target: e.target.value })} placeholder="e.g. Maintenance, Procurement" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCauseDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveCause}>Add Cause</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Intervention Link Dialog */}
      <Dialog open={showInterventionDialog} onOpenChange={setShowInterventionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Link Intervention to Cause</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Intervention Type</Label>
              <Select value={interventionForm.intervention_type} onValueChange={(v) => setInterventionForm({ ...interventionForm, intervention_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="learning_path">Learning Path</SelectItem>
                  <SelectItem value="program">Training Program</SelectItem>
                  <SelectItem value="micro">Micro-Intervention</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {interventionForm.intervention_type === "learning_path" && (
              <div>
                <Label>Learning Path</Label>
                <Select value={interventionForm.learning_path_id} onValueChange={(v) => setInterventionForm({ ...interventionForm, learning_path_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select learning path" /></SelectTrigger>
                  <SelectContent>
                    {learningPaths.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {interventionForm.intervention_type === "program" && (
              <div>
                <Label>Training Program</Label>
                <Select value={interventionForm.program_id} onValueChange={(v) => setInterventionForm({ ...interventionForm, program_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {interventionForm.intervention_type === "micro" && (
              <>
                <div>
                  <Label>Title</Label>
                  <Input value={interventionForm.micro_intervention_title} onChange={(e) => setInterventionForm({ ...interventionForm, micro_intervention_title: e.target.value })} placeholder="e.g. Machine Calibration Checklist" />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={interventionForm.micro_intervention_type} onValueChange={(v) => setInterventionForm({ ...interventionForm, micro_intervention_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checklist">Checklist</SelectItem>
                      <SelectItem value="video">Quick Video</SelectItem>
                      <SelectItem value="document">Reference Document</SelectItem>
                      <SelectItem value="task">Action Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea value={interventionForm.micro_intervention_content} onChange={(e) => setInterventionForm({ ...interventionForm, micro_intervention_content: e.target.value })} placeholder="Steps, instructions, or content..." rows={4} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterventionDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveIntervention}>Link Intervention</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Causal Maps by KPI */}
      {causesByKpi.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No KPIs configured yet</p>
            <p className="text-sm">Add KPIs first, then define probable causes here.</p>
            <Button className="mt-4" onClick={() => navigate("/laser/kpi-config")}>Configure KPIs</Button>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {causesByKpi.map(kpi => (
            <AccordionItem key={kpi.id} value={kpi.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{kpi.name}</p>
                    <p className="text-xs text-muted-foreground">{kpi.causes.length} probable cause{kpi.causes.length !== 1 ? "s" : ""} defined</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pb-2">
                  {kpi.causes.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No causes defined for this KPI yet.</p>
                  ) : (
                    kpi.causes.map((cause: any) => {
                      const linkedInterventions = interventionLinks.filter(l => l.cause_id === cause.id);
                      return (
                        <div key={cause.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={categoryColors[cause.cause_category] || categoryColors.other}>
                                {cause.cause_category.replace("_", " ")}
                              </Badge>
                              <span className="font-medium text-sm">{cause.cause_name}</span>
                              <Badge variant="outline" className="text-xs">Weight: {cause.default_weight}</Badge>
                              {cause.requires_training ? (
                                <Badge variant="outline" className="text-xs text-blue-600">Training</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs text-orange-600">Escalation: {cause.escalation_target || "—"}</Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedCauseId(cause.id);
                                setInterventionForm({ ...interventionForm, cause_id: cause.id });
                                setShowInterventionDialog(true);
                              }}>
                                <Link2 className="h-4 w-4 mr-1" /> Link
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteCause(cause.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          {cause.description && <p className="text-xs text-muted-foreground">{cause.description}</p>}
                          {linkedInterventions.length > 0 && (
                            <div className="ml-4 space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">Linked Interventions:</p>
                              {linkedInterventions.map((link: any) => (
                                <div key={link.id} className="flex items-center justify-between text-sm bg-accent/30 rounded p-2">
                                  <div className="flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-primary" />
                                    {link.intervention_type === "learning_path" && <span>{link.learning_paths?.title || "Learning Path"}</span>}
                                    {link.intervention_type === "program" && <span>{link.training_programs?.title || "Program"}</span>}
                                    {link.intervention_type === "micro" && <span>{link.micro_intervention_title || "Micro-intervention"}</span>}
                                    <Badge variant="outline" className="text-xs">{link.intervention_type}</Badge>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteIntervention(link.id)}>
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default CausalMaps;
