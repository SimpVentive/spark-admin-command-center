
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProgramCategoryManagement from "@/components/ProgramCategoryManagement";
import ResourceSelector from "@/components/library/ResourceSelector";

const CreateProgram = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    programType: "",
    level: "",
    outline: "",
    theme: "",
    faculty: "",
    venue: "",
    icon: "",
    preReadInfo: "",
    preTestInfo: "",
    multipleBatches: false,
    duration: "",
    maxParticipants: "",
    prerequisites: "",
    learningObjectives: "",
    assessmentCriteria: "",
    certificationOffered: false,
    cost: "",
    linkedResources: [] as string[],
  });

  const [sessions, setSessions] = useState([
    { date: "", startTime: "", endTime: "", venue: "", trainer: "" }
  ]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSession = () => {
    setSessions(prev => [
      ...prev,
      { date: "", startTime: "", endTime: "", venue: "", trainer: "" }
    ]);
  };

  const removeSession = (index: number) => {
    setSessions(prev => prev.filter((_, i) => i !== index));
  };

  const updateSession = (index: number, field: string, value: string) => {
    setSessions(prev => prev.map((session, i) => 
      i === index ? { ...session, [field]: value } : session
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would save to your database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Program created successfully!",
      });

      navigate('/programs');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create program",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/programs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Program</h1>
          <p className="text-muted-foreground">Design a comprehensive training program</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Program Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter program title"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="category">Program Category *</Label>
                <ProgramCategoryManagement
                  selectedCategory={formData.category}
                  selectedSubcategory={formData.subcategory}
                  onCategoryChange={(category, subcategory) => {
                    handleInputChange('category', category);
                    if (subcategory) {
                      handleInputChange('subcategory', subcategory);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programType">Program Type *</Label>
                <Select value={formData.programType} onValueChange={(value) => handleInputChange('programType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ILT">Instructor-Led Training (ILT)</SelectItem>
                    <SelectItem value="Digital">Digital/Online</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Self-Paced">Self-Paced</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 3 days, 2 weeks, 40 hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  placeholder="Maximum number of participants"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty/Trainer</Label>
                <Input
                  id="faculty"
                  value={formData.faculty}
                  onChange={(e) => handleInputChange('faculty', e.target.value)}
                  placeholder="Primary trainer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  placeholder="Training venue/location"
                />
              </div>
            </CardContent>
          </Card>

          {/* Program Content */}
          <Card>
            <CardHeader>
              <CardTitle>Program Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="outline">Program Outline *</Label>
                <Textarea
                  id="outline"
                  value={formData.outline}
                  onChange={(e) => handleInputChange('outline', e.target.value)}
                  placeholder="Detailed program outline, modules, topics covered..."
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="learningObjectives">Learning Objectives</Label>
                <Textarea
                  id="learningObjectives"
                  value={formData.learningObjectives}
                  onChange={(e) => handleInputChange('learningObjectives', e.target.value)}
                  placeholder="What participants will learn and achieve..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                  placeholder="Required knowledge, skills, or experience..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pre-Training Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pre-Training Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preReadInfo">Pre-Read Information</Label>
                <Textarea
                  id="preReadInfo"
                  value={formData.preReadInfo}
                  onChange={(e) => handleInputChange('preReadInfo', e.target.value)}
                  placeholder="Materials to be read before the training..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preTestInfo">Pre-Test Information</Label>
                <Textarea
                  id="preTestInfo"
                  value={formData.preTestInfo}
                  onChange={(e) => handleInputChange('preTestInfo', e.target.value)}
                  placeholder="Pre-assessment details and instructions..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sessions Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Training Sessions
                <Button type="button" variant="outline" size="sm" onClick={addSession}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Session {index + 1}</h4>
                    {sessions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSession(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={session.date}
                        onChange={(e) => updateSession(index, 'date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={session.startTime}
                        onChange={(e) => updateSession(index, 'startTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={session.endTime}
                        onChange={(e) => updateSession(index, 'endTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Venue</Label>
                      <Input
                        value={session.venue}
                        onChange={(e) => updateSession(index, 'venue', e.target.value)}
                        placeholder="Session venue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trainer</Label>
                      <Input
                        value={session.trainer}
                        onChange={(e) => updateSession(index, 'trainer', e.target.value)}
                        placeholder="Session trainer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multipleBatches"
                  checked={formData.multipleBatches}
                  onCheckedChange={(checked) => handleInputChange('multipleBatches', checked as boolean)}
                />
                <Label htmlFor="multipleBatches">Allow Multiple Batches</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certificationOffered"
                  checked={formData.certificationOffered}
                  onCheckedChange={(checked) => handleInputChange('certificationOffered', checked as boolean)}
                />
                <Label htmlFor="certificationOffered">Certification Offered</Label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cost">Program Cost</Label>
                  <Input
                    id="cost"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    placeholder="Program cost (if applicable)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessmentCriteria">Assessment Criteria</Label>
                  <Input
                    id="assessmentCriteria"
                    value={formData.assessmentCriteria}
                    onChange={(e) => handleInputChange('assessmentCriteria', e.target.value)}
                    placeholder="How will participants be assessed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Library Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Library Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceSelector
                selectedResources={formData.linkedResources}
                onResourcesChange={(resources) => handleInputChange('linkedResources', resources)}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/programs')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create Program"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProgram;
