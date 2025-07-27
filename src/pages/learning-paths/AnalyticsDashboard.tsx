import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Award, 
  Download, 
  Filter,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsDashboard = () => {
  const overviewMetrics = [
    {
      title: "Total Enrolled",
      value: "1,245",
      change: "+12%",
      trend: "up",
      icon: Users
    },
    {
      title: "Completion Rate",
      value: "73%",
      change: "+5%", 
      trend: "up",
      icon: CheckCircle
    },
    {
      title: "Average Time",
      value: "8.5 weeks",
      change: "-2%",
      trend: "down",
      icon: Clock
    },
    {
      title: "Satisfaction Score",
      value: "4.2/5",
      change: "+0.3",
      trend: "up",
      icon: Award
    }
  ];

  const enrollmentTrends = [
    { month: "Jan", enrollments: 120, completions: 85, dropouts: 8 },
    { month: "Feb", enrollments: 150, completions: 105, dropouts: 12 },
    { month: "Mar", enrollments: 180, completions: 125, dropouts: 15 },
    { month: "Apr", enrollments: 210, completions: 155, dropouts: 18 },
    { month: "May", enrollments: 195, completions: 145, dropouts: 14 },
    { month: "Jun", enrollments: 225, completions: 170, dropouts: 16 }
  ];

  const progressData = [
    { module: "Module 1", completion: 95, averageScore: 82 },
    { module: "Module 2", completion: 88, averageScore: 79 },
    { module: "Module 3", completion: 75, averageScore: 76 },
    { module: "Module 4", completion: 62, averageScore: 74 },
    { module: "Module 5", completion: 45, averageScore: 71 },
    { module: "Module 6", completion: 28, averageScore: 69 }
  ];

  const statusDistribution = [
    { name: "Active", value: 45, color: "#22c55e" },
    { name: "Completed", value: 30, color: "#3b82f6" },
    { name: "Not Started", value: 15, color: "#f59e0b" },
    { name: "Overdue", value: 8, color: "#ef4444" },
    { name: "Dropped", value: 2, color: "#6b7280" }
  ];

  const performanceData = [
    { pathName: "Digital Marketing", enrolled: 245, completed: 180, rate: 73, avgScore: 78 },
    { pathName: "Leadership Excellence", enrolled: 156, completed: 89, rate: 57, avgScore: 82 },
    { pathName: "Data Science Fundamentals", enrolled: 324, completed: 298, rate: 92, avgScore: 85 },
    { pathName: "Project Management", enrolled: 89, completed: 45, rate: 51, avgScore: 75 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Learning Path Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Learning Paths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Learning Paths</SelectItem>
              <SelectItem value="1">Digital Marketing Mastery</SelectItem>
              <SelectItem value="2">Leadership Excellence</SelectItem>
              <SelectItem value="3">Data Science Fundamentals</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="6m">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {overviewMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs">
                <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment Trends</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="bottlenecks">Bottleneck Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Learner Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <RechartsPieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Learning Path Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pathName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#3b82f6" name="Completion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Enrollment Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <AreaChart data={enrollmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="enrollments" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      name="New Enrollments"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completions" 
                      stackId="2" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      name="Completions"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="dropouts" 
                      stackId="3" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      name="Dropouts"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">+15%</div>
                <p className="text-sm text-muted-foreground">Monthly enrollment growth</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Peak Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">April</div>
                <p className="text-sm text-muted-foreground">Highest enrollment month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">87%</div>
                <p className="text-sm text-muted-foreground">Learners complete their paths</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Module-wise Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="module" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="completion" fill="#3b82f6" name="Completion Rate %" />
                    <Bar yAxisId="right" dataKey="averageScore" fill="#22c55e" name="Average Score" />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Progress Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Average completion time</span>
                  <Badge variant="outline">8.5 weeks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fastest completion</span>
                  <Badge variant="outline">4.2 weeks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Most challenging module</span>
                  <Badge variant="secondary">Module 4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Highest scoring module</span>
                  <Badge variant="default">Module 1</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Daily active learners</span>
                  <Badge variant="outline">342</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average session time</span>
                  <Badge variant="outline">45 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Peak activity hour</span>
                  <Badge variant="secondary">2-3 PM</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile vs Desktop</span>
                  <Badge variant="default">65% / 35%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((path, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{path.pathName}</h4>
                      <Badge 
                        variant={path.rate >= 70 ? "default" : path.rate >= 50 ? "secondary" : "destructive"}
                        className={path.rate >= 70 ? "bg-green-100 text-green-800" : ""}
                      >
                        {path.rate}% completion
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Enrolled:</span>
                        <div className="font-medium">{path.enrolled}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <div className="font-medium">{path.completed}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Score:</span>
                        <div className="font-medium">{path.avgScore}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <div className="font-medium">{Math.round((path.completed / path.enrolled) * 100)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bottlenecks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Bottleneck Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <h4 className="font-medium text-red-800">Critical Bottleneck</h4>
                <p className="text-red-700">Module 4: Project Implementation</p>
                <p className="text-sm text-red-600 mt-1">
                  45% drop in completion rate. Average time spent: 3.2 weeks (expected: 2 weeks)
                </p>
              </div>

              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <h4 className="font-medium text-yellow-800">Moderate Bottleneck</h4>
                <p className="text-yellow-700">Module 5: Advanced Concepts</p>
                <p className="text-sm text-yellow-600 mt-1">
                  25% completion rate decrease. Student feedback indicates difficulty level too high.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Add more practice exercises to Module 4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Provide additional support materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Implement peer learning groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Schedule instructor office hours</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Success Patterns</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Learners who complete Module 1 have 90% path completion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Interactive content shows 40% better engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Weekly check-ins improve completion by 25%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;