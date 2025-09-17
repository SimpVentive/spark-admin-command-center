import { Archive, Clock, Lock, Download, Trash2, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RecordManagement() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} initiated`,
      description: `${action} process has been started.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Archive className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Record Management & Retention</h1>
          <p className="text-muted-foreground">Electronic record lifecycle and retention management</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Retention Policies
            </CardTitle>
            <CardDescription>
              Configurable retention periods by record type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Policies</span>
                <Badge variant="secondary">24</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Record Types</span>
                <Badge variant="secondary">18</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Default Period</span>
                <Badge variant="secondary">7 years</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage Policies
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Policy Enforcement
            </CardTitle>
            <CardDescription>
              Automated retention policy enforcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Auto Enforcement</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Enforcement Jobs</span>
                <Badge variant="secondary">Daily</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Compliance Rate</span>
                <Badge variant="default">98.7%</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Run Enforcement
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Legal Hold
            </CardTitle>
            <CardDescription>
              Legal hold capabilities preventing deletion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Holds</span>
                <Badge variant="secondary">7</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Protected Records</span>
                <Badge variant="secondary">12,847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Hold Status</span>
                <Badge variant="default">Enforced</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage Holds
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Secure Archival
            </CardTitle>
            <CardDescription>
              Record archival with retrieval capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Archive Storage</span>
                <Badge variant="secondary">2.4 TB</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Archived Records</span>
                <Badge variant="secondary">847,293</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Retrieval Time</span>
                <Badge variant="secondary">&lt; 5 min</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Archive Manager
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Functions
            </CardTitle>
            <CardDescription>
              Complete and accurate record exports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Export Formats</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Bulk Exports</span>
                <Badge variant="default">Supported</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Data Integrity</span>
                <Badge variant="default">Verified</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Export Records
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Secure Disposal
            </CardTitle>
            <CardDescription>
              Record disposal with deletion verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Deletion Method</span>
                <Badge variant="default">DoD 5220.22-M</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Verification</span>
                <Badge variant="default">Required</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Disposal Logs</span>
                <Badge variant="secondary">2,847</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Disposal Manager
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}