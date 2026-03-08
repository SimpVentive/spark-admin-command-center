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
  ArrowLeft, Save, Plus, Trash2, Edit, Users, Settings, BookOpen, Award, Calendar, Send, Download
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generatePDF, generateExcel } from "@/utils/reportExport";
import ProgramCategoryManagement from "@/components/ProgramCategoryManagement";

const LearningPathManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [editingModule, setEditingModule] = useState<number | null>(null);
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

  const [modules, setModules] = useState([
    { id: 1, title: "Introduction to Digital Marketing", description: "Fundamentals overview", duration: "1 week", lessons: 5, assignments: 1 },
    { id: 2, title: "Search Engine Optimization", description: "SEO techniques and tools", duration: "2 weeks", lessons: 8, assignments: 2 },
    { id: 3, title: "Social Media Marketing", description: "Platform strategies and content", duration: "2 weeks", lessons: 7, assignments: 2 },
    { id: 4, title: "Email Marketing", description: "Campaign creation and automation", duration: "1 week", lessons: 6, assignments: 1 },
  ]);

  const [newModule, setNewModule] = useState({ title: "", description: "", duration: "", lessons: "5", assignments: "1" });
  const [addModuleOpen, setAddModuleOpen] = useState(false);

  const [enrollmentSettings, setEnrollmentSettings] = useState({
    autoEnrollment: false, requireApproval: true, deadlineEnabled: false,
    deadline: "", cohortBased: true, maxCohortSize: "25"
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnrollmentChange = (field: string, value: string | boolean) => {
    setEnrollmentSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: "Success", description: "Learning path updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update learning path", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: "Success", description: "Learning path published successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to publish learning path", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddModule = () => {
    if (!newModule.title.trim()) {
      toast({ title: "Error", description: "Module title is required", variant: "destructive" });
      return;
    }
    setModules(prev => [...prev, {
      id: Date.now(),
      title: newModule.title,
      description: newModule.description,
      duration: newModule.duration || "1 week",
      lessons: parseInt(newModule.lessons) || 5,
      assignments: parseInt(newModule.assignments) || 1,
    }]);
    setNewModule({ title: "", description: "", duration: "", lessons: "5", assignments: "1" });
    setAddModuleOpen(false);
    toast({ title: "Module added" });
  };

  const handleDeleteModule = (moduleId: number) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    toast({ title: "Module removed" });
  };

  const handleEditModule = (moduleId: number) => {
    setEditingModule(editingModule === moduleId ? null : moduleId);
  };

  const handleModuleFieldChange = (moduleId: number, field: string, value: string) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, [field]: value } : m));
  };

  const handleExportLearners = () => {
    const rows = enrolledLearners.map(l => [l.name, l.email, l.enrolledDate, `${l.progress}%`]);
    generatePDF(
      { title: `${formData.title} - Learners`, subtitle: "Enrolled Learners Report", dateRange: "" },
      [{ label: "Total Learners", value: String(enrolledLearners.length) }],
      [{ title: "Learners", headers: ["Name", "Email", "Enrolled", "Progress"], rows }]
    );
    toast({ title: "PDF exported" });
  };

  const handleArchive = () => {
    toast({ title: "Learning path archived", description: `"${formData.title}" has been archived.` });
    navigate('/learning-paths');
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
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} />
              </div>
              <ProgramCategoryManagement
                selectedCategory={formData.category}
                selectedSubcategory={formData.subcategory}
                onCategoryChange={(category, subcategory) => {
                  handleInputChange('category', category);
                  if (subcategory) handleInputChange('subcategory', subcategory);
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={(v) => handleInputChange('difficulty', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} placeholder="e.g., 12 weeks" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Instructor</Label>
                <Input value={formData.instructor} onChange={(e) => handleInputChange('instructor', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Prerequisites</Label>
                <Textarea value={formData.prerequisites} onChange={(e) => handleInputChange('prerequisites', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Learning Objectives</Label>
                <Textarea value={formData.learningObjectives} onChange={(e) => handleInputChange('learningObjectives', e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Course Modules ({modules.length})</span>
                <Dialog open={addModuleOpen} onOpenChange={setAddModuleOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Add Module</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add New Module</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Title *</Label><Input value={newModule.title} onChange={(e) => setNewModule(p => ({ ...p, title: e.target.value }))} placeholder="Module title" /></div>
                      <div className="space-y-2"><Label>Description</Label><Textarea value={newModule.description} onChange={(e) => setNewModule(p => ({ ...p, description: e.target.value }))} placeholder="Module description" /></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>Duration</Label><Input value={newModule.duration} onChange={(e) => setNewModule(p => ({ ...p, duration: e.target.value }))} placeholder="e.g., 2 weeks" /></div>
                        <div className="space-y-2"><Label>Lessons</Label><Input type="number" value={newModule.lessons} onChange={(e) => setNewModule(p => ({ ...p, lessons: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Assignments</Label><Input type="number" value={newModule.assignments} onChange={(e) => setNewModule(p => ({ ...p, assignments: e.target.value }))} /></div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddModuleOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddModule}>Add Module</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{module.title}</h4>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditModule(module.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteModule(module.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {editingModule === module.id ? (
                      <div className="space-y-3 border-t pt-3">
                        <div className="space-y-2"><Label>Title</Label><Input value={module.title} onChange={(e) => handleModuleFieldChange(module.id, 'title', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Description</Label><Textarea value={module.description} onChange={(e) => handleModuleFieldChange(module.id, 'description', e.target.value)} /></div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2"><Label>Duration</Label><Input value={module.duration} onChange={(e) => handleModuleFieldChange(module.id, 'duration', e.target.value)} /></div>
                          <div className="space-y-2"><Label>Lessons</Label><Input type="number" value={String(module.lessons)} onChange={(e) => handleModuleFieldChange(module.id, 'lessons', e.target.value)} /></div>
                          <div className="space-y-2"><Label>Assignments</Label><Input type="number" value={String(module.assignments)} onChange={(e) => handleModuleFieldChange(module.id, 'assignments', e.target.value)} /></div>
                        </div>
                        <Button size="sm" onClick={() => { setEditingModule(null); toast({ title: "Module updated" }); }}>Done Editing</Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Duration: {module.duration}</span>
                          <span>Lessons: {module.lessons}</span>
                          <span>Assignments: {module.assignments}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Enrollment Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div><Label>Enable Enrollment</Label><p className="text-sm text-muted-foreground">Allow new learners to enroll</p></div>
                <Switch checked={formData.enrollmentEnabled} onCheckedChange={(v) => handleInputChange('enrollmentEnabled', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Auto Enrollment</Label><p className="text-sm text-muted-foreground">Automatically enroll eligible learners</p></div>
                <Switch checked={enrollmentSettings.autoEnrollment} onCheckedChange={(v) => handleEnrollmentChange('autoEnrollment', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Require Approval</Label><p className="text-sm text-muted-foreground">Admin approval required for enrollment</p></div>
                <Switch checked={enrollmentSettings.requireApproval} onCheckedChange={(v) => handleEnrollmentChange('requireApproval', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Cohort-Based Learning</Label><p className="text-sm text-muted-foreground">Group learners in cohorts with start dates</p></div>
                <Switch checked={enrollmentSettings.cohortBased} onCheckedChange={(v) => handleEnrollmentChange('cohortBased', v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Enrollments</Label>
                  <Input value={formData.maxEnrollments} onChange={(e) => handleInputChange('maxEnrollments', e.target.value)} type="number" />
                </div>
                {enrollmentSettings.cohortBased && (
                  <div className="space-y-2">
                    <Label>Max Cohort Size</Label>
                    <Input value={enrollmentSettings.maxCohortSize} onChange={(e) => handleEnrollmentChange('maxCohortSize', e.target.value)} type="number" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Set Enrollment Deadline</Label><p className="text-sm text-muted-foreground">Set a deadline for enrollment</p></div>
                <Switch checked={enrollmentSettings.deadlineEnabled} onCheckedChange={(v) => handleEnrollmentChange('deadlineEnabled', v)} />
              </div>
              {enrollmentSettings.deadlineEnabled && (
                <div className="space-y-2">
                  <Label>Enrollment Deadline</Label>
                  <Input type="datetime-local" value={enrollmentSettings.deadline} onChange={(e) => handleEnrollmentChange('deadline', e.target.value)} />
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
                <Button variant="outline" size="sm" onClick={handleExportLearners}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Learners</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Learners to Learning Path</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Add Individual Learner</Label><Input placeholder="Search by name or email..." /></div>
                      <div className="space-y-2"><Label>Bulk Upload</Label><Input type="file" accept=".csv" /></div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={() => toast({ title: "Learners added successfully" })}>Add Learners</Button>
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
                        <Button variant="outline" size="sm" onClick={() => navigate(`/learning-paths/${id || '1'}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">Enrolled: {learner.enrolledDate}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Learning Path Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div><Label>Active Status</Label><p className="text-sm text-muted-foreground">Enable or disable this learning path</p></div>
                <Switch checked={formData.isActive} onCheckedChange={(v) => handleInputChange('isActive', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Certification Enabled</Label><p className="text-sm text-muted-foreground">Issue certificates upon completion</p></div>
                <Switch checked={formData.certificationEnabled} onCheckedChange={(v) => handleInputChange('certificationEnabled', v)} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                <div className="border border-destructive rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-medium">Archive Learning Path</h4>
                    <p className="text-sm text-muted-foreground">Archive this learning path. It will no longer be visible to learners.</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleArchive}>Archive Learning Path</Button>
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
