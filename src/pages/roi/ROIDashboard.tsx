import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, Users, Award } from "lucide-react";

const roiData = [
  { month: "Jan", investment: 45000, returns: 62000 },
  { month: "Feb", investment: 52000, returns: 71000 },
  { month: "Mar", investment: 48000, returns: 68000 },
  { month: "Apr", investment: 61000, returns: 85000 },
  { month: "May", investment: 55000, returns: 79000 },
  { month: "Jun", investment: 67000, returns: 95000 },
];

const categoryData = [
  { name: "Leadership", value: 35 },
  { name: "Technical", value: 30 },
  { name: "Compliance", value: 20 },
  { name: "Soft Skills", value: 15 },
];

const COLORS = ["hsl(var(--primary))", "hsl(220, 70%, 55%)", "hsl(150, 60%, 45%)", "hsl(40, 80%, 55%)"];

const ROIDashboard = () => {
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
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">$328,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className="text-2xl font-bold">$460,000</p>
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
                <p className="text-2xl font-bold">140%</p>
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
                <p className="text-2xl font-bold">1,245</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Investment vs Returns</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="investment" fill="hsl(220, 70%, 55%)" name="Investment" />
                <Bar dataKey="returns" fill="hsl(150, 60%, 45%)" name="Returns" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Investment by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ROIDashboard;
