import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, FolderOpen, Settings, Activity, TrendingUp, Users, BookOpen, Award, CheckCircle } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import LearningPathManagement from "@/components/learning-paths/LearningPathManagement";
import LearningPathAnalytics from "@/components/learning-paths/LearningPathAnalytics";
import ContentLibraryManager from "@/components/content/ContentLibraryManager";
import PathBuilderInterface from "@/components/path-builder/PathBuilderInterface";

const LearningPathDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const dashboardStats = [
    {
      title: "Total Learning Paths",
      value: "142",
      subtitle: "Active paths",
      icon: BookOpen,
      trend: { value: "12%", isPositive: true }
    },
    {
      title: "Active Learners",
      value: "2,847",
      subtitle: "Enrolled users",
      icon: Users,
      trend: { value: "8%", isPositive: true }
    },
    {
      title: "Completion Rate",
      value: "87%",
      subtitle: "Average completion",
      icon: CheckCircle,
      trend: { value: "5%", isPositive: true }
    },
    {
      title: "Path Effectiveness",
      value: "94%",
      subtitle: "Learning outcomes",
      icon: Award,
      trend: { value: "3%", isPositive: true }
    }
  ];

  const recentActivity = [
    { action: "New learning path created", user: "Sarah Johnson", time: "2 minutes ago", type: "create" },
    { action: "Path completion milestone reached", user: "Mike Chen", time: "15 minutes ago", type: "complete" },
    { action: "Content added to Digital Marketing path", user: "Emma Davis", time: "1 hour ago", type: "update" },
    { action: "25 users assigned to Leadership Training", user: "Tom Wilson", time: "3 hours ago", type: "assign" },
    { action: "Analytics report generated", user: "System", time: "6 hours ago", type: "system" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create": return <Plus className="h-4 w-4 text-green-600" />;
      case "complete": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "update": return <Settings className="h-4 w-4 text-orange-600" />;
      case "assign": return <Users className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Path Management</h1>
          <p className="text-muted-foreground">
            Comprehensive dashboard for managing learning paths, content, and analytics
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => navigate('/learning-paths/create')}>
          <Plus className="h-4 w-4" />
          Create Learning Path
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Content Library
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Path Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, index) => (
              <DashboardCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activity Feed */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("paths")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Learning Path
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("content")}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Manage Content
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("analytics")}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Training
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="paths" className="mt-6">
          <LearningPathManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <LearningPathAnalytics />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentLibraryManager />
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          <PathBuilderInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPathDashboard;