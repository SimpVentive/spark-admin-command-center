import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Award, 
  BookOpen, 
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";

const LearningPathAnalytics = () => {
  // Mock data for analytics
  const completionTrendData = [
    { month: "Jan", completions: 45, enrollments: 120 },
    { month: "Feb", completions: 67, enrollments: 150 },
    { month: "Mar", completions: 89, enrollments: 180 },
    { month: "Apr", completions: 112, enrollments: 200 },
    { month: "May", completions: 134, enrollments: 220 },
    { month: "Jun", completions: 156, enrollments: 245 }
  ];

  const pathPerformanceData = [
    { name: "Digital Marketing", completions: 156, rating: 4.8, enrollments: 245 },
    { name: "Leadership Excellence", rating: 4.9, completions: 134, enrollments: 189 },
    { name: "Data Analysis", completions: 98, rating: 4.7, enrollments: 156 },
    { name: "Project Management", completions: 78, rating: 4.6, enrollments: 123 },
    { name: "Sales Training", completions: 65, rating: 4.5, enrollments: 98 }
  ];

  const categoryDistribution = [
    { name: "Technology", value: 35, color: "#8884d8" },
    { name: "Leadership", value: 25, color: "#82ca9d" },
    { name: "Marketing", value: 20, color: "#ffc658" },
    { name: "Management", value: 12, color: "#ff7c7c" },
    { name: "Sales", value: 8, color: "#8dd1e1" }
  ];

  const engagementMetrics = [
    { metric: "Avg. Session Duration", value: "24 min", change: "+12%" },
    { metric: "Content Interactions", value: "156/day", change: "+8%" },
    { metric: "Discussion Posts", value: "89/week", change: "+15%" },
    { metric: "Resource Downloads", value: "234/week", change: "+22%" }
  ];

  const topPerformingPaths = [
    { name: "Leadership Excellence", completionRate: 92, satisfaction: 4.9 },
    { name: "Digital Marketing", completionRate: 87, satisfaction: 4.8 },
    { name: "Data Analysis", completionRate: 78, satisfaction: 4.7 },
    { name: "Project Management", completionRate: 85, satisfaction: 4.6 },
    { name: "Sales Training", completionRate: 73, satisfaction: 4.5 }
  ];

  const analyticsStats = [
    {
      title: "Total Completions",
      value: "1,247",
      subtitle: "This month",
      icon: Award,
      trend: { value: "15%", isPositive: true }
    },
    {
      title: "Active Learners",
      value: "2,847",
      subtitle: "Currently enrolled",
      icon: Users,
      trend: { value: "8%", isPositive: true }
    },
    {
      title: "Avg. Completion Time",
      value: "6.2 days",
      subtitle: "Per path",
      icon: Clock,
      trend: { value: "1.2 days", isPositive: false }
    },
    {
      title: "Content Effectiveness",
      value: "87%",
      subtitle: "Learning objectives met",
      icon: Target,
      trend: { value: "3%", isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Learning Path Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into learning path performance and engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsStats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Path Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pathPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completions" fill="hsl(var(--primary))" name="Completions" />
                    <Bar dataKey="enrollments" fill="hsl(var(--secondary))" name="Enrollments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Content Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Learning Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingPaths.map((path, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{path.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Completion: {path.completionRate}%</span>
                          <span>Rating: {path.satisfaction}/5.0</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={path.completionRate >= 85 ? "default" : "secondary"}>
                        {path.completionRate >= 85 ? "Excellent" : "Good"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Completion Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={completionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="enrollments" 
                    stackId="1" 
                    stroke="hsl(var(--muted-foreground))" 
                    fill="hsl(var(--muted))"
                    name="Enrollments"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completions" 
                    stackId="1" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    name="Completions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={completionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="completions" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Completions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Growth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">+23%</p>
                    <p className="text-sm text-muted-foreground">Enrollments</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">+18%</p>
                    <p className="text-sm text-muted-foreground">Completions</p>
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">87%</p>
                  <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {engagementMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-muted-foreground mb-2">{metric.metric}</p>
                    <Badge variant={metric.change.startsWith('+') ? "default" : "secondary"}>
                      {metric.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Daily Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>Daily active users chart would go here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Average Session Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>Session duration analytics would go here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Top Performer</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Leadership Excellence path has the highest completion rate at 92%
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Growth Trend</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Monthly enrollments increased by 23% compared to last quarter
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200">Improvement Area</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Consider adding more interactive content to boost engagement
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">📈 Optimize Path Sequence</h4>
                  <p className="text-sm text-muted-foreground">
                    Reorganize content modules based on completion patterns to improve flow
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 Create Advanced Tracks</h4>
                  <p className="text-sm text-muted-foreground">
                    High performers need advanced content to maintain engagement
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">💬 Increase Interaction</h4>
                  <p className="text-sm text-muted-foreground">
                    Add more discussion forums and peer-to-peer learning opportunities
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPathAnalytics;