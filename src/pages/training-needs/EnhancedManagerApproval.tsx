
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle, XCircle, Clock, Search, MessageSquare,
  User, BookOpen, Calendar, AlertCircle, Users, Shield
} from "lucide-react";

interface ApprovalRequest {
  id: number;
  employeeName: string;
  employeeId: string;
  department: string;
  reportingManager: string;
  program: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  justification: string;
  estimatedCost: string;
  duration: string;
  approvalLevel: "reporting_manager" | "training_manager";
  currentApprover?: string;
  rejectionReason?: string;
}

export default function EnhancedManagerApproval() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [approvalTypeFilter, setApprovalTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<"reporting_manager" | "training_manager">("reporting_manager");

  // Mock data for training requests
  const approvalRequests: ApprovalRequest[] = [
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      reportingManager: "Sarah Johnson",
      program: "Leadership Excellence",
      category: "Managerial",
      priority: "High",
      submittedDate: "2024-01-15",
      status: "pending",
      justification: "Need to develop leadership skills for upcoming team lead role",
      estimatedCost: "$2,500",
      duration: "5 days",
      approvalLevel: "reporting_manager",
      currentApprover: "Sarah Johnson"
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      department: "Sales",
      reportingManager: "Mike Chen",
      program: "Advanced Negotiation",
      category: "Functional",
      priority: "High",
      submittedDate: "2024-01-14",
      status: "approved",
      justification: "Required for handling enterprise clients",
      estimatedCost: "$1,800",
      duration: "3 days",
      approvalLevel: "training_manager",
      currentApprover: "Training Manager"
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      employeeId: "EMP003",
      department: "Marketing",
      reportingManager: "Lisa Rodriguez",
      program: "Data Analytics",
      category: "Technical",
      priority: "Medium",
      submittedDate: "2024-01-13",
      status: "rejected",
      rejectionReason: "Similar training completed recently",
      justification: "Need to analyze campaign performance better",
      estimatedCost: "$1,200",
      duration: "2 days",
      approvalLevel: "reporting_manager",
      currentApprover: "Lisa Rodriguez"
    },
    {
      id: 4,
      employeeName: "Sarah Wilson",
      employeeId: "EMP004",
      department: "Engineering",
      reportingManager: "Sarah Johnson",
      program: "Communication Skills",
      category: "Behavioral",
      priority: "Medium",
      submittedDate: "2024-01-12",
      status: "pending",
      justification: "Improve client presentation skills",
      estimatedCost: "$900",
      duration: "2 days",
      approvalLevel: "training_manager",
      currentApprover: "Training Manager"
    }
  ];

  const handleApprove = (requestId: number) => {
    toast({
      title: "Request Approved",
      description: `Training request #${requestId} has been approved successfully.`,
    });
  };

  const handleReject = (requestId: number) => {
    toast({
      title: "Request Rejected",
      description: `Training request #${requestId} has been rejected.`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getApprovalLevelBadge = (level: string) => {
    return level === "reporting_manager" ? (
      <Badge variant="outline" className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        Reporting Manager
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Shield className="h-3 w-3" />
        Training Manager
      </Badge>
    );
  };

  const filteredRequests = approvalRequests.filter(request => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesApprovalType = approvalTypeFilter === "all" || request.approvalLevel === approvalTypeFilter;
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter based on user role
    const matchesUserRole = userRole === "training_manager" || 
                           (userRole === "reporting_manager" && request.approvalLevel === "reporting_manager");
    
    return matchesStatus && matchesApprovalType && matchesSearch && matchesUserRole;
  });

  const stats = {
    total: filteredRequests.length,
    pending: filteredRequests.filter(r => r.status === "pending").length,
    approved: filteredRequests.filter(r => r.status === "approved").length,
    rejected: filteredRequests.filter(r => r.status === "rejected").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manager Approval Dashboard</h1>
          <p className="text-muted-foreground">
            Review and approve employee training requests
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={userRole} onValueChange={(value) => setUserRole(value as "reporting_manager" | "training_manager")}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reporting_manager">Reporting Manager</SelectItem>
              <SelectItem value="training_manager">Training Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Role Description */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            {userRole === "reporting_manager" ? (
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            ) : (
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            )}
            <div>
              <h3 className="font-semibold">
                {userRole === "reporting_manager" ? "Reporting Manager Role" : "Training Manager Role"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {userRole === "reporting_manager" 
                  ? "As a reporting manager, you approve training requests from your direct reports based on performance needs and business priorities."
                  : "As a training manager, you have the final approval authority for all training requests, focusing on budget, program availability, and organizational alignment."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              For your approval level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Ready for enrollment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              Declined requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Training Approval Requests</CardTitle>
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Search by employee name or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={approvalTypeFilter} onValueChange={setApprovalTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by approval type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approval Types</SelectItem>
                <SelectItem value="reporting_manager">Reporting Manager</SelectItem>
                <SelectItem value="training_manager">Training Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{request.employeeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.employeeId} • {request.department}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getApprovalLevelBadge(request.approvalLevel)}
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{request.program}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Category: {request.category} • Priority: {request.priority}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted: {request.submittedDate}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Reporting Manager: {request.reportingManager}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Cost:</span> {request.estimatedCost}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Duration:</span> {request.duration}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Current Approver:</span> {request.currentApprover}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Business Justification:</div>
                    <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                      {request.justification}
                    </div>
                  </div>

                  {request.status === "rejected" && request.rejectionReason && (
                    <div className="space-y-2">
                      <div className="font-medium text-sm text-destructive">Rejection Reason:</div>
                      <div className="text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        {request.rejectionReason}
                      </div>
                    </div>
                  )}

                  {request.status === "pending" && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Approval Comments:</label>
                        <Textarea placeholder="Add your comments (optional)..." />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApprove(request.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
