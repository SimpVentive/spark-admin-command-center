import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Clock, 
  BookOpen,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Recommendation {
  id: string;
  learning_path_id: string;
  recommendation_type: string;
  confidence_score: number;
  reasoning: string;
  metadata: any;
  learning_path: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    total_duration_hours: number;
  };
}

interface SimilarUser {
  user_id: string;
  similarity_score: number;
  profile: {
    full_name: string;
    department: string;
    position: string;
  };
}

const AIRecommendations = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [similarUsers, setSimilarUsers] = useState<SimilarUser[]>([]);
  const [similarUserPaths, setSimilarUserPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecommendations();
    loadSimilarUsers();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First try to get cached recommendations
      const { data: cachedRecs, error: cacheError } = await supabase
        .from('path_recommendations')
        .select(`
          *,
          learning_path:learning_paths(*)
        `)
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('confidence_score', { ascending: false });

      if (cacheError) {
        console.error('Error loading cached recommendations:', cacheError);
      }

      if (cachedRecs && cachedRecs.length > 0) {
        setRecommendations(cachedRecs);
      } else {
        // Generate new recommendations
        await generateNewRecommendations(user.id);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewRecommendations = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('learning-path-recommendations', {
        body: { userId }
      });

      if (error) throw error;

      if (data?.recommendations) {
        // Fetch full learning path details for the recommendations
        const pathIds = data.recommendations.map((rec: any) => rec.learning_path_id);
        const { data: paths, error: pathsError } = await supabase
          .from('learning_paths')
          .select('*')
          .in('id', pathIds);

        if (!pathsError && paths) {
          const enrichedRecommendations = data.recommendations.map((rec: any) => ({
            ...rec,
            learning_path: paths.find(p => p.id === rec.learning_path_id)
          }));
          setRecommendations(enrichedRecommendations);
        }
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations",
        variant: "destructive",
      });
    }
  };

  const loadSimilarUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('similar-users', {
        body: { userId: user.id }
      });

      if (error) throw error;

      if (data?.similar_users) {
        setSimilarUsers(data.similar_users);
        setSimilarUserPaths(data.recommended_paths || []);
      }
    } catch (error) {
      console.error('Error loading similar users:', error);
    }
  };

  const handleRecommendationAction = async (recommendationId: string, actionType: string, learningPathId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.functions.invoke('recommendation-feedback', {
        body: {
          user_id: user.id,
          recommendation_id: recommendationId,
          action_type: actionType,
          learning_path_id: learningPathId
        }
      });

      if (error) throw error;

      // Update local state
      if (actionType === 'clicked') {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recommendationId ? { ...rec, is_clicked: true } : rec
          )
        );
      } else if (actionType === 'enrolled') {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recommendationId ? { ...rec, is_enrolled: true } : rec
          )
        );
        toast({
          title: "Enrolled Successfully",
          description: "You've been enrolled in the learning path",
        });
      }
    } catch (error) {
      console.error('Error handling recommendation action:', error);
    }
  };

  const handleFeedback = async (recommendationId: string, feedbackType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.functions.invoke('recommendation-feedback', {
        body: {
          user_id: user.id,
          recommendation_id: recommendationId,
          feedback_type: feedbackType
        }
      });

      toast({
        title: "Feedback Recorded",
        description: "Thank you for helping us improve our recommendations",
      });

      // Remove recommendation from view if negative feedback
      if (['dislike', 'not_relevant', 'not_interested'].includes(feedbackType)) {
        setRecommendations(prev => 
          prev.filter(rec => rec.id !== recommendationId)
        );
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await generateNewRecommendations(user.id);
      
      toast({
        title: "Recommendations Updated",
        description: "Your recommendations have been refreshed based on your latest activity",
      });
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'collaborative': return <Users className="h-4 w-4" />;
      case 'content_based': return <Target className="h-4 w-4" />;
      case 'skill_gap': return <Brain className="h-4 w-4" />;
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'hybrid': return <Sparkles className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'collaborative': return 'bg-blue-100 text-blue-800';
      case 'content_based': return 'bg-green-100 text-green-800';
      case 'skill_gap': return 'bg-purple-100 text-purple-800';
      case 'trending': return 'bg-orange-100 text-orange-800';
      case 'hybrid': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading AI recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI-Powered Recommendations
          </h2>
          <p className="text-muted-foreground">
            Personalized learning paths based on your skills, goals, and similar learners
          </p>
        </div>
        <Button onClick={refreshRecommendations} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="for-you" className="w-full">
        <TabsList>
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="similar-users">Similar Learners</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="space-y-4">
          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground">
                  Complete your learning profile to get personalized recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTypeColor(rec.recommendation_type)}>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(rec.recommendation_type)}
                              {rec.recommendation_type.replace('_', ' ')}
                            </div>
                          </Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">
                              {Math.round(rec.confidence_score * 100)}% match
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{rec.learning_path.title}</h3>
                        <p className="text-muted-foreground mb-3">{rec.learning_path.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {rec.learning_path.total_duration_hours}h
                          </div>
                          <Badge variant="outline">{rec.learning_path.level}</Badge>
                          <Badge variant="outline">{rec.learning_path.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">{rec.reasoning}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRecommendationAction(rec.id, 'clicked', rec.learning_path_id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleRecommendationAction(rec.id, 'enrolled', rec.learning_path_id)}
                        >
                          Enroll Now
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleFeedback(rec.id, 'like')}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleFeedback(rec.id, 'dislike')}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="similar-users" className="space-y-4">
          <div className="grid gap-6">
            {similarUsers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Similar Learners ({similarUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarUsers.slice(0, 6).map((user) => (
                      <div key={user.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.profile?.full_name || 'Anonymous User'}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.profile?.position || 'Learner'} • {Math.round(user.similarity_score * 100)}% similar
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {similarUserPaths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Paths Completed by Similar Learners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {similarUserPaths.slice(0, 5).map((path: any, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{path.learning_path.title}</h4>
                          <Badge variant="secondary">
                            {path.completed_by_count} completions
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {path.learning_path.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{path.learning_path.level}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(path.recommendation_strength * 100)}% recommended
                            </span>
                          </div>
                          <Button size="sm">View Path</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Learning Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations
                  .filter(rec => rec.recommendation_type === 'trending')
                  .map((rec) => (
                    <div key={rec.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{rec.learning_path.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {rec.learning_path.description}
                          </p>
                          <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                        </div>
                        <Button size="sm">Enroll</Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIRecommendations;