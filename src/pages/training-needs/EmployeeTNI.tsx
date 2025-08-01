import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle, AlertCircle, BookOpen, Target, Users, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Program {
  id: string;
  title: string;
  description: string;
  duration_hours: number;
  category: string;
  level: string;
  faculty: string;
  venue: string;
  isMandatory?: boolean;
}

interface TNIData {
  selectedPrograms: string[];
  customRequirements: Array<{
    description: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  quarterPreference: string;
  additionalComments: string;
}

export default function EmployeeTNI() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [tniData, setTNIData] = useState<TNIData>({
    selectedPrograms: [],
    customRequirements: [],
    quarterPreference: '',
    additionalComments: ''
  });

  const [customRequirement, setCustomRequirement] = useState<{
    description: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
  }>({
    description: '',
    category: '',
    priority: 'medium'
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Fetch programs from database
  useEffect(() => {
    if (!user) return;
    
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase
          .from('training_programs')
          .select('*')
          .eq('is_active', true)
          .order('category', { ascending: true })
          .order('title', { ascending: true });

        if (error) throw error;
        setPrograms(data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch programs",
          variant: "destructive"
        });
      }
    };

    fetchPrograms();
  }, [user, toast]);

  // Sample cycle info
  const cycleInfo = {
    name: "Q1 2024 Training Needs Identification",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    minPrograms: 3,
    maxPrograms: 8,
    status: "Active"
  };

  const categoryIcons = {
    'Managerial': Target,
    'Behavioral': Users,
    'Functional': BookOpen,
    'Technical': Lightbulb
  };

  const categoryColors = {
    'Managerial': "bg-blue-500",
    'Behavioral': "bg-green-500",
    'Functional': "bg-purple-500",
    'Technical': "bg-orange-500"
  };

  const mandatoryPrograms = programs.filter(p => p.category === 'Mandatory');
  const optionalPrograms = programs.filter(p => p.category !== 'Mandatory');

  const handleProgramToggle = (programId: string) => {
    setTNIData(prev => ({
      ...prev,
      selectedPrograms: prev.selectedPrograms.includes(programId)
        ? prev.selectedPrograms.filter(id => id !== programId)
        : [...prev.selectedPrograms, programId]
    }));
  };

  const addCustomRequirement = () => {
    if (customRequirement.description && customRequirement.category) {
      setTNIData(prev => ({
        ...prev,
        customRequirements: [...prev.customRequirements, { ...customRequirement }]
      }));
      setCustomRequirement({ description: '', category: '', priority: 'medium' });
    }
  };

  const removeCustomRequirement = (index: number) => {
    setTNIData(prev => ({
      ...prev,
      customRequirements: prev.customRequirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const totalSelected = tniData.selectedPrograms.length + mandatoryPrograms.length;
    if (totalSelected < cycleInfo.minPrograms || totalSelected > cycleInfo.maxPrograms) {
      toast({
        title: "Selection Error",
        description: `Please select between ${cycleInfo.minPrograms - mandatoryPrograms.length} and ${cycleInfo.maxPrograms - mandatoryPrograms.length} optional programs.`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "TNI Submitted Successfully",
      description: "Your training needs have been submitted for approval."
    });
  };

  const renderProgramCard = (program: Program) => {
    const Icon = categoryIcons[program.category as keyof typeof categoryIcons] || BookOpen;
    const isSelected = tniData.selectedPrograms.includes(program.id) || program.category === 'Mandatory';
    const isMandatory = program.category === 'Mandatory';

    return (
      <Card 
        key={program.id} 
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary' : ''
        } ${isMandatory ? 'bg-muted/50' : ''}`}
        onClick={() => !isMandatory && handleProgramToggle(program.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${categoryColors[program.category as keyof typeof categoryColors] || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">{program.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {program.category}
                  </Badge>
                  {isMandatory && (
                    <Badge variant="destructive" className="text-xs">
                      Mandatory
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{Math.ceil((program.duration_hours || 0) / 8)} days</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{program.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <Checkbox 
              checked={isSelected}
              disabled={isMandatory}
              onChange={() => !isMandatory && handleProgramToggle(program.id)}
            />
            {isSelected && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Training Needs Identification</h1>
          <p className="text-muted-foreground">
            Complete your training needs assessment for {cycleInfo.name}
          </p>
        </div>

        {/* Cycle Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{cycleInfo.name}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {cycleInfo.startDate} - {cycleInfo.endDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Select {cycleInfo.minPrograms}-{cycleInfo.maxPrograms} programs
                  </div>
                </CardDescription>
              </div>
              <Badge variant="default">{cycleInfo.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{tniData.selectedPrograms.length + mandatoryPrograms.length}/{cycleInfo.maxPrograms} programs selected</span>
              </div>
              <Progress 
                value={((tniData.selectedPrograms.length + mandatoryPrograms.length) / cycleInfo.maxPrograms) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stepper Navigation */}
      <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="1">Mandatory Programs</TabsTrigger>
          <TabsTrigger value="2">Optional Programs</TabsTrigger>
          <TabsTrigger value="3">Custom Requirements</TabsTrigger>
          <TabsTrigger value="4">Review & Submit</TabsTrigger>
        </TabsList>

        {/* Step 1: Mandatory Programs */}
        <TabsContent value="1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Mandatory Programs
              </CardTitle>
              <CardDescription>
                These programs are required for your role and department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mandatoryPrograms.map(renderProgramCard)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Optional Programs */}
        <TabsContent value="2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optional Programs</CardTitle>
              <CardDescription>
                Choose additional programs based on your career goals and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Categories</TabsTrigger>
                  <TabsTrigger value="Managerial">Managerial</TabsTrigger>
                  <TabsTrigger value="Behavioral">Behavioral</TabsTrigger>
                  <TabsTrigger value="Functional">Functional</TabsTrigger>
                  <TabsTrigger value="Technical">Technical</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {optionalPrograms.map(renderProgramCard)}
                  </div>
                </TabsContent>
                
                {['Managerial', 'Behavioral', 'Functional', 'Technical'].map(category => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {optionalPrograms.filter(p => p.category === category).map(renderProgramCard)}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Custom Requirements */}
        <TabsContent value="3" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Training Requirements</CardTitle>
              <CardDescription>
                Specify any other training needs not covered in the program list
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Training Description</label>
                  <Textarea
                    value={customRequirement.description}
                    onChange={(e) => setCustomRequirement(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the training requirement..."
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select 
                      value={customRequirement.category} 
                      onValueChange={(value) => setCustomRequirement(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Managerial">Managerial</SelectItem>
                          <SelectItem value="Behavioral">Behavioral</SelectItem>
                          <SelectItem value="Functional">Functional</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select 
                      value={customRequirement.priority} 
                      onValueChange={(value: 'high' | 'medium' | 'low') => setCustomRequirement(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={addCustomRequirement} variant="outline" className="w-full">
                  Add Requirement
                </Button>
              </div>

              {/* Custom Requirements List */}
              {tniData.customRequirements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Added Requirements:</h4>
                  {tniData.customRequirements.map((req, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm">{req.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{req.category}</Badge>
                            <Badge 
                              variant={req.priority === 'high' ? 'destructive' : req.priority === 'medium' ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              {req.priority}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomRequirement(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Preferred Quarter</label>
                  <Select value={tniData.quarterPreference} onValueChange={(value) => setTNIData(prev => ({ ...prev, quarterPreference: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select preferred quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q1">Q1 2024</SelectItem>
                      <SelectItem value="q2">Q2 2024</SelectItem>
                      <SelectItem value="q3">Q3 2024</SelectItem>
                      <SelectItem value="q4">Q4 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Additional Comments</label>
                  <Textarea
                    value={tniData.additionalComments}
                    onChange={(e) => setTNIData(prev => ({ ...prev, additionalComments: e.target.value }))}
                    placeholder="Any additional comments about your training needs..."
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Review & Submit */}
        <TabsContent value="4" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Selection</CardTitle>
              <CardDescription>
                Please review your training needs before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Programs Summary */}
              <div>
                <h4 className="font-medium mb-3">Selected Programs ({tniData.selectedPrograms.length + mandatoryPrograms.length})</h4>
                <div className="space-y-2">
                  {[...mandatoryPrograms, ...programs.filter(p => tniData.selectedPrograms.includes(p.id))].map(program => (
                     <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg">
                       <div>
                         <p className="font-medium">{program.title}</p>
                         <div className="flex items-center gap-2 mt-1">
                           <Badge variant="outline" className="text-xs">{program.category}</Badge>
                           {program.category === 'Mandatory' && <Badge variant="destructive" className="text-xs">Mandatory</Badge>}
                         </div>
                       </div>
                       <span className="text-sm text-muted-foreground">{Math.ceil((program.duration_hours || 0) / 8)} days</span>
                     </div>
                  ))}
                </div>
              </div>

              {/* Custom Requirements Summary */}
              {tniData.customRequirements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Custom Requirements ({tniData.customRequirements.length})</h4>
                  <div className="space-y-2">
                    {tniData.customRequirements.map((req, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="text-sm">{req.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{req.category}</Badge>
                          <Badge 
                            variant={req.priority === 'high' ? 'destructive' : req.priority === 'medium' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {req.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Preferred Quarter</h4>
                  <p className="text-sm text-muted-foreground">{tniData.quarterPreference || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Total Programs</h4>
                  <p className="text-sm text-muted-foreground">{tniData.selectedPrograms.length + mandatoryPrograms.length} programs</p>
                </div>
              </div>

              {tniData.additionalComments && (
                <div>
                  <h4 className="font-medium">Additional Comments</h4>
                  <p className="text-sm text-muted-foreground">{tniData.additionalComments}</p>
                </div>
              )}

              <Button onClick={handleSubmit} className="w-full" size="lg">
                Submit Training Needs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          disabled={currentStep === 4}
        >
          Next
        </Button>
      </div>
    </div>
  );
}