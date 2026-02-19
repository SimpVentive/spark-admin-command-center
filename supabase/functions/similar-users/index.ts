import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create client with user's auth token to validate JWT
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await authClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Users can only query their own similar users data
    const userId = user.id;

    // Create service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Finding similar users for authenticated user:', userId);

    // Get similar users from the database
    const { data: similarUsers, error: similarUsersError } = await supabase
      .from('similar_users')
      .select(`
        similar_user_id,
        similarity_score,
        similarity_factors,
        calculated_at,
        profile:profiles!similar_users_similar_user_id_fkey(full_name, department, position)
      `)
      .eq('user_id', userId)
      .order('similarity_score', { ascending: false })
      .limit(10);

    if (similarUsersError) {
      throw new Error(`Failed to fetch similar users: ${similarUsersError.message}`);
    }

    // Get learning paths completed by similar users
    const similarUserIds = similarUsers?.map(u => u.similar_user_id) || [];
    
    if (similarUserIds.length === 0) {
      return new Response(JSON.stringify({
        similar_users: [],
        recommended_paths: [],
        message: 'No similar users found yet. Complete more learning paths to find users with similar interests.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get paths completed by similar users that the current user hasn't completed
    const [currentUserPaths, similarUserPaths] = await Promise.all([
      // Current user's completed paths
      supabase
        .from('user_learning_path_enrollments')
        .select('learning_path_id')
        .eq('user_id', userId)
        .in('status', ['completed', 'enrolled']),
      
      // Similar users' completed paths with details
      supabase
        .from('user_learning_path_enrollments')
        .select(`
          user_id,
          learning_path_id,
          status,
          completed_at,
          learning_path:learning_paths(
            id,
            title,
            description,
            category,
            level,
            total_duration_hours
          )
        `)
        .in('user_id', similarUserIds)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
    ]);

    const currentUserPathIds = new Set(
      currentUserPaths.data?.map(p => p.learning_path_id) || []
    );

    // Find paths completed by similar users that current user hasn't done
    const pathRecommendations: { [key: string]: any } = {};
    
    similarUserPaths.data?.forEach((enrollment: any) => {
      const pathId = enrollment.learning_path_id;
      
      // Skip if current user already completed/enrolled in this path
      if (currentUserPathIds.has(pathId)) {
        return;
      }

      if (!pathRecommendations[pathId]) {
        pathRecommendations[pathId] = {
          learning_path: enrollment.learning_path,
          completed_by_count: 0,
          completed_by_users: [],
          avg_similarity_score: 0
        };
      }

      const similarUser = similarUsers?.find(u => u.similar_user_id === enrollment.user_id);
      if (similarUser) {
        pathRecommendations[pathId].completed_by_count++;
        pathRecommendations[pathId].completed_by_users.push({
          user_id: enrollment.user_id,
          similarity_score: similarUser.similarity_score,
          profile: similarUser.profile,
          completed_at: enrollment.completed_at
        });
        pathRecommendations[pathId].avg_similarity_score += similarUser.similarity_score;
      }
    });

    // Calculate average similarity scores and sort by relevance
    const recommendedPaths = Object.values(pathRecommendations)
      .map((rec: any) => ({
        ...rec,
        avg_similarity_score: rec.avg_similarity_score / rec.completed_by_count,
        recommendation_strength: (rec.completed_by_count / similarUsers.length) * rec.avg_similarity_score
      }))
      .sort((a: any, b: any) => b.recommendation_strength - a.recommendation_strength)
      .slice(0, 15);

    // Get additional analytics about similar users
    const analyticsData = await getSimilarUsersAnalytics(supabase, userId, similarUserIds);

    return new Response(JSON.stringify({
      similar_users: similarUsers?.map(user => ({
        user_id: user.similar_user_id,
        similarity_score: user.similarity_score,
        similarity_factors: user.similarity_factors,
        profile: user.profile,
        last_calculated: user.calculated_at
      })) || [],
      recommended_paths: recommendedPaths,
      analytics: analyticsData,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in similar-users function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getSimilarUsersAnalytics(supabase: any, userId: string, similarUserIds: string[]) {
  try {
    const [skillsComparison, learningVelocity, popularCategories] = await Promise.all([
      // Compare skills distribution
      getSkillsComparison(supabase, userId, similarUserIds),
      
      // Compare learning velocity
      getLearningVelocityComparison(supabase, userId, similarUserIds),
      
      // Most popular categories among similar users
      getPopularCategories(supabase, similarUserIds)
    ]);

    return {
      skills_comparison: skillsComparison,
      learning_velocity: learningVelocity,
      popular_categories: popularCategories
    };
  } catch (error) {
    console.error('Error getting similar users analytics:', error);
    return {};
  }
}

async function getSkillsComparison(supabase: any, userId: string, similarUserIds: string[]) {
  // Get current user's skills
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_name, proficiency_level, confidence_score')
    .eq('user_id', userId);

  // Get similar users' skills
  const { data: similarUsersSkills } = await supabase
    .from('user_skills')
    .select('user_id, skill_name, proficiency_level, confidence_score')
    .in('user_id', similarUserIds);

  // Calculate skill overlap and gaps
  const userSkillNames = new Set(userSkills?.map((s: any) => s.skill_name) || []);
  
  const commonSkills: string[] = [];
  const skillGaps: string[] = [];
  const skillFrequency: { [key: string]: number } = {};

  similarUsersSkills?.forEach((skill: any) => {
    skillFrequency[skill.skill_name] = (skillFrequency[skill.skill_name] || 0) + 1;
    
    if (userSkillNames.has(skill.skill_name)) {
      commonSkills.push(skill.skill_name);
    } else {
      skillGaps.push(skill.skill_name);
    }
  });

  // Find most common skills among similar users that current user lacks
  const topSkillGaps = Object.entries(skillFrequency)
    .filter(([skillName]) => !userSkillNames.has(skillName))
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([skillName, frequency]) => ({ skill_name: skillName, frequency }));

  return {
    common_skills: [...new Set(commonSkills)],
    skill_gaps: topSkillGaps,
    similarity_percentage: (commonSkills.length / userSkillNames.size) * 100
  };
}

async function getLearningVelocityComparison(supabase: any, userId: string, similarUserIds: string[]) {
  // Get learning analytics for current user
  const { data: userAnalytics } = await supabase
    .from('user_learning_analytics')
    .select('learning_velocity, engagement_score, total_time_minutes')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get learning analytics for similar users
  const { data: similarUsersAnalytics } = await supabase
    .from('user_learning_analytics')
    .select('user_id, learning_velocity, engagement_score, total_time_minutes')
    .in('user_id', similarUserIds)
    .order('created_at', { ascending: false });

  const userAvgVelocity = userAnalytics?.reduce((sum: number, item: any) => sum + (item.learning_velocity || 0), 0) / (userAnalytics?.length || 1);
  const userAvgEngagement = userAnalytics?.reduce((sum: number, item: any) => sum + (item.engagement_score || 0), 0) / (userAnalytics?.length || 1);

  // Calculate averages for similar users
  const similarUsersAvgVelocity = similarUsersAnalytics?.reduce((sum: number, item: any) => sum + (item.learning_velocity || 0), 0) / (similarUsersAnalytics?.length || 1);
  const similarUsersAvgEngagement = similarUsersAnalytics?.reduce((sum: number, item: any) => sum + (item.engagement_score || 0), 0) / (similarUsersAnalytics?.length || 1);

  return {
    user_velocity: userAvgVelocity || 0,
    similar_users_avg_velocity: similarUsersAvgVelocity || 0,
    user_engagement: userAvgEngagement || 0,
    similar_users_avg_engagement: similarUsersAvgEngagement || 0,
    velocity_comparison: ((userAvgVelocity || 0) / (similarUsersAvgVelocity || 1)) * 100
  };
}

async function getPopularCategories(supabase: any, similarUserIds: string[]) {
  const { data: enrollments } = await supabase
    .from('user_learning_path_enrollments')
    .select(`
      learning_path:learning_paths(category)
    `)
    .in('user_id', similarUserIds)
    .eq('status', 'completed');

  const categoryFrequency: { [key: string]: number } = {};
  
  enrollments?.forEach((enrollment: any) => {
    const category = enrollment.learning_path?.category;
    if (category) {
      categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
    }
  });

  return Object.entries(categoryFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([category, count]) => ({
      category,
      completion_count: count,
      percentage: (count / similarUserIds.length) * 100
    }));
}