import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Plus, 
  BookOpen,
  Eye,
  ShoppingCart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CoursePreviewDialog } from "@/components/mooc/CoursePreviewDialog";
import { CourseManageDialog } from "@/components/mooc/CourseManageDialog";

const CourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('mooc_courses')
        .select(`
          *,
          mooc_providers (
            name,
            provider_type
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses.",
          variant: "destructive"
        });
        return;
      }

      setCourses(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (course) => {
    toast({
      title: "Course Preview",
      description: `Opening preview for ${course.title}...`
    });
    // In a real implementation, this would open a course preview modal or navigate to course details
  };

  const handleAddToCatalog = async (courseId, courseTitle) => {
    try {
      const { error } = await supabase
        .from('mooc_courses')
        .update({ in_catalog: true })
        .eq('id', courseId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `${courseTitle} added to organization catalog.`
      });

      // Refresh courses
      fetchCourses();
    } catch (error) {
      console.error('Error adding to catalog:', error);
      toast({
        title: "Error",
        description: "Failed to add course to catalog.",
        variant: "destructive"
      });
    }
  };

  const handleManage = (course) => {
    // This function is now handled by the CourseManageDialog component
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const providers = ["Coursera", "LinkedIn Learning", "Udemy Business"];
  const categories = ["Technology", "Marketing", "Management", "Finance", "Design"];

  const filteredCourses = courses.filter(course => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedProvider === "all" || course.provider_name === selectedProvider) &&
      (selectedCategory === "all" || course.category === selectedCategory)
    );
  });

  const totalAvailable = courses.length;
  const inCatalog = courses.filter(c => c.in_catalog).length;
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.organization_enrollments || 0), 0);
  const avgRating = courses.length > 0 ? 
    (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MOOC Course Catalog</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage courses from integrated MOOC platforms.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Available</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAvailable}</div>
            <p className="text-xs text-muted-foreground">From all providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Catalog</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inCatalog}</div>
            <p className="text-xs text-muted-foreground">Organization catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Current learners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}</div>
            <p className="text-xs text-muted-foreground">Catalog courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20">
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <Badge variant={course.in_catalog ? "default" : "secondary"}>
                  {course.in_catalog ? "In Catalog" : "Available"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{course.provider_name}</span>
                <span className="text-muted-foreground">${course.price}/month</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{course.instructor}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{course.duration_weeks} weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{course.student_count?.toLocaleString()}</span>
                </div>
              </div>

              {course.in_catalog && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Organization enrollments: </span>
                  <span className="font-medium">{course.organization_enrollments}</span>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <CoursePreviewDialog course={course} />
                {course.in_catalog ? (
                  <CourseManageDialog course={course} onUpdate={fetchCourses} />
                ) : (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleAddToCatalog(course.id, course.title)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Catalog
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseCatalog;