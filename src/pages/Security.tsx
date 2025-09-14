import { Shield, Lock, Key, UserCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Security() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-muted-foreground">Manage security settings and policies</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Access Control
            </CardTitle>
            <CardDescription>
              Manage user permissions and access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Active Users</span>
                <Badge variant="secondary">147</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Admin Users</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Manage Access
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              Configure authentication methods and policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>SSO Enabled</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>2FA Required</span>
                <Badge variant="secondary">Optional</Badge>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Configure Auth
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              User Roles
            </CardTitle>
            <CardDescription>
              Define and manage user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Total Roles</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Custom Roles</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Manage Roles
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Security Alerts
            </CardTitle>
            <CardDescription>
              Monitor security events and threats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Active Alerts</span>
                <Badge variant="destructive">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Resolved Today</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}