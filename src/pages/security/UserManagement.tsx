import { Users, UserPlus, UserCheck, UserX, GraduationCap, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function UserManagement() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} opened`,
      description: `${action} management interface is ready.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">User Management System</h1>
          <p className="text-muted-foreground">Comprehensive user administration and lifecycle management</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              User Provisioning
            </CardTitle>
            <CardDescription>
              User creation with approval workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Pending Requests</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Approval Workflow</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Auto-Provisioning</span>
                <Badge variant="secondary">Disabled</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage Requests
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Access Reviews
            </CardTitle>
            <CardDescription>
              Regular access reviews and recertification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Review Frequency</span>
                <Badge variant="secondary">Quarterly</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Reviews</span>
                <Badge variant="destructive">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Completion Rate</span>
                <Badge variant="default">94%</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Start Review
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5" />
              Deprovisioning
            </CardTitle>
            <CardDescription>
              Automated user deprovisioning process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Auto Deprovisioning</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Removals</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Grace Period</span>
                <Badge variant="secondary">30 days</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Review Queue
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Training Status
            </CardTitle>
            <CardDescription>
              Training tracking and enforcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Compliance Rate</span>
                <Badge variant="default">87%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Overdue Training</span>
                <Badge variant="destructive">45</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Training Modules</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Track Training
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Authority Levels
            </CardTitle>
            <CardDescription>
              Job function based authority assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Authority Matrix</span>
                <Badge variant="default">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Job Functions</span>
                <Badge variant="secondary">18</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Authority Levels</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage Authority
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Emergency Access
            </CardTitle>
            <CardDescription>
              Emergency procedures with enhanced logging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Emergency Accounts</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Usage This Month</span>
                <Badge variant="secondary">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Enhanced Logging</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Emergency Procedures
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}