import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, GripVertical, Plus, X, Upload, Calendar, Users, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const CreateLearningPath = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: "",
    description: "",
    category: "",
    difficulty: "",
    estimatedDuration: "",
    
    // Step 2: Prerequisites
    requiredCourses: [],
    skillsAssessment: false,
    experienceLevel: "",
    prerequisites: [],
    
    // Step 3: Course Selection & Sequencing
    selectedCourses: [],
    courseDependencies: {},
    
    // Step 4: Assessment Configuration
    knowledgeChecks: true,
    projects: false,
    passingCriteria: 70,
    retakePolicies: {
      maxAttempts: 3,
      cooldownPeriod: 24
    },
    
    // Step 5: Certification Setup
    certificateTemplate: "",
    requirements: [],
    validity: 12,
    industryRecognition: false,
    
    // Step 6: Publishing Settings
    visibility: "private",
    enrollmentRules: "",
    launchDate: ""
  });

  const [availableCourses] = useState([
    { id: 1, title: "Introduction to Digital Marketing", duration: "2 weeks", type: "Core" },
    { id: 2, title: "SEO Fundamentals", duration: "1 week", type: "Core" },
    { id: 3, title: "Social Media Strategy", duration: "2 weeks", type: "Core" },
    { id: 4, title: "Content Marketing", duration: "3 weeks", type: "Elective" },
    { id: 5, title: "Email Marketing", duration: "1 week", type: "Elective" },
    { id: 6, title: "Analytics & Reporting", duration: "2 weeks", type: "Core" }
  ]);

  const stepTitles = [
    "Basic Information",
    "Prerequisites Setup", 
    "Course Selection & Sequencing",
    "Assessment Configuration",
    "Certification Setup",
    "Publishing Settings"
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Learning Path Data:", formData);
    // Handle form submission
    navigate('/learning-paths');
  };

  const progress = (currentStep / totalSteps) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <PrerequisitesStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <CourseSelectionStep formData={formData} setFormData={setFormData} availableCourses={availableCourses} />;
      case 4:
        return <AssessmentConfigurationStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <CertificationSetupStep formData={formData} setFormData={setFormData} />;
      case 6:
        return <PublishingSettingsStep formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/learning-paths')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Learning Path</h1>
          <p className="text-muted-foreground">Design a structured learning journey</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-6 gap-2 text-xs">
              {stepTitles.map((title, index) => (
                <div 
                  key={index} 
                  className={`text-center p-2 rounded ${
                    index + 1 === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : index + 1 < currentStep 
                        ? 'bg-muted text-muted-foreground' 
                        : 'text-muted-foreground'
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{stepTitles[currentStep - 1]}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === totalSteps ? (
          <Button onClick={handleSubmit} className="gap-2">
            <Check className="h-4 w-4" />
            Create Learning Path
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Step Components
const BasicInformationStep = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="title">Learning Path Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter learning path title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="leadership">Leadership</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="management">Management</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Description *</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Describe what learners will achieve in this learning path"
        rows={4}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty Level *</Label>
        <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Estimated Duration *</Label>
        <Input
          id="duration"
          value={formData.estimatedDuration}
          onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})}
          placeholder="e.g., 12 weeks, 3 months"
        />
      </div>
    </div>
  </div>
);

const PrerequisitesStep = ({ formData, setFormData }) => {
  const [prerequisiteInput, setPrerequisiteInput] = useState("");

  const addPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      const newPrerequisites = [...formData.prerequisites, prerequisiteInput.trim()];
      setFormData({ ...formData, prerequisites: newPrerequisites });
      setPrerequisiteInput("");
    }
  };

  const removePrerequisite = (index) => {
    const newPrerequisites = formData.prerequisites.filter((_, i) => i !== index);
    setFormData({ ...formData, prerequisites: newPrerequisites });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPrerequisite();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="skillsAssessment" 
            checked={formData.skillsAssessment}
            onCheckedChange={(checked) => setFormData({...formData, skillsAssessment: checked})}
          />
          <Label htmlFor="skillsAssessment">Require skills assessment before enrollment</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Required Experience Level</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({...formData, experienceLevel: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No experience required</SelectItem>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5+">5+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Prerequisites and Requirements</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input 
              placeholder="Add a prerequisite (e.g., Basic computer skills)" 
              value={prerequisiteInput}
              onChange={(e) => setPrerequisiteInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2" 
              onClick={addPrerequisite}
            >
              <Plus className="h-4 w-4" />
              Add Prerequisite
            </Button>
          </div>
          
          {formData.prerequisites.length > 0 && (
            <div className="space-y-2 mt-4">
              <Label className="text-sm font-medium">Added Prerequisites:</Label>
              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                  <span className="text-sm">{prerequisite}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removePrerequisite(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseSelectionStep = ({ formData, setFormData, availableCourses }) => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedCourses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedCourses(items);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label className="text-base font-medium">Available Courses</Label>
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {availableCourses.map((course) => (
              <div key={course.id} className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.duration} • {course.type}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setSelectedCourses([...selectedCourses, course])}
                    disabled={selectedCourses.some(c => c.id === course.id)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Selected Courses (Drag to reorder)</Label>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="selected-courses">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4 space-y-2">
                  {selectedCourses.map((course, index) => (
                    <Draggable key={course.id} draggableId={course.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="p-3 border rounded-lg bg-card flex items-center gap-3"
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">{course.duration}</p>
                          </div>
                          <Badge variant={course.type === 'Core' ? 'default' : 'secondary'}>
                            {course.type}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setSelectedCourses(selectedCourses.filter(c => c.id !== course.id))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

const AssessmentConfigurationStep = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="knowledgeChecks" 
          checked={formData.knowledgeChecks}
          onCheckedChange={(checked) => setFormData({...formData, knowledgeChecks: checked})}
        />
        <Label htmlFor="knowledgeChecks">Enable knowledge checks between modules</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="projects" 
          checked={formData.projects}
          onCheckedChange={(checked) => setFormData({...formData, projects: checked})}
        />
        <Label htmlFor="projects">Require practical projects</Label>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="passingCriteria">Passing Score (%)</Label>
        <Input
          id="passingCriteria"
          type="number"
          value={formData.passingCriteria}
          onChange={(e) => setFormData({...formData, passingCriteria: parseInt(e.target.value)})}
          min="0"
          max="100"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="maxAttempts">Maximum Attempts</Label>
        <Input
          id="maxAttempts"
          type="number"
          value={formData.retakePolicies.maxAttempts}
          onChange={(e) => setFormData({
            ...formData, 
            retakePolicies: {...formData.retakePolicies, maxAttempts: parseInt(e.target.value)}
          })}
          min="1"
        />
      </div>
    </div>
  </div>
);

const CertificationSetupStep = ({ formData, setFormData }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({...formData, certificateTemplate: file.name});
    }
  };

  const triggerFileInput = () => {
    document.getElementById('certificateFileInput').click();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="certificateTemplate">Certificate Template</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              {formData.certificateTemplate ? `Selected: ${formData.certificateTemplate}` : 'Upload certificate template'}
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={triggerFileInput}>
              Choose File
            </Button>
            <input
              id="certificateFileInput"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="validity">Certificate Validity (months)</Label>
            <Input
              id="validity"
              type="number"
              value={formData.validity}
              onChange={(e) => setFormData({...formData, validity: parseInt(e.target.value)})}
              min="1"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-8">
            <Checkbox 
              id="industryRecognition" 
              checked={formData.industryRecognition}
              onCheckedChange={(checked) => setFormData({...formData, industryRecognition: checked})}
            />
            <Label htmlFor="industryRecognition">Industry recognized certification</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublishingSettingsStep = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="visibility">Visibility</Label>
        <Select value={formData.visibility} onValueChange={(value) => setFormData({...formData, visibility: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="restricted">Restricted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="launchDate">Launch Date</Label>
        <Input
          id="launchDate"
          type="date"
          value={formData.launchDate}
          onChange={(e) => setFormData({...formData, launchDate: e.target.value})}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="enrollmentRules">Enrollment Rules</Label>
      <Textarea
        id="enrollmentRules"
        value={formData.enrollmentRules}
        onChange={(e) => setFormData({...formData, enrollmentRules: e.target.value})}
        placeholder="Define who can enroll and any restrictions"
        rows={3}
      />
    </div>
  </div>
);

export default CreateLearningPath;