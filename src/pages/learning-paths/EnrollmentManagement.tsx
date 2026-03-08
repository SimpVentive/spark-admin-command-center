import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/reportExport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Users, 
  Upload, 
  Calendar, 
  Bell, 
  Filter,
  UserPlus,
  Download,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const EnrollmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPath, setSelectedPath] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");

  const learningPaths = [
    { id: "1", title: "Digital Marketing Mastery", enrolled: 245, capacity: 300 },
    { id: "2", title: "Leadership Excellence", enrolled: 156, capacity: 200 },
    { id: "3", title: "Data Science Fundamentals", enrolled: 324, capacity: 400 }
  ];

  const enrollments = [
    {
      id: "1",
      learnerName: "John Doe",
      email: "john.doe@company.com",
      learningPath: "Digital Marketing Mastery",
      enrolledDate: "2024-01-15",
      status: "active",
      progress: 65,
      lastActivity: "2024-01-20",
      completion: null
    },
    {
      id: "2", 
      learnerName: "Sarah Johnson",
      email: "sarah.j@company.com",
      learningPath: "Leadership Excellence",
      enrolledDate: "2024-01-10",
      status: "completed",
      progress: 100,
      lastActivity: "2024-01-18",
      completion: "2024-01-18"
    },
    {
      id: "3",
      learnerName: "Mike Chen",
      email: "mike.chen@company.com", 
      learningPath: "Data Science Fundamentals",
      enrolledDate: "2024-01-20",
      status: "pending",
      progress: 0,
      lastActivity: null,
      completion: null
    },
    {
      id: "4",
      learnerName: "Emily Davis",
      email: "emily.d@company.com",
      learningPath: "Digital Marketing Mastery", 
      enrolledDate: "2024-01-12",
      status: "overdue",
      progress: 30,
      lastActivity: "2024-01-14",
      completion: null
    }
  ];

  const cohorts = [
    {
      id: "1",
      name: "Q1 Marketing Team",
      learningPath: "Digital Marketing Mastery", 
      startDate: "2024-02-01",
      endDate: "2024-04-30",
      enrolled: 25,
      capacity: 30,
      status: "active"
    },
    {
      id: "2",
      name: "Leadership Development Batch 2",
      learningPath: "Leadership Excellence",
      startDate: "2024-01-15", 
      endDate: "2024-05-15",
      enrolled: 20,
      capacity: 25,
      status: "active"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'dropped': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800", 
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      dropped: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Enrollment Management</h1>
          <p className="text-muted-foreground">Manage learner enrollments and cohorts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate('/users/bulk-enrollment')}>
            <Upload className="h-4 w-4" />
            Bulk Enroll
          </Button>
          <Button className="gap-2" onClick={() => toast({ title: "Enroll Learner", description: "Select a learning path, then search and add a learner." })}>
            <UserPlus className="h-4 w-4" />
            Enroll Learner
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments.filter(e => e.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently learning</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments.filter(e => e.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Finished courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments.filter(e => e.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="enrollments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollments">Individual Enrollments</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Enrollment</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Management</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="space-y-4">
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
            <Select value={selectedPath} onValueChange={setSelectedPath}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Learning Paths" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Learning Paths</SelectItem>
                {learningPaths.map(path => (
                  <SelectItem key={path.id} value={path.id}>{path.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={() => {
              const rows = enrollments.map(e => [e.learner, e.email, e.learningPath, e.status, `${e.progress}%`, e.enrolledDate]);
              generatePDF(
                { title: "Enrollment Report", subtitle: "Learning Path Enrollments" },
                [{ label: "Total", value: String(enrollments.length) }],
                [{ title: "Enrollments", headers: ["Learner", "Email", "Path", "Status", "Progress", "Enrolled"], rows }]
              );
              toast({ title: "Report exported" });
            }}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Enrollments Table */}
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Learning Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{enrollment.learnerName}</div>
                          <div className="text-sm text-muted-foreground">{enrollment.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment.learningPath}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(enrollment.status)}
                          {getStatusBadge(enrollment.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{enrollment.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment.enrolledDate}</TableCell>
                      <TableCell>{enrollment.lastActivity || 'Never'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            <DropdownMenuItem>Extend Deadline</DropdownMenuItem>
                            <DropdownMenuItem>Unenroll</DropdownMenuItem>
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

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Enrollment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">CSV Upload</h3>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a CSV file with learner information
                    </p>
                    <Button variant="outline" size="sm">Choose File</Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Download Template
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Team Selection</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select learning path" />
                    </SelectTrigger>
                    <SelectContent>
                      {learningPaths.map(path => (
                        <SelectItem key={path.id} value={path.id}>{path.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="w-full">Enroll Team</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Cohort
            </Button>
          </div>
          
          <div className="grid gap-4">
            {cohorts.map((cohort) => (
              <Card key={cohort.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{cohort.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{cohort.learningPath}</p>
                    </div>
                    {getStatusBadge(cohort.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Start: {cohort.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>End: {cohort.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{cohort.enrolled}/{cohort.capacity} enrolled</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Manage</Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Send Notifications</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Learners</SelectItem>
                      <SelectItem value="active">Active Learners</SelectItem>
                      <SelectItem value="overdue">Overdue Learners</SelectItem>
                      <SelectItem value="completed">Completed Learners</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reminder">Progress Reminder</SelectItem>
                      <SelectItem value="deadline">Deadline Warning</SelectItem>
                      <SelectItem value="completion">Completion Congratulations</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full gap-2">
                    <Mail className="h-4 w-4" />
                    Send Notification
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Automated Reminders</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Overdue Reminder</p>
                        <p className="text-sm text-muted-foreground">Daily for overdue learners</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Active</Badge>
                        <Button variant="ghost" size="sm">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Completion Reminder</p>
                        <p className="text-sm text-muted-foreground">3 days before deadline</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Active</Badge>
                        <Button variant="ghost" size="sm">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configure Reminders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnrollmentManagement;