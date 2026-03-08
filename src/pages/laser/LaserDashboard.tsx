import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, 
  Target, Brain, Zap, BarChart3, ArrowRight, Users, Clock, Play
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const LaserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalKpis: 0,
    activeDeviations: 0,
    assignedInterventions: 0,
    resolvedDeviations: 0,
    avgImprovement: 0,
  });
  const [recentDeviations, setRecentDeviations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [kpisRes, deviationsRes, interventionsRes, resolvedRes] = await Promise.all([
        supabase.from("laser_kpi_definitions").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("laser_deviations").select("*, laser_kpi_definitions(name)").eq("status", "open").order("detected_at", { ascending: false }).limit(10),
        supabase.from("laser_assigned_interventions").select("id", { count: "exact" }).eq("status", "assigned"),
        supabase.from("laser_deviations").select("id", { count: "exact" }).eq("status", "resolved"),
      ]);

      setStats({
        totalKpis: kpisRes.count || 0,
        activeDeviations: deviationsRes.data?.length || 0,
        assignedInterventions: interventionsRes.count || 0,
        resolvedDeviations: resolvedRes.count || 0,
        avgImprovement: 0,
      });
      setRecentDeviations(deviationsRes.data || []);
    } catch (err) {
      console.error("Error fetching LASER dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const [rcaRunning, setRcaRunning] = useState(false);

  const handleRunRCAScan = async () => {
    setRcaRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("laser-rca-engine", {
        body: { mode: "scan" },
      });
      if (error) throw error;
      toast({
        title: "🧠 RCA Scan Complete",
        description: `${data.deviations_processed} deviation(s) analyzed, ${data.interventions_assigned} intervention(s) assigned`,
      });
      fetchDashboardData();
    } catch (err: any) {
      toast({ title: "RCA scan failed", description: err.message, variant: "destructive" });
    } finally {
      setRcaRunning(false);
    }
  };

  // Mock trend data for visualization
  const trendData = [
    { month: "Jan", deviations: 12, resolved: 8, interventions: 10 },
    { month: "Feb", deviations: 15, resolved: 12, interventions: 14 },
    { month: "Mar", deviations: 9, resolved: 11, interventions: 8 },
    { month: "Apr", deviations: 18, resolved: 14, interventions: 16 },
    { month: "May", deviations: 7, resolved: 15, interventions: 6 },
    { month: "Jun", deviations: 5, resolved: 9, interventions: 4 },
  ];

  const severityData = [
    { name: "Critical", value: 3, color: "hsl(var(--destructive))" },
    { name: "Warning", value: 8, color: "hsl(45, 93%, 47%)" },
    { name: "Info", value: 5, color: "hsl(var(--primary))" },
  ];

  const causeDistribution = [
    { cause: "Skill Gap", count: 12 },
    { cause: "Equipment", count: 8 },
    { cause: "Process", count: 6 },
    { cause: "Material", count: 4 },
    { cause: "Environment", count: 2 },
  ];

  const statCards = [
    { title: "Active KPIs", value: stats.totalKpis, icon: Target, color: "text-primary", desc: "Monitored KPIs" },
    { title: "Open Deviations", value: stats.activeDeviations, icon: AlertTriangle, color: "text-destructive", desc: "Require attention" },
    { title: "Active Interventions", value: stats.assignedInterventions, icon: Zap, color: "text-amber-500", desc: "In progress" },
    { title: "Resolved", value: stats.resolvedDeviations, icon: CheckCircle, color: "text-emerald-500", desc: "Successfully closed" },
  ];

  const quickActions = [
    { title: "Configure KPIs", desc: "Define and map KPIs to roles", url: "/laser/kpi-config", icon: Target },
    { title: "Causal Maps", desc: "Build cause-effect relationships", url: "/laser/causal-maps", icon: Brain },
    { title: "Performance Data", desc: "Import or view KPI signals", url: "/laser/performance-data", icon: BarChart3 },
    { title: "Interventions", desc: "View active interventions", url: "/laser/interventions", icon: Zap },
    { title: "Impact Validation", desc: "Track improvement outcomes", url: "/laser/impact", icon: TrendingUp },
    { title: "Data Sources", desc: "Configure external data feeds", url: "/laser/data-sources", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-7 w-7 text-primary" />
            </div>
            LASER Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Learning & Application Specific to Employee Role — Performance Intelligence
          </p>
        </div>
        <Button onClick={handleRunRCAScan} disabled={rcaRunning} variant="outline">
          <Play className="h-4 w-4 mr-2" />
          {rcaRunning ? "Running RCA..." : "Run RCA Scan"}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                </div>
                <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">LASER Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={() => navigate(action.url)}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left group"
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deviation & Resolution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="deviations" stroke="hsl(var(--destructive))" name="Deviations" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="hsl(142, 76%, 36%)" name="Resolved" strokeWidth={2} />
                <Line type="monotone" dataKey="interventions" stroke="hsl(var(--primary))" name="Interventions" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cause Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Root Cause Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={causeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="cause" type="category" className="text-xs" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deviations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Deviations</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/laser/performance-data")}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {recentDeviations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No active deviations</p>
              <p className="text-sm mt-1">Configure KPIs and import performance data to start detecting deviations.</p>
              <Button className="mt-4" onClick={() => navigate("/laser/kpi-config")}>
                <Target className="h-4 w-4 mr-2" />
                Configure KPIs
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDeviations.map((dev) => (
                <div key={dev.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-5 w-5 ${dev.severity === 'critical' ? 'text-destructive' : 'text-amber-500'}`} />
                    <div>
                      <p className="text-sm font-medium">{dev.laser_kpi_definitions?.name || 'KPI'}</p>
                      <p className="text-xs text-muted-foreground">
                        Deviation: {dev.deviation_percentage?.toFixed(1)}% | Target: {dev.target_value}
                      </p>
                    </div>
                  </div>
                  <Badge variant={dev.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {dev.severity}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How LASER Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {[
              { step: "1", title: "KPI Setup", desc: "Define KPIs & map to roles", icon: Target },
              { step: "2", title: "Data Ingestion", desc: "Import performance signals", icon: BarChart3 },
              { step: "3", title: "Deviation Detection", desc: "Auto-detect KPI dips", icon: AlertTriangle },
              { step: "4", title: "Root Cause Analysis", desc: "AI identifies probable cause", icon: Brain },
              { step: "5", title: "Auto-Intervention", desc: "Assign learning to employee", icon: Zap },
              { step: "6", title: "Impact Validation", desc: "Track KPI improvement", icon: TrendingUp },
            ].map((item, idx) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground max-w-[120px]">{item.desc}</p>
                </div>
                {idx < 5 && <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaserDashboard;
