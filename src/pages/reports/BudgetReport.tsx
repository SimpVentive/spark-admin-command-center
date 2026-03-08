import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters, ReportFilterValues } from "@/components/reports/ReportFilters";
import { generatePDF, generateExcel } from "@/utils/reportExport";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

const BudgetReport = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({});

  const { data: costData = [] } = useQuery({
    queryKey: ["report-budget"],
    queryFn: async () => {
      const { data } = await supabase.from("roi_cost_entries").select("*").order("category");
      return (data || []).map((item: any) => ({
        ...item,
        budget: Number(item.budget),
        actual: Number(item.actual),
        variance: Number(item.actual) - Number(item.budget),
      }));
    },
  });

  const filtered = costData.filter((c: any) => {
    if (filters.department && c.category !== filters.department) return false;
    return true;
  });

  const categories = [...new Set(costData.map((c: any) => c.category))];
  const totalBudget = filtered.reduce((s: number, c: any) => s + c.budget, 0);
  const totalActual = filtered.reduce((s: number, c: any) => s + c.actual, 0);
  const totalVariance = totalActual - totalBudget;

  const headers = ["Category", "Period", "Budget ($)", "Actual ($)", "Variance ($)", "Status"];
  const rows = filtered.map((c: any) => [
    c.category,
    c.period || "—",
    c.budget.toLocaleString(),
    c.actual.toLocaleString(),
    `${c.variance < 0 ? "-" : "+"}${Math.abs(c.variance).toLocaleString()}`,
    c.variance <= 0 ? "Under Budget" : "Over Budget",
  ]);

  const exportPDF = () => {
    generatePDF(
      { title: "Training Budget Report", confidential: true },
      [
        { label: "Total Budget", value: `$${totalBudget.toLocaleString()}` },
        { label: "Total Actual", value: `$${totalActual.toLocaleString()}` },
        { label: "Variance", value: `$${Math.abs(totalVariance).toLocaleString()}` },
        { label: "Categories", value: categories.length },
      ],
      [{ title: "Cost Breakdown", headers, rows }]
    );
  };

  const exportExcel = () => generateExcel("Budget Report", headers, rows);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Training Budget Report</h1>
        <p className="text-muted-foreground">Budget vs actual expenditure analysis</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} departments={categories} showLocation={false} onExportPDF={exportPDF} onExportExcel={exportExcel} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-blue-600" />
          <div><p className="text-xs text-muted-foreground">Total Budget</p><p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div><p className="text-xs text-muted-foreground">Total Actual</p><p className="text-2xl font-bold">${totalActual.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          {totalVariance < 0 ? <TrendingDown className="h-8 w-8 text-green-600" /> : <TrendingUp className="h-8 w-8 text-red-600" />}
          <div><p className="text-xs text-muted-foreground">Variance</p><p className={`text-2xl font-bold ${totalVariance < 0 ? "text-green-600" : "text-red-600"}`}>{totalVariance < 0 ? "-" : "+"}${Math.abs(totalVariance).toLocaleString()}</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Cost Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground">No budget data</TableCell></TableRow>
              ) : rows.map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => (
                  <TableCell key={j}>{j === 5 ? <Badge variant={cell === "Under Budget" ? "default" : "destructive"}>{String(cell)}</Badge> : cell}</TableCell>
                ))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetReport;
