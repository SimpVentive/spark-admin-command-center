import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Building2, MapPin, Users, TrendingUp, FileDown, Target, BookOpen, AlertTriangle } from "lucide-react";
import { generatePDF, generateExcel } from "@/utils/reportExport";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#6366f1",
  "#f59e0b",
  "#10b981",
];

export default function OrgTrainingNeeds() {
  const [selectedCycle, setSelectedCycle] = useState<string>("all");

  const { data: cycles = [] } = useQuery({
    queryKey: ["org-tna-cycles"],
    queryFn: async () => {
      const { data } = await supabase.from("tna_cycles").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["org-tni-submissions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tni_submissions")
        .select("*, profiles(full_name, department, location, position)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: programs = [] } = useQuery({
    queryKey: ["org-training-programs"],
    queryFn: async () => {
      const { data } = await supabase.from("training_programs").select("id, title, category, duration_hours, level").eq("is_active", true);
      return data || [];
    },
  });

  // Filter submissions by selected cycle
  const filtered = selectedCycle === "all"
    ? submissions
    : submissions.filter((s: any) => s.cycle_id === selectedCycle);

  // Aggregate program demand
  const programDemand: Record<string, { title: string; category: string; count: number; departments: Set<string> }> = {};
  filtered.forEach((s: any) => {
    const needs = s.training_needs as any;
    const selectedProgs: string[] = needs?.selectedPrograms || [];
    selectedProgs.forEach((pid: string) => {
      const prog = programs.find((p: any) => p.id === pid);
      if (prog) {
        if (!programDemand[pid]) {
          programDemand[pid] = { title: prog.title, category: prog.category, count: 0, departments: new Set() };
        }
        programDemand[pid].count += 1;
        if (s.profiles?.department) programDemand[pid].departments.add(s.profiles.department);
      }
    });
  });

  const demandList = Object.entries(programDemand)
    .map(([id, d]) => ({ id, ...d, departments: Array.from(d.departments) }))
    .sort((a, b) => b.count - a.count);

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  demandList.forEach((d) => {
    categoryBreakdown[d.category] = (categoryBreakdown[d.category] || 0) + d.count;
  });
  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }));

  // Department breakdown
  const deptBreakdown: Record<string, number> = {};
  filtered.forEach((s: any) => {
    const dept = s.profiles?.department || "Unassigned";
    deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
  });
  const deptData = Object.entries(deptBreakdown).map(([name, submissions]) => ({ name, submissions })).sort((a, b) => b.submissions - a.submissions);

  // Location breakdown
  const locBreakdown: Record<string, number> = {};
  filtered.forEach((s: any) => {
    const loc = s.profiles?.location || "Unassigned";
    locBreakdown[loc] = (locBreakdown[loc] || 0) + 1;
  });
  const locData = Object.entries(locBreakdown).map(([name, submissions]) => ({ name, submissions })).sort((a, b) => b.submissions - a.submissions);

  // Status summary
  const statusCounts = {
    total: filtered.length,
    submitted: filtered.filter((s: any) => s.status === "submitted").length,
    approved: filtered.filter((s: any) => s.status === "approved").length,
    pending: filtered.filter((s: any) => s.status === "pending").length,
    rejected: filtered.filter((s: any) => s.status === "rejected").length,
  };

  // Top skills gaps (programs requested by most unique departments)
  const skillGaps = demandList
    .filter((d) => d.departments.length >= 2)
    .slice(0, 5);

  const handleExportPDF = () => {
    const headers = ["Program", "Category", "Demand Count", "Departments"];
    const rows = demandList.map((d) => [d.title, d.category, d.count, d.departments.join(", ")]);
    generatePDF(
      { title: "Org. Training Needs Report", subtitle: "Organization-wide Training Demand Analysis", confidential: true },
      [
        { label: "Total Submissions", value: statusCounts.total },
        { label: "Unique Programs Requested", value: demandList.length },
        { label: "Approved", value: statusCounts.approved },
        { label: "Departments", value: Object.keys(deptBreakdown).length },
      ],
      [{ title: "Program Demand", headers, rows }]
    );
  };

  const handleExportExcel = () => {
    const headers = ["Program", "Category", "Demand Count", "Departments"];
    const rows = demandList.map((d) => [d.title, d.category, d.count, d.departments.join(", ")]);
    generateExcel("Org Training Needs", headers, rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Org. Training Needs</h1>
          <p className="text-muted-foreground">Organization-wide training demand analysis from TNI surveys</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCycle} onValueChange={setSelectedCycle}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by Cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cycles</SelectItem>
              {cycles.map((c: any) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileDown className="w-4 h-4 mr-2" />PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileDown className="w-4 h-4 mr-2" />Excel
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Submissions</p>
              <p className="text-2xl font-bold">{statusCounts.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <BookOpen className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Unique Programs Requested</p>
              <p className="text-2xl font-bold">{demandList.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Building2 className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Departments</p>
              <p className="text-2xl font-bold">{Object.keys(deptBreakdown).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <TrendingUp className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Approval Rate</p>
              <p className="text-2xl font-bold">
                {statusCounts.total > 0 ? Math.round((statusCounts.approved / statusCounts.total) * 100) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-Department Skill Gaps */}
      {skillGaps.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Cross-Department Skill Gaps
            </CardTitle>
            <CardDescription>Programs requested across multiple departments — potential org-wide gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {skillGaps.map((gap) => (
                <div key={gap.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{gap.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {gap.departments.map((d) => (
                        <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{gap.count}</p>
                    <p className="text-xs text-muted-foreground">requests</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="demand" className="space-y-4">
        <TabsList>
          <TabsTrigger value="demand">Program Demand</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="locations">By Location</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        {/* Program Demand Table */}
        <TabsContent value="demand">
          <Card>
            <CardHeader>
              <CardTitle>Program Demand Ranking</CardTitle>
              <CardDescription>Programs ranked by number of employee requests</CardDescription>
            </CardHeader>
            <CardContent>
              {demandList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No training needs submitted yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Demand</TableHead>
                      <TableHead>Departments</TableHead>
                      <TableHead>Demand %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demandList.slice(0, 20).map((d, i) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">#{i + 1}</TableCell>
                        <TableCell className="font-medium">{d.title}</TableCell>
                        <TableCell><Badge variant="secondary">{d.category}</Badge></TableCell>
                        <TableCell className="font-bold">{d.count}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {d.departments.slice(0, 3).map((dept) => (
                              <Badge key={dept} variant="outline" className="text-xs">{dept}</Badge>
                            ))}
                            {d.departments.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{d.departments.length - 3}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Progress value={statusCounts.total > 0 ? (d.count / statusCounts.total) * 100 : 0} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-10 text-right">
                              {statusCounts.total > 0 ? Math.round((d.count / statusCounts.total) * 100) : 0}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Breakdown */}
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Submissions by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Breakdown */}
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Submissions by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Pie */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Demand by Training Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={140} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Submitted", count: statusCounts.submitted, color: "bg-blue-500" },
              { label: "Approved", count: statusCounts.approved, color: "bg-green-500" },
              { label: "Pending", count: statusCounts.pending, color: "bg-yellow-500" },
              { label: "Rejected", count: statusCounts.rejected, color: "bg-red-500" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`w-3 h-3 rounded-full ${s.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.count}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
