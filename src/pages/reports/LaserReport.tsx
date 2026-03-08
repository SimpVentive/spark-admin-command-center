import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters, ReportFilterValues } from "@/components/reports/ReportFilters";
import { generatePDF, generateMultiSheetExcel } from "@/utils/reportExport";
import { format } from "date-fns";

const LaserReport = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({});

  const { data: deviations = [] } = useQuery({
    queryKey: ["report-laser-deviations"],
    queryFn: async () => {
      const { data } = await supabase.from("laser_deviations").select("*, profiles(full_name, department), laser_kpi_definitions(name, unit)").order("detected_at", { ascending: false });
      return data || [];
    },
  });

  const { data: interventions = [] } = useQuery({
    queryKey: ["report-laser-interventions"],
    queryFn: async () => {
      const { data } = await supabase.from("laser_assigned_interventions").select("*, profiles(full_name)").order("assigned_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = deviations.filter((d: any) => {
    if (filters.dateFrom && new Date(d.detected_at) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(d.detected_at) > filters.dateTo) return false;
    if (filters.department && d.profiles?.department !== filters.department) return false;
    return true;
  });

  const departments = [...new Set(deviations.map((d: any) => d.profiles?.department).filter(Boolean))];

  const devHeaders = ["Employee", "KPI", "Target", "Actual", "Deviation %", "Severity", "Status", "Detected"];
  const devRows = filtered.map((d: any) => [
    d.profiles?.full_name || "—",
    d.laser_kpi_definitions?.name || "—",
    d.target_value,
    d.actual_value,
    `${d.deviation_percentage}%`,
    d.severity,
    d.status,
    d.detected_at ? format(new Date(d.detected_at), "MMM d, yyyy") : "—",
  ]);

  const intHeaders = ["Employee", "Type", "Status", "Assigned", "Completed"];
  const intRows = interventions.map((i: any) => [
    i.profiles?.full_name || "—",
    i.intervention_type,
    i.status,
    i.assigned_at ? format(new Date(i.assigned_at), "MMM d, yyyy") : "—",
    i.completed_at ? format(new Date(i.completed_at), "MMM d, yyyy") : "—",
  ]);

  const exportPDF = () => {
    generatePDF(
      { title: "LASER Performance Report", confidential: true, dateRange: { from: filters.dateFrom?.toLocaleDateString(), to: filters.dateTo?.toLocaleDateString() } },
      [
        { label: "Deviations", value: filtered.length },
        { label: "Critical", value: filtered.filter((d: any) => d.severity === "critical").length },
        { label: "Interventions", value: interventions.length },
        { label: "Resolved", value: filtered.filter((d: any) => d.status === "resolved").length },
      ],
      [
        { title: "KPI Deviations", headers: devHeaders, rows: devRows },
        { title: "Assigned Interventions", headers: intHeaders, rows: intRows },
      ]
    );
  };

  const exportExcel = () => {
    generateMultiSheetExcel(
      [
        { name: "Deviations", headers: devHeaders, rows: devRows },
        { name: "Interventions", headers: intHeaders, rows: intRows },
      ],
      `LASER_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">LASER Performance Report</h1>
        <p className="text-muted-foreground">KPI deviations, root cause analysis, and interventions</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} departments={departments} showLocation={false} onExportPDF={exportPDF} onExportExcel={exportExcel} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Deviations", value: filtered.length },
          { label: "Critical", value: filtered.filter((d: any) => d.severity === "critical").length },
          { label: "Interventions", value: interventions.length },
          { label: "Resolved", value: filtered.filter((d: any) => d.status === "resolved").length },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>KPI Deviations</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>{devHeaders.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {devRows.length === 0 ? (
                <TableRow><TableCell colSpan={devHeaders.length} className="text-center py-8 text-muted-foreground">No deviations found</TableCell></TableRow>
              ) : devRows.map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => (
                  <TableCell key={j}>{j === 5 ? <Badge variant={cell === "critical" ? "destructive" : "secondary"}>{String(cell)}</Badge> : j === 6 ? <Badge variant={cell === "resolved" ? "default" : "outline"}>{String(cell)}</Badge> : cell}</TableCell>
                ))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaserReport;
