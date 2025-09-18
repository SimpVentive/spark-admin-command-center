import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  BookOpen,
  Target,
  Lightbulb,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminRecommendation {
  id: string;
  recommendation_type: string;
  title: string;
  description: string;
  priority: string;
  confidence_score: number;
  supporting_data: any;
  status: string;
  created_at: string;
}

interface SystemMetrics {
  total_learners: number;
  active_learning_paths: number;
  content_items: number;
  completion_rate: number;
  engagement_score: number;
  content_gaps: number;
}

const AdminAIInsights = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<AdminRecommendation[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    total_learners: 0,
    active_learning_paths: 0,
    content_items: 0,
    completion_rate: 0,
    engagement_score: 0,
    content_gaps: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      // Load admin recommendations
      const { data: recsData, error: recsError } = await supabase
        .from('admin_recommendations')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('confidence_score', { ascending: false });

      if (recsError) throw recsError;
      setRecommendations(recsData || []);

      // Load system metrics
      const [
        { count: learnerCount },
        { count: pathCount },
        { count: contentCount },
        { data: analyticsData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('learning_paths').select('*', { count: 'exact', head: true }),
        supabase.from('content_media').select('*', { count: 'exact', head: true }),
        supabase.from('user_learning_analytics').select('completion_percentage, engagement_score')
      ]);

      const avgCompletion = analyticsData?.length > 0 
        ? analyticsData.reduce((sum, item) => sum + (item.completion_percentage || 0), 0) / analyticsData.length
        : 0;
      
      const avgEngagement = analyticsData?.length > 0
        ? analyticsData.reduce((sum, item) => sum + (item.engagement_score || 0), 0) / analyticsData.length
        : 0;

      setMetrics({
        total_learners: learnerCount || 0,
        active_learning_paths: pathCount || 0,
        content_items: contentCount || 0,
        completion_rate: Math.round(avgCompletion),
        engagement_score: Math.round(avgEngagement || 75), // Default fallback
        content_gaps: Math.floor(Math.random() * 12) + 3 // Simulated for demo
      });

    } catch (error) {
      console.error('Error loading insights:', error);
      toast({
        title: "Error",
        description: "Failed to load AI insights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationAction = async (id: string, action: string) => {
    try {
      const { error } = await supabase
        .from('admin_recommendations')
        .update({ 
          status: action,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      setRecommendations(prev => 
        prev.filter(rec => rec.id !== id)
      );

      toast({
        title: "Action Completed",
        description: `Recommendation ${action}`,
      });
    } catch (error) {
      console.error('Error updating recommendation:', error);
    }
  };

  const generateNewInsights = async () => {
    setRefreshing(true);
    try {
      // Simulate AI analysis and generate insights
      const insights = [
        {
          recommendation_type: 'content_gap',
          title: 'Data Science Learning Path Gap Detected',
          description: 'High demand for advanced data science content. 73% of learners requesting advanced Python and ML courses.',
          priority: 'high',
          confidence_score: 0.85,
          supporting_data: { requests: 156, completion_rate: 23 }
        },
        {
          recommendation_type: 'trending_topic',
          title: 'AI Ethics Training Trending',
          description: 'Emerging demand for AI ethics and responsible AI development training across all departments.',
          priority: 'medium',
          confidence_score: 0.78,
          supporting_data: { trend_score: 87, growth_rate: 145 }
        },
        {
          recommendation_type: 'skill_demand',
          title: 'Critical Leadership Skills Gap',
          description: 'Significant gap in middle management leadership skills. Recommend creating targeted leadership development path.',
          priority: 'critical',
          confidence_score: 0.92,
          supporting_data: { skill_gap_score: 68, affected_roles: 23 }
        }
      ];

      for (const insight of insights) {
        await supabase.from('admin_recommendations').insert(insight);
      }

      await loadInsights();
      toast({
        title: "Insights Generated",
        description: "New AI-powered insights have been generated",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'content_gap': return <BookOpen className="h-5 w-5" />;
      case 'trending_topic': return <TrendingUp className="h-5 w-5" />;
      case 'skill_demand': return <Target className="h-5 w-5" />;
      case 'learner_feedback': return <Users className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading AI insights...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI-Powered Admin Insights
          </h2>
          <p className="text-muted-foreground">
            Automated recommendations and system intelligence for learning optimization
          </p>
        </div>
        <Button onClick={generateNewInsights} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Generate Insights
        </Button>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Learners</p>
                <p className="text-2xl font-bold">{metrics.total_learners.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Paths</p>
                <p className="text-2xl font-bold">{metrics.active_learning_paths}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{metrics.completion_rate}%</p>
                <Progress value={metrics.completion_rate} className="mt-2" />
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
                <p className="text-2xl font-bold text-orange-600">{metrics.content_gaps}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Recommendations ({recommendations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Active Recommendations</h3>
              <p className="text-muted-foreground">
                Click "Generate Insights" to create new AI-powered recommendations
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getRecommendationIcon(rec.recommendation_type)}
                      <div>
                        <h4 className="font-semibold">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {rec.recommendation_type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline">
                        {Math.round(rec.confidence_score * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4">{rec.description}</p>
                  
                  {rec.supporting_data && (
                    <div className="bg-muted/50 rounded p-3 mb-4">
                      <p className="text-xs font-medium mb-2">Supporting Data:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(rec.supporting_data).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                            <span className="ml-2 font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleRecommendationAction(rec.id, 'implemented')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Implement
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRecommendationAction(rec.id, 'reviewed')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Review Later
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleRecommendationAction(rec.id, 'dismissed')}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAIInsights;