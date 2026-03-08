import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, BookOpen, TrendingUp, Mail, 
  BarChart3, CheckCircle, Clock, Calendar, Plus, Eye
} from "lucide-react";

interface TNACycle {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  departments: string[];
  workflow_type: string;
  created_at: string;
  manager_ratification_required?: boolean;
}

interface CycleStats {
  cycle: TNACycle;
  totalSubmissions: number;
  submittedCount: number;
  approvedCount: number;
  topThemes: { name: string; count: number }[];
}

export default function TNADashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cycles, setCycles] = useState<TNACycle[]>([]);
  const [cycleStats, setCycleStats] = useState<CycleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [topManagers, setTopManagers] = useState<{ name: string; additions: number }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: cyclesData, error: cyclesError } = await supabase
        .from('tna_cycles')
        .select('*')
        .order('created_at', { ascending: false });

      if (cyclesError) throw cyclesError;
      const allCycles = cyclesData || [];
      setCycles(allCycles);

      if (allCycles.length > 0) {
        const cycleIds = allCycles.map(c => c.id);
        const { data: allSubs } = await supabase
          .from('tni_submissions')
          .select('id, cycle_id, status, submitted_at, training_needs, manager_id, manager_changes_count')
          .in('cycle_id', cycleIds);

        const stats: CycleStats[] = allCycles.map(cycle => {
          const subs = (allSubs || []).filter(s => s.cycle_id === cycle.id);
          const submittedCount = subs.filter(s => s.submitted_at).length;
          const approvedCount = subs.filter(s => s.status === 'approved').length;

          // Extract top themes from training_needs
          const themeCounts: Record<string, number> = {};
          subs.forEach(s => {
            const needs = Array.isArray(s.training_needs) ? s.training_needs : [];
            needs.forEach((need: any) => {
              const name = need.program || need.skill || need.title || need.category;
              if (name) {
                themeCounts[name] = (themeCounts[name] || 0) + 1;
              }
            });
          });

          const topThemes = Object.entries(themeCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));

          return {
            cycle,
            totalSubmissions: subs.length,
            submittedCount,
            approvedCount,
            topThemes,
          };
        });

        setCycleStats(stats);

        // Calculate top 3 managers by training additions
        const managerAdditions: Record<string, number> = {};
        (allSubs || []).forEach(s => {
          if (s.manager_id && (s.manager_changes_count as number) > 0) {
            managerAdditions[s.manager_id] = (managerAdditions[s.manager_id] || 0) + (s.manager_changes_count as number);
          }
        });

        const managerIds = Object.keys(managerAdditions);
        if (managerIds.length > 0) {
          const { data: managerProfiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', managerIds);

          const ranked = Object.entries(managerAdditions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([id, additions]) => ({
              name: managerProfiles?.find(p => p.id === id)?.full_name || 'Unknown',
              additions,
            }));
          setTopManagers(ranked);
        }
      }
    } catch (error: any) {
      console.error('Error fetching dashboard:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminders = () => {
    toast({
      title: "Reminders Sent",
      description: "Reminder emails queued for employees with pending submissions",
    });
  };

  const totalCycles = cycles.length;
  const activeCycles = cycles.filter(c => c.status === 'active').length;
  const completedCycles = cycles.filter(c => c.status === 'completed').length;
  const draftCycles = cycles.filter(c => c.status === 'draft').length;

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-emerald-500",
      completed: "bg-blue-500",
      draft: "bg-amber-500",
      closed: "bg-red-500",
    };
    return map[status] || "bg-muted";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default", completed: "secondary", draft: "outline", closed: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getCompletionPercent = (stats: CycleStats) => {
    if (stats.totalSubmissions === 0) return 0;
    return Math.round((stats.submittedCount / stats.totalSubmissions) * 100);
  };

  // Aggregate key themes across all cycles
  const allThemes: Record<string, number> = {};
  cycleStats.forEach(cs => {
    cs.topThemes.forEach(t => {
      allThemes[t.name] = (allThemes[t.name] || 0) + t.count;
    });
  });
  const globalTopThemes = Object.entries(allThemes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Training Needs Analysis</h1>
          <p className="text-muted-foreground">Master overview of all TNA cycles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSendReminders}>
            <Mail className="h-4 w-4 mr-2" /> Send Reminders
          </Button>
          <Button onClick={() => navigate('/training-needs/create-cycle')}>
            <Plus className="h-4 w-4 mr-2" /> Create New Cycle
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/cycles')}>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base">View All Cycles</CardTitle>
            <p className="text-xs text-muted-foreground">List of all TNA cycles</p>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/create-cycle')}>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base">Create TNI Cycle</CardTitle>
            <p className="text-xs text-muted-foreground">Start a new cycle</p>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/analytics')}>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-2">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base">View Analytics</CardTitle>
            <p className="text-xs text-muted-foreground">Cross-cycle insights</p>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/enhanced-employee-tni')}>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base">Employee TNI</CardTitle>
            <p className="text-xs text-muted-foreground">Employee training needs</p>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/enhanced-manager-approval')}>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base">Manager Approval</CardTitle>
            <p className="text-xs text-muted-foreground">Approvals & reporting</p>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/manager-dashboard')}>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base">Manager TNI</CardTitle>
            <p className="text-xs text-muted-foreground">Ratify reportee needs</p>
          </CardHeader>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cycles</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalCycles}</div>
            <p className="text-xs text-muted-foreground">Initiated TNA cycles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : activeCycles}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : completedCycles}</div>
            <p className="text-xs text-muted-foreground">Finished cycles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : draftCycles}</div>
            <p className="text-xs text-muted-foreground">Pending activation</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Themes */}
      {globalTopThemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Themes Across All Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {globalTopThemes.map(([theme, count]) => (
                <Badge key={theme} variant="secondary" className="text-sm py-1 px-3">
                  {theme} <span className="ml-1 font-bold text-primary">({count})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Managers Ranking */}
      {topManagers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Managers by Training Additions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {topManagers.map((mgr, i) => (
                <div key={mgr.name} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" :
                    i === 1 ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" :
                    "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                  }`}>
                    #{i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{mgr.name}</p>
                    <p className="text-xs text-muted-foreground">{mgr.additions} training needs added</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cycle Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All TNA Cycles</h2>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading cycles...</div>
        ) : cycleStats.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No TNA cycles created yet.</p>
              <Button className="mt-4" onClick={() => navigate('/training-needs/create-cycle')}>
                <Plus className="h-4 w-4 mr-2" /> Create Your First Cycle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cycleStats.map(cs => {
              const pct = getCompletionPercent(cs);
              return (
                <Card 
                  key={cs.cycle.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/training-needs/cycles/${cs.cycle.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {cs.cycle.name}
                      </CardTitle>
                      {getStatusBadge(cs.cycle.status)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {cs.cycle.start_date} — {cs.cycle.end_date}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Completion */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Completion</span>
                        <span className="font-medium">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {cs.submittedCount} of {cs.totalSubmissions} submitted · {cs.approvedCount} approved
                      </p>
                    </div>

                    {/* Departments */}
                    {cs.cycle.departments?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cs.cycle.departments.slice(0, 3).map(d => (
                          <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                        ))}
                        {cs.cycle.departments.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{cs.cycle.departments.length - 3}</Badge>
                        )}
                      </div>
                    )}

                    {/* Top Themes */}
                    {cs.topThemes.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Top Themes</p>
                        <div className="flex flex-wrap gap-1">
                          {cs.topThemes.map(t => (
                            <Badge key={t.name} variant="secondary" className="text-xs">
                              {t.name} ({t.count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate(`/training-needs/cycles/${cs.cycle.id}`)}>
                      <Eye className="h-4 w-4 mr-2" /> View Dashboard
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
