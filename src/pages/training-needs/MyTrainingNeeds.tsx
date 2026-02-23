import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle, AlertCircle, BookOpen, Target, Users, Lightbulb, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TnaCycle {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  departments: string[];
  locations: string[];
  roles: string[];
  workflow_type: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  duration_hours: number;
  category: string;
  level: string;
}

export default function MyTrainingNeeds() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cycles, setCycles] = useState<TnaCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<TnaCycle | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Fetch user profile and matching cycles
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("department, location, position")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // Fetch active cycles
      const { data: cyclesData } = await supabase
        .from("tna_cycles")
        .select("*")
        .eq("status", "active");

      if (cyclesData && profileData) {
        // Filter cycles matching user's criteria
        const matching = cyclesData.filter((c: any) => {
          const deptMatch = !c.departments?.length || c.departments.includes(profileData.department);
          const locMatch = !c.locations?.length || c.locations.includes(profileData.location);
          const roleMatch = !c.roles?.length || c.roles.includes(profileData.position);
          return deptMatch && locMatch && roleMatch;
        });
        setCycles(matching);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // When a cycle is selected, fetch programs and check for existing submission
  useEffect(() => {
    if (!selectedCycle || !user) return;
    const fetchCycleData = async () => {
      const { data: progs } = await supabase
        .from("training_programs")
        .select("id, title, description, duration_hours, category, level")
        .eq("is_active", true)
        .order("category")
        .order("title");
      setPrograms(progs || []);

      // Check existing submission
      const { data: existing } = await supabase
        .from("tni_submissions")
        .select("*")
        .eq("cycle_id", selectedCycle.id)
        .eq("employee_id", user.id)
        .maybeSingle();

      if (existing) {
        setExistingSubmission(existing);
        const needs = existing.training_needs as any;
        setSelectedPrograms(needs?.selectedPrograms || []);
        setComments(existing.employee_comments || "");
      } else {
        setExistingSubmission(null);
        setSelectedPrograms([]);
        setComments("");
      }
    };
    fetchCycleData();
  }, [selectedCycle, user]);

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms(prev =>
      prev.includes(programId) ? prev.filter(id => id !== programId) : [...prev, programId]
    );
  };

  const handleSubmit = async () => {
    if (selectedPrograms.length === 0) {
      toast({ title: "Error", description: "Please select at least one program", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const trainingNeeds = { selectedPrograms };
      if (existingSubmission) {
        const { error } = await supabase.from("tni_submissions").update({
          training_needs: trainingNeeds,
          employee_comments: comments,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        }).eq("id", existingSubmission.id);
        if (error) throw error;
      } else {
        // Find manager
        const { data: profileData } = await supabase
          .from("profiles")
          .select("manager_id")
          .eq("id", user!.id)
          .single();

        const { error } = await supabase.from("tni_submissions").insert({
          cycle_id: selectedCycle!.id,
          employee_id: user!.id,
          manager_id: profileData?.manager_id || null,
          training_needs: trainingNeeds,
          employee_comments: comments,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      toast({ title: "Success", description: "Training needs submitted successfully!" });
      setSelectedCycle(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const categoryColors: Record<string, string> = {
    Managerial: "bg-blue-500",
    Behavioral: "bg-green-500",
    Functional: "bg-purple-500",
    Technical: "bg-orange-500",
  };

  const categoryIcons: Record<string, any> = {
    Managerial: Target,
    Behavioral: Users,
    Functional: BookOpen,
    Technical: Lightbulb,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Cycle list view
  if (!selectedCycle) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">My Training Needs</h1>
          <p className="text-muted-foreground">View and submit your training needs for active cycles</p>
        </div>

        {cycles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Active Cycles</h3>
              <p className="text-muted-foreground">There are no active training needs cycles matching your profile criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {cycles.map(cycle => (
              <Card key={cycle.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCycle(cycle)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cycle.name}</CardTitle>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {cycle.start_date} to {cycle.end_date}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cycle.departments?.map(d => <Badge key={d} variant="outline">{d}</Badge>)}
                    {cycle.locations?.map(l => <Badge key={l} variant="secondary">{l}</Badge>)}
                  </div>
                  <Button className="mt-4 w-full" variant="outline">
                    View & Submit Programs →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Program selection view for selected cycle
  const categories = [...new Set(programs.map(p => p.category))];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setSelectedCycle(null)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{selectedCycle.name}</h1>
          <p className="text-muted-foreground">Select programs by category and submit your training needs</p>
        </div>
      </div>

      {existingSubmission && (
        <Card className="border-primary">
          <CardContent className="py-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>You have already submitted for this cycle. Status: <Badge>{existingSubmission.status}</Badge></span>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      <Card>
        <CardContent className="py-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Programs Selected</span>
            <span>{selectedPrograms.length} selected</span>
          </div>
          <Progress value={Math.min((selectedPrograms.length / 5) * 100, 100)} className="h-2" />
        </CardContent>
      </Card>

      {/* Category tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Categories</TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map(program => {
              const Icon = categoryIcons[program.category] || BookOpen;
              const isSelected = selectedPrograms.includes(program.id);
              return (
                <Card
                  key={program.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
                  onClick={() => handleProgramToggle(program.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${categoryColors[program.category] || "bg-gray-500"} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{program.title}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">{program.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{program.duration_hours}h</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Checkbox checked={isSelected} />
                      {isSelected && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.filter(p => p.category === cat).map(program => {
                const Icon = categoryIcons[program.category] || BookOpen;
                const isSelected = selectedPrograms.includes(program.id);
                return (
                  <Card
                    key={program.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleProgramToggle(program.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${categoryColors[program.category] || "bg-gray-500"} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">{program.title}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">{program.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <Checkbox checked={isSelected} />
                        {isSelected && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Comments & Submit */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Any additional comments about your training needs..."
          />
          <Button onClick={handleSubmit} disabled={submitting || selectedPrograms.length === 0} className="w-full">
            {submitting ? "Submitting..." : existingSubmission ? "Update Submission" : "Submit Training Needs"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
