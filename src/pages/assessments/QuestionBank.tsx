import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  difficulty_level: string;
  points: number;
  competency?: { name: string };
  program?: { title: string };
  options?: { option_text: string; is_correct: boolean }[];
}

interface Competency {
  id: string;
  name: string;
}

interface Program {
  id: string;
  title: string;
}

const QuestionBank = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompetency, setFilterCompetency] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterType, setFilterType] = useState("all");
  
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
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
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
        description: "Question created successfully!",
      });

      setIsCreateDialogOpen(false);
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

  const updateOption = (index: number, field: string, value: any) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'bg-blue-100 text-blue-800';
      case 'true_false': return 'bg-green-100 text-green-800';
      case 'essay': return 'bg-purple-100 text-purple-800';
      case 'short_answer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
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
          <h1 className="text-2xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground">Manage your assessment questions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Question</DialogTitle>
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
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuestion}>
                  Create Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
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

      {/* Questions List */}
      <div className="grid gap-4">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No questions found matching your criteria.
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardContent className="p-6">
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredQuestions.length} of {questions.length} questions
      </div>
    </div>
  );
};

export default QuestionBank;