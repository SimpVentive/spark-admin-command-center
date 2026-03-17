import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, Plus, Trash2, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyScope } from "@/hooks/useCompanyScope";

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { scopeData } = useCompanyScope();
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

  // Question Bank integration states
  const [questions, setQuestions] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompetency, setFilterCompetency] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_type: "multiple_choice",
    competency_id: "",
    program_id: "",
    difficulty_level: "basic",
    correct_answer: "",
    explanation: "",
    points: 1,
    options: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false }
    ]
  });

  useEffect(() => {
    fetchQuestions();
    fetchCompetencies();
    fetchPrograms();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('question_bank')
        .select(`
          *,
          competency:competencies(name),
          program:programs(title),
          options:question_options(option_text, is_correct)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchCompetencies = async () => {
    try {
      const { data, error } = await supabase
        .from('competencies')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setCompetencies(data || []);
    } catch (error) {
      console.error('Error fetching competencies:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('id, title');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveAssessment = async () => {
    if (!assessmentData.title || !assessmentData.type) {
      toast({ title: "Error", description: "Title and type are required", variant: "destructive" });
      return;
    }
    try {
      const { data: assessment, error } = await supabase.from('assessments').insert([scopeData({
        title: assessmentData.title,
        assessment_type: assessmentData.type,
        time_limit_minutes: assessmentData.timeLimit ? parseInt(assessmentData.timeLimit) : null,
        passing_score: assessmentData.passingScore,
        max_attempts: assessmentData.maxAttempts,
      })]).select().single();
      if (error) throw error;

      // Link selected questions
      if (assessment && assessmentData.selectedQuestions.length > 0) {
        const questionLinks = assessmentData.selectedQuestions.map((q: any, i: number) => ({
          assessment_id: assessment.id,
          question_id: q.id,
          question_order: i + 1,
          points: q.points || 1,
        }));
        await supabase.from('assessment_questions').insert(questionLinks);
      }

      toast({ title: "Assessment Created", description: `${assessmentData.title} has been created successfully!` });
      navigate("/assessments");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateQuestion = async () => {
    try {
      const questionData = {
        question_text: newQuestion.question_text,
        question_type: newQuestion.question_type,
        competency_id: newQuestion.competency_id || null,
        program_id: newQuestion.program_id || null,
        difficulty_level: newQuestion.difficulty_level,
        correct_answer: newQuestion.question_type === 'true_false' ? newQuestion.correct_answer : '',
        explanation: newQuestion.explanation,
        points: newQuestion.points
      };

      const { data: questionResult, error: questionError } = await supabase
        .from('question_bank')
        .insert(questionData)
        .select()
        .single();

      if (questionError) throw questionError;

      // Insert options for multiple choice questions
      if (newQuestion.question_type === 'multiple_choice' && questionResult) {
        const optionsToInsert = newQuestion.options
          .filter(opt => opt.text.trim())
          .map((opt, index) => ({
            question_id: questionResult.id,
            option_text: opt.text,
            option_order: index + 1,
            is_correct: opt.is_correct
          }));

        if (optionsToInsert.length > 0) {
          const { error: optionsError } = await supabase
            .from('question_options')
            .insert(optionsToInsert);

          if (optionsError) throw optionsError;
        }
      }

      toast({
        title: "Success",
        description: "Question added to Question Bank!",
      });

      setIsAddQuestionDialogOpen(false);
      resetNewQuestion();
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: "Error",
        description: "Failed to create question",
        variant: "destructive",
      });
    }
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      question_text: "",
      question_type: "multiple_choice",
      competency_id: "",
      program_id: "",
      difficulty_level: "basic",
      correct_answer: "",
      explanation: "",
      points: 1,
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false }
      ]
    });
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    
    // If marking as correct, unmark others
    if (field === 'is_correct' && value) {
      updatedOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }
    
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const toggleQuestionSelection = (questionId) => {
    const selectedIds = assessmentData.selectedQuestions.map(q => q.id);
    if (selectedIds.includes(questionId)) {
      setAssessmentData({
        ...assessmentData,
        selectedQuestions: assessmentData.selectedQuestions.filter(q => q.id !== questionId)
      });
    } else {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        setAssessmentData({
          ...assessmentData,
          selectedQuestions: [...assessmentData.selectedQuestions, question]
        });
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'multiple_choice': return 'bg-blue-100 text-blue-800';
      case 'true_false': return 'bg-green-100 text-green-800';
      case 'essay': return 'bg-purple-100 text-purple-800';
      case 'short_answer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'L1':
      case 'basic': return 'bg-green-100 text-green-800';
      case 'L2':
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'L3':
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'L4':
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompetency = filterCompetency === "all" || question.competency?.name === filterCompetency;
    const matchesProgram = filterProgram === "all" || question.program?.title === filterProgram;
    const matchesLevel = filterLevel === "all" || question.difficulty_level === filterLevel;
    const matchesType = filterType === "all" || question.question_type === filterType;
    
    return matchesSearch && matchesCompetency && matchesProgram && matchesLevel && matchesType;
  });

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
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Select Questions from Question Bank</h3>
                <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Question Bank
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Question to Question Bank</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="questionText">Question</Label>
                        <Textarea
                          id="questionText"
                          value={newQuestion.question_text}
                          onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                          placeholder="Enter your question"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select 
                            value={newQuestion.question_type} 
                            onValueChange={(value) => setNewQuestion({...newQuestion, question_type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="true_false">True/False</SelectItem>
                              <SelectItem value="essay">Essay</SelectItem>
                              <SelectItem value="short_answer">Short Answer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Difficulty Level</Label>
                          <Select 
                            value={newQuestion.difficulty_level} 
                            onValueChange={(value) => setNewQuestion({...newQuestion, difficulty_level: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="L1">L1 (Basic)</SelectItem>
                              <SelectItem value="L2">L2 (Intermediate)</SelectItem>
                              <SelectItem value="L3">L3 (Advanced)</SelectItem>
                              <SelectItem value="L4">L4 (Expert)</SelectItem>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Competency</Label>
                          <Select 
                            value={newQuestion.competency_id} 
                            onValueChange={(value) => setNewQuestion({...newQuestion, competency_id: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select competency (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {competencies.map(comp => (
                                <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Program</Label>
                          <Select 
                            value={newQuestion.program_id} 
                            onValueChange={(value) => setNewQuestion({...newQuestion, program_id: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select program (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {programs.map(prog => (
                                <SelectItem key={prog.id} value={prog.id}>{prog.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {newQuestion.question_type === "multiple_choice" && (
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          {newQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={option.text}
                                onChange={(e) => updateOption(index, 'text', e.target.value)}
                                placeholder={`Option ${index + 1}`}
                              />
                              <Checkbox
                                checked={option.is_correct}
                                onCheckedChange={(checked) => updateOption(index, 'is_correct', checked)}
                              />
                              <Label className="text-sm">Correct</Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {newQuestion.question_type === "true_false" && (
                        <div className="space-y-2">
                          <Label>Correct Answer</Label>
                          <Select 
                            value={newQuestion.correct_answer} 
                            onValueChange={(value) => setNewQuestion({...newQuestion, correct_answer: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">True</SelectItem>
                              <SelectItem value="false">False</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="explanation">Explanation (Optional)</Label>
                        <Textarea
                          id="explanation"
                          value={newQuestion.explanation}
                          onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                          placeholder="Explain the correct answer"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="points">Points</Label>
                        <Input
                          id="points"
                          type="number"
                          value={newQuestion.points}
                          onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value) || 1})}
                          min="1"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddQuestionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateQuestion}>
                          Add to Question Bank
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Filter Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search questions..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select value={filterCompetency} onValueChange={setFilterCompetency}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Competencies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Competencies</SelectItem>
                        {competencies.map(comp => (
                          <SelectItem key={comp.id} value={comp.name}>{comp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterProgram} onValueChange={setFilterProgram}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Programs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        {programs.map(prog => (
                          <SelectItem key={prog.id} value={prog.title}>{prog.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="L1">L1 (Basic)</SelectItem>
                        <SelectItem value="L2">L2 (Intermediate)</SelectItem>
                        <SelectItem value="L3">L3 (Advanced)</SelectItem>
                        <SelectItem value="L4">L4 (Expert)</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="short_answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Questions Summary */}
              {assessmentData.selectedQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Selected Questions ({assessmentData.selectedQuestions.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {assessmentData.selectedQuestions.map((question) => (
                        <div key={question.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm truncate flex-1">{question.question_text}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleQuestionSelection(question.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Available Questions */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredQuestions.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No questions found matching your criteria.
                    </CardContent>
                  </Card>
                ) : (
                  filteredQuestions.map((question) => (
                    <Card key={question.id} className={`cursor-pointer transition-colors ${
                      assessmentData.selectedQuestions.find(q => q.id === question.id) 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-accent'
                    }`} onClick={() => toggleQuestionSelection(question.id)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getTypeColor(question.question_type)}>
                                {question.question_type.replace('_', ' ')}
                              </Badge>
                              <Badge className={getLevelColor(question.difficulty_level)}>
                                {question.difficulty_level}
                              </Badge>
                              {question.competency && (
                                <Badge variant="outline">
                                  {question.competency.name}
                                </Badge>
                              )}
                              {question.program && (
                                <Badge variant="outline">
                                  {question.program.title}
                                </Badge>
                              )}
                              <Badge variant="secondary">
                                {question.points} points
                              </Badge>
                            </div>
                            <p className="text-sm font-medium mb-2">{question.question_text}</p>
                            {question.options && question.options.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Options: {question.options.map((opt, i) => `${i + 1}. ${opt.option_text}${opt.is_correct ? ' ✓' : ''}`).join(' | ')}
                              </div>
                            )}
                          </div>
                          <Checkbox 
                            checked={!!assessmentData.selectedQuestions.find(q => q.id === question.id)}
                            onChange={() => toggleQuestionSelection(question.id)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {filteredQuestions.length} available questions. {assessmentData.selectedQuestions.length} selected.
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
                <div><strong>Questions Selected:</strong> {assessmentData.selectedQuestions.length}</div>
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