import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  FileText,
  BarChart3,
  PlusCircle,
  Clock,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TrainingNeeds() {
  const currentCycles = [
    {
      id: 1,
      name: "Q1 2024 Training Needs Analysis",
      status: "Active",
      progress: 65,
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      participants: 245,
      completed: 159
    },
    {
      id: 2,
      name: "Leadership Development TNI",
      status: "Pending Approval",
      progress: 85,
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      participants: 45,
      completed: 38
    }
  ];

  const stats = [
    {
      title: "Active TNI Cycles",
      value: "3",
      change: "+1 this month",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Total Participants",
      value: "342",
      change: "+23% from last cycle",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Completion Rate",
      value: "78%",
      change: "+5% improvement",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Programs Identified",
      value: "156",
      change: "12 new programs",
      icon: Award,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Create TNI Cycle",
      description: "Start a new training needs identification cycle",
      icon: PlusCircle,
      link: "/training-needs/create-cycle",
      color: "bg-blue-500"
    },
    {
      title: "View Analytics",
      description: "Analyze training needs data and trends",
      icon: BarChart3,
      link: "/training-needs/analytics",
      color: "bg-green-500"
    },
    {
      title: "Employee TNI",
      description: "Access employee training needs interface",
      icon: FileText,
      link: "/training-needs/employee-tni",
      color: "bg-purple-500"
    },
    {
      title: "Manager Approval",
      description: "Review and approve training requests",
      icon: CheckCircle,
      link: "/training-needs/approval",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Needs Analysis</h1>
          <p className="text-muted-foreground">
            Identify, analyze, and manage organizational training requirements
          </p>
        </div>
        <Button asChild>
          <Link to="/training-needs/create-cycle">
            <PlusCircle className="w-4 h-4 mr-2" />
            New TNI Cycle
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to={action.link}>
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>

      {/* Current Cycles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current TNI Cycles</CardTitle>
              <CardDescription>
                Active and pending training needs identification cycles
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Cycles
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentCycles.map((cycle) => (
              <div key={cycle.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{cycle.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {cycle.startDate} - {cycle.endDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {cycle.completed}/{cycle.participants} completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={cycle.status === "Active" ? "default" : "secondary"}
                    >
                      {cycle.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{cycle.progress}%</span>
                  </div>
                  <Progress value={cycle.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates from training needs analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Q1 2024 TNI Cycle - 85% completion reached</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">New leadership development program identified</p>
                <p className="text-sm text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Manager approvals pending for Technical Training</p>
                <p className="text-sm text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}