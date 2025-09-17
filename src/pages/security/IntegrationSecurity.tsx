import { Plug, Key, Activity, Shield, AlertTriangle, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function IntegrationSecurity() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} opened`,
      description: `${action} management interface is now available.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Plug className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Integration & API Security</h1>
          <p className="text-muted-foreground">Secure integration capabilities and API protection</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Authentication
            </CardTitle>
            <CardDescription>
              Token and certificate-based authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Auth Methods</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Tokens</span>
                <Badge variant="secondary">47</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Certificate Auth</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("API Authentication Manager")}
              >
                Manage Auth
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Rate Limiting
            </CardTitle>
            <CardDescription>
              API rate limiting and throttling controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Rate Limits</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Requests/Min</span>
                <Badge variant="secondary">1,000</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Throttled Today</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Rate Limiting Settings")}
              >
                Rate Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Integration Audit
            </CardTitle>
            <CardDescription>
              Audit trails for external system interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>API Calls</span>
                <Badge variant="secondary">15,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Failed Calls</span>
                <Badge variant="destructive">47</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Audit Coverage</span>
                <Badge variant="default">100%</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Integration Audit Log")}
              >
                View Audit Log
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Data Validation
            </CardTitle>
            <CardDescription>
              Validation for incoming and outgoing data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Validation Rules</span>
                <Badge variant="secondary">89</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Validation Rate</span>
                <Badge variant="default">99.8%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Failed Validations</span>
                <Badge variant="destructive">12</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Data Validation Rules")}
              >
                Validation Rules
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Secure File Transfer
            </CardTitle>
            <CardDescription>
              SFTP/FTPS protocols for secure transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Transfer Protocols</span>
                <Badge variant="default">SFTP/FTPS</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Transfers</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Transfer History</span>
                <Badge variant="secondary">2,847</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Secure File Transfer Manager")}
              >
                Transfer Manager
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Web Service Security
            </CardTitle>
            <CardDescription>
              WS-Security standards compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>WS-Security</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>SOAP Services</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Security Tokens</span>
                <Badge variant="secondary">34</Badge>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Web Service Security Configuration")}
              >
                WS Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}