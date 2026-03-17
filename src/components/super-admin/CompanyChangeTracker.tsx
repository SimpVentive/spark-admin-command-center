import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Brain, Clock, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  companyId: string;
  companyName: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-muted text-muted-foreground",
};

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-destructive/10 text-destructive",
};

export default function CompanyChangeTracker({ companyId, companyName }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", change_type: "feature_request", priority: "medium", requested_by: "",
  });

  const { data: changes = [], isLoading } = useQuery({
    queryKey: ["company-customizations", companyId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("company_customizations")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from("company_customizations").insert({
        company_id: companyId,
        title: form.title,
        description: form.description,
        change_type: form.change_type,
        priority: form.priority,
        requested_by: form.requested_by || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-customizations", companyId] });
      toast({ title: "Change request added" });
      setOpen(false);
      setForm({ title: "", description: "", change_type: "feature_request", priority: "medium", requested_by: "" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const analyzeWithAI = async (changeId: string, title: string, description: string) => {
    setAnalyzingId(changeId);
    try {
      const { data, error } = await supabase.functions.invoke("ai-change-analysis", {
        body: { title, description, companyName },
      });
      if (error) throw error;

      const result = data?.analysis;
      if (result) {
        await (supabase as any).from("company_customizations").update({
          ai_estimated_hours: result.estimated_hours,
          ai_impact_score: result.impact_score,
          ai_risk_level: result.risk_level,
          ai_affected_modules: result.affected_modules,
          ai_analysis_notes: result.analysis_notes,
        }).eq("id", changeId);

        queryClient.invalidateQueries({ queryKey: ["company-customizations", companyId] });
        toast({ title: "AI Analysis Complete" });
      }
    } catch (e: any) {
      toast({ title: "AI Analysis Failed", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzingId(null);
    }
  };

  const updateStatus = async (changeId: string, status: string) => {
    await (supabase as any).from("company_customizations").update({ status }).eq("id", changeId);
    queryClient.invalidateQueries({ queryKey: ["company-customizations", companyId] });
    toast({ title: `Status updated to ${status}` });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Customizations & Changes</CardTitle>
          <CardDescription>Track modifications requested for {companyName}</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Log Change</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Customization Request</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Custom report for HR module" />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed description of what needs to change..." rows={4} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.change_type} onValueChange={(v) => setForm({ ...form, change_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="bug_fix">Bug Fix</SelectItem>
                      <SelectItem value="configuration">Configuration</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="ui_change">UI Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Requested By</Label>
                  <Input value={form.requested_by} onChange={(e) => setForm({ ...form, requested_by: e.target.value })} placeholder="Client contact" />
                </div>
              </div>
              <Button className="w-full" onClick={() => addMutation.mutate()} disabled={!form.title.trim() || !form.description.trim()}>
                Submit Change Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-4">Loading...</p>
        ) : changes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No customization requests logged yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Change</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Estimate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changes.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">{c.change_type.replace("_", " ")}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={PRIORITY_STYLES[c.priority]}>{c.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_STYLES[c.status]}>{c.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {c.ai_estimated_hours ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" /> {c.ai_estimated_hours}h
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <AlertTriangle className="h-3 w-3" /> Risk: {c.ai_risk_level}
                        </div>
                        {c.ai_affected_modules && (
                          <div className="flex flex-wrap gap-1">
                            {c.ai_affected_modules.slice(0, 3).map((m: string) => (
                              <Badge key={m} variant="outline" className="text-[10px]">{m}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not analyzed</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => analyzeWithAI(c.id, c.title, c.description)}
                        disabled={analyzingId === c.id}
                      >
                        {analyzingId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                      </Button>
                      {c.status === "pending" && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(c.id, "approved")}>
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(c.id, "rejected")}>
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
