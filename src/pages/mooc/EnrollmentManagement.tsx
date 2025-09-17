import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EnrollmentDetailsDialog } from "@/components/mooc/EnrollmentDetailsDialog";
import { SendReminderDialog } from "@/components/mooc/SendReminderDialog";

const EnrollmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const enrollmentStats = {
    totalEnrollments: 390,
    activeEnrollments: 234,
    completedThisMonth: 45,
    avgCompletionRate: 78
  };

  const enrollments = [
    {
      id: 1,
      employeeName: "Sarah Johnson",
      employeeId: "EMP001",
      department: "Marketing",
      course: "Digital Marketing Strategy",
      provider: "LinkedIn Learning",
      enrolledDate: "2024-01-15",
      dueDate: "2024-03-15",
      progress: 65,
      status: "in_progress",
      completionDate: null
    },
    {
      id: 2,
      employeeName: "Michael Chen",
      employeeId: "EMP002", 
      department: "Engineering",
      course: "Machine Learning Specialization",
      provider: "Coursera",
      enrolledDate: "2024-01-10",
      dueDate: "2024-03-10",
      progress: 100,
      status: "completed",
      completionDate: "2024-02-28"
    },
    {
      id: 3,
      employeeName: "Emily Rodriguez",
      employeeId: "EMP003",
      department: "Operations",
      course: "Project Management Professional",
      provider: "Coursera",
      enrolledDate: "2024-01-20",
      dueDate: "2024-02-20",
      progress: 30,
      status: "overdue",
      completionDate: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      case "in_progress":
        return <Clock className="w-3 h-3" />;
      case "overdue":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MOOC Enrollment Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage employee enrollments in MOOC courses and track progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Bulk Enroll
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentStats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learning</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentStats.activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Completions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentStats.completedThisMonth}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentStats.avgCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">Organization average</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name, course, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Enrollments</CardTitle>
          <CardDescription>
            Monitor progress and manage employee MOOC enrollments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{enrollment.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.employeeId} • {enrollment.department}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(enrollment.status)}>
                      {getStatusIcon(enrollment.status)}
                      <span className="ml-1 capitalize">{enrollment.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm">{enrollment.course}</p>
                      <p className="text-xs text-muted-foreground">{enrollment.provider}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {enrollment.status !== "completed" && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Enrolled: {new Date(enrollment.enrolledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {new Date(enrollment.dueDate).toLocaleDateString()}</span>
                        </div>
                        {enrollment.completionDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Completed: {new Date(enrollment.completionDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <EnrollmentDetailsDialog enrollment={enrollment} />
                  {enrollment.status === "overdue" && (
                    <SendReminderDialog enrollment={enrollment} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentManagement;