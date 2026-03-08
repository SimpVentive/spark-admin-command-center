import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/reportExport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  MoreHorizontal,
  TrendingUp,
  Target,
  Award,
  User
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const StatusTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pathFilter, setPathFilter] = useState("all");

  const statusData = [
    { status: "Not Started", count: 156, percentage: 15.6, color: "#f59e0b" },
    { status: "In Progress", count: 450, percentage: 45.0, color: "#3b82f6" },
    { status: "Completed", count: 300, percentage: 30.0, color: "#22c55e" },
    { status: "Overdue", count: 72, percentage: 7.2, color: "#ef4444" },
    { status: "Dropped", count: 22, percentage: 2.2, color: "#6b7280" }
  ];

  const progressionData = [
    { week: "Week 1", notStarted: 200, inProgress: 100, completed: 0, dropped: 0 },
    { week: "Week 2", notStarted: 150, inProgress: 130, completed: 15, dropped: 5 },
    { week: "Week 4", notStarted: 100, inProgress: 150, completed: 40, dropped: 10 },
    { week: "Week 6", notStarted: 80, inProgress: 140, completed: 70, dropped: 10 },
    { week: "Week 8", notStarted: 60, inProgress: 120, completed: 110, dropped: 10 },
    { week: "Week 12", notStarted: 40, inProgress: 80, completed: 170, dropped: 10 }
  ];

  const learnerDetails = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      path: "Digital Marketing Mastery",
      status: "in-progress",
      progress: 65,
      currentModule: "Module 3: SEO Optimization",
      timeSpent: "32 hours",
      lastActivity: "2024-01-20",
      startDate: "2024-01-01",
      expectedCompletion: "2024-03-15",
      score: 78,
      risk: "low"
    },
    {
      id: "2",
      name: "Sarah Johnson", 
      email: "sarah.j@company.com",
      path: "Leadership Excellence",
      status: "completed",
      progress: 100,
      currentModule: "Completed",
      timeSpent: "45 hours",
      lastActivity: "2024-01-18",
      startDate: "2023-12-01",
      expectedCompletion: "2024-01-18",
      score: 92,
      risk: "none"
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@company.com",
      path: "Data Science Fundamentals", 
      status: "overdue",
      progress: 30,
      currentModule: "Module 2: Statistics",
      timeSpent: "18 hours",
      lastActivity: "2024-01-10",
      startDate: "2023-11-15",
      expectedCompletion: "2024-01-15",
      score: 65,
      risk: "high"
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.d@company.com",
      path: "Project Management",
      status: "not-started",
      progress: 0,
      currentModule: "Not Started",
      timeSpent: "0 hours",
      lastActivity: "Never",
      startDate: "2024-01-20",
      expectedCompletion: "2024-04-20",
      score: 0,
      risk: "medium"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'not-started': return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'dropped': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'completed': "bg-green-100 text-green-800",
      'in-progress': "bg-blue-100 text-blue-800",
      'overdue': "bg-red-100 text-red-800",
      'not-started': "bg-gray-100 text-gray-800",
      'dropped': "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      'low': "bg-green-100 text-green-800",
      'medium': "bg-yellow-100 text-yellow-800", 
      'high': "bg-red-100 text-red-800",
      'none': "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={colors[risk] || "bg-gray-100 text-gray-800"}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Status Drill-Down Analytics</h1>
          <p className="text-muted-foreground">Detailed learner status tracking and intervention tools</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Alerts configured", description: "You'll receive notifications for at-risk and overdue learners." })}>
            <Bell className="h-4 w-4" />
            Set Alerts
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => {
            generatePDF(
              { title: "Status Tracking Report", subtitle: "Learning Path Status Analytics" },
              statusData.map(s => ({ label: s.status, value: `${s.count} (${s.percentage}%)` })),
              [{ title: "Status Summary", headers: ["Status", "Count", "Percentage"], rows: statusData.map(s => [s.status, s.count, `${s.percentage}%`]) }]
            );
            toast({ title: "Report exported" });
          }}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        {statusData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.status}</CardTitle>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              <p className="text-xs text-muted-foreground">
                {item.percentage}% of total learners
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Status Distribution</TabsTrigger>
          <TabsTrigger value="progression">Status Progression</TabsTrigger>
          <TabsTrigger value="individual">Individual Tracking</TabsTrigger>
          <TabsTrigger value="interventions">Intervention Recommendations</TabsTrigger>
          <TabsTrigger value="alerts">Automated Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Status Distribution Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ percentage }) => `${percentage}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Status by Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={[
                      { path: "Digital Marketing", completed: 180, inProgress: 45, overdue: 20 },
                      { path: "Leadership", completed: 89, inProgress: 45, overdue: 22 },
                      { path: "Data Science", completed: 298, inProgress: 20, overdue: 6 },
                      { path: "Project Mgmt", completed: 45, inProgress: 30, overdue: 14 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="path" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                      <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                      <Bar dataKey="overdue" fill="#ef4444" name="Overdue" />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">High Completion Rate</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Data Science Fundamentals has 92% completion rate - highest performing path
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium">Attention Needed</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Leadership Excellence shows higher than average dropout rate at 14%
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Peak Activity</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    45% of learners are currently in progress - good engagement level
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progression" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Status Progression Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={progressionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="notStarted" stroke="#6b7280" name="Not Started" />
                    <Line type="monotone" dataKey="inProgress" stroke="#3b82f6" name="In Progress" />
                    <Line type="monotone" dataKey="completed" stroke="#22c55e" name="Completed" />
                    <Line type="monotone" dataKey="dropped" stroke="#ef4444" name="Dropped" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Progression Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Average time to start</span>
                  <Badge variant="outline">3.2 days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Critical decision point</span>
                  <Badge variant="secondary">Week 4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completion momentum</span>
                  <Badge variant="default">Week 6+</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dropout risk period</span>
                  <Badge variant="destructive">Week 2-4</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <p className="text-sm font-medium text-green-800">High Success Indicator</p>
                  <p className="text-xs text-green-600">Learners active in Week 1 have 89% completion rate</p>
                </div>
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <p className="text-sm font-medium text-yellow-800">Warning Signal</p>
                  <p className="text-xs text-yellow-600">No activity by Week 2 = 67% dropout probability</p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <p className="text-sm font-medium text-blue-800">Momentum Point</p>
                  <p className="text-xs text-blue-600">Completing Module 2 leads to 85% path completion</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search learners..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pathFilter} onValueChange={setPathFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Paths" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Learning Paths</SelectItem>
                <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                <SelectItem value="leadership">Leadership Excellence</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Individual Learner Table */}
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Learning Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Current Module</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {learnerDetails.map((learner) => (
                    <TableRow key={learner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{learner.name}</div>
                            <div className="text-sm text-muted-foreground">{learner.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{learner.path}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(learner.status)}
                          {getStatusBadge(learner.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={learner.progress} className="w-16" />
                          <span className="text-sm">{learner.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{learner.currentModule}</div>
                          <div className="text-xs text-muted-foreground">
                            {learner.timeSpent} spent
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(learner.risk)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Extend Deadline</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Check-in</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Intervention Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-800">High Priority - Immediate Action Needed</h4>
                  <Badge variant="destructive">72 learners</Badge>
                </div>
                <p className="text-red-700 mb-3">Learners overdue by more than 2 weeks</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive">Send Urgent Reminder</Button>
                  <Button size="sm" variant="outline">Schedule Call</Button>
                  <Button size="sm" variant="outline">Extend Deadline</Button>
                </div>
              </div>

              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-yellow-800">Medium Priority - Monitor Closely</h4>
                  <Badge variant="secondary">156 learners</Badge>
                </div>
                <p className="text-yellow-700 mb-3">Learners showing signs of disengagement</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Send Motivation Email</Button>
                  <Button size="sm" variant="outline">Provide Extra Resources</Button>
                  <Button size="sm" variant="outline">Peer Mentoring</Button>
                </div>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-800">Low Priority - Proactive Support</h4>
                  <Badge variant="outline">89 learners</Badge>
                </div>
                <p className="text-blue-700 mb-3">New enrollees who haven't started</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Welcome Email</Button>
                  <Button size="sm" variant="outline">Study Group Invitation</Button>
                  <Button size="sm" variant="outline">Getting Started Guide</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Automated Interventions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Inactivity Alert</p>
                    <p className="text-sm text-muted-foreground">Trigger after 7 days of no activity</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Progress Check</p>
                    <p className="text-sm text-muted-foreground">Weekly progress emails</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Completion Reminder</p>
                    <p className="text-sm text-muted-foreground">3 days before deadline</p>
                  </div>
                  <Badge variant="secondary">Inactive</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Interventions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Early Engagement</p>
                    <p className="text-sm text-muted-foreground">Increased completion by 23%</p>
                  </div>
                  <Badge variant="default">Proven</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Peer Learning Groups</p>
                    <p className="text-sm text-muted-foreground">Reduced dropout by 31%</p>
                  </div>
                  <Badge variant="default">Proven</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Personalized Feedback</p>
                    <p className="text-sm text-muted-foreground">Improved engagement by 18%</p>
                  </div>
                  <Badge variant="secondary">Testing</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Automated Alert System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Active Alerts</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">High Risk Learners</span>
                      </div>
                      <p className="text-sm text-red-600 mb-2">Alert when learner progress drops below 20%</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="destructive">23 triggered</Badge>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Deadline Approaching</span>
                      </div>
                      <p className="text-sm text-yellow-600 mb-2">Alert 1 week before deadline</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">45 triggered</Badge>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Batch Completion</span>
                      </div>
                      <p className="text-sm text-blue-600 mb-2">Alert when cohort reaches 80% completion</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">2 triggered</Badge>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Create New Alert</h3>
                  <div className="space-y-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="progress">Progress Based</SelectItem>
                        <SelectItem value="time">Time Based</SelectItem>
                        <SelectItem value="activity">Activity Based</SelectItem>
                        <SelectItem value="score">Score Based</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than">Less than</SelectItem>
                        <SelectItem value="greater-than">Greater than</SelectItem>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="no-activity">No activity for</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input placeholder="Threshold value" />

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Notification method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="both">Email + Dashboard</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button className="w-full">Create Alert</Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Alert History</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between p-2 border rounded text-sm">
                    <span>High Risk Learner: John Doe (Progress: 15%)</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded text-sm">
                    <span>Deadline Alert: Marketing Batch (Due in 5 days)</span>
                    <span className="text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded text-sm">
                    <span>Cohort Completion: Leadership Q1 (82% complete)</span>
                    <span className="text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatusTracking;