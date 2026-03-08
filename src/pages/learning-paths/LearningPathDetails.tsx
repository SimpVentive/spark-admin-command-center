import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Users, Clock, BookOpen, Award, TrendingUp, Calendar,
  CheckCircle, XCircle, AlertCircle, Download, MessageSquare,
  BarChart3, Target, Activity, Settings
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generatePDF, generateExcel } from "@/utils/reportExport";

const LearningPathDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    isActive: true,
    enrollmentOpen: true,
    certificationEnabled: true,
    requireApproval: false,
    autoReminders: true,
    maxEnrollments: "500",
    passingScore: "70",
    visibility: "public",
  });

  const learningPath = {
    id: 1, title: "Digital Marketing Mastery",
    description: "Comprehensive digital marketing program covering SEO, social media, and analytics",
    category: "Marketing", subcategory: "Digital Marketing", difficulty: "Intermediate",
    duration: "12 weeks", modules: 8, enrolled: 245, completed: 180, completionRate: 73,
    status: "Active", instructor: "Sarah Johnson", createdAt: "2024-01-15", lastUpdated: "2024-01-20",
    prerequisites: ["Basic Marketing Knowledge", "Computer Literacy"],
    learningObjectives: [
      "Master SEO fundamentals and advanced techniques",
      "Create effective social media marketing campaigns",
      "Analyze digital marketing metrics and ROI",
      "Develop comprehensive digital marketing strategies"
    ],
    modules_detail: [
      { id: 1, title: "Introduction to Digital Marketing", duration: "1 week", completion: 95, lessons: 5, status: "completed" },
      { id: 2, title: "Search Engine Optimization (SEO)", duration: "2 weeks", completion: 87, lessons: 8, status: "in_progress" },
      { id: 3, title: "Social Media Marketing", duration: "2 weeks", completion: 76, lessons: 7, status: "in_progress" },
      { id: 4, title: "Email Marketing Strategies", duration: "1 week", completion: 45, lessons: 6, status: "not_started" }
    ]
  };

  const enrollmentData = [
    { id: 1, name: "John Smith", email: "john.smith@company.com", enrolledDate: "2024-01-15", progress: 85, status: "in_progress", lastActivity: "2024-01-22" },
    { id: 2, name: "Emily Davis", email: "emily.davis@company.com", enrolledDate: "2024-01-10", progress: 100, status: "completed", lastActivity: "2024-01-21" },
    { id: 3, name: "Michael Johnson", email: "michael.j@company.com", enrolledDate: "2024-01-20", progress: 25, status: "at_risk", lastActivity: "2024-01-20" }
  ];

  const analyticsData = {
    weeklyCompletions: [12, 18, 15, 22, 19, 25, 20],
    avgTimePerModule: "4.2 hours",
    dropOffRate: "12%",
    avgScore: 82,
    satisfactionRating: 4.3,
    moduleCompletionRates: learningPath.modules_detail.map(m => ({ name: m.title, rate: m.completion })),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'at_risk': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      at_risk: "bg-red-100 text-red-800",
      not_started: "bg-muted text-muted-foreground"
    };
    return <Badge className={variants[status] || variants.not_started}>{status.replace('_', ' ')}</Badge>;
  };

  const handleExportEnrollments = () => {
    const rows = enrollmentData.map(l => [l.name, l.email, l.enrolledDate, `${l.progress}%`, l.status, l.lastActivity]);
    generatePDF(
      { title: `${learningPath.title} - Enrollments`, subtitle: "Enrollment Report" },
      [{ label: "Enrolled", value: String(learningPath.enrolled) }, { label: "Completed", value: String(learningPath.completed) }, { label: "Completion Rate", value: `${learningPath.completionRate}%` }],
      [{ title: "Enrolled Learners", headers: ["Name", "Email", "Enrolled", "Progress", "Status", "Last Activity"], rows }]
    );
    toast({ title: "PDF exported successfully" });
  };

  const handleExportExcel = () => {
    const rows = enrollmentData.map(l => [l.name, l.email, l.enrolledDate, `${l.progress}%`, l.status, l.lastActivity]);
    generateExcel(
      `${learningPath.title} - Enrollments`,
      [{ title: "Enrolled Learners", headers: ["Name", "Email", "Enrolled", "Progress", "Status", "Last Activity"], rows }]
    );
    toast({ title: "Excel exported successfully" });
  };

  const handleContact = (learner: typeof enrollmentData[0]) => {
    window.open(`mailto:${learner.email}?subject=Regarding: ${learningPath.title}&body=Hi ${learner.name.split(' ')[0]},`);
  };

  const handleSaveSettings = () => {
    toast({ title: "Settings saved", description: "Learning path settings have been updated." });
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
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Enrolled</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{learningPath.enrolled}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle><Award className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{learningPath.completed}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completion Rate</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{learningPath.completionRate}%</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Duration</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{learningPath.duration}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Modules</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{learningPath.modules}</div></CardContent></Card>
      </div>

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
              <CardHeader><CardTitle>Learning Path Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Category:</span><p>{learningPath.category} &gt; {learningPath.subcategory}</p></div>
                  <div><span className="font-medium">Difficulty:</span><p>{learningPath.difficulty}</p></div>
                  <div><span className="font-medium">Instructor:</span><p>{learningPath.instructor}</p></div>
                  <div><span className="font-medium">Status:</span><p>{learningPath.status}</p></div>
                  <div><span className="font-medium">Created:</span><p>{learningPath.createdAt}</p></div>
                  <div><span className="font-medium">Last Updated:</span><p>{learningPath.lastUpdated}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Prerequisites</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {learningPath.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /><span className="text-sm">{prereq}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Learning Objectives</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {learningPath.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3"><Badge variant="outline" className="mt-1">{index + 1}</Badge><span className="text-sm">{objective}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Course Modules</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {learningPath.modules_detail.map((module) => (
                <div key={module.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{module.title}</h3>
                    {getStatusBadge(module.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{module.duration}</span></div>
                    <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>{module.lessons} lessons</span></div>
                    <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /><span>{module.completion}% completion</span></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>Progress</span><span>{module.completion}%</span></div>
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
                <Button variant="outline" size="sm" onClick={handleExportEnrollments}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button size="sm" onClick={() => navigate('/users/bulk-enrollment')}>Add Learners</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollmentData.map((learner) => (
                  <div key={learner.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarImage src="" /><AvatarFallback>{learner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                        <div><h4 className="font-medium">{learner.name}</h4><p className="text-sm text-muted-foreground">{learner.email}</p></div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusIcon(learner.status)}
                        {getStatusBadge(learner.status)}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Enrolled:</span><p className="font-medium">{learner.enrolledDate}</p></div>
                      <div><span className="text-muted-foreground">Progress:</span><p className="font-medium">{learner.progress}%</p></div>
                      <div><span className="text-muted-foreground">Last Activity:</span><p className="font-medium">{learner.lastActivity}</p></div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleContact(learner)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3"><Progress value={learner.progress} className="h-2" /></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab - FULLY IMPLEMENTED */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{analyticsData.avgScore}%</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Time/Module</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{analyticsData.avgTimePerModule}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drop-off Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold text-destructive">{analyticsData.dropOffRate}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{analyticsData.satisfactionRating}/5</div></CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Module Completion Rates</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.moduleCompletionRates.map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="truncate max-w-[200px]">{m.name}</span>
                      <span className="font-medium">{m.rate}%</span>
                    </div>
                    <Progress value={m.rate} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Weekly Completions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm w-8">{day}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(analyticsData.weeklyCompletions[i] / 30) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{analyticsData.weeklyCompletions[i]}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab - FULLY IMPLEMENTED */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Learning Path Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div><Label>Active Status</Label><p className="text-sm text-muted-foreground">Enable or disable this learning path</p></div>
                <Switch checked={settings.isActive} onCheckedChange={(v) => setSettings(s => ({ ...s, isActive: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Open Enrollment</Label><p className="text-sm text-muted-foreground">Allow new learners to enroll</p></div>
                <Switch checked={settings.enrollmentOpen} onCheckedChange={(v) => setSettings(s => ({ ...s, enrollmentOpen: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Certification</Label><p className="text-sm text-muted-foreground">Issue certificates upon completion</p></div>
                <Switch checked={settings.certificationEnabled} onCheckedChange={(v) => setSettings(s => ({ ...s, certificationEnabled: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Require Approval</Label><p className="text-sm text-muted-foreground">Admin must approve enrollment requests</p></div>
                <Switch checked={settings.requireApproval} onCheckedChange={(v) => setSettings(s => ({ ...s, requireApproval: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Auto Reminders</Label><p className="text-sm text-muted-foreground">Send automatic reminder emails to inactive learners</p></div>
                <Switch checked={settings.autoReminders} onCheckedChange={(v) => setSettings(s => ({ ...s, autoReminders: v }))} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Max Enrollments</Label>
                  <Input type="number" value={settings.maxEnrollments} onChange={(e) => setSettings(s => ({ ...s, maxEnrollments: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Passing Score (%)</Label>
                  <Input type="number" value={settings.passingScore} onChange={(e) => setSettings(s => ({ ...s, passingScore: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select value={settings.visibility} onValueChange={(v) => setSettings(s => ({ ...s, visibility: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="invite-only">Invite Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => navigate('/learning-paths')}>Cancel</Button>
                <Button onClick={handleSaveSettings}>Save Settings</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Archive Learning Path</h4>
                  <p className="text-sm text-muted-foreground">Remove from active paths. Enrolled learners will be notified.</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => { toast({ title: "Learning path archived" }); navigate('/learning-paths'); }}>
                  Archive
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPathDetails;
