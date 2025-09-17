import { PenTool, Shield, Clock, Key, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ElectronicSignature() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} accessed`,
      description: `${action} module is now available.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PenTool className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Electronic Signature Framework</h1>
          <p className="text-muted-foreground">Legally binding electronic signature system</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Signature Capture
            </CardTitle>
            <CardDescription>
              Comprehensive signature data collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Printed Name</span>
                <Badge variant="default">Required</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Date/Time Stamp</span>
                <Badge variant="default">Automatic</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Signature Meaning</span>
                <Badge variant="default">Captured</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Configure Capture
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
              Two-component authentication system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>ID Verification</span>
                <Badge variant="default">Required</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Password/Biometric</span>
                <Badge variant="default">Required</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Auth Methods</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage Auth
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Controls
            </CardTitle>
            <CardDescription>
              Prevent copying, transfer, or reuse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Copy Protection</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Transfer Prevention</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Reuse Detection</span>
                <Badge variant="default">Monitoring</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Signature Events
            </CardTitle>
            <CardDescription>
              Legally binding signature creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Signatures</span>
                <Badge variant="secondary">15,432</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>This Month</span>
                <Badge variant="secondary">847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Legal Binding</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <Button className="w-full" variant="outline">
                View Events
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Metadata Storage
            </CardTitle>
            <CardDescription>
              Secure signature metadata management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Storage Format</span>
                <Badge variant="default">Encrypted</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Retention Period</span>
                <Badge variant="secondary">7 years</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Backup Status</span>
                <Badge variant="default">Current</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage Storage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Validation System
            </CardTitle>
            <CardDescription>
              Signature authenticity verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Auto Validation</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Validation Checks</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Failed Validations</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Run Validation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}