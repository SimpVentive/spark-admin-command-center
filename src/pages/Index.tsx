import { StatsGrid } from "@/components/StatsGrid";
import { RecentActivity } from "@/components/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Megaphone, FileBarChart, Shield, Settings } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import SuperAdminDashboard from "@/pages/super-admin/SuperAdminDashboard";

const CHART_COLORS = [
  "hsl(220, 90%, 56%)",
  "hsl(160, 70%, 40%)",
  "hsl(30, 95%, 55%)",
  "hsl(280, 70%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(190, 80%, 45%)",
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch department distribution for pie chart
  const { data: departments } = useQuery({
    queryKey: ['dashboard-dept-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('name, employee_count')
        .eq('is_active', true)
        .order('employee_count', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch recent programs for bar chart
  const { data: programs } = useQuery({
    queryKey: ['dashboard-programs-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_programs')
        .select('title, category, duration_hours')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data || [];
    }
  });

  const programChartData = programs?.map(p => ({
    name: p.title?.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
    hours: p.duration_hours || 0,
    category: p.category,
  })) || [];

  const deptPieData = departments?.map(d => ({
    name: d.name,
    value: d.employee_count || 0,
  })) || [];

  const quickActions = [
    { label: "Create New Course", icon: PlusCircle, onClick: () => navigate('/programs/create') },
    { label: "Send Announcement", icon: Megaphone, onClick: () => navigate('/processes/workflows') },
    { label: "Generate Report", icon: FileBarChart, onClick: () => navigate('/reports') },
    { label: "Manage Permissions", icon: Shield, onClick: () => navigate('/processes/user-roles') },
    { label: "System Settings", icon: Settings, onClick: () => navigate('/settings') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(220,90%,56%)] to-[hsl(280,70%,55%)] bg-clip-text text-transparent">
            L-Kurve Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time overview of your learning management platform
          </p>
        </div>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-[hsl(220,90%,56%)] to-[hsl(250,80%,50%)] hover:opacity-90 text-white border-0 shadow-lg"
          onClick={() => navigate("/reports")}
        >
          View Full Report
        </Button>
      </div>

      <StatsGrid />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Program Duration Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {programChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={programChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="hours" name="Duration (hrs)" radius={[6, 6, 0, 0]}>
                      {programChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No programs yet. Create your first training program.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {deptPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {deptPieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No departments yet. Add departments in Organization.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity />
        </div>
        
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-start gap-3 hover:bg-gradient-to-r hover:from-[hsl(220,90%,56%)]/10 hover:to-[hsl(250,80%,50%)]/10 hover:border-[hsl(220,90%,56%)]/30 transition-all"
                onClick={action.onClick}
              >
                <action.icon className="h-4 w-4 text-[hsl(220,90%,56%)]" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
