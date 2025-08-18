
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import {
  TrendingUp, Users, AlertTriangle, Award, Building, 
  UserCheck, Download, Filter, Search
} from "lucide-react";

export default function TNAAnalytics() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("6m");

  // Mock data for analytics
  const overallStats = {
    totalNeeds: 1247,
    employeesWithGaps: 856,
    gapPercentage: 68.5,
    departmentsCovered: 12,
    superiorsInvolved: 45
  };

  const topSkillGaps = {
    functional: [
      { skill: "Project Management", count: 234, percentage: 18.8 },
      { skill: "Data Analysis", count: 189, percentage: 15.2 },
      { skill: "Business Process Optimization", count: 156, percentage: 12.5 },
      { skill: "Financial Planning", count: 142, percentage: 11.4 },
      { skill: "Strategic Planning", count: 128, percentage: 10.3 }
    ],
    technical: [
      { skill: "Python Programming", count: 198, percentage: 15.9 },
      { skill: "Cloud Computing (AWS)", count: 176, percentage: 14.1 },
      { skill: "Machine Learning", count: 165, percentage: 13.2 },
      { skill: "Database Management", count: 143, percentage: 11.5 },
      { skill: "Cybersecurity", count: 134, percentage: 10.7 }
    ],
    behavioral: [
      { skill: "Leadership Development", count: 267, percentage: 21.4 },
      { skill: "Communication Skills", count: 234, percentage: 18.8 },
      { skill: "Team Collaboration", count: 198, percentage: 15.9 },
      { skill: "Time Management", count: 176, percentage: 14.1 },
      { skill: "Emotional Intelligence", count: 165, percentage: 13.2 }
    ]
  };

  const departmentData = [
    { 
      name: "Engineering", 
      employees: 245, 
      needsIdentified: 387, 
      avgNeedsPerEmployee: 1.58,
      topNeed: "Technical Skills",
      gapPercentage: 72
    },
    { 
      name: "Sales", 
      employees: 156, 
      needsIdentified: 234, 
      avgNeedsPerEmployee: 1.50,
      topNeed: "Communication Skills",
      gapPercentage: 65
    },
    { 
      name: "Marketing", 
      employees: 89, 
      needsIdentified: 145, 
      avgNeedsPerEmployee: 1.63,
      topNeed: "Data Analysis",
      gapPercentage: 78
    },
    { 
      name: "HR", 
      employees: 34, 
      needsIdentified: 67, 
      avgNeedsPerEmployee: 1.97,
      topNeed: "Leadership Development",
      gapPercentage: 85
    },
    { 
      name: "Finance", 
      employees: 67, 
      needsIdentified: 89, 
      avgNeedsPerEmployee: 1.33,
      topNeed: "Financial Planning",
      gapPercentage: 58
    }
  ];

  const managerData = [
    { name: "Sarah Johnson", department: "Engineering", needsIdentified: 45, teamSize: 12, efficiency: 3.75 },
    { name: "Mike Chen", department: "Sales", needsIdentified: 38, teamSize: 15, efficiency: 2.53 },
    { name: "Lisa Rodriguez", department: "Marketing", needsIdentified: 34, teamSize: 8, efficiency: 4.25 },
    { name: "David Thompson", department: "HR", needsIdentified: 28, teamSize: 6, efficiency: 4.67 },
    { name: "Jennifer Wang", department: "Finance", needsIdentified: 26, teamSize: 9, efficiency: 2.89 }
  ];

  const chartColors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Training Needs Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into organizational training requirements
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Training Needs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalNeeds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {overallStats.departmentsCovered} departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees with Gaps</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.employeesWithGaps}</div>
            <p className="text-xs text-muted-foreground">
              {overallStats.gapPercentage}% of total workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gap Coverage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.gapPercentage}%</div>
            <p className="text-xs text-green-600">
              Above industry average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.departmentsCovered}</div>
            <p className="text-xs text-muted-foreground">
              Active in analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers Involved</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.superiorsInvolved}</div>
            <p className="text-xs text-muted-foreground">
              Identifying team needs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skill-gaps">Skill Gaps</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="managers">Manager Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Training Needs Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Functional', value: 35, color: '#3b82f6' },
                          { name: 'Technical', value: 40, color: '#22c55e' },
                          { name: 'Behavioral', value: 25, color: '#f59e0b' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Functional', value: 35, color: '#3b82f6' },
                          { name: 'Technical', value: 40, color: '#22c55e' },
                          { name: 'Behavioral', value: 25, color: '#f59e0b' }
                        ].map((entry, index) => (
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
                <CardTitle>Department vs Training Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="needsIdentified" fill="#3b82f6" name="Training Needs" />
                      <Bar dataKey="employees" fill="#22c55e" name="Employees" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skill-gaps" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Functional Gaps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSkillGaps.functional.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">#{index + 1} {skill.skill}</div>
                      <div className="text-sm text-muted-foreground">
                        {skill.count} employees ({skill.percentage}%)
                      </div>
                    </div>
                    <Badge variant="outline">{skill.percentage}%</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Technical Gaps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSkillGaps.technical.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">#{index + 1} {skill.skill}</div>
                      <div className="text-sm text-muted-foreground">
                        {skill.count} employees ({skill.percentage}%)
                      </div>
                    </div>
                    <Badge variant="secondary">{skill.percentage}%</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Behavioral Gaps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSkillGaps.behavioral.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">#{index + 1} {skill.skill}</div>
                      <div className="text-sm text-muted-foreground">
                        {skill.count} employees ({skill.percentage}%)
                      </div>
                    </div>
                    <Badge variant="destructive">{skill.percentage}%</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Training Needs Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{dept.name}</h4>
                      <Badge variant={dept.gapPercentage > 70 ? "destructive" : "secondary"}>
                        {dept.gapPercentage}% gap coverage
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Employees:</span>
                        <div className="font-medium">{dept.employees}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Needs Identified:</span>
                        <div className="font-medium">{dept.needsIdentified}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg per Employee:</span>
                        <div className="font-medium">{dept.avgNeedsPerEmployee}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Top Need:</span>
                        <div className="font-medium">{dept.topNeed}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manager Performance in Identifying Team Needs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {managerData.map((manager, index) => (
                  <div key={manager.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">#{index + 1} {manager.name}</h4>
                        <p className="text-sm text-muted-foreground">{manager.department}</p>
                      </div>
                      <Badge variant="outline">
                        {manager.efficiency} needs/employee
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Needs Identified:</span>
                        <div className="font-medium">{manager.needsIdentified}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Team Size:</span>
                        <div className="font-medium">{manager.teamSize}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efficiency:</span>
                        <div className="font-medium">{manager.efficiency} avg</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
