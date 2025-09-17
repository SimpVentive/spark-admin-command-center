import { Shield, Lock, Key, UserCheck, Timer, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SystemAccess() {
  const [passwordPolicyOpen, setPasswordPolicyOpen] = useState(false);
  const [lockoutOpen, setLockoutOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [rbacOpen, setRbacOpen] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);
  const [userIdOpen, setUserIdOpen] = useState(false);
  
  // Form states
  const [minLength, setMinLength] = useState("8");
  const [complexityRules, setComplexityRules] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [maxFailedAttempts, setMaxFailedAttempts] = useState("5");
  const [lockoutDuration, setLockoutDuration] = useState("30");
  const [autoUnlock, setAutoUnlock] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [autoLogout, setAutoLogout] = useState(true);
  
  const { toast } = useToast();

  const handleSave = (settingName: string) => {
    toast({
      title: `${settingName} updated`,
      description: `${settingName} settings have been modified.`,
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
              <Dialog open={passwordPolicyOpen} onOpenChange={setPasswordPolicyOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Configure Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Password Policy Configuration</DialogTitle>
                    <DialogDescription>
                      Configure strong password requirements and enforcement
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="minLength">Minimum Length (characters)</Label>
                      <Input
                        id="minLength"
                        type="number"
                        value={minLength}
                        onChange={(e) => setMinLength(e.target.value)}
                        min="6"
                        max="128"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="complexity">Complexity Rules</Label>
                      <Switch
                        id="complexity"
                        checked={complexityRules}
                        onCheckedChange={setComplexityRules}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Password Expiry (days)</Label>
                      <Select value={passwordExpiry} onValueChange={setPasswordExpiry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleSave("Password Policy Configuration");
                        setPasswordPolicyOpen(false);
                      }}
                    >
                      Save Changes
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
              <Dialog open={lockoutOpen} onOpenChange={setLockoutOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Manage Lockouts
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Account Lockout Settings</DialogTitle>
                    <DialogDescription>
                      Configure protection against brute force attacks
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="failedAttempts">Max Failed Attempts</Label>
                      <Select value={maxFailedAttempts} onValueChange={setMaxFailedAttempts}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                      <Select value={lockoutDuration} onValueChange={setLockoutDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoUnlock">Auto Unlock</Label>
                      <Switch
                        id="autoUnlock"
                        checked={autoUnlock}
                        onCheckedChange={setAutoUnlock}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleSave("Account Lockout Management");
                        setLockoutOpen(false);
                      }}
                    >
                      Save Changes
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
              <Dialog open={sessionOpen} onOpenChange={setSessionOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Session Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Session Management Settings</DialogTitle>
                    <DialogDescription>
                      Configure session timeout and automatic logout
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoLogout">Auto Logout</Label>
                      <Switch
                        id="autoLogout"
                        checked={autoLogout}
                        onCheckedChange={setAutoLogout}
                      />
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Current Active Sessions</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Total: 147 sessions</p>
                        <p>Your session: Active since 2 hours ago</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleSave("Session Management Settings");
                        setSessionOpen(false);
                      }}
                    >
                      Save Changes
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
              <Dialog open={rbacOpen} onOpenChange={setRbacOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Manage RBAC
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Role-Based Access Control</DialogTitle>
                    <DialogDescription>
                      Manage roles and granular permissions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium">Admin Role</h4>
                        <p className="text-sm text-muted-foreground">Full system access</p>
                        <Badge variant="secondary" className="mt-2">23 users</Badge>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium">Manager Role</h4>
                        <p className="text-sm text-muted-foreground">Department oversight</p>
                        <Badge variant="secondary" className="mt-2">67 users</Badge>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium">User Role</h4>
                        <p className="text-sm text-muted-foreground">Standard access</p>
                        <Badge variant="secondary" className="mt-2">1,157 users</Badge>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium">Guest Role</h4>
                        <p className="text-sm text-muted-foreground">Read-only access</p>
                        <Badge variant="secondary" className="mt-2">0 users</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Add Role
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Edit Permissions
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleSave("Role-Based Access Control Manager");
                        setRbacOpen(false);
                      }}
                    >
                      Done
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
              <Dialog open={mfaOpen} onOpenChange={setMfaOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Configure MFA
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Multi-Factor Authentication</DialogTitle>
                    <DialogDescription>
                      Configure enhanced security for users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Admin MFA Requirement</Label>
                      <Select defaultValue="required">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">Required</SelectItem>
                          <SelectItem value="optional">Optional</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>User MFA Requirement</Label>
                      <Select defaultValue="optional">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">Required</SelectItem>
                          <SelectItem value="optional">Optional</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Available Methods</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch defaultChecked />
                          <Label>SMS Authentication</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch defaultChecked />
                          <Label>Email Authentication</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch defaultChecked />
                          <Label>Authenticator App</Label>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleSave("Multi-Factor Authentication Configuration");
                        setMfaOpen(false);
                      }}
                    >
                      Save Changes
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
              <Dialog open={userIdOpen} onOpenChange={setUserIdOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    View User IDs
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>User Identification Management</DialogTitle>
                    <DialogDescription>
                      View and manage unique user identification codes
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium">User ID</div>
                      <div className="font-medium">Username</div>
                      <div className="font-medium">Status</div>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      <div className="grid grid-cols-3 gap-4 text-sm p-2 border rounded">
                        <div className="font-mono text-xs">uuid-123-456-789</div>
                        <div>admin@company.com</div>
                        <Badge variant="default" className="w-fit">Active</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm p-2 border rounded">
                        <div className="font-mono text-xs">uuid-987-654-321</div>
                        <div>manager@company.com</div>
                        <Badge variant="default" className="w-fit">Active</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm p-2 border rounded">
                        <div className="font-mono text-xs">uuid-456-789-123</div>
                        <div>user@company.com</div>
                        <Badge variant="secondary" className="w-fit">Inactive</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Export List
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Generate Report
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleSave("User ID Management");
                        setUserIdOpen(false);
                      }}
                    >
                      Close
                    </Button>
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