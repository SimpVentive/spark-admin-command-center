import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Eye, BarChart3, Users, Clock, Award, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Result {
  id: string;
  assessment_id: string;
  user_id: string;
  score: number | null;
  passing_score: number | null;
  status: string;
  attempt_number: number;
  started_at: string;
  completed_at: string | null;
  time_spent_minutes: number | null;
  assessment?: { title: string } | null;
  profile?: { full_name: string | null; email: string | null } | null;
}

const AssessmentResults = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => { fetchResults(); }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('assessment_results')
        .select('*, assessment:assessments(title), profile:profiles(full_name, email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setResults(data || []);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const getStatusColor = (status: string) => {
    switch (status) { case 'passed': return 'bg-green-100 text-green-800'; case 'failed': return 'bg-red-100 text-red-800'; case 'in_progress': return 'bg-blue-100 text-blue-800'; default: return 'bg-muted text-muted-foreground'; }
  };

  const completed = results.filter(r => r.status !== 'in_progress');
  const stats = {
    total: results.length,
    participants: new Set(results.map(r => r.user_id)).size,
    avgScore: completed.length > 0 ? Math.round(completed.reduce((s, r) => s + (r.score || 0), 0) / completed.length) : 0,
    passRate: completed.length > 0 ? Math.round((completed.filter(r => r.status === 'passed').length / completed.length) * 100) : 0,
  };

  const filtered = results.filter(r => {
    const matchSearch = ((r as any).profile?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || ((r as any).assessment?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Assessment Results</h1><p className="text-muted-foreground">View and analyze assessment performance</p></div>
        <Button onClick={() => toast({ title: "Export Started", description: "Results being exported..." })} className="gap-2"><Download className="h-4 w-4" />Export Results</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[{ label: "Total Attempts", value: stats.total, icon: BarChart3 }, { label: "Participants", value: stats.participants, icon: Users }, { label: "Average Score", value: `${stats.avgScore}%`, icon: Award }, { label: "Pass Rate", value: `${stats.passRate}%`, icon: Clock }].map(s => (
          <Card key={s.label}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{s.label}</CardTitle><s.icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="passed">Passed</SelectItem><SelectItem value="failed">Failed</SelectItem><SelectItem value="in_progress">In Progress</SelectItem></SelectContent></Select>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Participant</TableHead><TableHead>Assessment</TableHead><TableHead>Score</TableHead><TableHead>Status</TableHead><TableHead>Attempt</TableHead><TableHead>Duration</TableHead><TableHead>Completed</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><div className="font-medium">{(r as any).profile?.full_name || 'Unknown'}</div><div className="text-sm text-muted-foreground">{(r as any).profile?.email || ''}</div></TableCell>
                  <TableCell>{(r as any).assessment?.title || 'Unknown'}</TableCell>
                  <TableCell>{r.status === 'in_progress' ? '—' : `${r.score}%`}{r.status !== 'in_progress' && <span className="text-sm text-muted-foreground"> / {r.passing_score}%</span>}</TableCell>
                  <TableCell><Badge className={getStatusColor(r.status)}>{r.status.replace('_', ' ')}</Badge></TableCell>
                  <TableCell>{r.attempt_number}</TableCell>
                  <TableCell>{r.time_spent_minutes ? `${r.time_spent_minutes} min` : '—'}</TableCell>
                  <TableCell>{r.completed_at ? new Date(r.completed_at).toLocaleDateString() : 'In Progress'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No results found.</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentResults;
