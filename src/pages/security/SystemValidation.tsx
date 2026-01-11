import { Settings, GitBranch, TestTube, Activity, Layers, FileCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SystemValidation() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-2">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">System Validation Framework</h1>
          <p className="text-muted-foreground">Comprehensive validation support and change control</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer" onClick={() => navigate("/security/system-validation/cmdb")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuration Management
            </CardTitle>
            <CardDescription>Configuration management database (CMDB)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Configuration Items</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Baseline Status</span>
                <Badge variant="default">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Change Requests</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/security/system-validation/cmdb");
                }}
              >
                Manage CMDB
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => navigate("/security/system-validation/change-control")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Change Control
            </CardTitle>
            <CardDescription>Change control workflow with approval gates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Pending Changes</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Approval Gates</span>
                <Badge variant="secondary">4</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Emergency Changes</span>
                <Badge variant="destructive">2</Badge>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/security/system-validation/change-control");
                }}
              >
                Change Board
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => navigate("/security/system-validation/test-execution")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Test Execution
            </CardTitle>
            <CardDescription>Test case tracking and results storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Test Cases</span>
                <Badge variant="secondary">847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Pass Rate</span>
                <Badge variant="default">94.7%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Failed Tests</span>
                <Badge variant="destructive">12</Badge>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/security/system-validation/test-execution");
                }}
              >
                Test Manager
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => navigate("/security/system-validation/performance")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Monitoring
            </CardTitle>
            <CardDescription>System performance monitoring and alerting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>System Health</span>
                <Badge variant="default">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Uptime</span>
                <Badge variant="default">99.9%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Alerts</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/security/system-validation/performance");
                }}
              >
                Performance Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => navigate("/security/system-validation/environments")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Environment Management
            </CardTitle>
            <CardDescription>Dev/test/prod segregation with promotion controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Environments</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Promotion Gates</span>
                <Badge variant="secondary">6</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Data Masking</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/security/system-validation/environments");
                }}
              >
                Environment Control
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => navigate("/security/system-validation/documentation")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Validation Documentation
            </CardTitle>
            <CardDescription>Automated validation document generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Document Templates</span>
                <Badge variant="secondary">15</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Auto Generation</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Validation Packages</span>
                <Badge variant="secondary">47</Badge>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/security/system-validation/documentation");
                }}
              >
                Document Generator
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
