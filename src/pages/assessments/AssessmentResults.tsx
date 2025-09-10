import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Eye, Filter, BarChart3, Users, Clock, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AssessmentResults = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssessment, setFilterAssessment] = useState("");

  // Mock data - replace with actual API calls
  const assessmentResults = [
    {
      id: 1,
      participantName: "John Doe",
      participantEmail: "john.doe@company.com",
      assessmentTitle: "Leadership Skills Assessment",
      score: 85,
      passingScore: 70,
      status: "Passed",
      attemptNumber: 1,
      maxAttempts: 3,
      startedAt: "2024-01-15T10:00:00Z",
      completedAt: "2024-01-15T10:45:00Z",
      timeSpent: 45
    },
    {
      id: 2,
      participantName: "Jane Smith",
      participantEmail: "jane.smith@company.com",
      assessmentTitle: "Digital Marketing Pre-Test",
      score: 62,
      passingScore: 60,
      status: "Passed",
      attemptNumber: 2,
      maxAttempts: 1,
      startedAt: "2024-01-14T14:00:00Z",
      completedAt: "2024-01-14T14:30:00Z",
      timeSpent: 30
    },
    {
      id: 3,
      participantName: "Mike Johnson",
      participantEmail: "mike.johnson@company.com",
      assessmentTitle: "Project Management Certification Exam",
      score: 65,
      passingScore: 80,
      status: "Failed",
      attemptNumber: 1,
      maxAttempts: 2,
      startedAt: "2024-01-13T09:00:00Z",
      completedAt: "2024-01-13T11:00:00Z",
      timeSpent: 120
    },
    {
      id: 4,
      participantName: "Sarah Wilson",
      participantEmail: "sarah.wilson@company.com",
      assessmentTitle: "Leadership Skills Assessment",
      score: 0,
      passingScore: 70,
      status: "In Progress",
      attemptNumber: 1,
      maxAttempts: 3,
      startedAt: "2024-01-16T11:00:00Z",
      completedAt: null,
      timeSpent: 15
    }
  ];

  const stats = {
    totalAttempts: assessmentResults.length,
    totalParticipants: new Set(assessmentResults.map(r => r.participantEmail)).size,
    averageScore: Math.round(assessmentResults.filter(r => r.status !== "In Progress").reduce((acc, r) => acc + r.score, 0) / assessmentResults.filter(r => r.status !== "In Progress").length),
    passRate: Math.round((assessmentResults.filter(r => r.status === "Passed").length / assessmentResults.filter(r => r.status !== "In Progress").length) * 100)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportResults = () => {
    toast({
      title: "Export Started",
      description: "Assessment results are being exported to CSV...",
    });
  };

  const handleViewDetails = (resultId: number) => {
    toast({
      title: "Loading Details",
      description: "Opening detailed view for this assessment attempt...",
    });
  };

  const filteredResults = assessmentResults.filter(result => {
    const matchesSearch = 
      result.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.participantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || result.status === filterStatus;
    const matchesAssessment = !filterAssessment || result.assessmentTitle === filterAssessment;
    
    return matchesSearch && matchesStatus && matchesAssessment;
  });

  const uniqueAssessments = [...new Set(assessmentResults.map(r => r.assessmentTitle))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assessment Results</h1>
          <p className="text-muted-foreground">View and analyze assessment performance</p>
        </div>
        <Button onClick={handleExportResults} className="gap-2">
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">
              Assessment attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Unique participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Across all assessments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.passRate}%</div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search participants or assessments..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Passed">Passed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAssessment} onValueChange={setFilterAssessment}>
              <SelectTrigger>
                <SelectValue placeholder="All Assessments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Assessments</SelectItem>
                {uniqueAssessments.map(assessment => (
                  <SelectItem key={assessment} value={assessment}>{assessment}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempt</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.participantName}</div>
                      <div className="text-sm text-muted-foreground">{result.participantEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{result.assessmentTitle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {result.status === "In Progress" ? "—" : `${result.score}%`}
                      </span>
                      {result.status !== "In Progress" && (
                        <span className="text-sm text-muted-foreground">
                          / {result.passingScore}%
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {result.attemptNumber} / {result.maxAttempts}
                  </TableCell>
                  <TableCell>
                    {result.timeSpent} min
                  </TableCell>
                  <TableCell>
                    {result.completedAt 
                      ? new Date(result.completedAt).toLocaleDateString()
                      : "In Progress"
                    }
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(result.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredResults.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No assessment results found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {filteredResults.length} of {assessmentResults.length} results
      </div>
    </div>
  );
};

export default AssessmentResults;