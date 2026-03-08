import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAIInsights from "@/components/ai/AdminAIInsights";
import ContentManagementAI from "@/components/ai/ContentManagementAI";
import LearningPathAnalytics from "@/components/ai/LearningPathAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, BarChart3, FileText, Users, TrendingUp, AlertTriangle, Award, Target, BookOpen } from "lucide-react";

const learnerSegments = [
  { segment: "High Performers", count: 342, avgCompletion: 94, avgScore: 92, trend: "+5%", color: "bg-green-500" },
  { segment: "Steady Learners", count: 1205, avgCompletion: 72, avgScore: 78, trend: "+2%", color: "bg-blue-500" },
  { segment: "At-Risk Learners", count: 189, avgCompletion: 35, avgScore: 55, trend: "-8%", color: "bg-yellow-500" },
  { segment: "Disengaged", count: 64, avgCompletion: 12, avgScore: 40, trend: "-15%", color: "bg-red-500" },
];

const topSkillGaps = [
  { skill: "Data Analysis", gap: 68, demand: "High", recommended: "Advanced Analytics Path" },
  { skill: "Cloud Architecture", gap: 55, demand: "Critical", recommended: "AWS/Azure Certification" },
  { skill: "Project Management", gap: 42, demand: "Medium", recommended: "PMP Preparation" },
  { skill: "Cybersecurity", gap: 38, demand: "High", recommended: "Security Fundamentals" },
  { skill: "AI/ML Basics", gap: 72, demand: "Critical", recommended: "AI Foundations Path" },
];

const learnerInsights = [
  { insight: "189 learners haven't logged in for 14+ days — consider sending re-engagement emails", type: "warning", impact: "High" },
  { insight: "Completion rates peak on Tuesdays and Wednesdays — schedule new content releases mid-week", type: "optimization", impact: "Medium" },
  { insight: "Video content has 2.3x higher engagement than text-based modules", type: "insight", impact: "High" },
  { insight: "Learners who complete prerequisites score 34% higher on assessments", type: "insight", impact: "High" },
  { insight: "Mobile learners complete 40% fewer modules — optimize mobile experience", type: "warning", impact: "Medium" },
];

const AIAdminPage = () => {
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Admin Center</h1>
          <p className="text-muted-foreground">
            Intelligent insights and automated content management for learning administrators
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content AI
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Path Analytics
          </TabsTrigger>
          <TabsTrigger value="learners" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Learner Intelligence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-6">
          <AdminAIInsights />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentManagementAI />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <LearningPathAnalytics />
        </TabsContent>

        <TabsContent value="learners" className="mt-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Active Learners</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,800</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Engagement Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">+3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At-Risk Learners</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">253</div>
                <p className="text-xs text-muted-foreground">Needs intervention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certifications Earned</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">487</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Learner Segments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Learner Segments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {learnerSegments.map((seg) => (
                  <div key={seg.segment} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${seg.color}`} />
                        <span className="font-medium text-sm">{seg.segment}</span>
                        <Badge variant="outline" className="text-xs">{seg.count}</Badge>
                      </div>
                      <span className={`text-xs font-medium ${seg.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {seg.trend}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground pl-5">
                      <div>Avg. Completion: <span className="font-medium text-foreground">{seg.avgCompletion}%</span></div>
                      <div>Avg. Score: <span className="font-medium text-foreground">{seg.avgScore}%</span></div>
                    </div>
                    <Progress value={seg.avgCompletion} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skill Gap Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Skill Gaps (AI-Detected)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topSkillGaps.map((gap) => (
                  <div key={gap.skill} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{gap.skill}</span>
                      <Badge variant={gap.demand === "Critical" ? "destructive" : gap.demand === "High" ? "default" : "secondary"}>
                        {gap.demand}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={gap.gap} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-8">{gap.gap}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      Recommended: {gap.recommended}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Generated Learner Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {learnerInsights.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  {item.type === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  ) : item.type === "optimization" ? (
                    <Target className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  ) : (
                    <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{item.insight}</p>
                  </div>
                  <Badge variant={item.impact === "High" ? "default" : "secondary"} className="shrink-0">
                    {item.impact} Impact
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAdminPage;
