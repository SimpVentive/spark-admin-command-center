import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft,
  Save, 
  Plus, 
  Trash2, 
  Edit,
  Users,
  Settings,
  BookOpen,
  Award,
  Calendar,
  Send,
  Download
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProgramCategoryManagement from "@/components/ProgramCategoryManagement";

const LearningPathManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "Digital Marketing Mastery",
    description: "Comprehensive digital marketing program covering SEO, social media, and analytics",
    category: "Marketing",
    subcategory: "Digital Marketing",
    difficulty: "Intermediate",
    duration: "12 weeks",
    isActive: true,
    enrollmentEnabled: true,
    certificationEnabled: true,
    prerequisites: "Basic Marketing Knowledge",
    learningObjectives: "Master digital marketing fundamentals and advanced techniques",
    maxEnrollments: "500",
    instructor: "Sarah Johnson"
  });

  const [enrollmentSettings, setEnrollmentSettings] = useState({
    autoEnrollment: false,
    requireApproval: true,
    deadlineEnabled: false,
    deadline: "",
    cohortBased: true,
    maxCohortSize: "25"
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEnrollmentChange = (field: string, value: string | boolean) => {
    setEnrollmentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Learning path updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to update learning path",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Learning path published successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish learning path", 
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enrolledLearners = [
    { id: 1, name: "John Smith", email: "john@company.com", enrolledDate: "2024-01-15", progress: 85 },
    { id: 2, name: "Emily Davis", email: "emily@company.com", enrolledDate: "2024-01-10", progress: 100 },
    { id: 3, name: "Michael Johnson", email: "michael@company.com", enrolledDate: "2024-01-20", progress: 25 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/learning-paths')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Paths
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Manage Learning Path</h1>
            <p className="text-muted-foreground">{formData.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button onClick={handlePublish} disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="learners">Learners</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 12 weeks, 3 months"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">Primary Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningObjectives">Learning Objectives</Label>
                <Textarea
                  id="learningObjectives"
                  value={formData.learningObjectives}
                  onChange={(e) => handleInputChange('learningObjectives', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Course Modules</span>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((module) => (
                  <div key={module} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Module {module}: Sample Module Title</h4>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Module description and learning outcomes...</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Duration: 2 weeks</span>
                      <span>Lessons: 6</span>
                      <span>Assignments: 2</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Enrollment</Label>
                  <p className="text-sm text-muted-foreground">Allow new learners to enroll</p>
                </div>
                <Switch
                  checked={formData.enrollmentEnabled}
                  onCheckedChange={(checked) => handleInputChange('enrollmentEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Enrollment</Label>
                  <p className="text-sm text-muted-foreground">Automatically enroll eligible learners</p>
                </div>
                <Switch
                  checked={enrollmentSettings.autoEnrollment}
                  onCheckedChange={(checked) => handleEnrollmentChange('autoEnrollment', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Approval</Label>
                  <p className="text-sm text-muted-foreground">Admin approval required for enrollment</p>
                </div>
                <Switch
                  checked={enrollmentSettings.requireApproval}
                  onCheckedChange={(checked) => handleEnrollmentChange('requireApproval', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cohort-Based Learning</Label>
                  <p className="text-sm text-muted-foreground">Group learners in cohorts with start dates</p>
                </div>
                <Switch
                  checked={enrollmentSettings.cohortBased}
                  onCheckedChange={(checked) => handleEnrollmentChange('cohortBased', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxEnrollments">Max Enrollments</Label>
                  <Input
                    id="maxEnrollments"
                    value={formData.maxEnrollments}
                    onChange={(e) => handleInputChange('maxEnrollments', e.target.value)}
                    type="number"
                  />
                </div>
                
                {enrollmentSettings.cohortBased && (
                  <div className="space-y-2">
                    <Label htmlFor="maxCohortSize">Max Cohort Size</Label>
                    <Input
                      id="maxCohortSize"
                      value={enrollmentSettings.maxCohortSize}
                      onChange={(e) => handleEnrollmentChange('maxCohortSize', e.target.value)}
                      type="number"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Set Enrollment Deadline</Label>
                  <p className="text-sm text-muted-foreground">Set a deadline for enrollment</p>
                </div>
                <Switch
                  checked={enrollmentSettings.deadlineEnabled}
                  onCheckedChange={(checked) => handleEnrollmentChange('deadlineEnabled', checked)}
                />
              </div>

              {enrollmentSettings.deadlineEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="deadline">Enrollment Deadline</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={enrollmentSettings.deadline}
                    onChange={(e) => handleEnrollmentChange('deadline', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learners" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Enrolled Learners ({enrolledLearners.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Learners
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Learners to Learning Path</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Add Individual Learner</Label>
                        <Input placeholder="Search by name or email..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Bulk Upload</Label>
                        <Input type="file" accept=".csv" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Add Learners</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledLearners.map((learner) => (
                  <div key={learner.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{learner.name}</h4>
                        <p className="text-sm text-muted-foreground">{learner.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{learner.progress}%</p>
                          <p className="text-xs text-muted-foreground">Progress</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Enrolled: {learner.enrolledDate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable this learning path</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Certification Enabled</Label>
                  <p className="text-sm text-muted-foreground">Issue certificates upon completion</p>
                </div>
                <Switch
                  checked={formData.certificationEnabled}
                  onCheckedChange={(checked) => handleInputChange('certificationEnabled', checked)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                <div className="border border-destructive rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-medium">Archive Learning Path</h4>
                    <p className="text-sm text-muted-foreground">Archive this learning path. It will no longer be visible to learners.</p>
                  </div>
                  <Button variant="destructive" size="sm">Archive Learning Path</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPathManagement;