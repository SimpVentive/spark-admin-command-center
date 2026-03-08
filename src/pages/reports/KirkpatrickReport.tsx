import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters, ReportFilterValues } from "@/components/reports/ReportFilters";
import { generatePDF, generateExcel } from "@/utils/reportExport";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

const KirkpatrickReport = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({});

  const { data: evaluations = [] } = useQuery({
    queryKey: ["report-kirkpatrick"],
    queryFn: async () => {
      const { data } = await supabase.from("kirkpatrick_evaluations").select("*").order("evaluation_date", { ascending: false });
      return data || [];
    },
  });

  const filtered = evaluations.filter((e: any) => {
    if (filters.dateFrom && new Date(e.evaluation_date) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(e.evaluation_date) > filters.dateTo) return false;
    return true;
  });

  const levelLabels: Record<string, string> = { "1": "Reaction", "2": "Learning", "3": "Behavior", "4": "Results" };
  const levelAvgs = ["1", "2", "3", "4"].map((level) => {
    const items = filtered.filter((e: any) => String(e.level) === level);
    const avg = items.length > 0 ? items.reduce((s: number, e: any) => s + e.score, 0) / items.length : 0;
    return { level, label: levelLabels[level], avg: Math.round(avg * 10) / 10, count: items.length };
  });

  const headers = ["Level", "Metric", "Score", "Date", "Notes"];
  const rows = filtered.map((e: any) => [
    `L${e.level} - ${levelLabels[String(e.level)] || e.level}`,
    e.metric_name,
    e.score,
    e.evaluation_date ? format(new Date(e.evaluation_date), "MMM d, yyyy") : "—",
    e.notes || "—",
  ]);

  const exportPDF = () => {
    generatePDF(
      { title: "Kirkpatrick Evaluation Report", confidential: false, dateRange: { from: filters.dateFrom?.toLocaleDateString(), to: filters.dateTo?.toLocaleDateString() } },
      levelAvgs.map((l) => ({ label: `L${l.level} ${l.label}`, value: `${l.avg}/10` })),
      [{ title: "Evaluation Details", headers, rows }]
    );
  };

  const exportExcel = () => generateExcel("Kirkpatrick Report", headers, rows);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kirkpatrick Evaluation Report</h1>
        <p className="text-muted-foreground">4-level training effectiveness evaluation</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} showDepartment={false} showLocation={false} onExportPDF={exportPDF} onExportExcel={exportExcel} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {levelAvgs.map((l) => (
          <Card key={l.level}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">L{l.level} - {l.label}</p>
              <p className="text-2xl font-bold">{l.avg}/10</p>
              <Progress value={l.avg * 10} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">{l.count} evaluations</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>All Evaluations ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground">No evaluations found</TableCell></TableRow>
              ) : rows.map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default KirkpatrickReport;
