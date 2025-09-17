import { Database, Shield, CheckCircle, AlertTriangle, RefreshCw, Archive } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DataIntegrity() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Data Integrity & Validation</h1>
          <p className="text-muted-foreground">Comprehensive data validation and integrity controls</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Input Validation
            </CardTitle>
            <CardDescription>
              Data type checking and range validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Validation Rules</span>
                <Badge variant="secondary">247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Type Checking</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Range Validation</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Manage Rules
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Constraints
            </CardTitle>
            <CardDescription>
              Prevent invalid data entry at database level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Constraints</span>
                <Badge variant="secondary">156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Foreign Keys</span>
                <Badge variant="secondary">89</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Check Constraints</span>
                <Badge variant="secondary">67</Badge>
              </div>
              <Button className="w-full" variant="outline">
                View Constraints
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Checksums & Hashing
            </CardTitle>
            <CardDescription>
              Hash verification for data integrity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Hash Algorithm</span>
                <Badge variant="default">SHA-256</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Verified Records</span>
                <Badge variant="secondary">1.2M</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Integrity Status</span>
                <Badge variant="default">100%</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Run Verification
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Version Control
            </CardTitle>
            <CardDescription>
              Electronic record versioning system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Versioned Records</span>
                <Badge variant="secondary">847,293</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Version History</span>
                <Badge variant="default">Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Change Tracking</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Button className="w-full" variant="outline">
                View Versions
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Backup & Recovery
            </CardTitle>
            <CardDescription>
              Validated backup and recovery procedures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Last Backup</span>
                <Badge variant="secondary">2 hours ago</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Backup Status</span>
                <Badge variant="default">Successful</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Recovery Tests</span>
                <Badge variant="secondary">Monthly</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Run Recovery Test
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Data Migration
            </CardTitle>
            <CardDescription>
              Migration validation and integrity checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Migration Scripts</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Validation Tests</span>
                <Badge variant="default">Passed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Data Integrity</span>
                <Badge variant="default">Verified</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Validate Migration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}