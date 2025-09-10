
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Clock, Users, FileText, BarChart, Target, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Assessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({
    title: "",
    description: "",
    type: "",
    timeLimit: "",
    passingScore: 70,
    maxAttempts: 3,
    questions: []
  });
  const handleCreateAssessment = () => {
    setIsCreateDialogOpen(true);
    setCurrentStep(1);
    setAssessmentData({
      title: "",
      description: "",
      type: "",
      timeLimit: "",
      passingScore: 70,
      maxAttempts: 3,
      questions: []
    });
  };

  const handleSaveAssessment = () => {
    toast({
      title: "Assessment Created",
      description: `${assessmentData.title} has been created successfully!`,
    });
    setIsCreateDialogOpen(false);
    console.log("Assessment data:", assessmentData);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleCreateAssessment}>
              <Plus className="h-4 w-4" />
              Create Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Assessment - Step {currentStep} of 3</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assessment Title</Label>
                    <Input
                      id="title"
                      value={assessmentData.title}
                      onChange={(e) => setAssessmentData({...assessmentData, title: e.target.value})}
                      placeholder="Enter assessment title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={assessmentData.description}
                      onChange={(e) => setAssessmentData({...assessmentData, description: e.target.value})}
                      placeholder="Describe the assessment"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Assessment Type</Label>
                    <Select value={assessmentData.type} onValueChange={(value) => setAssessmentData({...assessmentData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="survey">Survey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        value={assessmentData.timeLimit}
                        onChange={(e) => setAssessmentData({...assessmentData, timeLimit: e.target.value})}
                        placeholder="e.g., 30"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passingScore">Passing Score (%)</Label>
                      <Input
                        id="passingScore"
                        type="number"
                        value={assessmentData.passingScore}
                        onChange={(e) => setAssessmentData({...assessmentData, passingScore: parseInt(e.target.value)})}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Maximum Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={assessmentData.maxAttempts}
                      onChange={(e) => setAssessmentData({...assessmentData, maxAttempts: parseInt(e.target.value)})}
                      min="1"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Assessment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {assessmentData.title}</div>
                    <div><strong>Type:</strong> {assessmentData.type}</div>
                    <div><strong>Time Limit:</strong> {assessmentData.timeLimit} minutes</div>
                    <div><strong>Passing Score:</strong> {assessmentData.passingScore}%</div>
                    <div><strong>Max Attempts:</strong> {assessmentData.maxAttempts}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="addQuestions" />
                      <Label htmlFor="addQuestions">Add questions after creation</Label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep === 3 ? (
                  <Button onClick={handleSaveAssessment}>
                    Create Assessment
                  </Button>
                ) : (
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
