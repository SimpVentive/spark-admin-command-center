import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MessageSquare
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const LearningPathDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data - in real app, fetch based on id
  const learningPath = {
    id: 1,
    title: "Digital Marketing Mastery",
    description: "Comprehensive digital marketing program covering SEO, social media, and analytics",
    category: "Marketing",
    subcategory: "Digital Marketing",
    difficulty: "Intermediate",
    duration: "12 weeks",
    modules: 8,
    enrolled: 245,
    completed: 180,
    completionRate: 73,
    status: "Active",
    instructor: "Sarah Johnson",
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    prerequisites: ["Basic Marketing Knowledge", "Computer Literacy"],
    learningObjectives: [
      "Master SEO fundamentals and advanced techniques",
      "Create effective social media marketing campaigns",
      "Analyze digital marketing metrics and ROI",
      "Develop comprehensive digital marketing strategies"
    ],
    modules_detail: [
      {
        id: 1,
        title: "Introduction to Digital Marketing",
        duration: "1 week",
        completion: 95,
        lessons: 5,
        status: "completed"
      },
      {
        id: 2, 
        title: "Search Engine Optimization (SEO)",
        duration: "2 weeks",
        completion: 87,
        lessons: 8,
        status: "in_progress"
      },
      {
        id: 3,
        title: "Social Media Marketing",
        duration: "2 weeks", 
        completion: 76,
        lessons: 7,
        status: "in_progress"
      },
      {
        id: 4,
        title: "Email Marketing Strategies",
        duration: "1 week",
        completion: 45,
        lessons: 6,
        status: "not_started"
      }
    ]
  };

  const enrollmentData = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      enrolledDate: "2024-01-15",
      progress: 85,
      status: "in_progress",
      lastActivity: "2024-01-22"
    },
    {
      id: 2,
      name: "Emily Davis", 
      email: "emily.davis@company.com",
      enrolledDate: "2024-01-10",
      progress: 100,
      status: "completed",
      lastActivity: "2024-01-21"
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.j@company.com", 
      enrolledDate: "2024-01-20",
      progress: 25,
      status: "at_risk",
      lastActivity: "2024-01-20"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'at_risk': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800", 
      at_risk: "bg-red-100 text-red-800",
      not_started: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[status as keyof typeof variants] || variants.not_started}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/learning-paths')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning Paths
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{learningPath.title}</h1>
          <p className="text-muted-foreground">{learningPath.description}</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPath.enrolled}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPath.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPath.completionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPath.duration}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPath.modules}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Path Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span>
                    <p>{learningPath.category} &gt; {learningPath.subcategory}</p>
                  </div>
                  <div>
                    <span className="font-medium">Difficulty:</span>
                    <p>{learningPath.difficulty}</p>
                  </div>
                  <div>
                    <span className="font-medium">Instructor:</span>
                    <p>{learningPath.instructor}</p>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <p>{learningPath.status}</p>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p>{learningPath.createdAt}</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>
                    <p>{learningPath.lastUpdated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {learningPath.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {learningPath.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningPath.modules_detail.map((module) => (
                <div key={module.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{module.title}</h3>
                    {getStatusBadge(module.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{module.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>{module.completion}% completion</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{module.completion}%</span>
                    </div>
                    <Progress value={module.completion} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Enrolled Learners</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">Add Learners</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollmentData.map((learner) => (
                  <div key={learner.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>{learner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{learner.name}</h4>
                          <p className="text-sm text-muted-foreground">{learner.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusIcon(learner.status)}
                        {getStatusBadge(learner.status)}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Enrolled:</span>
                        <p className="font-medium">{learner.enrolledDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Progress:</span>
                        <p className="font-medium">{learner.progress}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Activity:</span>
                        <p className="font-medium">{learner.lastActivity}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={learner.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPathDetails;