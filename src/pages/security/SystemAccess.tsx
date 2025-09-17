import { Shield, Lock, Key, UserCheck, Timer, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function SystemAccess() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} updated`,
      description: `${action} settings have been modified.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">System Access & Authentication</h1>
          <p className="text-muted-foreground">Multi-layered authentication and access control system</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Password Policy
            </CardTitle>
            <CardDescription>
              Strong password requirements and enforcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Minimum Length</span>
                <Badge variant="secondary">8 chars</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Complexity Rules</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Password Expiry</span>
                <Badge variant="secondary">90 days</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Configure Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Account Lockout
            </CardTitle>
            <CardDescription>
              Protection against brute force attacks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Failed Attempts</span>
                <Badge variant="secondary">5 max</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Lockout Duration</span>
                <Badge variant="secondary">30 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Auto Unlock</span>
                <Switch defaultChecked />
              </div>
              <Button className="w-full" variant="outline">
                Manage Lockouts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Session Management
            </CardTitle>
            <CardDescription>
              Session timeout and automatic logout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Session Timeout</span>
                <Badge variant="secondary">30 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Auto Logout</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Sessions</span>
                <Badge variant="secondary">147</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Session Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Role-Based Access
            </CardTitle>
            <CardDescription>
              Granular permissions and role management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Roles</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Permission Groups</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Granular Control</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage RBAC
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Multi-Factor Auth
            </CardTitle>
            <CardDescription>
              Enhanced security for admin users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Admin MFA</span>
                <Badge variant="default">Required</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>User MFA</span>
                <Badge variant="secondary">Optional</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Methods Available</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Configure MFA
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              User Identification
            </CardTitle>
            <CardDescription>
              Unique user codes and identification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Unique IDs</span>
                <Badge variant="default">Never Reused</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ID Format</span>
                <Badge variant="secondary">UUID</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Users</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <Button className="w-full" variant="outline">
                View User IDs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}