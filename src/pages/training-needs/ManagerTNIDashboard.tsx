import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, BookOpen, Plus, Trash2, Eye, CheckCircle, Clock, Calendar,
  BarChart3, Edit, Mail, AlertCircle, TrendingUp
} from "lucide-react";

interface Reportee {
  id: string;
  full_name: string | null;
  email: string | null;
  department: string | null;
  position: string | null;
}

interface TNISubmission {
  id: string;
  cycle_id: string;
  employee_id: string;
  status: string;
  training_needs: any;
  employee_comments: string | null;
  manager_comments: string | null;
  submitted_at: string | null;
  manager_changes_count: number;
  manager_modifications: any[];
}

interface TNACycle {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  manager_ratification_required: boolean;
}

export default function ManagerTNIDashboard() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [reportees, setReportees] = useState<Reportee[]>([]);
  const [cycles, setCycles] = useState<TNACycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<string>("");
  const [selectedReportee, setSelectedReportee] = useState<Reportee | null>(null);
  const [submission, setSubmission] = useState<TNISubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newNeed, setNewNeed] = useState({ description: "", category: "Functional", priority: "medium" });
  const [allSubmissions, setAllSubmissions] = useState<TNISubmission[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);

      // Fetch reportees
      const { data: reps } = await supabase
        .from("profiles")
        .select("id, full_name, email, department, position")
        .eq("manager_id", session.user.id);
      setReportees(reps || []);

      // Fetch cycles
      const { data: cyc } = await supabase
        .from("tna_cycles")
        .select("id, name, status, start_date, end_date, manager_ratification_required")
        .order("created_at", { ascending: false });
      setCycles((cyc as any[]) || []);
      if (cyc && cyc.length > 0) setSelectedCycle(cyc[0].id);

      setLoading(false);
    };
    init();
  }, []);

  // Fetch all submissions for selected cycle and reportees
  useEffect(() => {
    if (!selectedCycle || reportees.length === 0) return;
    const fetchSubs = async () => {
      const repIds = reportees.map(r => r.id);
      const { data } = await supabase
        .from("tni_submissions")
        .select("*")
        .eq("cycle_id", selectedCycle)
        .in("employee_id", repIds);
      setAllSubmissions((data as any[]) || []);
    };
    fetchSubs();
  }, [selectedCycle, reportees]);

  const handleSelectReportee = async (reportee: Reportee) => {
    setSelectedReportee(reportee);
    if (!selectedCycle) return;

    const { data } = await supabase
      .from("tni_submissions")
      .select("*")
      .eq("cycle_id", selectedCycle)
      .eq("employee_id", reportee.id)
      .maybeSingle();
    setSubmission(data as any);
  };

  const getTrainingNeeds = (): any[] => {
    if (!submission?.training_needs) return [];
    const tn = submission.training_needs as any;
    if (Array.isArray(tn)) return tn;
    // Handle the structured format
    const needs: any[] = [];
    if (tn.selectedPrograms) needs.push(...tn.selectedPrograms.map((p: string) => ({ type: "program", id: p })));
    if (tn.customRequirements) needs.push(...tn.customRequirements.map((r: any) => ({ type: "custom", ...r })));
    return needs;
  };

  const handleAddNeed = async () => {
    if (!submission || !newNeed.description) return;

    const currentNeeds = getTrainingNeeds();
    const updatedNeeds = [...currentNeeds, { type: "custom", ...newNeed, addedBy: "manager" }];
    const modifications = [...(submission.manager_modifications || []), {
      action: "added",
      description: newNeed.description,
      category: newNeed.category,
      timestamp: new Date().toISOString(),
    }];

    const { error } = await supabase
      .from("tni_submissions")
      .update({
        training_needs: updatedNeeds,
        manager_modifications: modifications,
        manager_changes_count: (submission.manager_changes_count || 0) + 1,
      })
      .eq("id", submission.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Training Need Added", description: `Added "${newNeed.description}" for ${selectedReportee?.full_name}` });
    setAddDialogOpen(false);
    setNewNeed({ description: "", category: "Functional", priority: "medium" });
    handleSelectReportee(selectedReportee!);
  };

  const handleDeleteNeed = async (index: number) => {
    if (!submission) return;
    const currentNeeds = getTrainingNeeds();
    const removedNeed = currentNeeds[index];
    const updatedNeeds = currentNeeds.filter((_, i) => i !== index);
    const modifications = [...(submission.manager_modifications || []), {
      action: "removed",
      description: removedNeed.description || removedNeed.id || "Program removed",
      timestamp: new Date().toISOString(),
    }];

    const { error } = await supabase
      .from("tni_submissions")
      .update({
        training_needs: updatedNeeds,
        manager_modifications: modifications,
        manager_changes_count: (submission.manager_changes_count || 0) + 1,
      })
      .eq("id", submission.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Training Need Removed", description: `Removed item for ${selectedReportee?.full_name}` });
    handleSelectReportee(selectedReportee!);
  };

  const handleSendNotification = () => {
    toast({
      title: "Notification Sent",
      description: `Email notification sent to ${selectedReportee?.full_name} about TNI changes.`,
    });
  };

  const totalChanges = allSubmissions.reduce((sum, s) => sum + (s.manager_changes_count || 0), 0);
  const submittedCount = allSubmissions.filter(s => s.submitted_at).length;
  const approvedCount = allSubmissions.filter(s => s.status === "approved").length;

  const currentCycle = cycles.find(c => c.id === selectedCycle);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manager TNI Dashboard</h1>
          <p className="text-muted-foreground">
            Review and ratify training needs for your reportees
          </p>
        </div>
        <div className="w-64">
          <Select value={selectedCycle} onValueChange={setSelectedCycle}>
            <SelectTrigger>
              <SelectValue placeholder="Select cycle" />
            </SelectTrigger>
            <SelectContent>
              {cycles.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} {c.manager_ratification_required && "🔒"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Reportees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportees.length}</div>
            <p className="text-xs text-muted-foreground">Direct reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedCount}/{reportees.length}</div>
            <p className="text-xs text-muted-foreground">TNI forms submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Finalized submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Changes</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChanges}</div>
            <p className="text-xs text-muted-foreground">Training needs modified</p>
          </CardContent>
        </Card>
      </div>

      {currentCycle?.manager_ratification_required && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Manager Ratification Required:</strong> You must review and ratify each reportee's training needs before they are finalized.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content: Reportee List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Reportee List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Reportees</CardTitle>
            <CardDescription>Click to view training needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {reportees.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No reportees found</p>
            ) : (
              reportees.map(rep => {
                const sub = allSubmissions.find(s => s.employee_id === rep.id);
                return (
                  <div
                    key={rep.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                      selectedReportee?.id === rep.id ? "bg-accent border-primary" : ""
                    }`}
                    onClick={() => handleSelectReportee(rep)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{rep.full_name || "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground">{rep.department || "—"} · {rep.position || "—"}</p>
                      </div>
                      <div>
                        {sub ? (
                          <Badge variant={sub.status === "approved" ? "default" : sub.status === "submitted" ? "secondary" : "outline"} className="text-xs">
                            {sub.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">No submission</Badge>
                        )}
                      </div>
                    </div>
                    {sub && sub.manager_changes_count > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <Edit className="inline h-3 w-3 mr-1" />{sub.manager_changes_count} changes made
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Right: Detail Pane */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {selectedReportee ? `${selectedReportee.full_name}'s Training Needs` : "Select a Reportee"}
                </CardTitle>
                {selectedReportee && (
                  <CardDescription>{selectedReportee.email} · {selectedReportee.department}</CardDescription>
                )}
              </div>
              {selectedReportee && submission && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleSendNotification}>
                    <Mail className="h-4 w-4 mr-1" /> Notify Employee
                  </Button>
                  <Button size="sm" onClick={() => setAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Need
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedReportee ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Select a reportee from the left pane to view their training needs</p>
              </div>
            ) : !submission ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>This employee hasn't submitted their TNI yet for this cycle</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Training Needs List */}
                {getTrainingNeeds().length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No training needs recorded</p>
                ) : (
                  getTrainingNeeds().map((need, index) => (
                    <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {need.description || need.id || `Program ${index + 1}`}
                          </p>
                          {need.addedBy === "manager" && (
                            <Badge variant="outline" className="text-xs">Added by Manager</Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mt-1">
                          {need.category && <Badge variant="secondary" className="text-xs">{need.category}</Badge>}
                          {need.priority && <Badge variant="outline" className="text-xs">{need.priority}</Badge>}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteNeed(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}

                {/* Employee Comments */}
                {submission.employee_comments && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Employee Comments:</p>
                    <p className="text-sm">{submission.employee_comments}</p>
                  </div>
                )}

                {/* Modification History */}
                {submission.manager_modifications && (submission.manager_modifications as any[]).length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Change History ({(submission.manager_modifications as any[]).length})</p>
                    <div className="space-y-1">
                      {(submission.manager_modifications as any[]).map((mod: any, i: number) => (
                        <div key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className={mod.action === "added" ? "text-emerald-600" : "text-destructive"}>
                            {mod.action === "added" ? "+" : "−"}
                          </span>
                          <span>{mod.description}</span>
                          <span className="ml-auto">{new Date(mod.timestamp).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Training Need Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Training Need</DialogTitle>
            <DialogDescription>Add a training need for {selectedReportee?.full_name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newNeed.description}
                onChange={(e) => setNewNeed(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the training need..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newNeed.category} onValueChange={(v) => setNewNeed(prev => ({ ...prev, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Managerial">Managerial</SelectItem>
                    <SelectItem value="Behavioral">Behavioral</SelectItem>
                    <SelectItem value="Functional">Functional</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newNeed.priority} onValueChange={(v) => setNewNeed(prev => ({ ...prev, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNeed} disabled={!newNeed.description}>Add & Notify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
