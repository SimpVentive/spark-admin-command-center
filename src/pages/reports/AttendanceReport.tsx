import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters, ReportFilterValues } from "@/components/reports/ReportFilters";
import { generatePDF, generateExcel } from "@/utils/reportExport";
import { format } from "date-fns";

const AttendanceReport = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({});

  const { data: enrollments = [] } = useQuery({
    queryKey: ["report-attendance"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_program_enrollments")
        .select("*, profiles(full_name, department, location), training_programs(title, program_type)")
        .order("enrolled_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = enrollments.filter((e: any) => {
    if (filters.dateFrom && new Date(e.enrolled_at) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(e.enrolled_at) > filters.dateTo) return false;
    if (filters.department && e.profiles?.department !== filters.department) return false;
    if (filters.program && e.training_programs?.title !== filters.program) return false;
    return true;
  });

  const departments = [...new Set(enrollments.map((e: any) => e.profiles?.department).filter(Boolean))];
  const programs = [...new Set(enrollments.map((e: any) => e.training_programs?.title).filter(Boolean))];

  const headers = ["Employee", "Department", "Program", "Type", "Status", "Attendance", "Enrolled Date"];
  const rows = filtered.map((e: any) => [
    e.profiles?.full_name || "—",
    e.profiles?.department || "—",
    e.training_programs?.title || "—",
    e.training_programs?.program_type || "—",
    e.status || "—",
    e.attendance_percentage != null ? `${e.attendance_percentage}%` : "—",
    e.enrolled_at ? format(new Date(e.enrolled_at), "MMM d, yyyy") : "—",
  ]);

  const completed = filtered.filter((e: any) => e.status === "completed").length;
  const avgAttendance = filtered.length > 0 ? Math.round(filtered.reduce((sum: number, e: any) => sum + (e.attendance_percentage || 0), 0) / filtered.length) : 0;

  const exportPDF = () => {
    generatePDF(
      { title: "Training Attendance Report", confidential: false, dateRange: { from: filters.dateFrom?.toLocaleDateString(), to: filters.dateTo?.toLocaleDateString() } },
      [
        { label: "Total Enrollments", value: filtered.length },
        { label: "Completed", value: completed },
        { label: "Avg Attendance", value: `${avgAttendance}%` },
        { label: "Programs", value: programs.length },
      ],
      [{ title: "Attendance Records", headers, rows }]
    );
  };

  const exportExcel = () => generateExcel("Attendance Report", headers, rows);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Training Attendance Report</h1>
        <p className="text-muted-foreground">Program attendance records and participation tracking</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} departments={departments} programs={programs} showProgram showLocation={false} onExportPDF={exportPDF} onExportExcel={exportExcel} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Enrollments", value: filtered.length },
          { label: "Completed", value: completed },
          { label: "Avg Attendance", value: `${avgAttendance}%` },
          { label: "Active Programs", value: programs.length },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Attendance Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground">No records found</TableCell></TableRow>
              ) : rows.map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => (
                  <TableCell key={j}>{j === 4 ? <Badge variant={cell === "completed" ? "default" : "secondary"}>{String(cell)}</Badge> : cell}</TableCell>
                ))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReport;
