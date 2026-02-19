import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, Users, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ["hsl(var(--primary))", "hsl(220, 70%, 55%)", "hsl(150, 60%, 45%)", "hsl(40, 80%, 55%)"];

const ROIDashboard = () => {
  const { data: costData = [] } = useQuery({
    queryKey: ["roi-costs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("roi_cost_entries").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: impactData = [] } = useQuery({
    queryKey: ["roi-impact"],
    queryFn: async () => {
      const { data, error } = await supabase.from("roi_impact_metrics").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: profileCount = 0 } = useQuery({
    queryKey: ["roi-employee-count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const totalInvestment = costData.reduce((sum, item) => sum + Number(item.budget || 0), 0);
  const totalActual = costData.reduce((sum, item) => sum + Number(item.actual || 0), 0);
  const roiPercent = totalInvestment > 0 ? Math.round(((totalActual - totalInvestment) / totalInvestment) * 100) : 0;

  // Group costs by category for bar chart
  const categoryChartData = costData.reduce((acc: any[], item) => {
    const existing = acc.find((c) => c.category === item.category);
    if (existing) {
      existing.investment += Number(item.budget || 0);
      existing.returns += Number(item.actual || 0);
    } else {
      acc.push({ category: item.category, investment: Number(item.budget || 0), returns: Number(item.actual || 0) });
    }
    return acc;
  }, []);

  // Group impact by impact_level for pie chart
  const impactPieData = impactData.reduce((acc: any[], item) => {
    const existing = acc.find((c) => c.name === item.impact_level);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.impact_level, value: 1 });
    }
    return acc;
  }, []);

  const hasData = costData.length > 0 || impactData.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ROI Dashboard</h1>
        <p className="text-muted-foreground">Training Return on Investment Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${totalInvestment.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Actual</p>
                <p className="text-2xl font-bold">${totalActual.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">ROI Percentage</p>
                <p className="text-2xl font-bold">{roiPercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Employees Trained</p>
                <p className="text-2xl font-bold">{profileCount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Budget vs Actual by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="investment" fill="hsl(220, 70%, 55%)" name="Budget" />
                  <Bar dataKey="returns" fill="hsl(150, 60%, 45%)" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Impact Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={impactPieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {impactPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No ROI Data Yet</h3>
            <p className="text-sm text-muted-foreground text-center">
              Add cost entries and impact metrics to see your ROI dashboard populate with live data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ROIDashboard;
