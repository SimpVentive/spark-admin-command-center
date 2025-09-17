import { FileText, Clock, Shield, Search, Download, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AuditTrail() {
  const [viewLogsOpen, setViewLogsOpen] = useState(false);
  const [verifyIntegrityOpen, setVerifyIntegrityOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} initiated`,
      description: `${action} process has been started successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Audit Trail Implementation</h1>
          <p className="text-muted-foreground">Comprehensive audit logging and trail management</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Audit Logging
            </CardTitle>
            <CardDescription>
              Immutable timestamps and action recording
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Records</span>
                <Badge variant="secondary">1.2M</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Today's Entries</span>
                <Badge variant="secondary">847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Timestamp Format</span>
                <Badge variant="default">UTC</Badge>
              </div>
              <Dialog open={viewLogsOpen} onOpenChange={setViewLogsOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    View Logs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Audit Logs</DialogTitle>
                    <DialogDescription>
                      Recent audit log entries with timestamps and user actions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3 text-sm">
                      <div className="font-semibold">2024-01-15 14:30:22 UTC</div>
                      <div>User: admin@company.com | Action: LOGIN_SUCCESS</div>
                      <div className="text-muted-foreground">IP: 192.168.1.100</div>
                    </div>
                    <div className="border rounded-lg p-3 text-sm">
                      <div className="font-semibold">2024-01-15 14:25:15 UTC</div>
                      <div>User: user@company.com | Action: RECORD_UPDATE</div>
                      <div className="text-muted-foreground">Record ID: 12345 | Table: training_programs</div>
                    </div>
                    <div className="border rounded-lg p-3 text-sm">
                      <div className="font-semibold">2024-01-15 14:20:08 UTC</div>
                      <div>User: manager@company.com | Action: REPORT_GENERATE</div>
                      <div className="text-muted-foreground">Report: Monthly Compliance</div>
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
              <Shield className="w-5 h-5" />
              Data Integrity
            </CardTitle>
            <CardDescription>
              Tamper-proof format and checksums
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Integrity Status</span>
                <Badge variant="default">Verified</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Digital Signatures</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Check</span>
                <Badge variant="secondary">2 min ago</Badge>
              </div>
              <Dialog open={verifyIntegrityOpen} onOpenChange={setVerifyIntegrityOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Verify Integrity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Data Integrity Verification</DialogTitle>
                    <DialogDescription>
                      Running comprehensive integrity checks on audit trail data
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Digital Signatures</span>
                      <Badge variant="default">✓ Valid</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Checksums</span>
                      <Badge variant="default">✓ Verified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Timestamp Integrity</span>
                      <Badge variant="default">✓ Consistent</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Record Count</span>
                      <Badge variant="secondary">1,247,892</Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleAction("Integrity Verification");
                        setVerifyIntegrityOpen(false);
                      }}
                    >
                      Run Full Verification
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Audit Search
            </CardTitle>
            <CardDescription>
              Search and filter audit records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Search audit logs..." />
              <div className="flex justify-between items-center">
                <span>Quick Filters</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Date Range</span>
                <Badge variant="secondary">30 days</Badge>
              </div>
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Advanced Search
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Audit Search</DialogTitle>
                    <DialogDescription>
                      Search and filter audit records with advanced criteria
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="User ID or Email" />
                    <Input placeholder="Action Type" />
                    <Input placeholder="Date Range (YYYY-MM-DD to YYYY-MM-DD)" />
                    <Input placeholder="IP Address" />
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleAction("Advanced Search");
                        setSearchOpen(false);
                      }}
                    >
                      Search Records
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Audit Reports
            </CardTitle>
            <CardDescription>
              Generate human-readable audit reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Report Templates</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Export Formats</span>
                <Badge variant="secondary">PDF, CSV</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Scheduled Reports</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Report Generation")}
              >
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              System Events
            </CardTitle>
            <CardDescription>
              Login, logout, and access attempt tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Login Events</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Failed Attempts</span>
                <Badge variant="destructive">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Security Events</span>
                <Badge variant="secondary">47</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("System Events View")}
              >
                View Events
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Record Changes
            </CardTitle>
            <CardDescription>
              Before/after values and change tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Change Records</span>
                <Badge variant="secondary">45,678</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Value Tracking</span>
                <Badge variant="default">Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Field Changes</span>
                <Badge variant="secondary">892</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Record Changes View")}
              >
                View Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}