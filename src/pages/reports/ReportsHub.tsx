import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Target, Users, GraduationCap, DollarSign, FileText,
  BarChart3, UserCheck, Crosshair, Shield, ClipboardList, Wand2
} from "lucide-react";

const reports = [
  { title: "TNA Report", description: "Training Needs Analysis cycle reports with submission tracking", icon: Target, path: "/reports/tna", color: "text-blue-600" },
  { title: "Training Attendance", description: "Program attendance records with participant details", icon: Users, path: "/reports/attendance", color: "text-green-600" },
  { title: "Training Program Report", description: "Offline training program details, sessions, and outcomes", icon: GraduationCap, path: "/reports/programs", color: "text-purple-600" },
  { title: "Training Budget Report", description: "Budget vs actual expenditure analysis across categories", icon: DollarSign, path: "/reports/budget", color: "text-amber-600" },
  { title: "Assessment Report", description: "Test scores, pass rates, and attempt history", icon: ClipboardList, path: "/reports/assessments", color: "text-red-600" },
  { title: "Kirkpatrick Evaluation", description: "4-level training effectiveness evaluation summary", icon: BarChart3, path: "/reports/kirkpatrick", color: "text-indigo-600" },
  { title: "Employee Learning Profile", description: "Per-employee training history, skills, and certifications", icon: UserCheck, path: "/reports/employee-profile", color: "text-teal-600" },
  { title: "LASER Performance", description: "KPI deviations, root cause analysis, and interventions", icon: Crosshair, path: "/reports/laser", color: "text-orange-600" },
  { title: "Audit Trail Report", description: "CFR 21 Part 11 compliant activity log with integrity hashes", icon: Shield, path: "/reports/audit", color: "text-slate-600" },
];

const ReportsHub = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" /> Reports Center
          </h1>
          <p className="text-muted-foreground">Generate, filter, and export reports in PDF and Excel formats</p>
        </div>
        <Button onClick={() => navigate("/reports/builder")} className="gap-2">
          <Wand2 className="h-4 w-4" />
          Build Custom Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card
            key={report.path}
            className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
            onClick={() => navigate(report.path)}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg bg-muted ${report.color}`}>
                  <report.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsHub;
