import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Save, Calendar, Users, Building, MapPin, Briefcase, Download, BarChart3, Eye, CheckCircle, Clock, PieChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TNACycle {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  departments: string[];
  workflow_type: string;
  created_at: string;
  created_by: string | null;
}

interface TNISubmission {
  id: string;
  employee_id: string;
  status: string;
  training_needs: any;
  submitted_at: string | null;
  employee_comments: string | null;
  manager_comments: string | null;
  manager_approved_at: string | null;
}

export default function TNACycleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cycle, setCycle] = useState<TNACycle | null>(null);
  const [submissions, setSubmissions] = useState<TNISubmission[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", status: "", start_date: "", end_date: "" });
  const [saving, setSaving] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");
  const [programs, setPrograms] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  const isEditMode = new URLSearchParams(window.location.search).get("edit") === "true";

  useEffect(() => {
    if (id) {
      fetchCycleData();
      fetchReferenceData();
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode && cycle) {
      setIsEditing(true);
    }
  }, [isEditMode, cycle]);

  const fetchReferenceData = async () => {
    const [programsRes, deptsRes, locsRes] = await Promise.all([
      supabase.from('training_programs').select('id, title, category, departments, locations, roles').eq('is_active', true),
      supabase.from('departments').select('id, name').eq('is_active', true),
      supabase.from('locations').select('id, name').eq('is_active', true),
    ]);
    setPrograms(programsRes.data || []);
    setDepartments(deptsRes.data || []);
    setLocations(locsRes.data || []);
  };

  const fetchCycleData = async () => {
    try {
      const { data: cycleData, error: cycleError } = await supabase
        .from('tna_cycles')
        .select('*')
        .eq('id', id)
        .single();

      if (cycleError) throw cycleError;
      setCycle(cycleData);
      setEditData({
        name: cycleData.name,
        status: cycleData.status,
        start_date: cycleData.start_date,
        end_date: cycleData.end_date,
      });

      const { data: subsData } = await supabase
        .from('tni_submissions')
        .select('*')
        .eq('cycle_id', id);

      setSubmissions(subsData || []);

      // Fetch profiles for submissions
      if (subsData && subsData.length > 0) {
        const employeeIds = [...new Set(subsData.map(s => s.employee_id))];
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, email, department, position')
          .in('id', employeeIds);

        const profileMap: Record<string, any> = {};
        (profileData || []).forEach(p => { profileMap[p.id] = p; });
        setProfiles(profileMap);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('tna_cycles')
        .update({
          name: editData.name,
          status: editData.status,
          start_date: editData.start_date,
          end_date: editData.end_date,
        })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Saved", description: "Cycle updated successfully" });
      setIsEditing(false);
      fetchCycleData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default", completed: "secondary", draft: "outline", closed: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  // Analysis helpers
  const getFilteredSubmissions = () => {
    return submissions.filter(s => {
      const profile = profiles[s.employee_id];
      if (!profile) return true;
      if (filterDepartment !== "all" && profile.department !== filterDepartment) return false;
      if (filterPosition !== "all" && profile.position !== filterPosition) return false;
      return true;
    });
  };

  const getSelectedPrograms = () => {
    const programCounts: Record<string, { title: string; count: number; departments: Record<string, number>; positions: Record<string, number> }> = {};
    
    submissions.forEach(s => {
      const profile = profiles[s.employee_id];
      const needs = Array.isArray(s.training_needs) ? s.training_needs : [];
      needs.forEach((need: any) => {
        const programTitle = need.program || need.skill || need.title || "Unknown";
        if (!programCounts[programTitle]) {
          programCounts[programTitle] = { title: programTitle, count: 0, departments: {}, positions: {} };
        }
        programCounts[programTitle].count++;
        if (profile?.department) {
          programCounts[programTitle].departments[profile.department] = (programCounts[programTitle].departments[profile.department] || 0) + 1;
        }
        if (profile?.position) {
          programCounts[programTitle].positions[profile.position] = (programCounts[programTitle].positions[profile.position] || 0) + 1;
        }
      });
    });

    return Object.values(programCounts).sort((a, b) => b.count - a.count);
  };

  const getDepartmentBreakdown = () => {
    const breakdown: Record<string, { total: number; submitted: number; approved: number }> = {};
    submissions.forEach(s => {
      const dept = profiles[s.employee_id]?.department || "Unknown";
      if (!breakdown[dept]) breakdown[dept] = { total: 0, submitted: 0, approved: 0 };
      breakdown[dept].total++;
      if (s.submitted_at) breakdown[dept].submitted++;
      if (s.status === "approved") breakdown[dept].approved++;
    });
    return breakdown;
  };

  const getPositionBreakdown = () => {
    const breakdown: Record<string, number> = {};
    submissions.forEach(s => {
      const pos = profiles[s.employee_id]?.position || "Unknown";
      breakdown[pos] = (breakdown[pos] || 0) + 1;
    });
    return breakdown;
  };

  const handleDownloadCSV = () => {
    const selectedPrograms = getSelectedPrograms();
    const headers = ["Program", "Total Selections", "Departments", "Positions"];
    const rows = selectedPrograms.map(p => [
      p.title,
      p.count,
      Object.entries(p.departments).map(([d, c]) => `${d}(${c})`).join("; "),
      Object.entries(p.positions).map(([pos, c]) => `${pos}(${c})`).join("; "),
    ]);

    const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tna-analysis-${cycle?.name || id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Analysis report exported as CSV" });
  };

  const uniquePositions = [...new Set(Object.values(profiles).map(p => p.position).filter(Boolean))];
  const uniqueDepartments = [...new Set(Object.values(profiles).map(p => p.department).filter(Boolean))];

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading cycle details...</div>;
  }

  if (!cycle) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Cycle not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/training-needs/cycles')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cycles
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{cycle.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(cycle.status)}
              <span className="text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 inline mr-1" />
                {cycle.start_date} — {cycle.end_date}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing && cycle.status !== "completed" && cycle.status !== "closed" && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Cycle</Button>
          )}
          <Button variant="outline" onClick={handleDownloadCSV}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard"><BarChart3 className="h-4 w-4 mr-1" /> Dashboard</TabsTrigger>
          <TabsTrigger value="overview"><Eye className="h-4 w-4 mr-1" /> Overview</TabsTrigger>
          <TabsTrigger value="submissions"><Users className="h-4 w-4 mr-1" /> Submissions</TabsTrigger>
          <TabsTrigger value="departments"><Building className="h-4 w-4 mr-1" /> Department Analysis</TabsTrigger>
          <TabsTrigger value="analysis"><PieChart className="h-4 w-4 mr-1" /> Program Analysis</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions.filter(s => s.submitted_at).length}</div>
                <p className="text-xs text-muted-foreground">out of {submissions.length} expected</p>
                <Progress value={submissions.length > 0 ? (submissions.filter(s => s.submitted_at).length / submissions.length) * 100 : 0} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {submissions.length > 0 ? Math.round((submissions.filter(s => s.submitted_at).length / submissions.length) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {submissions.filter(s => s.submitted_at).length > submissions.length * 0.85 ? (
                    <span className="text-emerald-600">Above 85% threshold</span>
                  ) : (
                    <span className="text-amber-600">Below 85% threshold</span>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Programs Selected</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getSelectedPrograms().length}</div>
                <p className="text-xs text-muted-foreground">Unique programs identified</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions.filter(s => !s.submitted_at).length}</div>
                <p className="text-xs text-muted-foreground">Need to complete TNI</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Distribution & Top Programs */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Category Distribution</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const catCounts: Record<string, { count: number; programs: Set<string> }> = {};
                  submissions.forEach(s => {
                    const needs = Array.isArray(s.training_needs) ? s.training_needs : [];
                    needs.forEach((n: any) => {
                      const cat = n.category || "Uncategorized";
                      if (!catCounts[cat]) catCounts[cat] = { count: 0, programs: new Set() };
                      catCounts[cat].count++;
                      if (n.program || n.title) catCounts[cat].programs.add(n.program || n.title);
                    });
                  });
                  const cats = Object.entries(catCounts).sort(([,a],[,b]) => b.count - a.count);
                  if (cats.length === 0) return <p className="text-muted-foreground text-sm">No data yet</p>;
                  const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];
                  return cats.map(([cat, data], i) => (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{cat}</span>
                        <span className="text-sm text-muted-foreground">{data.count} requests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${colors[i % colors.length]}`} />
                        <div className="text-sm">{data.programs.size} programs</div>
                      </div>
                    </div>
                  ));
                })()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top Requested Programs</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {getSelectedPrograms().slice(0, 5).map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">#{i + 1} {p.title}</div>
                      <div className="text-sm text-muted-foreground">{p.count} selections</div>
                    </div>
                    <Badge variant={p.count > 5 ? "destructive" : "secondary"}>
                      {p.count > 5 ? "High" : "Medium"}
                    </Badge>
                  </div>
                ))}
                {getSelectedPrograms().length === 0 && (
                  <p className="text-muted-foreground text-sm">No program data yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Department completion overview */}
          <Card>
            <CardHeader><CardTitle>Department Completion</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(getDepartmentBreakdown()).map(([dept, data]) => (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept}</span>
                    <span>{data.total > 0 ? Math.round((data.submitted / data.total) * 100) : 0}%</span>
                  </div>
                  <Progress value={data.total > 0 ? (data.submitted / data.total) * 100 : 0} className="h-2" />
                </div>
              ))}
              {Object.keys(getDepartmentBreakdown()).length === 0 && (
                <p className="text-muted-foreground text-sm">No department data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Cycle Details</CardTitle></CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editData.status} onValueChange={v => setEditData(d => ({ ...d, status: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" value={editData.start_date} onChange={e => setEditData(d => ({ ...d, start_date: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" value={editData.end_date} onChange={e => setEditData(d => ({ ...d, end_date: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><span className="text-sm text-muted-foreground">Workflow</span><p className="font-medium">{cycle.workflow_type}</p></div>
                  <div><span className="text-sm text-muted-foreground">Departments</span><div className="flex flex-wrap gap-1 mt-1">{(cycle.departments || []).map(d => <Badge key={d} variant="outline" className="text-xs">{d}</Badge>)}</div></div>
                  <div><span className="text-sm text-muted-foreground">Total Submissions</span><p className="font-medium text-lg">{submissions.length}</p></div>
                  <div><span className="text-sm text-muted-foreground">Approved</span><p className="font-medium text-lg">{submissions.filter(s => s.status === "approved").length}</p></div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Employee Submissions ({submissions.length})</CardTitle></CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No submissions yet for this cycle.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Programs Selected</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map(s => {
                      const profile = profiles[s.employee_id];
                      const needs = Array.isArray(s.training_needs) ? s.training_needs : [];
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{profile?.full_name || s.employee_id}</TableCell>
                          <TableCell>{profile?.department || "—"}</TableCell>
                          <TableCell>{profile?.position || "—"}</TableCell>
                          <TableCell>{getStatusBadge(s.status)}</TableCell>
                          <TableCell>{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : "—"}</TableCell>
                          <TableCell>{needs.length}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Analysis Tab */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Department-wise Completion Status</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(getDepartmentBreakdown()).map(([dept, data]) => (
                    <TableRow key={dept}>
                      <TableCell className="font-medium">{dept}</TableCell>
                      <TableCell>{data.total}</TableCell>
                      <TableCell>{data.submitted}</TableCell>
                      <TableCell>{data.approved}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={data.total > 0 ? (data.submitted / data.total) * 100 : 0} className="w-20 h-2" />
                          <span className="text-sm">{data.total > 0 ? Math.round((data.submitted / data.total) * 100) : 0}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {Object.keys(getDepartmentBreakdown()).length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No department data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Position-wise Breakdown</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Submissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(getPositionBreakdown()).sort(([,a],[,b]) => b - a).map(([pos, count]) => (
                    <TableRow key={pos}>
                      <TableCell className="font-medium">{pos}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                  {Object.keys(getPositionBreakdown()).length === 0 && (
                    <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-6">No position data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Building className="h-3 w-3" /> Department</Label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {uniqueDepartments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> Position</Label>
                  <Select value={filterPosition} onValueChange={setFilterPosition}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      {uniquePositions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleDownloadCSV} className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Download Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Breakdown */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" /> Department-wise Breakdown</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Submissions</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Completion %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(getDepartmentBreakdown()).map(([dept, data]) => (
                    <TableRow key={dept}>
                      <TableCell className="font-medium">{dept}</TableCell>
                      <TableCell>{data.total}</TableCell>
                      <TableCell>{data.submitted}</TableCell>
                      <TableCell>{data.approved}</TableCell>
                      <TableCell>
                        <Badge variant={data.total > 0 && data.submitted / data.total >= 0.8 ? "default" : "secondary"}>
                          {data.total > 0 ? Math.round((data.submitted / data.total) * 100) : 0}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {Object.keys(getDepartmentBreakdown()).length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No data available</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Position Breakdown */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Position-wise Breakdown</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Submissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(getPositionBreakdown()).map(([pos, count]) => (
                    <TableRow key={pos}>
                      <TableCell className="font-medium">{pos}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                  {Object.keys(getPositionBreakdown()).length === 0 && (
                    <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-6">No data available</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Selected Programs Analysis */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Employee-Selected Programs Analysis</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program / Skill</TableHead>
                    <TableHead>Total Selections</TableHead>
                    <TableHead>By Department</TableHead>
                    <TableHead>By Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSelectedPrograms().map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell><Badge>{p.count}</Badge></TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(p.departments).map(([d, c]) => (
                            <Badge key={d} variant="outline" className="text-xs">{d}: {c}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(p.positions).map(([pos, c]) => (
                            <Badge key={pos} variant="secondary" className="text-xs">{pos}: {c}</Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getSelectedPrograms().length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">No program selections found in submissions</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
