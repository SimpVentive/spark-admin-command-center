import { useState } from "react";
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

const CourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const courses = [
    {
      id: 1,
      title: "Machine Learning Specialization",
      provider: "Coursera",
      instructor: "Andrew Ng",
      rating: 4.9,
      students: 185000,
      duration: "11 weeks",
      category: "Technology",
      price: "$49/month",
      description: "Master machine learning fundamentals and build real-world applications.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
      inCatalog: true,
      enrollments: 45
    },
    {
      id: 2,
      title: "Digital Marketing Strategy",
      provider: "LinkedIn Learning",
      instructor: "Sarah Miller",
      rating: 4.7,
      students: 67000,
      duration: "6 weeks",
      category: "Marketing",
      price: "$29.99/month",
      description: "Learn to create effective digital marketing campaigns.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      inCatalog: false,
      enrollments: 0
    },
    {
      id: 3,
      title: "Project Management Professional",
      provider: "Coursera",
      instructor: "Google",
      rating: 4.8,
      students: 120000,
      duration: "8 weeks",
      category: "Management",
      price: "$39/month",
      description: "Prepare for PMP certification with Google's comprehensive course.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      inCatalog: true,
      enrollments: 23
    }
  ];

  const providers = ["Coursera", "LinkedIn Learning", "Udemy Business"];
  const categories = ["Technology", "Marketing", "Management", "Finance", "Design"];

  const filteredCourses = courses.filter(course => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedProvider === "all" || course.provider === selectedProvider) &&
      (selectedCategory === "all" || course.category === selectedCategory)
    );
  });

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
            <div className="text-2xl font-bold">7,700</div>
            <p className="text-xs text-muted-foreground">From all providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Catalog</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Organization catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">390</div>
            <p className="text-xs text-muted-foreground">Current learners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
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
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <Badge variant={course.inCatalog ? "default" : "secondary"}>
                  {course.inCatalog ? "In Catalog" : "Available"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{course.provider}</span>
                <span className="text-muted-foreground">{course.price}</span>
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
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
              </div>

              {course.inCatalog && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Organization enrollments: </span>
                  <span className="font-medium">{course.enrollments}</span>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                {course.inCatalog ? (
                  <Button size="sm" className="flex-1">
                    Manage
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1">
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