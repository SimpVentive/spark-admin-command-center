import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  GripVertical,
  Plus,
  Search,
  PlayCircle,
  FileText,
  Award,
  Image,
  Settings,
  Save,
  Eye,
  Clock,
  Users,
  Star,
  Filter,
  BookOpen,
  Target,
  CheckCircle,
  X,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface ContentModule {
  id: string;
  title: string;
  type: "video" | "document" | "interactive" | "assessment" | "image";
  duration: string;
  description: string;
  thumbnail?: string;
  rating: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

interface PathModule extends ContentModule {
  order: number;
  isRequired: boolean;
  prerequisites: string[];
}

interface PathBuilderProps {}

const PathBuilderInterface = ({}: PathBuilderProps) => {
  const [pathModules, setPathModules] = useState<PathModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<PathModule | null>(null);
  const [showModuleConfig, setShowModuleConfig] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [pathMetadata, setPathMetadata] = useState({
    title: "New Learning Path",
    description: "",
    objectives: "",
    targetAudience: "",
    estimatedDuration: "",
    category: ""
  });

  // Mock content library
  const availableContent: ContentModule[] = [
    {
      id: "content-1",
      title: "Introduction to Digital Marketing",
      type: "video",
      duration: "45 min",
      description: "Comprehensive overview of digital marketing fundamentals",
      rating: 4.8,
      difficulty: "beginner",
      tags: ["marketing", "digital", "fundamentals"],
      thumbnail: "/api/placeholder/150/100"
    },
    {
      id: "content-2", 
      title: "SEO Best Practices",
      type: "document",
      duration: "30 min",
      description: "Essential SEO techniques for better rankings",
      rating: 4.7,
      difficulty: "intermediate",
      tags: ["seo", "marketing", "optimization"]
    },
    {
      id: "content-3",
      title: "Social Media Strategy Quiz",
      type: "assessment",
      duration: "20 min", 
      description: "Test your social media knowledge",
      rating: 4.6,
      difficulty: "intermediate",
      tags: ["social media", "assessment", "strategy"]
    },
    {
      id: "content-4",
      title: "Analytics Dashboard Tutorial",
      type: "interactive",
      duration: "60 min",
      description: "Hands-on analytics training",
      rating: 4.9,
      difficulty: "advanced",
      tags: ["analytics", "tutorial", "interactive"]
    }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPathModules((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        return reorderedItems.map((item, index) => ({ ...item, order: index + 1 }));
      });
    }
  }, []);

  const addModuleToPath = (content: ContentModule) => {
    const newModule: PathModule = {
      ...content,
      order: pathModules.length + 1,
      isRequired: true,
      prerequisites: []
    };
    
    setPathModules(prev => [...prev, newModule]);
    toast.success(`Added "${content.title}" to learning path`);
  };

  const removeModuleFromPath = (moduleId: string) => {
    setPathModules(prev => 
      prev.filter(module => module.id !== moduleId)
        .map((module, index) => ({ ...module, order: index + 1 }))
    );
    toast.success("Module removed from path");
  };

  const updateModuleConfig = (moduleId: string, config: Partial<PathModule>) => {
    setPathModules(prev =>
      prev.map(module =>
        module.id === moduleId ? { ...module, ...config } : module
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <PlayCircle className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      case "assessment": return <Award className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      case "interactive": return <Settings className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContent = availableContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || content.type === selectedType;
    const notInPath = !pathModules.some(module => module.id === content.id);
    
    return matchesSearch && matchesType && notInPath;
  });

  const calculateTotalDuration = () => {
    return pathModules.reduce((total, module) => {
      const duration = parseInt(module.duration);
      return total + (isNaN(duration) ? 0 : duration);
    }, 0);
  };

  const savePath = () => {
    if (!pathMetadata.title || pathModules.length === 0) {
      toast.error("Please add a title and at least one module");
      return;
    }
    
    // Simulate save operation
    console.log("Saving path:", { pathMetadata, pathModules });
    toast.success("Learning path saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Path Builder</h2>
          <p className="text-muted-foreground">
            Create and customize learning paths with drag-and-drop
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={savePath}>
            <Save className="h-4 w-4 mr-2" />
            Save Path
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Content Library Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Content Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Available Content */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredContent.map((content) => (
                <Card key={content.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      {getTypeIcon(content.type)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addModuleToPath(content)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <h4 className="font-medium text-sm leading-tight mb-1">{content.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {content.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{content.duration}</span>
                      </div>
                      <Badge variant="outline" className={getDifficultyColor(content.difficulty)}>
                        {content.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs">{content.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredContent.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No content found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Builder Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Path Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Path Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="path-title">Path Title</Label>
                  <Input
                    id="path-title"
                    value={pathMetadata.title}
                    onChange={(e) => setPathMetadata(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter path title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={pathMetadata.category} onValueChange={(value) => setPathMetadata(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={pathMetadata.description}
                    onChange={(e) => setPathMetadata(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the learning path objectives and outcomes"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Path Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Learning Path Structure
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{pathModules.length} modules</span>
                  <span>~{calculateTotalDuration()} minutes</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pathModules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Start Building Your Path</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag content from the library or click the + button to add modules
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={pathModules.map(m => m.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {pathModules.map((module, index) => (
                        <SortableModuleCard
                          key={module.id}
                          module={module}
                          index={index}
                          onRemove={removeModuleFromPath}
                          onConfig={(module) => {
                            setSelectedModule(module);
                            setShowModuleConfig(true);
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>

          {/* Path Summary */}
          {pathModules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Path Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{pathModules.length}</p>
                    <p className="text-sm text-muted-foreground">Total Modules</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{calculateTotalDuration()}</p>
                    <p className="text-sm text-muted-foreground">Minutes</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{pathModules.filter(m => m.isRequired).length}</p>
                    <p className="text-sm text-muted-foreground">Required</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{pathModules.filter(m => m.type === "assessment").length}</p>
                    <p className="text-sm text-muted-foreground">Assessments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Module Configuration Dialog */}
      <Dialog open={showModuleConfig} onOpenChange={setShowModuleConfig}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Module</DialogTitle>
          </DialogHeader>
          {selectedModule && (
            <ModuleConfigForm
              module={selectedModule}
              onSave={(config) => {
                updateModuleConfig(selectedModule.id, config);
                setShowModuleConfig(false);
              }}
              onCancel={() => setShowModuleConfig(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sortable Module Card Component
interface SortableModuleCardProps {
  module: PathModule;
  index: number;
  onRemove: (id: string) => void;
  onConfig: (module: PathModule) => void;
}

const SortableModuleCard = ({ module, index, onRemove, onConfig }: SortableModuleCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <PlayCircle className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      case "assessment": return <Award className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
    >
      <div
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
        {index + 1}
      </div>
      
      <div className="flex items-center gap-2 text-muted-foreground">
        {getTypeIcon(module.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{module.title}</h4>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{module.duration}</span>
          {module.isRequired && (
            <Badge variant="outline" className="text-xs">Required</Badge>
          )}
          {module.prerequisites.length > 0 && (
            <Badge variant="outline" className="text-xs">
              Has Prerequisites
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => onConfig(module)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onRemove(module.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Module Configuration Form Component
interface ModuleConfigFormProps {
  module: PathModule;
  onSave: (config: Partial<PathModule>) => void;
  onCancel: () => void;
}

const ModuleConfigForm = ({ module, onSave, onCancel }: ModuleConfigFormProps) => {
  const [config, setConfig] = useState({
    isRequired: module.isRequired,
    prerequisites: module.prerequisites
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Module: {module.title}</Label>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="required"
          checked={config.isRequired}
          onChange={(e) => setConfig(prev => ({ ...prev, isRequired: e.target.checked }))}
        />
        <Label htmlFor="required">This module is required</Label>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(config)}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default PathBuilderInterface;