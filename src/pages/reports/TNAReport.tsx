import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters, ReportFilterValues } from "@/components/reports/ReportFilters";
import { generatePDF, generateExcel } from "@/utils/reportExport";
import { format } from "date-fns";

const TNAReport = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({});

  const { data: cycles = [] } = useQuery({
    queryKey: ["report-tna-cycles"],
    queryFn: async () => {
      const { data } = await supabase.from("tna_cycles").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["report-tni-submissions"],
    queryFn: async () => {
      const { data } = await supabase.from("tni_submissions").select("*, profiles(full_name, department, location)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const filteredSubmissions = submissions.filter((s: any) => {
    if (filters.dateFrom && new Date(s.created_at) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(s.created_at) > filters.dateTo) return false;
    if (filters.department && s.profiles?.department !== filters.department) return false;
    if (filters.location && s.profiles?.location !== filters.location) return false;
    return true;
  });

  const departments = [...new Set(submissions.map((s: any) => s.profiles?.department).filter(Boolean))];
  const locations = [...new Set(submissions.map((s: any) => s.profiles?.location).filter(Boolean))];

  const headers = ["Employee", "Department", "Location", "Cycle", "Status", "Programs", "Submitted"];
  const rows = filteredSubmissions.map((s: any) => {
    const cycle = cycles.find((c: any) => c.id === s.cycle_id);
    const needs = Array.isArray(s.training_needs) ? s.training_needs : [];
    return [
      s.profiles?.full_name || "—",
      s.profiles?.department || "—",
      s.profiles?.location || "—",
      cycle?.name || "—",
      s.status || "pending",
      needs.length,
      s.created_at ? format(new Date(s.created_at), "MMM d, yyyy") : "—",
    ];
  });

  const exportPDF = () => {
    generatePDF(
      { title: "TNA Report", subtitle: "Training Needs Analysis", confidential: true, dateRange: { from: filters.dateFrom?.toLocaleDateString(), to: filters.dateTo?.toLocaleDateString() } },
      [
        { label: "Total Cycles", value: cycles.length },
        { label: "Total Submissions", value: filteredSubmissions.length },
        { label: "Approved", value: filteredSubmissions.filter((s: any) => s.status === "approved").length },
        { label: "Pending", value: filteredSubmissions.filter((s: any) => s.status === "pending" || s.status === "submitted").length },
      ],
      [{ title: "TNI Submissions", headers, rows }]
    );
  };

  const exportExcel = () => generateExcel("TNA Report", headers, rows);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">TNA Report</h1>
        <p className="text-muted-foreground">Training Needs Analysis cycle and submission reports</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} departments={departments} locations={locations} onExportPDF={exportPDF} onExportExcel={exportExcel} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cycles", value: cycles.length },
          { label: "Submissions", value: filteredSubmissions.length },
          { label: "Approved", value: filteredSubmissions.filter((s: any) => s.status === "approved").length },
          { label: "Pending", value: filteredSubmissions.filter((s: any) => s.status === "pending" || s.status === "submitted").length },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>TNI Submissions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground">No submissions found</TableCell></TableRow>
              ) : rows.map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => (
                  <TableCell key={j}>{j === 4 ? <Badge variant={cell === "approved" ? "default" : "secondary"}>{String(cell)}</Badge> : cell}</TableCell>
                ))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TNAReport;
