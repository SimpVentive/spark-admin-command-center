import { Shield, Lock, Server, AlertTriangle, HardDrive, Wifi } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SecurityInfrastructure() {
  const [encryptionOpen, setEncryptionOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} accessed`,
      description: `${action} interface has been opened.`,
    });
  };

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
              <Dialog open={encryptionOpen} onOpenChange={setEncryptionOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Encryption Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Encryption Configuration</DialogTitle>
                    <DialogDescription>
                      Configure encryption settings for data at rest and in transit
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Database Encryption</span>
                      <Badge variant="default">AES-256 Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>File System Encryption</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>TLS Version</span>
                      <Badge variant="default">1.3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Key Rotation</span>
                      <Badge variant="secondary">90 days</Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleAction("Encryption Settings");
                        setEncryptionOpen(false);
                      }}
                    >
                      Update Settings
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
              <Dialog open={networkOpen} onOpenChange={setNetworkOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Network Monitor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Network Security Monitor</DialogTitle>
                    <DialogDescription>
                      Real-time network security monitoring and threat detection
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3 text-sm">
                      <div className="font-semibold text-destructive">High Priority Alert</div>
                      <div>Suspicious login attempts from IP: 203.45.67.89</div>
                      <div className="text-muted-foreground">Time: 14:30 UTC</div>
                    </div>
                    <div className="border rounded-lg p-3 text-sm">
                      <div className="font-semibold">Normal Traffic</div>
                      <div>API requests within normal parameters</div>
                      <div className="text-muted-foreground">Rate: 450/min</div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleAction("Network Monitor");
                        setNetworkOpen(false);
                      }}
                    >
                      View Full Dashboard
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
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Vulnerability Scan")}
              >
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
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Backup Manager")}
              >
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
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Disaster Recovery Procedures")}
              >
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
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleAction("Physical Security Dashboard")}
              >
                Physical Security
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}