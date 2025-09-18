import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Users, 
  Clock, 
  BookOpen,
  MoreHorizontal,
  Star,
  Copy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LearningPathWizard from "./LearningPathWizard";
import LearningPathDetail from "./LearningPathDetail";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  modules: number;
  enrollments: number;
  completionRate: number;
  status: "active" | "draft" | "archived";
  createdBy: string;
  createdAt: string;
  rating: number;
}

const LearningPathManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  const learningPaths: LearningPath[] = [
    {
      id: "1",
      title: "Digital Marketing Fundamentals",
      description: "Master the basics of digital marketing including SEO, social media, and analytics",
      category: "Marketing",
      level: "Beginner",
      duration: "8 weeks",
      modules: 12,
      enrollments: 245,
      completionRate: 87,
      status: "active",
      createdBy: "Sarah Johnson",
      createdAt: "2024-01-15",
      rating: 4.8
    },
    {
      id: "2",
      title: "Leadership Excellence Program",
      description: "Develop essential leadership skills for modern managers and executives",
      category: "Leadership",
      level: "Intermediate",
      duration: "12 weeks",
      modules: 18,
      enrollments: 189,
      completionRate: 92,
      status: "active",
      createdBy: "Mike Chen",
      createdAt: "2024-02-01",
      rating: 4.9
    },
    {
      id: "3",
      title: "Data Analysis with Python",
      description: "Learn data analysis and visualization using Python and pandas",
      category: "Technology",
      level: "Advanced",
      duration: "10 weeks",
      modules: 15,
      enrollments: 156,
      completionRate: 78,
      status: "active",
      createdBy: "Emma Davis",
      createdAt: "2024-02-15",
      rating: 4.7
    },
    {
      id: "4",
      title: "Project Management Essentials",
      description: "Comprehensive guide to project management methodologies and tools",
      category: "Management",
      level: "Beginner",
      duration: "6 weeks",
      modules: 10,
      enrollments: 98,
      completionRate: 85,
      status: "draft",
      createdBy: "Tom Wilson",
      createdAt: "2024-03-01",
      rating: 0
    }
  ];

  const categories = ["all", "Marketing", "Leadership", "Technology", "Management", "Sales", "Finance"];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];
  const statuses = ["all", "active", "draft", "archived"];

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || path.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || path.level === selectedLevel;
    const matchesStatus = selectedStatus === "all" || path.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Intermediate": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (showWizard) {
    return <LearningPathWizard onClose={() => setShowWizard(false)} />;
  }

  if (selectedPath) {
    return <LearningPathDetail path={selectedPath} onBack={() => setSelectedPath(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Learning Paths</h2>
          <p className="text-muted-foreground">Manage and organize your learning content</p>
        </div>
        <Button onClick={() => setShowWizard(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Path
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search learning paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPaths.map((path) => (
          <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{path.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(path.status)}>
                      {path.status}
                    </Badge>
                    <Badge variant="outline" className={getLevelColor(path.level)}>
                      {path.level}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedPath(path)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Path
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{path.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{path.modules} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{path.enrollments} enrolled</span>
                </div>
                {path.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{path.rating}</span>
                  </div>
                )}
              </div>

              {path.status === "active" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>{path.completionRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${path.completionRate}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {path.createdBy.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{path.createdBy}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedPath(path)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPaths.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No learning paths found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or create a new learning path.
            </p>
            <Button onClick={() => setShowWizard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Path
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningPathManagement;