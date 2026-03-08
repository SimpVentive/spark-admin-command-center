import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters, ReportFilterValues } from "@/components/reports/ReportFilters";
import { generatePDF, generateMultiSheetExcel } from "@/utils/reportExport";

const EmployeeProfileReport = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({});

  const { data: profiles = [] } = useQuery({
    queryKey: ["report-emp-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("full_name");
      return data || [];
    },
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["report-emp-enrollments"],
    queryFn: async () => {
      const { data } = await supabase.from("user_program_enrollments").select("*, training_programs(title)");
      return data || [];
    },
  });

  const { data: skills = [] } = useQuery({
    queryKey: ["report-emp-skills"],
    queryFn: async () => {
      const { data } = await supabase.from("user_skills").select("*");
      return data || [];
    },
  });

  const { data: certs = [] } = useQuery({
    queryKey: ["report-emp-certs"],
    queryFn: async () => {
      const { data } = await supabase.from("user_certifications").select("*, certifications(title)");
      return data || [];
    },
  });

  const filtered = profiles.filter((p: any) => {
    if (filters.department && p.department !== filters.department) return false;
    if (filters.location && p.location !== filters.location) return false;
    return true;
  });

  const departments = [...new Set(profiles.map((p: any) => p.department).filter(Boolean))];
  const locations = [...new Set(profiles.map((p: any) => p.location).filter(Boolean))];

  const headers = ["Employee", "Department", "Position", "Location", "Programs", "Skills", "Certifications"];
  const rows = filtered.map((p: any) => {
    const pEnrollments = enrollments.filter((e: any) => e.user_id === p.id);
    const pSkills = skills.filter((s: any) => s.user_id === p.id);
    const pCerts = certs.filter((c: any) => c.user_id === p.id);
    return [p.full_name || "—", p.department || "—", p.position || "—", p.location || "—", pEnrollments.length, pSkills.length, pCerts.length];
  });

  const exportPDF = () => {
    generatePDF(
      { title: "Employee Learning Profile Report", confidential: true },
      [
        { label: "Total Employees", value: filtered.length },
        { label: "With Skills", value: filtered.filter((p: any) => skills.some((s: any) => s.user_id === p.id)).length },
        { label: "With Certifications", value: filtered.filter((p: any) => certs.some((c: any) => c.user_id === p.id)).length },
        { label: "Departments", value: departments.length },
      ],
      [{ title: "Employee Profiles", headers, rows }]
    );
  };

  const exportExcel = () => {
    const skillHeaders = ["Employee", "Skill", "Level", "Verified"];
    const skillRows = skills.map((s: any) => {
      const p = profiles.find((pr: any) => pr.id === s.user_id);
      return [p?.full_name || "—", s.skill_name, s.proficiency_level || "—", s.is_verified ? "Yes" : "No"];
    });
    generateMultiSheetExcel(
      [
        { name: "Profiles", headers, rows },
        { name: "Skills", headers: skillHeaders, rows: skillRows },
      ],
      `Employee_Learning_Profiles_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Employee Learning Profile Report</h1>
        <p className="text-muted-foreground">Per-employee training history, skills, and certifications</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} departments={departments} locations={locations} onExportPDF={exportPDF} onExportExcel={exportExcel} />

      <Card>
        <CardHeader><CardTitle>Employees ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground">No employees found</TableCell></TableRow>
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

export default EmployeeProfileReport;
