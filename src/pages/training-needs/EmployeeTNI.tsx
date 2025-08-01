import { useState } from "react";
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

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  category: 'managerial' | 'behavioral' | 'functional' | 'technical';
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
  const [currentStep, setCurrentStep] = useState(1);
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

  // Sample cycle info
  const cycleInfo = {
    name: "Q1 2024 Training Needs Identification",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    minPrograms: 3,
    maxPrograms: 8,
    status: "Active"
  };

  // Sample programs data
  const programs: Program[] = [
    // Managerial
    { id: "m1", name: "Leadership Excellence", description: "Develop core leadership skills", duration: "3 days", category: "managerial", isMandatory: true },
    { id: "m2", name: "Strategic Planning", description: "Strategic thinking and planning", duration: "2 days", category: "managerial" },
    { id: "m3", name: "Team Management", description: "Effective team leadership", duration: "2 days", category: "managerial" },
    
    // Behavioral
    { id: "b1", name: "Communication Skills", description: "Effective workplace communication", duration: "2 days", category: "behavioral", isMandatory: true },
    { id: "b2", name: "Emotional Intelligence", description: "Understanding and managing emotions", duration: "1 day", category: "behavioral" },
    { id: "b3", name: "Conflict Resolution", description: "Managing workplace conflicts", duration: "1 day", category: "behavioral" },
    
    // Functional
    { id: "f1", name: "Project Management", description: "PMP certification preparation", duration: "5 days", category: "functional" },
    { id: "f2", name: "Financial Analysis", description: "Business financial skills", duration: "3 days", category: "functional" },
    { id: "f3", name: "Quality Management", description: "Six Sigma principles", duration: "4 days", category: "functional" },
    
    // Technical
    { id: "t1", name: "Data Analytics", description: "Data analysis and visualization", duration: "4 days", category: "technical" },
    { id: "t2", name: "Digital Transformation", description: "Technology adoption strategies", duration: "2 days", category: "technical" },
    { id: "t3", name: "Cybersecurity Awareness", description: "Information security basics", duration: "1 day", category: "technical", isMandatory: true }
  ];

  const categoryIcons = {
    managerial: Target,
    behavioral: Users,
    functional: BookOpen,
    technical: Lightbulb
  };

  const categoryColors = {
    managerial: "bg-blue-500",
    behavioral: "bg-green-500",
    functional: "bg-purple-500",
    technical: "bg-orange-500"
  };

  const mandatoryPrograms = programs.filter(p => p.isMandatory);
  const optionalPrograms = programs.filter(p => !p.isMandatory);

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
    const Icon = categoryIcons[program.category];
    const isSelected = tniData.selectedPrograms.includes(program.id) || program.isMandatory;
    const isMandatory = program.isMandatory;

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
              <div className={`w-10 h-10 ${categoryColors[program.category]} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">{program.name}</CardTitle>
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
              <span className="text-sm text-muted-foreground">{program.duration}</span>
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
                  <TabsTrigger value="managerial">Managerial</TabsTrigger>
                  <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                  <TabsTrigger value="functional">Functional</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {optionalPrograms.map(renderProgramCard)}
                  </div>
                </TabsContent>
                
                {Object.keys(categoryIcons).map(category => (
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
                        <SelectItem value="managerial">Managerial</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="functional">Functional</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
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
                        <p className="font-medium">{program.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{program.category}</Badge>
                          {program.isMandatory && <Badge variant="destructive" className="text-xs">Mandatory</Badge>}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{program.duration}</span>
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