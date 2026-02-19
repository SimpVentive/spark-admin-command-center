import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ImpactReports = () => {
  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ["roi-impact-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("roi_impact_metrics").select("*").order("measurement_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Chart data: unique metrics with before/after
  const chartData = metrics
    .reduce((acc: any[], item) => {
      if (!acc.find((c) => c.metric === item.metric_name)) {
        acc.push({ metric: item.metric_name, before: Number(item.before_value), after: Number(item.after_value) });
      }
      return acc;
    }, [])
    .slice(0, 8);

  // Group as reports by report_title
  const reports = metrics
    .filter((m) => m.report_title)
    .reduce((acc: any[], item) => {
      const existing = acc.find((r) => r.title === item.report_title);
      if (existing) {
        existing.metrics += 1;
        existing.employees = Math.max(existing.employees, item.employee_count || 0);
      } else {
        acc.push({
          title: item.report_title,
          date: item.measurement_date,
          status: item.report_status,
          impact: item.impact_level,
          metrics: 1,
          employees: item.employee_count || 0,
        });
      }
      return acc;
    }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Impact Reports</h1>
        <p className="text-muted-foreground">Measure and report training impact on business outcomes</p>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Performance Impact (Before vs After Training)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="before" fill="hsl(220, 15%, 70%)" name="Before Training" />
                <Bar dataKey="after" fill="hsl(150, 60%, 45%)" name="After Training" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Impact Reports Yet</h3>
            <p className="text-sm text-muted-foreground text-center">
              Add impact metrics with report titles to see your reports here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{report.date}</span>
                      <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{report.metrics} metrics</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{report.employees} employees</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.impact === "High" ? "default" : "secondary"}>
                      {report.impact} Impact
                    </Badge>
                    <Badge variant={report.status === "published" ? "default" : report.status === "draft" ? "outline" : "secondary"}>
                      {report.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpactReports;
