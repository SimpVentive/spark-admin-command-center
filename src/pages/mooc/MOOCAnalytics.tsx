import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Clock, 
  Award,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";

const MOOCAnalytics = () => {
  const analyticsData = {
    totalLearners: 234,
    activeEnrollments: 189,
    completionRate: 78,
    avgTimeToComplete: 6.2,
    totalHoursLearned: 1847,
    certificatesEarned: 145
  };

  const departmentData = [
    { name: "Engineering", enrollments: 89, completions: 67, rate: 75 },
    { name: "Marketing", enrollments: 45, completions: 38, rate: 84 },
    { name: "Sales", enrollments: 34, completions: 29, rate: 85 },
    { name: "HR", enrollments: 28, completions: 22, rate: 79 },
    { name: "Operations", enrollments: 38, completions: 31, rate: 82 }
  ];

  const popularCourses = [
    { name: "Machine Learning Specialization", enrollments: 67, rating: 4.9, completions: 52 },
    { name: "Digital Marketing Strategy", enrollments: 45, rating: 4.7, completions: 38 },
    { name: "Project Management Professional", enrollments: 43, rating: 4.8, completions: 35 },
    { name: "Data Analysis with Python", enrollments: 38, rating: 4.6, completions: 29 },
    { name: "UX Design Fundamentals", enrollments: 31, rating: 4.8, completions: 26 }
  ];

  const monthlyProgress = [
    { month: "Oct", enrollments: 45, completions: 38 },
    { month: "Nov", enrollments: 52, completions: 41 },
    { month: "Dec", enrollments: 48, completions: 39 },
    { month: "Jan", enrollments: 67, completions: 45 },
    { month: "Feb", enrollments: 58, completions: 42 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MOOC Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor learning progress, engagement, and outcomes across your organization.
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalLearners}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learning</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
            <p className="text-xs text-muted-foreground">+5% improvement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgTimeToComplete}</div>
            <p className="text-xs text-muted-foreground">weeks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalHoursLearned}</div>
            <p className="text-xs text-muted-foreground">Total this year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.certificatesEarned}</div>
            <p className="text-xs text-muted-foreground">Earned this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Department Performance
          </CardTitle>
          <CardDescription>
            Completion rates and enrollment statistics by department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{dept.name}</h3>
                    <Badge variant="secondary">{dept.rate}% completion</Badge>
                  </div>
                  <div className="flex gap-6 text-sm text-muted-foreground mb-2">
                    <span>{dept.enrollments} enrollments</span>
                    <span>{dept.completions} completions</span>
                  </div>
                  <Progress value={dept.rate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Most Popular Courses
            </CardTitle>
            <CardDescription>
              Top performing courses by enrollment and completion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{course.name}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span>{course.enrollments} enrolled</span>
                      <span>{course.completions} completed</span>
                      <span>★ {course.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {Math.round((course.completions / course.enrollments) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">completion</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Trends
            </CardTitle>
            <CardDescription>
              Enrollment and completion trends over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyProgress.map((month, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{month.month}</div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{month.enrollments} enrolled</span>
                      <span>{month.completions} completed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(month.completions / month.enrollments) * 100} 
                      className="h-2 w-20" 
                    />
                    <span className="text-xs w-10 text-right">
                      {Math.round((month.completions / month.enrollments) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Peak Learning Times</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Most learning activity occurs between 9 AM - 11 AM and 2 PM - 4 PM
              </p>
              <Badge variant="secondary">Business Hours Focused</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Completion Patterns</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Courses with 6-8 week duration show highest completion rates
              </p>
              <Badge variant="secondary">Optimal Duration</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Engagement Factors</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Interactive courses with peer discussions have 23% higher engagement
              </p>
              <Badge variant="secondary">Social Learning</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MOOCAnalytics;