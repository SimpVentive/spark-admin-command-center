import { Shield, Lock, Key, UserCheck, AlertTriangle, Database, PenTool, FileText, BarChart3, Plug, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Security() {
  const navigate = useNavigate();

  const securityModules = [
    {
      title: "System Access & Authentication",
      description: "Multi-layered authentication with RBAC and MFA",
      icon: Lock,
      path: "/security/system-access",
      status: "Active",
      metrics: "147 Users"
    },
    {
      title: "Audit Trail",
      description: "Comprehensive audit logging with tamper-proof records",
      icon: FileText,
      path: "/security/audit-trail",
      status: "Monitoring",
      metrics: "1.2M Records"
    },
    {
      title: "Electronic Signature",
      description: "Legally binding electronic signature framework",
      icon: PenTool,
      path: "/security/electronic-signature",
      status: "Compliant",
      metrics: "15,432 Signatures"
    },
    {
      title: "Data Integrity & Validation",
      description: "Data validation controls and integrity checks",
      icon: Database,
      path: "/security/data-integrity",
      status: "Verified",
      metrics: "100% Integrity"
    },
    {
      title: "User Management",
      description: "User lifecycle and administration system",
      icon: UserCheck,
      path: "/security/user-management",
      status: "Active",
      metrics: "8 Pending"
    },
    {
      title: "Record Management",
      description: "Electronic record lifecycle and retention",
      icon: FileText,
      path: "/security/record-management",
      status: "Enforced",
      metrics: "24 Policies"
    },
    {
      title: "System Validation",
      description: "Validation support and change control framework",
      icon: CheckCircle,
      path: "/security/system-validation",
      status: "Current",
      metrics: "847 Tests"
    },
    {
      title: "Reporting & Compliance",
      description: "FDA-ready reports and compliance monitoring",
      icon: BarChart3,
      path: "/security/reporting-compliance",
      status: "Compliant",
      metrics: "94.7% Score"
    },
    {
      title: "Security & Infrastructure",
      description: "Encryption, network security, and infrastructure protection",
      icon: Shield,
      path: "/security/infrastructure",
      status: "Protected",
      metrics: "99.9% Uptime"
    },
    {
      title: "Integration & API Security",
      description: "Secure API and integration capabilities",
      icon: Plug,
      path: "/security/integration-security",
      status: "Secured",
      metrics: "47 APIs"
    },
    {
      title: "Quality Management",
      description: "Quality system interfaces and CAPA integration",
      icon: CheckCircle,
      path: "/security/quality-management",
      status: "Integrated",
      metrics: "12 CAPAs"
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
      case "Compliant":
      case "Verified":
      case "Enforced":
      case "Current":
      case "Protected":
      case "Secured":
      case "Integrated":
        return "default";
      case "Monitoring":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-muted-foreground">Comprehensive security framework and compliance management</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {securityModules.map((module) => (
          <Card key={module.path} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <module.icon className="w-5 h-5" />
                {module.title}
              </CardTitle>
              <CardDescription>
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <Badge variant={getStatusVariant(module.status)}>{module.status}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Metrics</span>
                  <Badge variant="secondary">{module.metrics}</Badge>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(module.path)}
                >
                  Access Module
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}