import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Users, BookOpen, Award, TrendingUp, Mail, Brain, 
  ChevronDown, ChevronRight, Search, Filter, Download,
  BarChart3, PieChart, AlertCircle, CheckCircle, Clock
} from "lucide-react";

export default function TNADashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [aiInput, setAiInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const overallStats = {
    totalEmployees: 2847,
    completed: 2456,
    pending: 391,
    completionRate: 86.3,
    threshold: 85,
    canStartTNA: true
  };

  const categoryBreakdown = [
    { name: "Managerial", total: 1234, programs: 45, avgPerEmployee: 2.8, color: "bg-blue-500" },
    { name: "Behavioral", total: 987, programs: 32, avgPerEmployee: 2.1, color: "bg-green-500" },
    { name: "Functional", total: 1456, programs: 67, avgPerEmployee: 3.2, color: "bg-purple-500" },
    { name: "Technical", total: 1789, programs: 89, avgPerEmployee: 3.8, color: "bg-orange-500" }
  ];

  const departmentData = [
    {
      name: "Engineering",
      total: 456,
      completed: 398,
      pending: 58,
      rate: 87.3,
      teams: [
        { name: "Frontend", completed: 45, total: 52, rate: 86.5 },
        { name: "Backend", completed: 38, total: 42, rate: 90.5 },
        { name: "DevOps", completed: 23, total: 28, rate: 82.1 }
      ]
    },
    {
      name: "Sales",
      total: 234,
      completed: 201,
      pending: 33,
      rate: 85.9,
      teams: [
        { name: "Inside Sales", completed: 89, total: 102, rate: 87.3 },
        { name: "Field Sales", completed: 67, total: 78, rate: 85.9 }
      ]
    },
    {
      name: "Marketing",
      total: 189,
      completed: 167,
      pending: 22,
      rate: 88.4,
      teams: [
        { name: "Digital Marketing", completed: 45, total: 52, rate: 86.5 },
        { name: "Content", completed: 34, total: 38, rate: 89.5 }
      ]
    }
  ];

  const topPrograms = [
    { name: "Leadership Excellence", requests: 456, category: "Managerial", priority: "High" },
    { name: "Communication Skills", requests: 387, category: "Behavioral", priority: "High" },
    { name: "Data Analytics", requests: 342, category: "Technical", priority: "Medium" },
    { name: "Project Management", requests: 298, category: "Functional", priority: "High" },
    { name: "Time Management", requests: 267, category: "Behavioral", priority: "Medium" }
  ];

  const otherRequirements = [
    { id: 1, text: "Advanced Excel for financial modeling", employee: "John Doe", suggested: "Data Analytics", confidence: 85 },
    { id: 2, text: "Public speaking for client presentations", employee: "Jane Smith", suggested: "Communication Skills", confidence: 92 },
    { id: 3, text: "Agile methodology training", employee: "Mike Johnson", suggested: "Project Management", confidence: 78 },
    { id: 4, text: "Digital transformation strategies", employee: "Sarah Wilson", suggested: "Leadership Excellence", confidence: 71 }
  ];

  const toggleDepartment = (deptName: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptName)) {
      newExpanded.delete(deptName);
    } else {
      newExpanded.add(deptName);
    }
    setExpandedDepts(newExpanded);
  };

  const handleSendReminders = () => {
    toast({
      title: "Reminders Sent",
      description: `Reminder emails sent to ${overallStats.pending} pending employees`,
    });
  };

  const handleStartTNA = () => {
    toast({
      title: "TNA Process Initiated",
      description: "Training Needs Analysis process has been started successfully",
    });
  };

  const handleAIClassification = () => {
    if (!aiInput.trim()) return;
    
    // Mock AI classification
    const categories = ["Managerial", "Behavioral", "Functional", "Technical"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    setSelectedCategory(randomCategory);
    toast({
      title: "AI Classification Complete",
      description: `Requirement classified as: ${randomCategory}`,
    });
  };

  const handleViewAnalytics = () => {
    navigate('/training-needs/analytics');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Training Needs Analysis Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights from TNI data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSendReminders}>
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/create-cycle')}>
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">Create TNI Cycle</CardTitle>
            <p className="text-sm text-muted-foreground">Start a new training needs identification cycle</p>
          </CardHeader>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewAnalytics}>
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">View Analytics</CardTitle>
            <p className="text-sm text-muted-foreground">Comprehensive training needs analytics and insights</p>
          </CardHeader>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/enhanced-employee-tni')}>
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">Employee TNI</CardTitle>
            <p className="text-sm text-muted-foreground">Search and manage employee training needs</p>
          </CardHeader>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/training-needs/enhanced-manager-approval')}>
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">Manager Approval</CardTitle>
            <p className="text-sm text-muted-foreground">Reporting & Training Manager approvals</p>
          </CardHeader>
        </Card>
      </div>

      {/* Overall Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.completed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              out of {overallStats.totalEmployees.toLocaleString()} employees
            </p>
            <Progress value={overallStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.completionRate}%</div>
            <p className="text-xs text-green-600">
              Above {overallStats.threshold}% threshold
            </p>
            <Badge variant="secondary" className="mt-2">
              TNA Ready
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">233</div>
            <p className="text-xs text-muted-foreground">
              Across 4 categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Need to complete TNI
            </p>
            <Badge variant="outline" className="mt-2">
              {Math.round((overallStats.pending / overallStats.totalEmployees) * 100)}% remaining
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="programs">Program Analysis</TabsTrigger>
          <TabsTrigger value="ai-classification">AI Classification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryBreakdown.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {category.total} requests
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${category.color}`} />
                      <div className="flex-1 space-y-1">
                        <div className="text-sm">{category.programs} programs</div>
                        <div className="text-xs text-muted-foreground">
                          Avg: {category.avgPerEmployee} per employee
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Requested Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPrograms.map((program, index) => (
                  <div key={program.name} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">#{index + 1} {program.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {program.category} • {program.requests} requests
                      </div>
                    </div>
                    <Badge variant={program.priority === "High" ? "destructive" : "secondary"}>
                      {program.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Completion Status</CardTitle>
              <div className="flex gap-2">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleDepartment(dept.name)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedDepts.has(dept.name) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        {dept.completed}/{dept.total} ({dept.rate}%)
                      </div>
                      <Progress value={dept.rate} className="w-24" />
                    </div>
                  </div>
                  
                  {expandedDepts.has(dept.name) && (
                    <div className="ml-6 space-y-2">
                      {dept.teams.map((team) => (
                        <div key={team.name} className="flex items-center justify-between p-2 rounded border-l-2 border-muted">
                          <span className="text-sm">{team.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {team.completed}/{team.total} ({team.rate}%)
                            </span>
                            <Progress value={team.rate} className="w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {categoryBreakdown.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${category.color}`} />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{category.total}</div>
                      <div className="text-sm text-muted-foreground">Total Requests</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{category.programs}</div>
                      <div className="text-sm text-muted-foreground">Programs</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{category.avgPerEmployee}</div>
                    <div className="text-sm text-muted-foreground">Avg per Employee</div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Demand Analysis</CardTitle>
              <div className="flex gap-2">
                <Input placeholder="Search programs..." className="max-w-sm" />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPrograms.map((program, index) => (
                  <div key={program.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-1">
                      <div className="font-medium">#{index + 1} {program.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Category: {program.category}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold">{program.requests} requests</div>
                      <Badge variant={program.priority === "High" ? "destructive" : "secondary"}>
                        {program.priority} Priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-classification" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Classification Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Training Requirement Text</label>
                  <Textarea
                    placeholder="Enter the employee's custom training requirement..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                  />
                </div>
                <Button onClick={handleAIClassification} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Classify Requirement
                </Button>
                {selectedCategory && (
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="font-medium">Suggested Category: {selectedCategory}</div>
                    <div className="text-sm text-muted-foreground">
                      Confidence: {Math.floor(Math.random() * 20) + 80}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Classifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {otherRequirements.map((req) => (
                  <div key={req.id} className="p-3 rounded-lg border space-y-2">
                    <div className="text-sm">{req.text}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {req.employee}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{req.suggested}</Badge>
                        <span className="text-xs">{req.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
