import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle, XCircle, Clock, User, BookOpen, ArrowLeft, Plus, Trash2, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Reportee {
  id: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
}

interface Submission {
  id: string;
  employee_id: string;
  cycle_id: string;
  status: string;
  training_needs: any;
  employee_comments: string;
  manager_comments: string;
  submitted_at: string;
}

interface Program {
  id: string;
  title: string;
  category: string;
  duration_hours: number;
}

export default function TeamTrainingNeeds() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reportees, setReportees] = useState<Reportee[]>([]);
  const [selectedReportee, setSelectedReportee] = useState<Reportee | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programApprovals, setProgramApprovals] = useState<Record<string, "approved" | "rejected">>({});
  const [managerAddedPrograms, setManagerAddedPrograms] = useState<string[]>([]);
  const [managerComments, setManagerComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);

  // Fetch reportees
  useEffect(() => {
    if (!user) return;
    const fetchReportees = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, department, position")
        .eq("manager_id", user.id);
      setReportees(data || []);

      const { data: progs } = await supabase
        .from("training_programs")
        .select("id, title, category, duration_hours")
        .eq("is_active", true)
        .order("category")
        .order("title");
      setAllPrograms(progs || []);

      setLoading(false);
    };
    fetchReportees();
  }, [user]);

  // Fetch submissions for selected reportee
  useEffect(() => {
    if (!selectedReportee) return;
    const fetchSubmissions = async () => {
      const { data } = await supabase
        .from("tni_submissions")
        .select("*")
        .eq("employee_id", selectedReportee.id)
        .eq("manager_id", user!.id)
        .in("status", ["submitted", "manager_review", "approved", "rejected"]);
      setSubmissions(data || []);
    };
    fetchSubmissions();
  }, [selectedReportee, user]);

  // When viewing a submission, prepare program data
  useEffect(() => {
    if (!selectedSubmission) return;
    const needs = selectedSubmission.training_needs as any;
    const selectedIds: string[] = needs?.selectedPrograms || [];
    const matchedPrograms = allPrograms.filter(p => selectedIds.includes(p.id));
    setPrograms(matchedPrograms);
    // Reset approvals
    const initial: Record<string, "approved" | "rejected"> = {};
    selectedIds.forEach(id => { initial[id] = "approved"; });
    setProgramApprovals(initial);
    setManagerAddedPrograms([]);
    setManagerComments(selectedSubmission.manager_comments || "");
  }, [selectedSubmission, allPrograms]);

  const handleApproveProgram = (programId: string) => {
    setProgramApprovals(prev => ({ ...prev, [programId]: "approved" }));
  };

  const handleRejectProgram = (programId: string) => {
    setProgramApprovals(prev => ({ ...prev, [programId]: "rejected" }));
  };

  const handleAddManagerProgram = (programId: string) => {
    if (!managerAddedPrograms.includes(programId)) {
      setManagerAddedPrograms(prev => [...prev, programId]);
    }
  };

  const handleRemoveManagerProgram = (programId: string) => {
    setManagerAddedPrograms(prev => prev.filter(id => id !== programId));
  };

  const handleSubmitReview = async () => {
    if (!selectedSubmission) return;
    setSubmitting(true);
    try {
      const approvedPrograms = Object.entries(programApprovals)
        .filter(([_, status]) => status === "approved")
        .map(([id]) => id);

      const finalPrograms = [...approvedPrograms, ...managerAddedPrograms];

      const managerModifications = {
        approved: approvedPrograms,
        rejected: Object.entries(programApprovals)
          .filter(([_, status]) => status === "rejected")
          .map(([id]) => id),
        managerAdded: managerAddedPrograms,
      };

      const { error } = await supabase
        .from("tni_submissions")
        .update({
          status: "approved",
          manager_comments: managerComments,
          manager_approved_at: new Date().toISOString(),
          manager_modifications: managerModifications,
          manager_changes_count: managerAddedPrograms.length +
            Object.values(programApprovals).filter(s => s === "rejected").length,
          training_needs: { selectedPrograms: finalPrograms },
        })
        .eq("id", selectedSubmission.id);

      if (error) throw error;

      toast({ title: "Success", description: `Review submitted for ${selectedReportee?.full_name}. Employee will be notified.` });
      setSelectedSubmission(null);
      // Refresh submissions
      const { data } = await supabase
        .from("tni_submissions")
        .select("*")
        .eq("employee_id", selectedReportee!.id)
        .eq("manager_id", user!.id);
      setSubmissions(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Level 3: Submission detail view
  if (selectedSubmission && selectedReportee) {
    const availableToAdd = allPrograms.filter(
      p => !programs.some(ep => ep.id === p.id) && !managerAddedPrograms.includes(p.id)
    );

    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedReportee.full_name}'s Training Needs</h1>
            <p className="text-muted-foreground">Review, approve/reject programs, or add your own</p>
          </div>
        </div>

        {selectedSubmission.employee_comments && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Employee Comments</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{selectedSubmission.employee_comments}</p>
            </CardContent>
          </Card>
        )}

        {/* Employee selected programs */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Selected Programs</CardTitle>
            <CardDescription>Approve or reject each program</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {programs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No programs selected by employee.</p>
            ) : (
              programs.map(program => (
                <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{program.title}</p>
                      <p className="text-xs text-muted-foreground">{program.category} • {program.duration_hours}h</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={programApprovals[program.id] === "approved" ? "default" : "outline"}
                      onClick={() => handleApproveProgram(program.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant={programApprovals[program.id] === "rejected" ? "destructive" : "outline"}
                      onClick={() => handleRejectProgram(program.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Manager added programs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add Programs
            </CardTitle>
            <CardDescription>Add additional programs for this employee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {managerAddedPrograms.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">Added by you:</p>
                {managerAddedPrograms.map(id => {
                  const prog = allPrograms.find(p => p.id === id);
                  return prog ? (
                    <div key={id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">{prog.title} ({prog.category})</span>
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveManagerProgram(id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            <Select onValueChange={handleAddManagerProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Select a program to add..." />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title} ({p.category})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Manager comments & submit */}
        <Card>
          <CardHeader><CardTitle>Manager Comments</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={managerComments}
              onChange={(e) => setManagerComments(e.target.value)}
              placeholder="Add any comments for the employee..."
            />
            <Button onClick={handleSubmitReview} disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "Submit Review & Notify Employee"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Level 2: Reportee submissions view
  if (selectedReportee) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedReportee(null); setSubmissions([]); }}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedReportee.full_name}</h1>
            <p className="text-muted-foreground">{selectedReportee.department} • {selectedReportee.position}</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Submissions</h3>
              <p className="text-muted-foreground">This employee hasn't submitted any training needs yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map(sub => {
              const needs = sub.training_needs as any;
              const programCount = needs?.selectedPrograms?.length || 0;
              return (
                <Card
                  key={sub.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedSubmission(sub)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">TNI Submission</CardTitle>
                      <Badge variant={sub.status === "approved" ? "default" : sub.status === "rejected" ? "destructive" : "secondary"}>
                        {sub.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Submitted: {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "N/A"} • {programCount} programs selected
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Review Submission →</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Level 1: Reportee list
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Team Training Needs</h1>
        <p className="text-muted-foreground">Review and manage training needs for your team members</p>
      </div>

      {reportees.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Reportees</h3>
            <p className="text-muted-foreground">You don't have any team members assigned to you.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportees.map(reportee => (
            <Card
              key={reportee.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReportee(reportee)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{reportee.full_name}</CardTitle>
                    <CardDescription>{reportee.department} • {reportee.position}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{reportee.email}</p>
                <Button variant="outline" className="w-full mt-3">View TNI Submissions →</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
