import { BarChart3, FileText, Activity, GraduationCap, AlertTriangle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ReportingCompliance() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} generated`,
      description: `${action} has been created successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Reporting & Compliance Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive compliance reporting and monitoring tools</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              FDA Audit Reports
            </CardTitle>
            <CardDescription>
              Generate FDA-ready audit reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Report Templates</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Export Formats</span>
                <Badge variant="secondary">PDF, CSV</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>This Month</span>
                <Badge variant="secondary">47</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("FDA-Ready Report Generator")}
              >
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health
            </CardTitle>
            <CardDescription>
              Real-time system health monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>System Status</span>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Uptime</span>
                <Badge variant="default">99.97%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Performance</span>
                <Badge variant="default">Excellent</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("System Health Dashboard")}
              >
                Health Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Training Compliance
            </CardTitle>
            <CardDescription>
              Track training completion and certification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Compliance Rate</span>
                <Badge variant="default">87.3%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Overdue Training</span>
                <Badge variant="destructive">45</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Certifications</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Training Completion Reports")}
              >
                Training Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              System performance and availability metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Response Time</span>
                <Badge variant="default">&lt;200ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Throughput</span>
                <Badge variant="secondary">1,247 req/min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Error Rate</span>
                <Badge variant="default">&lt;0.1%</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("System Performance Reports")}
              >
                Performance Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Security Monitoring
            </CardTitle>
            <CardDescription>
              Alert on security events and violations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Alerts</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Security Events</span>
                <Badge variant="secondary">147</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Compliance Score</span>
                <Badge variant="default">94.7%</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Security Event Dashboard")}
              >
                Security Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Executive Dashboard
            </CardTitle>
            <CardDescription>
              High-level compliance status overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Overall Status</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Risk Level</span>
                <Badge variant="secondary">Low</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Action Items</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Executive Compliance View")}
              >
                Executive View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}