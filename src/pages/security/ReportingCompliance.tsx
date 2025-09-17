import { BarChart3, FileText, Activity, GraduationCap, AlertTriangle, Eye, Download, RefreshCw, Calendar, TrendingUp, Shield, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function ReportingCompliance() {
  const [openDialogs, setOpenDialogs] = useState({
    fdaReports: false,
    systemHealth: false,
    trainingCompliance: false,
    performanceMetrics: false,
    securityMonitoring: false,
    executiveDashboard: false,
  });

  const toggleDialog = (dialogName: keyof typeof openDialogs) => {
    setOpenDialogs(prev => ({
      ...prev,
      [dialogName]: !prev[dialogName]
    }));
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
              <Dialog open={openDialogs.fdaReports} onOpenChange={() => toggleDialog('fdaReports')}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Generate Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      FDA Audit Report Generator
                    </DialogTitle>
                    <DialogDescription>
                      Generate comprehensive FDA-ready audit reports
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Available Templates</span>
                            <Badge variant="secondary">12</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Reports Generated</span>
                            <Badge variant="default">47</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">Report Options</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <Button variant="outline" className="justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Compliance Summary Report
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Training Records Export
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          System Validation Report
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Audit Trail Summary
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
              <Dialog open={openDialogs.systemHealth} onOpenChange={() => toggleDialog('systemHealth')}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Health Dashboard
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      System Health Dashboard
                    </DialogTitle>
                    <DialogDescription>
                      Real-time system health monitoring and metrics
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Uptime</span>
                              <Badge variant="default">99.97%</Badge>
                            </div>
                            <Progress value={99.97} className="w-full" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Performance</span>
                              <Badge variant="default">Excellent</Badge>
                            </div>
                            <Progress value={95} className="w-full" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Memory Usage</span>
                              <Badge variant="secondary">67%</Badge>
                            </div>
                            <Progress value={67} className="w-full" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">System Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <span>Response Time</span>
                              <Badge variant="default">&lt;200ms</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <span>Throughput</span>
                              <Badge variant="secondary">1,247 req/min</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
              <Dialog open={openDialogs.trainingCompliance} onOpenChange={() => toggleDialog('trainingCompliance')}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Training Reports
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Training Compliance Dashboard
                    </DialogTitle>
                    <DialogDescription>
                      Track training completion and certification status
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Compliance Rate</span>
                              <Badge variant="default">87.3%</Badge>
                            </div>
                            <Progress value={87.3} className="w-full" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overdue Training</span>
                            <Badge variant="destructive">45</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Certifications</span>
                            <Badge variant="secondary">1,247</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">Training Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Safety Training</span>
                          <div className="flex items-center gap-2">
                            <Progress value={92} className="w-20" />
                            <Badge variant="default">92%</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Compliance Training</span>
                          <div className="flex items-center gap-2">
                            <Progress value={85} className="w-20" />
                            <Badge variant="secondary">85%</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Technical Training</span>
                          <div className="flex items-center gap-2">
                            <Progress value={78} className="w-20" />
                            <Badge variant="secondary">78%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
              <Dialog open={openDialogs.performanceMetrics} onOpenChange={() => toggleDialog('performanceMetrics')}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Performance Reports
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Metrics Dashboard
                    </DialogTitle>
                    <DialogDescription>
                      System performance and availability metrics
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Response Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">&lt;200ms</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUp className="w-3 h-3" />
                            5% improvement
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Throughput</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">1,247</div>
                          <div className="text-xs text-muted-foreground">requests/min</div>
                        </CardContent>
                      </Card>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">Performance Trends</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>CPU Usage</span>
                          <div className="flex items-center gap-2">
                            <Progress value={42} className="w-20" />
                            <Badge variant="default">42%</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Memory Usage</span>
                          <div className="flex items-center gap-2">
                            <Progress value={67} className="w-20" />
                            <Badge variant="secondary">67%</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Error Rate</span>
                          <div className="flex items-center gap-2">
                            <Progress value={0.1} className="w-20" />
                            <Badge variant="default">&lt;0.1%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
              <Dialog open={openDialogs.securityMonitoring} onOpenChange={() => toggleDialog('securityMonitoring')}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Security Dashboard
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Security Monitoring Dashboard
                    </DialogTitle>
                    <DialogDescription>
                      Real-time security event monitoring and alerts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Active Alerts</span>
                            <Badge variant="destructive">3</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Security Events</span>
                            <Badge variant="secondary">147</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Compliance Score</span>
                            <Badge variant="default">94.7%</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">Recent Security Events</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-red-500" />
                            <span className="text-sm">Failed login attempt</span>
                          </div>
                          <Badge variant="destructive">High</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">Unusual access pattern</span>
                          </div>
                          <Badge variant="secondary">Medium</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Policy compliance check</span>
                          </div>
                          <Badge variant="default">Low</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
              <Dialog open={openDialogs.executiveDashboard} onOpenChange={() => toggleDialog('executiveDashboard')}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Executive View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Executive Compliance Dashboard
                    </DialogTitle>
                    <DialogDescription>
                      High-level compliance status and key metrics overview
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">94.7%</div>
                          <div className="text-xs text-muted-foreground">Overall Compliance</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">1,247</div>
                          <div className="text-xs text-muted-foreground">Active Users</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-600">8</div>
                          <div className="text-xs text-muted-foreground">Action Items</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-red-600">3</div>
                          <div className="text-xs text-muted-foreground">Critical Alerts</div>
                        </CardContent>
                      </Card>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">Key Performance Indicators</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Training Completion Rate</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={87} className="w-20" />
                            <Badge variant="default">87%</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Security Compliance</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={95} className="w-20" />
                            <Badge variant="default">95%</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            <span>System Uptime</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={99.97} className="w-20" />
                            <Badge variant="default">99.97%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}