import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, Users, CheckCircle, Settings, Shield } from "lucide-react";

const Processes = () => {
  const processModules = [
    {
      title: "Workflow Management",
      description: "Design, execute, and monitor business workflows with drag-and-drop builder",
      icon: Workflow,
      link: "/processes/workflows",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      title: "User and Role Management",
      description: "Manage user roles, permissions, and organizational access control",
      icon: Users,
      link: "/processes/user-roles",
      gradient: "from-purple-600 to-purple-800"
    },
    {
      title: "Approval Framework",
      description: "Configure approval workflows and escalation rules",
      icon: CheckCircle,
      link: "/processes/approvals",
      gradient: "from-green-600 to-green-800"
    },
    {
      title: "Business Rules",
      description: "Define and manage business logic and automated decision rules",
      icon: Settings,
      link: "/processes/business-rules",
      gradient: "from-orange-600 to-orange-800"
    },
    {
      title: "Security & Access Control",
      description: "Configure security policies and access control mechanisms",
      icon: Shield,
      link: "/processes/security",
      gradient: "from-red-600 to-red-800"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Process Management</h1>
        <p className="text-muted-foreground">
          Streamline your business processes with powerful automation and management tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processModules.map((module) => (
          <Link key={module.title} to={module.link}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 group cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
                <CardDescription>
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-primary font-medium group-hover:underline">
                  Access Module →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Processes;