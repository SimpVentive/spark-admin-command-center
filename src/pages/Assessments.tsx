import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Clock, Users, FileText, BarChart, Target, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Assessment {
  id: string;
  title: string;
  assessment_type: string;
  time_limit_minutes: number | null;
  passing_score: number;
  max_attempts: number | null;
  created_at: string | null;
  question_count?: number;
  completion_count?: number;
  avg_score?: number;
}

const Assessments = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchAssessments(); }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase.from('assessments').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      const enriched = await Promise.all((data || []).map(async (a) => {
        const { count: qCount } = await supabase.from('assessment_questions').select('*', { count: 'exact', head: true }).eq('assessment_id', a.id);
        const { data: results } = await (supabase as any).from('assessment_results').select('score, status').eq('assessment_id', a.id);
        const completions = (results || []).filter((r: any) => r.status !== 'in_progress');
        const avgScore = completions.length > 0 ? Math.round(completions.reduce((s: number, r: any) => s + (r.score || 0), 0) / completions.length) : 0;
        return { ...a, question_count: qCount || 0, completion_count: completions.length, avg_score: avgScore };
      }));

      setAssessments(enriched);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const getTypeColor = (type: string) => {
    switch (type) { case 'quiz': return 'bg-blue-100 text-blue-800'; case 'survey': return 'bg-green-100 text-green-800'; case 'exam': case 'certification': return 'bg-purple-100 text-purple-800'; default: return 'bg-muted text-muted-foreground'; }
  };

  const filtered = assessments.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Assessment Management</h1><p className="text-muted-foreground">Create and manage assessments, quizzes, and exams</p></div>
        <Button className="gap-2" onClick={() => navigate("/assessments/create")}><Plus className="h-4 w-4" />Create Assessment</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search assessments..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No assessments found. Create your first assessment.</CardContent></Card>
      ) : (
        <div className="grid gap-6">
          {filtered.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <Badge className={getTypeColor(assessment.assessment_type)}>{assessment.assessment_type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate("/assessments/results")}>View Results</Button>
                    <Button size="sm" onClick={() => navigate(`/assessments/create`)}>Edit</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><div className="text-sm"><div className="font-medium">{assessment.question_count}</div><div className="text-muted-foreground">Questions</div></div></div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><div className="text-sm"><div className="font-medium">{assessment.time_limit_minutes || '∞'}m</div><div className="text-muted-foreground">Time Limit</div></div></div>
                  <div className="flex items-center gap-2"><Target className="h-4 w-4 text-muted-foreground" /><div className="text-sm"><div className="font-medium">{assessment.passing_score}%</div><div className="text-muted-foreground">Pass Score</div></div></div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><div className="text-sm"><div className="font-medium">{assessment.completion_count}</div><div className="text-muted-foreground">Completed</div></div></div>
                  <div className="flex items-center gap-2"><BarChart className="h-4 w-4 text-muted-foreground" /><div className="text-sm"><div className="font-medium">{assessment.avg_score}%</div><div className="text-muted-foreground">Avg Score</div></div></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Question Bank</CardTitle></CardHeader>
          <CardContent><Button variant="outline" className="w-full" onClick={() => navigate("/assessments/questions")}>Manage Question Bank</Button></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Assessment Analytics</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span>Total Assessments</span><Badge variant="outline">{assessments.length}</Badge></div>
              <div className="flex justify-between"><span>Total Completions</span><Badge variant="outline">{assessments.reduce((s, a) => s + (a.completion_count || 0), 0)}</Badge></div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate("/assessments/results")}>View Detailed Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessments;
