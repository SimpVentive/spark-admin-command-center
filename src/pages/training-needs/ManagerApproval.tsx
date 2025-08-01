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
  CheckCircle, XCircle, Clock, Search, Filter, MessageSquare,
  User, BookOpen, Calendar, AlertCircle
} from "lucide-react";

export default function ManagerApproval() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for training requests
  const trainingRequests = [
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      program: "Leadership Excellence",
      category: "Managerial",
      priority: "High",
      submittedDate: "2024-01-15",
      status: "pending",
      justification: "Need to develop leadership skills for upcoming team lead role",
      estimatedCost: "$2,500",
      duration: "5 days"
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      department: "Sales",
      program: "Advanced Negotiation",
      category: "Functional",
      priority: "High",
      submittedDate: "2024-01-14",
      status: "approved",
      justification: "Required for handling enterprise clients",
      estimatedCost: "$1,800",
      duration: "3 days"
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      employeeId: "EMP003",
      department: "Marketing",
      program: "Data Analytics",
      category: "Technical",
      priority: "Medium",
      submittedDate: "2024-01-13",
      status: "rejected",
      rejectionReason: "Similar training completed recently",
      justification: "Need to analyze campaign performance better",
      estimatedCost: "$1,200",
      duration: "2 days"
    },
    {
      id: 4,
      employeeName: "Sarah Wilson",
      employeeId: "EMP004",
      department: "Engineering",
      program: "Communication Skills",
      category: "Behavioral",
      priority: "Medium",
      submittedDate: "2024-01-12",
      status: "pending",
      justification: "Improve client presentation skills",
      estimatedCost: "$900",
      duration: "2 days"
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
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredRequests = trainingRequests.filter(request => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.program.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: trainingRequests.length,
    pending: trainingRequests.filter(r => r.status === "pending").length,
    approved: trainingRequests.filter(r => r.status === "approved").length,
    rejected: trainingRequests.filter(r => r.status === "rejected").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manager Approval</h1>
          <p className="text-muted-foreground">
            Review and approve employee training requests
          </p>
        </div>
      </div>

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
              All time submissions
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
              Awaiting approval
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Training Requests</CardTitle>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee name or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
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
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Cost:</span> {request.estimatedCost}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Duration:</span> {request.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Justification:</div>
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
                    <div className="flex gap-2 pt-2">
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