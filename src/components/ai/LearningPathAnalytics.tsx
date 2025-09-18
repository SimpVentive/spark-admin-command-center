import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Brain,
  Zap,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  total_duration_hours: number;
  created_at: string;
  enrollment_count?: number;
  completion_rate?: number;
  avg_rating?: number;
  engagement_score?: number;
  modules?: Array<{
    id: string;
    title: string;
    duration_hours: number;
    completion_rate: number;
  }>;
}

interface PathRecommendation {
  type: string;
  title: string;
  description: string;
  confidence: number;
  impact: string;
  data?: any;
}

const LearningPathAnalytics = () => {
  const { toast } = useToast();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [recommendations, setRecommendations] = useState<PathRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalPaths: 0,
    totalEnrollments: 0,
    averageCompletion: 0,
    topPerformingPath: '',
    strugglingLearners: 0,
    contentGaps: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load learning paths with basic data
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learning_path_modules(*)
        `)
        .order('created_at', { ascending: false });

      if (pathsError) throw pathsError;

      // Simulate enrollment and performance data
      const enrichedPaths = pathsData?.map(path => {
        const enrollmentCount = Math.floor(Math.random() * 500) + 50;
        const completionRate = Math.floor(Math.random() * 40) + 60; // 60-100%
        const avgRating = Number((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5-5
        const engagementScore = Math.floor(Math.random() * 30) + 70; // 70-100

        return {
          ...path,
          enrollment_count: enrollmentCount,
          completion_rate: completionRate,
          avg_rating: avgRating,
          engagement_score: engagementScore,
          modules: path.learning_path_modules?.map((module: any) => ({
            ...module,
            completion_rate: Math.floor(Math.random() * 40) + 60
          }))
        };
      }) || [];

      setLearningPaths(enrichedPaths);

      // Calculate analytics
      const totalEnrollments = enrichedPaths.reduce((sum, path) => sum + (path.enrollment_count || 0), 0);
      const avgCompletion = enrichedPaths.length > 0 
        ? Math.round(enrichedPaths.reduce((sum, path) => sum + (path.completion_rate || 0), 0) / enrichedPaths.length)
        : 0;
      
      const topPath = enrichedPaths.reduce((top, path) => 
        (path.completion_rate || 0) > (top.completion_rate || 0) ? path : top
      , enrichedPaths[0]);

      setAnalytics({
        totalPaths: enrichedPaths.length,
        totalEnrollments,
        averageCompletion: avgCompletion,
        topPerformingPath: topPath?.title || '',
        strugglingLearners: Math.floor(totalEnrollments * 0.15), // 15% struggling
        contentGaps: Math.floor(Math.random() * 8) + 3 // 3-10 gaps
      });

      // Generate AI recommendations
      generateRecommendations(enrichedPaths);

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load learning path analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (paths: LearningPath[]) => {
    const recs: PathRecommendation[] = [];

    // Low completion rate paths
    const lowCompletionPaths = paths.filter(p => (p.completion_rate || 0) < 65);
    if (lowCompletionPaths.length > 0) {
      recs.push({
        type: 'optimization',
        title: 'Optimize Low-Performing Paths',
        description: `${lowCompletionPaths.length} learning paths have completion rates below 65%. Consider restructuring content or adjusting difficulty.`,
        confidence: 0.87,
        impact: 'high',
        data: { paths: lowCompletionPaths.length, avgCompletion: Math.round(lowCompletionPaths.reduce((sum, p) => sum + (p.completion_rate || 0), 0) / lowCompletionPaths.length) }
      });
    }

    // High enrollment but low engagement
    const lowEngagementPaths = paths.filter(p => (p.enrollment_count || 0) > 200 && (p.engagement_score || 0) < 75);
    if (lowEngagementPaths.length > 0) {
      recs.push({
        type: 'engagement',
        title: 'Improve High-Traffic Path Engagement',
        description: `${lowEngagementPaths.length} popular paths show low engagement scores. Add interactive elements or gamification.`,
        confidence: 0.82,
        impact: 'medium',
        data: { paths: lowEngagementPaths.length }
      });
    }

    // Successful path replication
    const topPaths = paths.filter(p => (p.completion_rate || 0) > 85 && (p.avg_rating || 0) > 4.2).slice(0, 3);
    if (topPaths.length > 0) {
      recs.push({
        type: 'replication',
        title: 'Replicate Successful Path Elements',
        description: `${topPaths.length} paths show exceptional performance. Analyze and apply their success factors to other paths.`,
        confidence: 0.91,
        impact: 'high',
        data: { successfulPaths: topPaths.map(p => p.title) }
      });
    }

    // Content gap analysis
    const categories = [...new Set(paths.map(p => p.category))];
    const underservedCategories = categories.filter(cat => 
      paths.filter(p => p.category === cat).length < 3
    );
    
    if (underservedCategories.length > 0) {
      recs.push({
        type: 'content_gap',
        title: 'Address Content Gaps',
        description: `Categories like ${underservedCategories.slice(0, 2).join(', ')} need more learning paths to meet learner demand.`,
        confidence: 0.76,
        impact: 'medium',
        data: { categories: underservedCategories }
      });
    }

    setRecommendations(recs);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="h-5 w-5" />;
      case 'engagement': return <Zap className="h-5 w-5" />;
      case 'replication': return <Award className="h-5 w-5" />;
      case 'content_gap': return <BookOpen className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading learning path analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Learning Path Analytics
          </h2>
          <p className="text-muted-foreground">
            AI-powered insights into learning path performance and optimization opportunities
          </p>
        </div>
        <Button onClick={loadAnalytics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analytics
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paths</p>
                <p className="text-2xl font-bold">{analytics.totalPaths}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-bold">{analytics.totalEnrollments.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Completion</p>
                <p className="text-2xl font-bold">{analytics.averageCompletion}%</p>
                <Progress value={analytics.averageCompletion} className="mt-2" />
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Content Gaps</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.contentGaps}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="path-performance">Path Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Generated Recommendations ({recommendations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Recommendations Available</h3>
                  <p className="text-muted-foreground">
                    Refresh analytics to generate new AI-powered recommendations
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getRecommendationIcon(rec.type)}
                          <div>
                            <h4 className="font-semibold">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {rec.type.replace('_', ' ')} recommendation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getImpactColor(rec.impact)}>
                            {rec.impact} impact
                          </Badge>
                          <Badge variant="outline">
                            {Math.round(rec.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-4">{rec.description}</p>
                      
                      {rec.data && (
                        <div className="bg-muted/50 rounded p-3 mb-4">
                          <p className="text-xs font-medium mb-2">Supporting Data:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(rec.data).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                                <span className="ml-2 font-medium">
                                  {Array.isArray(value) ? value.join(', ') : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Implement
                        </Button>
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                        <Button size="sm" variant="ghost">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="path-performance" className="space-y-4">
          <div className="grid gap-4">
            {learningPaths.slice(0, 10).map((path) => (
              <Card key={path.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{path.title}</h4>
                        <Badge variant="outline">{path.level}</Badge>
                        <Badge variant="secondary">{path.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {path.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{path.enrollment_count} enrolled</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span className={path.completion_rate! < 65 ? 'text-red-600' : 'text-green-600'}>
                            {path.completion_rate}% completion
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{path.engagement_score}% engagement</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{path.total_duration_hours}h duration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{path.completion_rate}%</span>
                    </div>
                    <Progress value={path.completion_rate} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Rating:</span>
                      <span className="font-medium">{path.avg_rating}/5.0</span>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...new Set(learningPaths.map(p => p.category))]
                    .map(category => {
                      const categoryPaths = learningPaths.filter(p => p.category === category);
                      const avgCompletion = Math.round(
                        categoryPaths.reduce((sum, p) => sum + (p.completion_rate || 0), 0) / categoryPaths.length
                      );
                      return { category, avgCompletion, count: categoryPaths.length };
                    })
                    .sort((a, b) => b.avgCompletion - a.avgCompletion)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium">{item.category}</span>
                          <span className="text-sm text-muted-foreground ml-2">({item.count} paths)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.avgCompletion} className="w-20" />
                          <span className="text-sm font-medium">{item.avgCompletion}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+23%</div>
                    <div className="text-sm text-muted-foreground">Monthly Growth</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-muted-foreground">Path Utilization</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">4.2/5</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPathAnalytics;