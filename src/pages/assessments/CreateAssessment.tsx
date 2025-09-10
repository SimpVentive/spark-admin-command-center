import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({
    title: "",
    description: "",
    type: "",
    timeLimit: "",
    passingScore: 70,
    maxAttempts: 3,
    questionSource: "existing", // existing, new, or mixed
    selectedQuestions: [],
    newQuestions: [],
    randomizeQuestions: false,
    randomizeOptions: false
  });

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveAssessment = () => {
    toast({
      title: "Assessment Created",
      description: `${assessmentData.title} has been created successfully!`,
    });
    navigate("/assessments");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Assessment</h1>
          <p className="text-muted-foreground">Step {currentStep} of 5</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/assessments")}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Creation Wizard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium">Basic Information</h3>
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
                    <SelectItem value="certification">Certification Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium">Assessment Settings</h3>
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

              <div className="space-y-4">
                <Label>Randomization Options</Label>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="randomizeQuestions"
                        checked={assessmentData.randomizeQuestions}
                        onCheckedChange={(checked) => setAssessmentData({...assessmentData, randomizeQuestions: !!checked})}
                      />
                      <Label htmlFor="randomizeQuestions">Randomize question order</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="randomizeOptions"
                        checked={assessmentData.randomizeOptions}
                        onCheckedChange={(checked) => setAssessmentData({...assessmentData, randomizeOptions: !!checked})}
                      />
                      <Label htmlFor="randomizeOptions">Randomize answer options</Label>
                    </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium">Question Source</h3>
              <div className="space-y-2">
                <Label>Choose how to add questions:</Label>
                <Select value={assessmentData.questionSource} onValueChange={(value) => setAssessmentData({...assessmentData, questionSource: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing">Use existing questions from Question Bank</SelectItem>
                    <SelectItem value="new">Create new questions</SelectItem>
                    <SelectItem value="mixed">Mix of existing and new questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {assessmentData.questionSource === "existing" && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You will be able to select questions from the Question Bank in the next step.
                    You can filter by competency, program, and difficulty level.
                  </p>
                </div>
              )}

              {assessmentData.questionSource === "new" && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You will create new questions in the next step. These questions will be added to the Question Bank
                    and can be reused in future assessments.
                  </p>
                </div>
              )}

              {assessmentData.questionSource === "mixed" && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You can select existing questions from the Question Bank and create new ones.
                    This gives you maximum flexibility in assessment creation.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-medium">Select Questions</h3>
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground">
                  Question selection interface will be implemented here.
                  This will include filters by competency, program, difficulty level, and question type.
                </p>
                <div className="mt-4">
                  <Button onClick={() => navigate("/assessments/questions")}>
                    Go to Question Bank
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="font-medium">Review and Create</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Title:</strong> {assessmentData.title}</div>
                <div><strong>Type:</strong> {assessmentData.type}</div>
                <div><strong>Time Limit:</strong> {assessmentData.timeLimit} minutes</div>
                <div><strong>Passing Score:</strong> {assessmentData.passingScore}%</div>
                <div><strong>Max Attempts:</strong> {assessmentData.maxAttempts}</div>
                <div><strong>Question Source:</strong> {assessmentData.questionSource}</div>
                <div><strong>Randomize Questions:</strong> {assessmentData.randomizeQuestions ? "Yes" : "No"}</div>
                <div><strong>Randomize Options:</strong> {assessmentData.randomizeOptions ? "Yes" : "No"}</div>
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
            
            {currentStep === 5 ? (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAssessment;