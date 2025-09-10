
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Clock, Users, FileText, BarChart, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Assessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleCreateAssessment = () => {
    toast({
      title: "Create Assessment",
      description: "Opening assessment creation wizard...",
    });
    // Navigate to create assessment page when implemented
    console.log("Navigate to create assessment");
  };

  const handleViewResults = (assessmentId: number, assessmentTitle: string) => {
    toast({
      title: "View Results",
      description: `Loading results for ${assessmentTitle}...`,
    });
    console.log("View results for assessment:", assessmentId);
  };

  const handleEditAssessment = (assessmentId: number, assessmentTitle: string) => {
    toast({
      title: "Edit Assessment",
      description: `Opening editor for ${assessmentTitle}...`,
    });
    console.log("Edit assessment:", assessmentId);
  };

  const handleManageQuestionBank = () => {
    toast({
      title: "Question Bank",
      description: "Opening question bank management...",
    });
    console.log("Navigate to question bank");
  };

  const handleViewAnalytics = () => {
    toast({
      title: "Analytics Dashboard",
      description: "Loading detailed analytics...",
    });
    console.log("Navigate to analytics dashboard");
  };

  const assessments = [
    {
      id: 1,
      title: "Leadership Skills Assessment",
      type: "Quiz",
      questions: 25,
      timeLimit: 45,
      attempts: 3,
      passingScore: 70,
      completions: 142,
      avgScore: 78,
      status: "Active"
    },
    {
      id: 2,
      title: "Digital Marketing Pre-Test",
      type: "Survey",
      questions: 15,
      timeLimit: 30,
      attempts: 1,
      passingScore: 60,
      completions: 89,
      avgScore: 72,
      status: "Active"
    },
    {
      id: 3,
      title: "Project Management Certification Exam",
      type: "Exam",
      questions: 50,
      timeLimit: 120,
      attempts: 2,
      passingScore: 80,
      completions: 34,
      avgScore: 85,
      status: "Draft"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Quiz': return 'bg-blue-100 text-blue-800';
      case 'Survey': return 'bg-green-100 text-green-800';
      case 'Exam': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" 
      ? <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      : <Badge variant="secondary">Draft</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assessment Management</h1>
          <p className="text-muted-foreground">Create and manage assessments, quizzes, and exams</p>
        </div>
        <Button className="gap-2" onClick={handleCreateAssessment}>
          <Plus className="h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assessments..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-6">
        {assessments.map((assessment) => (
          <Card key={assessment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <Badge className={getTypeColor(assessment.type)}>{assessment.type}</Badge>
                    {getStatusBadge(assessment.status)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewResults(assessment.id, assessment.title)}
                  >
                    View Results
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleEditAssessment(assessment.id, assessment.title)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">{assessment.questions}</div>
                    <div className="text-muted-foreground">Questions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">{assessment.timeLimit}m</div>
                    <div className="text-muted-foreground">Time Limit</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">{assessment.passingScore}%</div>
                    <div className="text-muted-foreground">Pass Score</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">{assessment.completions}</div>
                    <div className="text-muted-foreground">Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">{assessment.avgScore}%</div>
                    <div className="text-muted-foreground">Avg Score</div>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{assessment.attempts}</div>
                  <div className="text-muted-foreground">Max Attempts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Question Bank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Multiple Choice Questions</span>
              <Badge variant="outline">245</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>True/False Questions</span>
              <Badge variant="outline">89</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Essay Questions</span>
              <Badge variant="outline">34</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Fill in the Blank</span>
              <Badge variant="outline">67</Badge>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleManageQuestionBank}>
              Manage Question Bank
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Assessments</span>
              <Badge variant="outline">{assessments.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Assessments</span>
              <Badge variant="outline">{assessments.filter(a => a.status === 'Active').length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Completions</span>
              <Badge variant="outline">{assessments.reduce((sum, a) => sum + a.completions, 0)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Score</span>
              <Badge variant="outline">
                {Math.round(assessments.reduce((sum, a) => sum + a.avgScore, 0) / assessments.length)}%
              </Badge>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleViewAnalytics}>
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessments;
