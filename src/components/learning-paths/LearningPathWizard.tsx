import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  Plus, 
  Target,
  Users,
  BookOpen,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface WizardProps {
  onClose: () => void;
}

const LearningPathWizard = ({ onClose }: WizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: "",
    description: "",
    category: "",
    level: "",
    estimatedDuration: "",
    
    // Step 2: Learning Objectives
    objectives: [""],
    targetAudience: "",
    prerequisites: [""],
    
    // Step 3: Content Structure
    modules: [],
    assessmentEnabled: false,
    certificationEnabled: false,
    
    // Step 4: Assignment Rules
    assignmentType: "manual",
    departments: [],
    roles: [],
    autoEnroll: false
  });

  const totalSteps = 4;

  const categories = ["Marketing", "Leadership", "Technology", "Management", "Sales", "Finance", "HR"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];
  const roles = ["Manager", "Senior Developer", "Marketing Specialist", "Sales Representative"];

  const steps = [
    { number: 1, title: "Basic Info", icon: BookOpen },
    { number: 2, title: "Objectives", icon: Target },
    { number: 3, title: "Structure", icon: Settings },
    { number: 4, title: "Assignment", icon: Users }
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, ""]
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ""]
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prereq, i) => i === index ? value : prereq)
    }));
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.category && formData.level;
      case 2:
        return formData.objectives.some(obj => obj.trim()) && formData.targetAudience;
      case 3:
        return true; // Structure step is optional
      case 4:
        return formData.assignmentType;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log("Learning Path Data:", formData);
      toast.success("Learning path created successfully!");
      onClose();
    } else {
      toast.error("Please complete all required fields");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Path Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                placeholder="e.g., Digital Marketing Fundamentals"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe what learners will gain from this path..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level *</Label>
                <Select value={formData.level} onValueChange={(value) => updateFormData("level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Estimated Duration</Label>
              <Input
                id="duration"
                value={formData.estimatedDuration}
                onChange={(e) => updateFormData("estimatedDuration", e.target.value)}
                placeholder="e.g., 8 weeks, 20 hours"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Learning Objectives *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Objective
                </Button>
              </div>
              
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder={`Learning objective ${index + 1}`}
                  />
                  {formData.objectives.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeObjective(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience *</Label>
              <Textarea
                id="audience"
                value={formData.targetAudience}
                onChange={(e) => updateFormData("targetAudience", e.target.value)}
                placeholder="Who is this path designed for?"
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Prerequisites</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPrerequisite}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prerequisite
                </Button>
              </div>
              
              {formData.prerequisites.map((prereq, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={prereq}
                    onChange={(e) => updatePrerequisite(index, e.target.value)}
                    placeholder={`Prerequisite ${index + 1}`}
                  />
                  {formData.prerequisites.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePrerequisite(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Content Structure</h3>
              <p className="text-muted-foreground mb-4">
                You'll be able to add and organize content modules after creating the path
              </p>
              <Badge variant="secondary">Coming up next: Path Builder</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assessment"
                  checked={formData.assessmentEnabled}
                  onCheckedChange={(checked) => updateFormData("assessmentEnabled", checked)}
                />
                <Label htmlFor="assessment">Enable assessments for this path</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certification"
                  checked={formData.certificationEnabled}
                  onCheckedChange={(checked) => updateFormData("certificationEnabled", checked)}
                />
                <Label htmlFor="certification">Issue certificates upon completion</Label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Assignment Method</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manual"
                    checked={formData.assignmentType === "manual"}
                    onCheckedChange={(checked) => 
                      checked && updateFormData("assignmentType", "manual")
                    }
                  />
                  <Label htmlFor="manual">Manual assignment by administrators</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto"
                    checked={formData.assignmentType === "automatic"}
                    onCheckedChange={(checked) => 
                      checked && updateFormData("assignmentType", "automatic")
                    }
                  />
                  <Label htmlFor="auto">Automatic assignment based on rules</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="self"
                    checked={formData.assignmentType === "self-enroll"}
                    onCheckedChange={(checked) => 
                      checked && updateFormData("assignmentType", "self-enroll")
                    }
                  />
                  <Label htmlFor="self">Allow self-enrollment</Label>
                </div>
              </div>
            </div>

            {formData.assignmentType === "automatic" && (
              <>
                <div className="space-y-2">
                  <Label>Target Departments</Label>
                  <div className="flex flex-wrap gap-2">
                    {departments.map(dept => (
                      <Badge
                        key={dept}
                        variant={formData.departments.includes(dept) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const updated = formData.departments.includes(dept)
                            ? formData.departments.filter(d => d !== dept)
                            : [...formData.departments, dept];
                          updateFormData("departments", updated);
                        }}
                      >
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                      <Badge
                        key={role}
                        variant={formData.roles.includes(role) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const updated = formData.roles.includes(role)
                            ? formData.roles.filter(r => r !== role)
                            : [...formData.roles, role];
                          updateFormData("roles", updated);
                        }}
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Paths
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Create Learning Path</h2>
          <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : isActive 
                        ? "border-primary text-primary" 
                        : "border-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-0.5 w-16 ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const step = steps.find(s => s.number === currentStep);
              if (step) {
                const Icon = step.icon;
                return (
                  <>
                    <Icon className="h-5 w-5" />
                    Step {currentStep}: {step.title}
                  </>
                );
              }
              return null;
            })()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Check className="h-4 w-4 mr-2" />
            Create Learning Path
          </Button>
        )}
      </div>
    </div>
  );
};

export default LearningPathWizard;