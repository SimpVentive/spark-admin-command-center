import { Shield, Lock, Server, AlertTriangle, HardDrive, Wifi } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SecurityInfrastructure() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Security & Infrastructure</h1>
          <p className="text-muted-foreground">Comprehensive security controls and infrastructure protection</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Encryption Controls
            </CardTitle>
            <CardDescription>
              AES-256 at rest and TLS 1.3 in transit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>At Rest</span>
                <Badge variant="default">AES-256</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>In Transit</span>
                <Badge variant="default">TLS 1.3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Key Management</span>
                <Badge variant="default">HSM</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Encryption Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Network Security
            </CardTitle>
            <CardDescription>
              Firewall rules and intrusion detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Firewall Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>IDS/IPS</span>
                <Badge variant="default">Monitoring</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Blocked Attempts</span>
                <Badge variant="secondary">247</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Network Monitor
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Vulnerability Scanning
            </CardTitle>
            <CardDescription>
              Regular security vulnerability assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Last Scan</span>
                <Badge variant="secondary">2 days ago</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Vulnerabilities</span>
                <Badge variant="destructive">3 High</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Scan Frequency</span>
                <Badge variant="secondary">Weekly</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Run Scan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Backup Security
            </CardTitle>
            <CardDescription>
              Secure backup procedures with encryption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Backup Status</span>
                <Badge variant="default">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Encryption</span>
                <Badge variant="default">AES-256</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Backup</span>
                <Badge variant="secondary">4 hours ago</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Backup Manager
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Disaster Recovery
            </CardTitle>
            <CardDescription>
              Tested disaster recovery procedures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>DR Status</span>
                <Badge variant="default">Ready</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>RTO Target</span>
                <Badge variant="secondary">4 hours</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Test</span>
                <Badge variant="secondary">30 days ago</Badge>
              </div>
              <Button className="w-full" variant="outline">
                DR Procedures
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Physical Security
            </CardTitle>
            <CardDescription>
              Server infrastructure physical controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Access Control</span>
                <Badge variant="default">Biometric</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Surveillance</span>
                <Badge variant="default">24/7</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Environmental</span>
                <Badge variant="default">Monitored</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Physical Security
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}