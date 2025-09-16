import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Users, BookOpen, Target, BarChart3, TrendingUp, Award } from "lucide-react";

interface KirkpatrickMetrics {
  level1: {
    averageSatisfaction: number;
    recommendationRate: number;
    totalResponses: number;
  };
  level2: {
    averageLearningGain: number;
    improvementPercentage: number;
    totalAssessments: number;
  };
  level3: {
    averageApplicationScore: number;
    successfulApplications: number;
    totalBehaviorAssessments: number;
  };
  level4: {
    averageBusinessImpact: number;
    positiveImpactCount: number;
    totalResultsAssessments: number;
  };
}

interface KirkpatrickCalculatorProps {
  programId?: string;
  enrollmentId?: string;
}

const KirkpatrickCalculator = ({ programId, enrollmentId }: KirkpatrickCalculatorProps) => {
  const [metrics, setMetrics] = useState<KirkpatrickMetrics>({
    level1: { averageSatisfaction: 0, recommendationRate: 0, totalResponses: 0 },
    level2: { averageLearningGain: 0, improvementPercentage: 0, totalAssessments: 0 },
    level3: { averageApplicationScore: 0, successfulApplications: 0, totalBehaviorAssessments: 0 },
    level4: { averageBusinessImpact: 0, positiveImpactCount: 0, totalResultsAssessments: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [programId, enrollmentId]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('kirkpatrick_evaluations')
        .select(`
          *,
          enrollment_id (
            program_id,
            user_id
          )
        `);

      if (programId) {
        // Filter by program ID through enrollments
        query = query.eq('enrollment_id.program_id', programId);
      } else if (enrollmentId) {
        // Filter by specific enrollment
        query = query.eq('enrollment_id', enrollmentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate Level 1 metrics
      const level1Data = data?.filter(d => d.level === '1') || [];
      const avgSatisfaction = level1Data.length > 0 
        ? level1Data.reduce((sum, item) => sum + parseFloat(String(item.score || 0)), 0) / level1Data.length 
        : 0;
      const recommendCount = level1Data.filter(item => parseFloat(String(item.score || 0)) >= 8).length;
      const recommendationRate = level1Data.length > 0 ? (recommendCount / level1Data.length) * 100 : 0;

      // Calculate Level 2 metrics
      const level2Data = data?.filter(d => d.level === '2') || [];
      const avgLearningGain = level2Data.length > 0
        ? level2Data.reduce((sum, item) => sum + parseFloat(String(item.score || 0)), 0) / level2Data.length
        : 0;
      const avgImprovementPercentage = level2Data.length > 0
        ? level2Data.reduce((sum, item) => {
            try {
              const notes = JSON.parse(item.notes || '{}');
              return sum + (parseFloat(notes.improvement_percentage || '0'));
            } catch {
              return sum;
            }
          }, 0) / level2Data.length
        : 0;

      // Calculate Level 3 metrics  
      const level3Data = data?.filter(d => d.level === '3') || [];
      const avgApplicationScore = level3Data.length > 0
        ? level3Data.reduce((sum, item) => sum + parseFloat(String(item.score || 0)), 0) / level3Data.length
        : 0;
      const successfulApplications = level3Data.filter(item => parseFloat(String(item.score || 0)) >= 7).length;

      // Calculate Level 4 metrics
      const level4Data = data?.filter(d => d.level === '4') || [];
      const avgBusinessImpact = level4Data.length > 0
        ? level4Data.reduce((sum, item) => sum + parseFloat(String(item.score || 0)), 0) / level4Data.length
        : 0;
      const positiveImpactCount = level4Data.filter(item => parseFloat(String(item.score || 0)) >= 7).length;

      setMetrics({
        level1: {
          averageSatisfaction: avgSatisfaction,
          recommendationRate: recommendationRate,
          totalResponses: level1Data.length
        },
        level2: {
          averageLearningGain: avgLearningGain,
          improvementPercentage: avgImprovementPercentage,
          totalAssessments: level2Data.length
        },
        level3: {
          averageApplicationScore: avgApplicationScore,
          successfulApplications: successfulApplications,
          totalBehaviorAssessments: level3Data.length
        },
        level4: {
          averageBusinessImpact: avgBusinessImpact,
          positiveImpactCount: positiveImpactCount,
          totalResultsAssessments: level4Data.length
        }
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Level 1: Reaction */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-500" />
              Level 1: Reaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Satisfaction</span>
                  <span className="font-bold text-lg">{metrics.level1.averageSatisfaction.toFixed(1)}/10</span>
                </div>
                <Progress value={metrics.level1.averageSatisfaction * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Would Recommend</span>
                  <span className="font-bold">{metrics.level1.recommendationRate.toFixed(0)}%</span>
                </div>
                <Progress value={metrics.level1.recommendationRate} className="h-2" />
              </div>
              <Badge variant="outline" className="text-xs">
                {metrics.level1.totalResponses} responses
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Level 2: Learning */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-green-500" />
              Level 2: Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Avg. Learning Gain</span>
                  <span className="font-bold text-lg">+{metrics.level2.averageLearningGain.toFixed(1)}</span>
                </div>
                <Progress value={(metrics.level2.averageLearningGain + 5) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Improvement</span>
                  <span className="font-bold">{metrics.level2.improvementPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={Math.min(metrics.level2.improvementPercentage, 100)} className="h-2" />
              </div>
              <Badge variant="outline" className="text-xs">
                {metrics.level2.totalAssessments} assessments
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Level 3: Behavior */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-orange-500" />
              Level 3: Behavior
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Application Score</span>
                  <span className="font-bold text-lg">{metrics.level3.averageApplicationScore.toFixed(1)}/10</span>
                </div>
                <Progress value={metrics.level3.averageApplicationScore * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-bold">
                    {metrics.level3.totalBehaviorAssessments > 0 
                      ? Math.round((metrics.level3.successfulApplications / metrics.level3.totalBehaviorAssessments) * 100)
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={metrics.level3.totalBehaviorAssessments > 0 
                    ? (metrics.level3.successfulApplications / metrics.level3.totalBehaviorAssessments) * 100 
                    : 0} 
                  className="h-2" 
                />
              </div>
              <Badge variant="outline" className="text-xs">
                {metrics.level3.totalBehaviorAssessments} assessments
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Level 4: Results */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              Level 4: Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Business Impact</span>
                  <span className="font-bold text-lg">{metrics.level4.averageBusinessImpact.toFixed(1)}/10</span>
                </div>
                <Progress value={metrics.level4.averageBusinessImpact * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Positive Impact</span>
                  <span className="font-bold">
                    {metrics.level4.totalResultsAssessments > 0 
                      ? Math.round((metrics.level4.positiveImpactCount / metrics.level4.totalResultsAssessments) * 100)
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={metrics.level4.totalResultsAssessments > 0 
                    ? (metrics.level4.positiveImpactCount / metrics.level4.totalResultsAssessments) * 100 
                    : 0} 
                  className="h-2" 
                />
              </div>
              <Badge variant="outline" className="text-xs">
                {metrics.level4.totalResultsAssessments} assessments
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall ROI Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Overall Training Effectiveness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{metrics.level1.averageSatisfaction.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">+{metrics.level2.averageLearningGain.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Learning Gain</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{metrics.level3.averageApplicationScore.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Application</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{metrics.level4.averageBusinessImpact.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Business Impact</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-medium">ROI Assessment</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {metrics.level4.averageBusinessImpact >= 7 
                ? "Strong positive ROI indicated - Training is delivering measurable business value" 
                : metrics.level4.averageBusinessImpact >= 5 
                ? "Moderate ROI - Training shows some business impact" 
                : "Limited ROI data - Consider implementing follow-up assessments"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KirkpatrickCalculator;