
import { StatsGrid } from "@/components/StatsGrid";
import { RecentActivity } from "@/components/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const chartData = [
    { name: "Jan", users: 120, courses: 45 },
    { name: "Feb", users: 150, courses: 52 },
    { name: "Mar", users: 180, courses: 48 },
    { name: "Apr", users: 220, courses: 61 },
    { name: "May", users: 280, courses: 55 },
    { name: "Jun", users: 320, courses: 67 },
  ];

  const engagementData = [
    { name: "Week 1", engagement: 85 },
    { name: "Week 2", engagement: 88 },
    { name: "Week 3", engagement: 92 },
    { name: "Week 4", engagement: 87 },
    { name: "Week 5", engagement: 94 },
    { name: "Week 6", engagement: 91 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">LMSAdmin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor your Skill Spark employee learning platform
          </p>
        </div>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          View Full Report
        </Button>
      </div>

      <StatsGrid />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth & Course Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="hsl(var(--primary))" name="New Users" />
                  <Bar dataKey="courses" fill="hsl(var(--muted))" name="Course Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Engagement %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/programs/create')}
            >
              Create New Course
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({
                title: "Send Announcement",
                description: "Announcement functionality will be implemented soon.",
              })}
            >
              Send Announcement
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({
                title: "Generate Report",
                description: "Report generation functionality will be implemented soon.",
              })}
            >
              Generate Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/processes/user-role-management')}
            >
              Manage Permissions
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({
                title: "System Settings",
                description: "System settings functionality will be implemented soon.",
              })}
            >
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
