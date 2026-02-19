import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Level1ReactionForm from "@/components/kirkpatrick/Level1ReactionForm";
import Level2LearningForm from "@/components/kirkpatrick/Level2LearningForm";
import Level3BehaviorForm from "@/components/kirkpatrick/Level3BehaviorForm";
import Level4ResultsForm from "@/components/kirkpatrick/Level4ResultsForm";
import KirkpatrickCalculator from "@/components/kirkpatrick/KirkpatrickCalculator";
import { ClipboardList, BarChart2, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const KirkpatrickEvaluations = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      fetchEnrollments();
      fetchPrograms();
    } else {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      console.log('Fetching enrollments for user:', user?.id);
      const { data, error } = await supabase
        .from('user_program_enrollments')
        .select(`
          *,
          programs!program_id (
            id,
            title,
            outline
          )
        `)
        .eq('status', 'enrolled');

      console.log('Enrollments response:', { data, error });
      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleFormSubmit = () => {
    toast({
      title: "Evaluation Submitted",
      description: "Thank you for your feedback!",
    });
    // Refresh the calculator data
    window.location.reload();
  };

  const selectedEnrollmentData = enrollments.find(e => e.id === selectedEnrollment);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Kirkpatrick Evaluations</h1>
            <p className="text-muted-foreground">Measure training effectiveness across all four levels</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LogIn className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              You need to be logged in to access your Kirkpatrick evaluations.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Kirkpatrick Evaluations</h1>
          <p className="text-muted-foreground">Measure training effectiveness across all four levels</p>
        </div>
      </div>

      <Tabs defaultValue="forms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forms">Evaluation Forms</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          {/* Enrollment Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Training Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Enrollments</label>
                  <Select value={selectedEnrollment} onValueChange={setSelectedEnrollment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an enrollment to evaluate" />
                    </SelectTrigger>
                    <SelectContent>
                      {enrollments.map((enrollment) => (
                        <SelectItem key={enrollment.id} value={enrollment.id}>
                          {enrollment.programs?.title || 'Unknown Program'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedEnrollmentData && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium">{selectedEnrollmentData.programs?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnrollmentData.programs?.outline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enrolled: {new Date(selectedEnrollmentData.enrolled_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedEnrollment && (
            <Tabs defaultValue="level1" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="level1">Level 1</TabsTrigger>
                <TabsTrigger value="level2">Level 2</TabsTrigger>
                <TabsTrigger value="level3">Level 3</TabsTrigger>
                <TabsTrigger value="level4">Level 4</TabsTrigger>
              </TabsList>

              <TabsContent value="level1" className="mt-6">
                <Level1ReactionForm 
                  enrollmentId={selectedEnrollment}
                  programName={selectedEnrollmentData?.programs?.title}
                  onSubmit={handleFormSubmit}
                />
              </TabsContent>

              <TabsContent value="level2" className="mt-6">
                <Level2LearningForm 
                  enrollmentId={selectedEnrollment}
                  programName={selectedEnrollmentData?.programs?.title}
                  onSubmit={handleFormSubmit}
                />
              </TabsContent>

              <TabsContent value="level3" className="mt-6">
                <Level3BehaviorForm 
                  enrollmentId={selectedEnrollment}
                  programName={selectedEnrollmentData?.programs?.title}
                  onSubmit={handleFormSubmit}
                />
              </TabsContent>

              <TabsContent value="level4" className="mt-6">
                <Level4ResultsForm 
                  enrollmentId={selectedEnrollment}
                  programName={selectedEnrollmentData?.programs?.title}
                  onSubmit={handleFormSubmit}
                />
              </TabsContent>
            </Tabs>
          )}

          {!selectedEnrollment && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Program to Evaluate</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Choose one of your enrolled training programs above to begin the Kirkpatrick evaluation process.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">View Analytics For</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program (or view all)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <KirkpatrickCalculator programId={selectedProgram === "all" ? undefined : selectedProgram} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KirkpatrickEvaluations;