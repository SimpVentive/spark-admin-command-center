import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  skills: Array<{skill_name: string, proficiency_level: string, confidence_score: number}>;
  preferences: {
    job_role?: string;
    career_goals?: string[];
    preferred_learning_style?: string;
    difficulty_preference?: string;
    topics_of_interest?: string[];
  };
  analytics: {
    learning_velocity: number;
    engagement_score: number;
    preferred_content_types: string[];
  };
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  total_duration_hours: number;
  prerequisites: any;
}

// Helper function to validate JWT and get user ID
async function validateAuth(req: Request, supabaseUrl: string, supabaseAnonKey: string): Promise<{ userId: string | null; error: Response | null }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      userId: null,
      error: new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return {
      userId: null,
      error: new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    };
  }

  return { userId: data.user.id, error: null };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

    // Validate authentication
    const { userId: authenticatedUserId, error: authError } = await validateAuth(req, supabaseUrl, supabaseAnonKey);
    if (authError) {
      return authError;
    }

    // Create service client for database operations (after auth validation)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Use the authenticated user ID (ignore URL parameter for security)
    const userId = authenticatedUserId!;

    console.log('Generating recommendations for authenticated user:', userId);

    // Get user profile data
    const userProfile = await getUserProfile(supabase, userId);
    console.log('User profile:', userProfile);

    // Get all available learning paths
    const { data: learningPaths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('*');

    if (pathsError) {
      throw new Error(`Failed to fetch learning paths: ${pathsError.message}`);
    }

    // Generate different types of recommendations
    const [
      collaborativeRecs,
      contentBasedRecs,
      skillGapRecs,
      trendingRecs,
      aiEnhancedRecs
    ] = await Promise.all([
      generateCollaborativeRecommendations(supabase, userId, learningPaths),
      generateContentBasedRecommendations(userProfile, learningPaths),
      generateSkillGapRecommendations(supabase, userProfile, learningPaths),
      generateTrendingRecommendations(supabase, learningPaths),
      generateAIEnhancedRecommendations(openaiApiKey, userProfile, learningPaths)
    ]);

    // Combine and rank all recommendations
    const allRecommendations = [
      ...collaborativeRecs,
      ...contentBasedRecs,
      ...skillGapRecs,
      ...trendingRecs,
      ...aiEnhancedRecs
    ];

    // Remove duplicates and sort by confidence score
    const uniqueRecommendations = removeDuplicatesAndRank(allRecommendations);

    // Store recommendations in database
    await storeRecommendations(supabase, userId, uniqueRecommendations);

    // Return top 10 recommendations
    const topRecommendations = uniqueRecommendations.slice(0, 10);

    return new Response(JSON.stringify({
      recommendations: topRecommendations,
      total_count: uniqueRecommendations.length,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in learning-path-recommendations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getUserProfile(supabase: any, userId: string): Promise<UserProfile> {
  const [skillsResult, preferencesResult, analyticsResult] = await Promise.all([
    supabase.from('user_skills').select('*').eq('user_id', userId),
    supabase.from('learning_preferences').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_learning_analytics')
      .select('learning_velocity, engagement_score, preferred_content_types')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
  ]);

  const skills = skillsResult.data || [];
  const preferences = preferencesResult.data || {};
  
  // Calculate average analytics
  const analytics = {
    learning_velocity: 0,
    engagement_score: 0,
    preferred_content_types: [] as string[]
  };

  if (analyticsResult.data && analyticsResult.data.length > 0) {
    const avgVelocity = analyticsResult.data.reduce((sum: number, item: any) => sum + (item.learning_velocity || 0), 0) / analyticsResult.data.length;
    const avgEngagement = analyticsResult.data.reduce((sum: number, item: any) => sum + (item.engagement_score || 0), 0) / analyticsResult.data.length;
    
    analytics.learning_velocity = avgVelocity;
    analytics.engagement_score = avgEngagement;
    
    // Get most common content types
    const contentTypes = analyticsResult.data
      .flatMap((item: any) => item.preferred_content_types || [])
      .reduce((acc: Record<string, number>, type: string) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
    
    analytics.preferred_content_types = Object.entries(contentTypes)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 3)
      .map(([type]: any) => type);
  }

  return { skills, preferences, analytics };
}

async function generateCollaborativeRecommendations(supabase: any, userId: string, learningPaths: LearningPath[]) {
  // Find similar users based on skills and learning patterns
  const { data: similarUsers } = await supabase
    .from('similar_users')
    .select('similar_user_id, similarity_score')
    .eq('user_id', userId)
    .order('similarity_score', { ascending: false })
    .limit(10);

  if (!similarUsers || similarUsers.length === 0) {
    return [];
  }

  // Get learning paths completed/enrolled by similar users
  const similarUserIds = similarUsers.map((u: any) => u.similar_user_id);
  const { data: enrollments } = await supabase
    .from('user_learning_path_enrollments')
    .select('learning_path_id, status')
    .in('user_id', similarUserIds)
    .eq('status', 'completed');

  // Count and score recommendations
  const pathScores: { [key: string]: number } = {};
  enrollments?.forEach((enrollment: any) => {
    pathScores[enrollment.learning_path_id] = (pathScores[enrollment.learning_path_id] || 0) + 1;
  });

  return Object.entries(pathScores)
    .map(([pathId, count]) => ({
      learning_path_id: pathId,
      recommendation_type: 'collaborative',
      confidence_score: Math.min(0.95, (count as number) / similarUsers.length),
      reasoning: `${count} similar learners completed this path`,
      metadata: { similar_user_count: count }
    }))
    .filter(rec => rec.confidence_score > 0.1);
}

async function generateContentBasedRecommendations(userProfile: UserProfile, learningPaths: LearningPath[]) {
  const recommendations = [];
  
  for (const path of learningPaths) {
    let score = 0;
    let reasons = [];

    // Match categories with interests
    if (userProfile.preferences.topics_of_interest?.includes(path.category)) {
      score += 0.3;
      reasons.push(`matches interest in ${path.category}`);
    }

    // Match difficulty with preference
    const difficultyMapping: Record<string, string[]> = {
      'easy': ['beginner'],
      'moderate': ['basic', 'intermediate'], 
      'challenging': ['advanced', 'expert']
    };

    if (userProfile.preferences.difficulty_preference && 
        difficultyMapping[userProfile.preferences.difficulty_preference]?.includes(path.level)) {
      score += 0.2;
      reasons.push(`matches preferred difficulty level`);
    }

    // Match with current skill gaps
    const pathDescription = path.description?.toLowerCase() || '';
    
    let skillMatches = 0;
    userProfile.skills.forEach(skill => {
      if (skill.proficiency_level === 'beginner' && 
          pathDescription.includes(skill.skill_name.toLowerCase())) {
        skillMatches++;
      }
    });

    if (skillMatches > 0) {
      score += Math.min(0.4, skillMatches * 0.1);
      reasons.push(`addresses ${skillMatches} skill development areas`);
    }

    if (score > 0.2) {
      recommendations.push({
        learning_path_id: path.id,
        recommendation_type: 'content_based',
        confidence_score: Math.min(0.95, score),
        reasoning: reasons.join(', '),
        metadata: { skill_matches: skillMatches }
      });
    }
  }

  return recommendations;
}

async function generateSkillGapRecommendations(supabase: any, userProfile: UserProfile, learningPaths: LearningPath[]) {
  if (!userProfile.preferences.job_role) {
    return [];
  }

  // Get required skills for target role (simplified - in production, this would be a comprehensive skills database)
  const roleSkillMappings: Record<string, string[]> = {
    'software_engineer': ['programming', 'algorithms', 'system_design', 'databases'],
    'data_scientist': ['machine_learning', 'statistics', 'python', 'data_analysis'],
    'product_manager': ['strategy', 'analytics', 'user_research', 'project_management'],
    'designer': ['ui_design', 'ux_research', 'prototyping', 'user_testing']
  };

  const targetSkills = roleSkillMappings[userProfile.preferences.job_role] || [];
  const currentSkills = userProfile.skills.map(s => s.skill_name.toLowerCase());
  
  const skillGaps = targetSkills.filter(skill => 
    !currentSkills.some(currentSkill => 
      currentSkill.includes(skill) || skill.includes(currentSkill)
    )
  );

  const recommendations = [];
  for (const path of learningPaths) {
    const pathContent = (path.title + ' ' + path.description).toLowerCase();
    let gapsCovered = 0;
    
    skillGaps.forEach(gap => {
      if (pathContent.includes(gap)) {
        gapsCovered++;
      }
    });

    if (gapsCovered > 0) {
      const score = Math.min(0.9, (gapsCovered / skillGaps.length) * 0.8 + 0.1);
      recommendations.push({
        learning_path_id: path.id,
        recommendation_type: 'skill_gap',
        confidence_score: score,
        reasoning: `Addresses ${gapsCovered} skill gaps for ${userProfile.preferences.job_role}`,
        metadata: { gaps_covered: gapsCovered, total_gaps: skillGaps.length }
      });
    }
  }

  return recommendations;
}

async function generateTrendingRecommendations(supabase: any, learningPaths: LearningPath[]) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentEnrollments } = await supabase
    .from('user_learning_path_enrollments')
    .select('learning_path_id')
    .gte('enrolled_at', thirtyDaysAgo.toISOString());

  const enrollmentCounts: { [key: string]: number } = {};
  recentEnrollments?.forEach((enrollment: any) => {
    enrollmentCounts[enrollment.learning_path_id] = 
      (enrollmentCounts[enrollment.learning_path_id] || 0) + 1;
  });

  const totalEnrollments = Object.values(enrollmentCounts).reduce((a, b) => a + b, 0);
  
  return Object.entries(enrollmentCounts)
    .map(([pathId, count]) => ({
      learning_path_id: pathId,
      recommendation_type: 'trending',
      confidence_score: Math.min(0.8, (count as number) / totalEnrollments * 10),
      reasoning: `${count} recent enrollments - trending now`,
      metadata: { recent_enrollments: count }
    }))
    .filter(rec => rec.confidence_score > 0.1)
    .slice(0, 5);
}

async function generateAIEnhancedRecommendations(openaiApiKey: string, userProfile: UserProfile, learningPaths: LearningPath[]) {
  if (!userProfile.preferences.career_goals || userProfile.preferences.career_goals.length === 0) {
    return [];
  }

  try {
    const prompt = `Given this user profile:
- Current skills: ${userProfile.skills.map(s => `${s.skill_name} (${s.proficiency_level})`).join(', ')}
- Career goals: ${userProfile.preferences.career_goals?.join(', ')}
- Learning style: ${userProfile.preferences.preferred_learning_style}
- Job role: ${userProfile.preferences.job_role}
- Interests: ${userProfile.preferences.topics_of_interest?.join(', ')}

Available learning paths:
${learningPaths.slice(0, 20).map(p => `- ${p.title}: ${p.description} (${p.level}, ${p.category})`).join('\n')}

Recommend the top 3 learning paths and provide confidence scores (0-1) and reasoning. Format as JSON:
{"recommendations": [{"path_title": "title", "confidence": 0.8, "reasoning": "why this matches"}]}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI learning path recommendation expert. Provide personalized suggestions based on user profiles.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return [];
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);

    const recommendations = [];
    for (const rec of aiResponse.recommendations) {
      const matchingPath = learningPaths.find(p => 
        p.title.toLowerCase().includes(rec.path_title.toLowerCase()) ||
        rec.path_title.toLowerCase().includes(p.title.toLowerCase())
      );

      if (matchingPath) {
        recommendations.push({
          learning_path_id: matchingPath.id,
          recommendation_type: 'hybrid',
          confidence_score: rec.confidence,
          reasoning: `AI Analysis: ${rec.reasoning}`,
          metadata: { ai_generated: true }
        });
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Error in AI recommendations:', error);
    return [];
  }
}

function removeDuplicatesAndRank(recommendations: any[]) {
  const pathScores: { [key: string]: any } = {};
  
  recommendations.forEach(rec => {
    const pathId = rec.learning_path_id;
    if (!pathScores[pathId] || pathScores[pathId].confidence_score < rec.confidence_score) {
      pathScores[pathId] = rec;
    }
  });

  return Object.values(pathScores).sort((a: any, b: any) => b.confidence_score - a.confidence_score);
}

async function storeRecommendations(supabase: any, userId: string, recommendations: any[]) {
  const recommendationData = recommendations.map(rec => ({
    user_id: userId,
    learning_path_id: rec.learning_path_id,
    recommendation_type: rec.recommendation_type,
    confidence_score: rec.confidence_score,
    reasoning: rec.reasoning,
    metadata: rec.metadata || {}
  }));

  // Delete old recommendations
  await supabase
    .from('path_recommendations')
    .delete()
    .eq('user_id', userId)
    .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  // Insert new recommendations
  const { error } = await supabase
    .from('path_recommendations')
    .insert(recommendationData);

  if (error) {
    console.error('Error storing recommendations:', error);
  }
}
