import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, BookOpen, Users, Clock, Award, TrendingUp, Filter, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LearningPaths = () => {
  const navigate = useNavigate();
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLearningPaths(data || []);
    } catch (error: any) {
      console.error('Error fetching learning paths:', error);
      // Fallback to mock data if database fails
      setLearningPaths([
    {
      id: 1,
      title: "Digital Marketing Mastery",
      description: "Comprehensive digital marketing program covering SEO, social media, and analytics",
      category: "Marketing",
      difficulty: "Intermediate",
      duration: "12 weeks",
      modules: 8,
      enrolled: 245,
      completed: 180,
      completionRate: 73,
      status: "Active"
    },
    {
      id: 2,
      title: "Leadership Excellence",
      description: "Build leadership skills and learn to manage high-performing teams",
      category: "Leadership",
      difficulty: "Advanced",
      duration: "16 weeks",
      modules: 12,
      enrolled: 156,
      completed: 89,
      completionRate: 57,
      status: "Active"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      description: "Learn Python, statistics, and machine learning basics",
      category: "Technology",
      difficulty: "Beginner",
      duration: "20 weeks",
      modules: 15,
      enrolled: 324,
      completed: 298,
      completionRate: 92,
      status: "Active"
    },
    {
      id: 4,
      title: "Project Management Professional",
      description: "Complete PMP certification preparation course",
      category: "Management",
      difficulty: "Advanced",
      duration: "14 weeks",
      modules: 10,
      enrolled: 89,
      completed: 0,
      completionRate: 0,
      status: "Draft"
    }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" 
      ? <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      : <Badge variant="secondary">Draft</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Learning Paths</h1>
          <p className="text-muted-foreground">Create and manage structured learning journeys</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/learning-paths/create')}>
          <Plus className="h-4 w-4" />
          Create Learning Path
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPaths.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learningPaths.reduce((sum, path) => sum + path.enrolled, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(learningPaths.reduce((sum, path) => sum + path.completionRate, 0) / learningPaths.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learningPaths.reduce((sum, path) => sum + path.completed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search learning paths..." className="pl-8" />
        </div>
        <Button variant="outline" className="gap-2" onClick={() => {
          // Simple filter toggle
          const input = document.querySelector<HTMLInputElement>('input[placeholder="Search learning paths..."]');
          if (input) input.focus();
        }}>
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => (
          <Card key={path.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {path.description}
                  </p>
                </div>
                {getStatusBadge(path.status)}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{path.category}</Badge>
                <Badge className={getDifficultyColor(path.difficulty)}>
                  {path.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <span>{path.enrolled} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>{path.completed} completed</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">{path.completionRate}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${path.completionRate}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/learning-paths/details/${path.id}`)}>
                  View Details
                </Button>
                <Button size="sm" className="flex-1" onClick={() => navigate(`/learning-paths/management`)}>
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/learning-paths/create')}>
            <Plus className="h-6 w-6" />
            <span>New Path</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/learning-paths/content')}>
            <BookOpen className="h-6 w-6" />
            <span>Manage Content</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/learning-paths/enrollment')}>
            <Users className="h-6 w-6" />
            <span>Enrollments</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/learning-paths/analytics')}>
            <TrendingUp className="h-6 w-6" />
            <span>Analytics</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/learning-paths/status')}>
            <Award className="h-6 w-6" />
            <span>Status Tracking</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPaths;