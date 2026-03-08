import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters, ReportFilterValues } from "@/components/reports/ReportFilters";
import { generatePDF, generateExcel } from "@/utils/reportExport";
import { format } from "date-fns";

const AssessmentReport = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({});

  const { data: results = [] } = useQuery({
    queryKey: ["report-assessments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("assessment_results")
        .select("*, assessments(title, passing_score, assessment_type)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["report-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, department, location");
      return data || [];
    },
  });

  const filtered = results.filter((r: any) => {
    if (filters.dateFrom && new Date(r.created_at) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(r.created_at) > filters.dateTo) return false;
    const profile = profiles.find((p: any) => p.id === r.user_id);
    if (filters.department && profile?.department !== filters.department) return false;
    return true;
  });

  const departments = [...new Set(profiles.map((p: any) => p.department).filter(Boolean))];
  const passed = filtered.filter((r: any) => r.score >= (r.assessments?.passing_score || 0)).length;
  const avgScore = filtered.length > 0 ? Math.round(filtered.reduce((s: number, r: any) => s + (r.score || 0), 0) / filtered.length) : 0;

  const headers = ["Employee", "Assessment", "Type", "Score", "Passing Score", "Result", "Attempt", "Date"];
  const rows = filtered.map((r: any) => {
    const profile = profiles.find((p: any) => p.id === r.user_id);
    const passed = r.score >= (r.assessments?.passing_score || 0);
    return [
      profile?.full_name || "—",
      r.assessments?.title || "—",
      r.assessments?.assessment_type || "—",
      r.score ?? "—",
      r.assessments?.passing_score || "—",
      passed ? "Pass" : "Fail",
      r.attempt_number || 1,
      r.created_at ? format(new Date(r.created_at), "MMM d, yyyy") : "—",
    ];
  });

  const exportPDF = () => {
    generatePDF(
      { title: "Assessment Report", confidential: false, dateRange: { from: filters.dateFrom?.toLocaleDateString(), to: filters.dateTo?.toLocaleDateString() } },
      [
        { label: "Total Attempts", value: filtered.length },
        { label: "Passed", value: passed },
        { label: "Pass Rate", value: `${filtered.length > 0 ? Math.round((passed / filtered.length) * 100) : 0}%` },
        { label: "Avg Score", value: avgScore },
      ],
      [{ title: "Assessment Results", headers, rows }]
    );
  };

  const exportExcel = () => generateExcel("Assessment Report", headers, rows);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assessment Report</h1>
        <p className="text-muted-foreground">Test scores, pass rates, and attempt history</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} departments={departments} showLocation={false} onExportPDF={exportPDF} onExportExcel={exportExcel} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Attempts", value: filtered.length },
          { label: "Passed", value: passed },
          { label: "Pass Rate", value: `${filtered.length > 0 ? Math.round((passed / filtered.length) * 100) : 0}%` },
          { label: "Avg Score", value: avgScore },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Results</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground">No results found</TableCell></TableRow>
              ) : rows.map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => (
                  <TableCell key={j}>{j === 5 ? <Badge variant={cell === "Pass" ? "default" : "destructive"}>{String(cell)}</Badge> : cell}</TableCell>
                ))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentReport;
