import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Award, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const impactData = [
  { metric: "Employee Productivity", before: 72, after: 89 },
  { metric: "Quality Scores", before: 78, after: 92 },
  { metric: "Customer Satisfaction", before: 68, after: 85 },
  { metric: "Error Reduction", before: 65, after: 88 },
  { metric: "Process Efficiency", before: 70, after: 86 },
];

const reports = [
  { title: "Q4 2025 Leadership Development Impact", date: "2026-01-15", status: "published", impact: "High", programs: 4, employees: 120 },
  { title: "Technical Skills Uplift Report", date: "2026-02-01", status: "published", impact: "High", programs: 6, employees: 250 },
  { title: "Compliance Training Effectiveness", date: "2026-02-10", status: "draft", impact: "Medium", programs: 3, employees: 500 },
  { title: "Onboarding Program Analysis", date: "2026-02-15", status: "in-review", impact: "Medium", programs: 2, employees: 85 },
];

const ImpactReports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Impact Reports</h1>
        <p className="text-muted-foreground">Measure and report training impact on business outcomes</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Performance Impact (Before vs After Training)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData}>
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

      <div className="grid gap-4">
        {reports.map((report, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{report.date}</span>
                    <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{report.programs} programs</span>
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
    </div>
  );
};

export default ImpactReports;
