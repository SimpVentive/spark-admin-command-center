import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Clock, Star, Play, Download } from "lucide-react";

const MOOC = () => {
  const courses = [
    {
      id: 1,
      title: "Digital Marketing Fundamentals",
      description: "Learn the basics of digital marketing including SEO, social media, and content marketing.",
      instructor: "Sarah Johnson",
      duration: "8 weeks",
      students: 1234,
      rating: 4.8,
      progress: 65,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      enrolled: true
    },
    {
      id: 2,
      title: "Data Science with Python",
      description: "Master data analysis, visualization, and machine learning with Python.",
      instructor: "Dr. Michael Chen",
      duration: "12 weeks",
      students: 892,
      rating: 4.9,
      progress: 0,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
      enrolled: false
    },
    {
      id: 3,
      title: "Project Management Professional",
      description: "Comprehensive PMP certification preparation course.",
      instructor: "Lisa Rodriguez",
      duration: "10 weeks",
      students: 567,
      rating: 4.7,
      progress: 100,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      enrolled: true
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">MOOC Integration</h1>
        <p className="text-muted-foreground mt-2">
          Access and manage Massive Open Online Courses integrated with your learning platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Available MOOCs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Completed courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Total learning time</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <Badge variant={course.enrolled ? "default" : "secondary"}>
                  {course.enrolled ? "Enrolled" : "Available"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
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
              
              {course.enrolled && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                {course.enrolled ? (
                  <>
                    <Button className="flex-1" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button className="w-full" size="sm">
                    Enroll Now
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

export default MOOC;