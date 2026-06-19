import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  BookOpen,
  Video,
  FileText,
  Link,
  Clock,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Upload,
  Play,
  Download
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ContentManagement = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  const learningPaths = [
    {
      id: "1",
      title: "Digital Marketing Mastery",
      modules: [
        {
          id: "m1",
          title: "Introduction to Digital Marketing",
          duration: "2 weeks",
          lessons: [
            { id: "l1", title: "What is Digital Marketing?", type: "video", duration: "15 min", status: "published" },
            { id: "l2", title: "Digital Marketing Landscape", type: "document", duration: "20 min", status: "published" },
            { id: "l3", title: "Setting Goals and KPIs", type: "video", duration: "25 min", status: "draft" },
            { id: "l4", title: "Module 1 Quiz", type: "assessment", duration: "10 min", status: "published" }
          ]
        },
        {
          id: "m2", 
          title: "Search Engine Optimization (SEO)",
          duration: "3 weeks",
          lessons: [
            { id: "l5", title: "SEO Fundamentals", type: "video", duration: "30 min", status: "published" },
            { id: "l6", title: "Keyword Research", type: "document", duration: "45 min", status: "published" },
            { id: "l7", title: "On-Page SEO", type: "video", duration: "35 min", status: "published" },
            { id: "l8", title: "Technical SEO", type: "link", duration: "40 min", status: "draft" }
          ]
        }
      ]
    }
  ];

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleAddContent = () => {
    toast({
      title: "Add Content",
      description: "Navigate to the upload tab or use bulk upload"
    });
  };

  const handleBulkUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`
      });
    }
  };

  const handleFilterStatus = (status: string) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  const handleFilterType = (type: string) => {
    setTypeFilter(typeFilter === type ? null : type);
  };

  const handleAddModule = () => {
    toast({
      title: "Add Module",
      description: "Dialog for creating new module would open here"
    });
  };

  const handlePreviewPath = () => {
    toast({
      title: "Preview",
      description: "Preview mode for learning path"
    });
  };

  const handleEditModule = (moduleId: string) => {
    toast({
      title: "Edit Module",
      description: `Editing module ${moduleId}`
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    toast({
      title: "Delete Module",
      description: "Module deleted successfully",
      variant: "destructive"
    });
  };

  const handleAddLesson = (moduleId: string) => {
    toast({
      title: "Add Lesson",
      description: `Adding lesson to module ${moduleId}`
    });
  };

  const handlePreviewLesson = (lessonId: string) => {
    const lesson = learningPaths[0].modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
    setSelectedLesson(lesson);
    toast({
      title: "Preview",
      description: `Previewing lesson: ${lesson?.title}`
    });
  };

  const handleEditLesson = (lessonId: string) => {
    const lesson = learningPaths[0].modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
    toast({
      title: "Edit Lesson",
      description: `Editing: ${lesson?.title}`
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    const lesson = learningPaths[0].modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
    toast({
      title: "Delete Lesson",
      description: `Deleted: ${lesson?.title}`,
      variant: "destructive"
    });
  };

  const handlePlayLesson = (lessonId: string) => {
    const lesson = learningPaths[0].modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
    setSelectedLesson(lesson);
    toast({
      title: "Playing",
      description: `Now playing: ${lesson?.title}`
    });
  };

  const handleDownloadLesson = (lessonId: string) => {
    const lesson = learningPaths[0].modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
    toast({
      title: "Download",
      description: `Downloading: ${lesson?.title}`
    });
  };

  // Filter lessons based on search and filters
  const filterLessons = (lessons: any[]) => {
    return lessons.filter(lesson => {
      const matchesSearch = !searchTerm || lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || lesson.status === statusFilter;
      const matchesType = !typeFilter || lesson.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'assessment': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "published" 
      ? <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>
      : <Badge variant="secondary">Draft</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Course Content Management</h1>
          <p className="text-muted-foreground">Manage modules, lessons, and resources for learning paths</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleBulkUpload}>
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".mp4,.avi,.mov,.pdf,.docx,.pptx,.zip,.jpg,.png,.gif"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button className="gap-2" onClick={handleAddContent}>
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant={statusFilter ? "default" : "outline"}
          onClick={() => handleFilterStatus("published")}
          className="gap-2"
        >
          Filter by Status {statusFilter && `(${statusFilter})`}
        </Button>
        <Button
          variant={typeFilter ? "default" : "outline"}
          onClick={() => handleFilterType("video")}
          className="gap-2"
        >
          Filter by Type {typeFilter && `(${typeFilter})`}
        </Button>
        {(searchTerm || statusFilter || typeFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter(null);
              setTypeFilter(null);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <Tabs defaultValue="tree" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tree">Tree View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="tree" className="space-y-4">
          {learningPaths.map((path) => (
            <Card key={path.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleAddModule}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Module
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Module</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Module Title</Label>
                            <Input placeholder="Enter module title" />
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <Input placeholder="e.g., 2 weeks" />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={() => handleAddModule()}>Add Module</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={handlePreviewPath}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {path.modules.map((module) => (
                    <Collapsible 
                      key={module.id}
                      open={expandedModules.includes(module.id)}
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <div className="border rounded-lg">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 hover:bg-accent cursor-pointer">
                            <div className="flex items-center gap-3">
                              {expandedModules.includes(module.id) ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium">{module.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {module.duration} • {module.lessons.length} lessons
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditModule(module.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteModule(module.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="border-t bg-muted/20">
                            <div className="p-4 space-y-2">
                              {filterLessons(module.lessons).map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between p-3 bg-background rounded border">
                                  <div className="flex items-center gap-3">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    {getTypeIcon(lesson.type)}
                                    <div>
                                      <h5 className="font-medium">{lesson.title}</h5>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {lesson.duration}
                                        </span>
                                        <span className="capitalize">{lesson.type}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(lesson.status)}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handlePreviewLesson(lesson.id)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditLesson(lesson.id)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteLesson(lesson.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2"
                                    onClick={() => handleAddLesson(module.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Lesson
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add New Lesson</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Lesson Title</Label>
                                      <Input placeholder="Enter lesson title" />
                                    </div>
                                    <div>
                                      <Label>Content Type</Label>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="video">Video</SelectItem>
                                          <SelectItem value="document">Document</SelectItem>
                                          <SelectItem value="link">Link</SelectItem>
                                          <SelectItem value="assessment">Assessment</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Duration</Label>
                                      <Input placeholder="e.g., 15 min" />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline">Cancel</Button>
                                      <Button onClick={() => handleAddLesson(module.id)}>Add Lesson</Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Content Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {learningPaths.flatMap(path =>
                  path.modules.flatMap(module =>
                    filterLessons(module.lessons).map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(lesson.type)}
                          <div>
                            <h5 className="font-medium">{lesson.title}</h5>
                            <p className="text-sm text-muted-foreground">
                              {module.title} • {lesson.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(lesson.status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayLesson(lesson.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLesson(lesson.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadLesson(lesson.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Content Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Content Files</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop files or click to browse. Supports videos, documents, and SCORM packages.
                </p>
                <Button onClick={handleBulkUpload}>Choose Files</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Supported Formats</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Videos: MP4, AVI, MOV, WMV</li>
                    <li>• Documents: PDF, DOCX, PPTX</li>
                    <li>• SCORM: ZIP packages</li>
                    <li>• Images: JPG, PNG, GIF</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Upload Guidelines</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Maximum file size: 500MB</li>
                    <li>• Use descriptive filenames</li>
                    <li>• Include metadata when possible</li>
                    <li>• Check copyright permissions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select content to preview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;