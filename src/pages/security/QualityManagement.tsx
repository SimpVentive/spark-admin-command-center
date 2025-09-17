import { CheckCircle, AlertTriangle, TrendingUp, Users, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function QualityManagement() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} opened`,
      description: `${action} interface is now accessible.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Quality Management Integration</h1>
          <p className="text-muted-foreground">Quality system interfaces and management integration</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              CAPA Integration
            </CardTitle>
            <CardDescription>
              Corrective and Preventive Action tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Open CAPAs</span>
                <Badge variant="destructive">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>This Month</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Avg Resolution</span>
                <Badge variant="secondary">15 days</Badge>
              </div>
              <Button className="w-full" variant="outline">
                CAPA Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Deviation Tracking
            </CardTitle>
            <CardDescription>
              Deviation tracking and reporting system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Deviations</span>
                <Badge variant="destructive">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Under Investigation</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Closed This Month</span>
                <Badge variant="secondary">47</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Deviation Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Risk Assessment
            </CardTitle>
            <CardDescription>
              Risk assessment documentation and tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Risk Assessments</span>
                <Badge variant="secondary">34</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>High Risk Items</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Mitigation Plans</span>
                <Badge variant="secondary">15</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Risk Register
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Training Effectiveness
            </CardTitle>
            <CardDescription>
              Training effectiveness measurement and tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Effectiveness Score</span>
                <Badge variant="default">87.3%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Training Programs</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Assessment Rate</span>
                <Badge variant="default">94.7%</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Effectiveness Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Supplier Management
            </CardTitle>
            <CardDescription>
              Supplier and vendor management integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Suppliers</span>
                <Badge variant="secondary">47</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Qualified Vendors</span>
                <Badge variant="default">42</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Audit Schedule</span>
                <Badge variant="secondary">Quarterly</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Supplier Portal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Document Control
            </CardTitle>
            <CardDescription>
              Document control system connectivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Controlled Documents</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Approvals</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Version Control</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Button className="w-full" variant="outline">
                Document System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}