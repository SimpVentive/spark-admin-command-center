import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters, ReportFilterValues } from "@/components/reports/ReportFilters";
import { generatePDF, generateExcel } from "@/utils/reportExport";
import { format } from "date-fns";

const ProgramReport = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({});

  const { data: programs = [] } = useQuery({
    queryKey: ["report-programs"],
    queryFn: async () => {
      const { data } = await supabase.from("training_programs").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["report-sessions"],
    queryFn: async () => {
      const { data } = await supabase.from("program_sessions").select("*, training_programs(title)").order("session_date", { ascending: false });
      return data || [];
    },
  });

  const filtered = programs.filter((p: any) => {
    if (filters.dateFrom && new Date(p.created_at) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(p.created_at) > filters.dateTo) return false;
    if (filters.department && !(p.departments || []).includes(filters.department)) return false;
    if (filters.location && !(p.locations || []).includes(filters.location)) return false;
    return true;
  });

  const allDepts = [...new Set(programs.flatMap((p: any) => p.departments || []))];
  const allLocs = [...new Set(programs.flatMap((p: any) => p.locations || []))];

  const headers = ["Program", "Type", "Duration (hrs)", "Sessions", "Departments", "Status", "Created"];
  const rows = filtered.map((p: any) => {
    const sessionCount = sessions.filter((s: any) => s.program_id === p.id).length;
    return [
      p.title,
      p.program_type || "—",
      p.duration_hours || "—",
      sessionCount,
      (p.departments || []).join(", ") || "—",
      p.is_active ? "Active" : "Inactive",
      p.created_at ? format(new Date(p.created_at), "MMM d, yyyy") : "—",
    ];
  });

  const exportPDF = () => {
    generatePDF(
      { title: "Training Program Report", subtitle: "Offline Training Programs", confidential: false, dateRange: { from: filters.dateFrom?.toLocaleDateString(), to: filters.dateTo?.toLocaleDateString() } },
      [
        { label: "Total Programs", value: filtered.length },
        { label: "Active", value: filtered.filter((p: any) => p.is_active).length },
        { label: "Total Sessions", value: sessions.length },
        { label: "Avg Duration", value: `${Math.round(filtered.reduce((s: number, p: any) => s + (p.duration_hours || 0), 0) / (filtered.length || 1))}h` },
      ],
      [{ title: "Program Details", headers, rows }]
    );
  };

  const exportExcel = () => generateExcel("Program Report", headers, rows);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Training Program Report</h1>
        <p className="text-muted-foreground">Offline training program details, sessions, and outcomes</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} departments={allDepts} locations={allLocs} onExportPDF={exportPDF} onExportExcel={exportExcel} />

      <Card>
        <CardHeader><CardTitle>Programs ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground">No programs found</TableCell></TableRow>
              ) : rows.map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => (
                  <TableCell key={j}>{j === 5 ? <Badge variant={cell === "Active" ? "default" : "secondary"}>{String(cell)}</Badge> : cell}</TableCell>
                ))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramReport;
