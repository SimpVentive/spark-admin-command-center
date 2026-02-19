import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    // Use authenticated user's ID instead of trusting client-supplied value
    const user_id = user.id;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      recommendation_id,
      feedback_type,
      rating,
      comments,
      learning_path_id,
      action_type // 'clicked', 'enrolled', 'dismissed'
    } = await req.json();

    // Handle different types of feedback
    if (action_type === 'clicked' && recommendation_id) {
      // Update recommendation interaction
      await supabase
        .from('path_recommendations')
        .update({
          is_clicked: true,
          clicked_at: new Date().toISOString()
        })
        .eq('id', recommendation_id)
        .eq('user_id', user_id);

    } else if (action_type === 'enrolled' && recommendation_id) {
      // Update recommendation enrollment
      await supabase
        .from('path_recommendations')
        .update({
          is_enrolled: true,
          enrolled_at: new Date().toISOString()
        })
        .eq('id', recommendation_id)
        .eq('user_id', user_id);

      // Also create actual enrollment record if learning_path_id provided
      if (learning_path_id) {
        const { error: enrollmentError } = await supabase
          .from('user_learning_path_enrollments')
          .insert({
            user_id,
            learning_path_id,
            status: 'enrolled'
          });

        if (enrollmentError) {
          console.error('Error creating enrollment:', enrollmentError);
        }
      }

    } else if (feedback_type && recommendation_id) {
      // Store explicit feedback
      const { error: feedbackError } = await supabase
        .from('recommendation_feedback')
        .insert({
          user_id,
          recommendation_id,
          feedback_type,
          rating: rating || null,
          comments: comments || null
        });

      if (feedbackError) {
        throw new Error(`Failed to store feedback: ${feedbackError.message}`);
      }
    }

    // Update user preferences based on feedback patterns
    await updateUserPreferencesFromFeedback(supabase, user_id, feedback_type, recommendation_id);

    // Trigger recommendation model retraining (fire and forget)
    updateRecommendationModel(supabase, user_id, feedback_type).catch(e => console.error('Background model update failed:', e));

    return new Response(JSON.stringify({
      success: true,
      message: 'Feedback processed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in recommendation-feedback:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function updateUserPreferencesFromFeedback(
  supabase: any, 
  userId: string, 
  feedbackType: string, 
  recommendationId: string
) {
  try {
    // Get the recommendation details
    const { data: recommendation } = await supabase
      .from('path_recommendations')
      .select(`
        *,
        learning_path:learning_paths(*)
      `)
      .eq('id', recommendationId)
      .single();

    if (!recommendation) return;

    // Get current user preferences
    const { data: currentPrefs } = await supabase
      .from('learning_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!currentPrefs) return;

    // Update preferences based on positive/negative feedback
    let updatedTopics = currentPrefs.topics_of_interest || [];
    
    if (feedbackType === 'like' || feedbackType === 'enrolled') {
      // Add learning path category to interests if not present
      const pathCategory = recommendation.learning_path?.category;
      if (pathCategory && !updatedTopics.includes(pathCategory)) {
        updatedTopics.push(pathCategory);
      }
    } else if (feedbackType === 'dislike' || feedbackType === 'not_interested') {
      // Remove category from interests
      const pathCategory = recommendation.learning_path?.category;
      updatedTopics = updatedTopics.filter((topic: string) => topic !== pathCategory);
    }

    // Update difficulty preference based on feedback
    let updatedDifficulty = currentPrefs.difficulty_preference;
    if (feedbackType === 'too_difficult') {
      updatedDifficulty = 'easy';
    } else if (feedbackType === 'too_easy') {
      updatedDifficulty = 'challenging';
    }

    // Save updated preferences
    await supabase
      .from('learning_preferences')
      .update({
        topics_of_interest: updatedTopics,
        difficulty_preference: updatedDifficulty,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

  } catch (error) {
    console.error('Error updating user preferences:', error);
  }
}

async function updateRecommendationModel(supabase: any, userId: string, feedbackType: string) {
  try {
    console.log('Starting background recommendation model update...');
    
    // Calculate user similarity based on recent feedback patterns
    await recalculateSimilarUsers(supabase, userId);
    
    // Update recommendation weights based on global feedback
    await updateRecommendationWeights(supabase);
    
    console.log('Background recommendation model update completed');
  } catch (error) {
    console.error('Error in background model update:', error);
  }
}

async function recalculateSimilarUsers(supabase: any, userId: string) {
  try {
    // Get this user's learning patterns
    const { data: userEnrollments } = await supabase
      .from('user_learning_path_enrollments')
      .select('learning_path_id, status')
      .eq('user_id', userId);

    const { data: userFeedback } = await supabase
      .from('recommendation_feedback')
      .select('feedback_type, recommendation:path_recommendations(learning_path_id)')
      .eq('user_id', userId);

    if (!userEnrollments || userEnrollments.length === 0) return;

    // Get all other users with similar patterns
    const { data: allUsers } = await supabase
      .from('user_learning_path_enrollments')
      .select('user_id, learning_path_id, status')
      .neq('user_id', userId);

    // Calculate similarity scores
    const userSimilarities: { [key: string]: number } = {};
    
    allUsers?.forEach((enrollment: any) => {
      const otherUserId = enrollment.user_id;
      if (!userSimilarities[otherUserId]) {
        userSimilarities[otherUserId] = 0;
      }

      // Check if both users completed the same path
      const sharedPath = userEnrollments.find(
        (userEnroll: any) => 
          userEnroll.learning_path_id === enrollment.learning_path_id &&
          userEnroll.status === 'completed' &&
          enrollment.status === 'completed'
      );

      if (sharedPath) {
        userSimilarities[otherUserId] += 1;
      }
    });

    // Normalize scores and store top similar users
    const maxShared = Math.max(...Object.values(userSimilarities));
    const similarUsers = Object.entries(userSimilarities)
      .map(([otherUserId, sharedCount]) => ({
        user_id: userId,
        similar_user_id: otherUserId,
        similarity_score: sharedCount / maxShared,
        similarity_factors: ['completed_paths'],
        calculated_at: new Date().toISOString()
      }))
      .filter(sim => sim.similarity_score > 0.1)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 50);

    // Delete old similarities
    await supabase
      .from('similar_users')
      .delete()
      .eq('user_id', userId);

    // Insert new similarities
    if (similarUsers.length > 0) {
      await supabase
        .from('similar_users')
        .insert(similarUsers);
    }

  } catch (error) {
    console.error('Error recalculating similar users:', error);
  }
}

async function updateRecommendationWeights(supabase: any) {
  try {
    // Analyze global feedback patterns to adjust recommendation algorithm weights
    const { data: feedbackStats } = await supabase
      .from('recommendation_feedback')
      .select(`
        feedback_type,
        recommendation:path_recommendations(recommendation_type)
      `)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (!feedbackStats || feedbackStats.length === 0) return;

    // Calculate success rates by recommendation type
    const typeStats: { [key: string]: { positive: number, negative: number } } = {};
    
    feedbackStats.forEach((feedback: any) => {
      const type = feedback.recommendation?.recommendation_type;
      if (!type) return;

      if (!typeStats[type]) {
        typeStats[type] = { positive: 0, negative: 0 };
      }

      if (['like', 'enrolled'].includes(feedback.feedback_type)) {
        typeStats[type].positive++;
      } else if (['dislike', 'not_interested'].includes(feedback.feedback_type)) {
        typeStats[type].negative++;
      }
    });

    console.log('Recommendation type performance:', typeStats);

    // Store performance metrics for future algorithm improvements
    const performanceData = Object.entries(typeStats).map(([type, stats]) => ({
      recommendation_type: type,
      positive_feedback: stats.positive,
      negative_feedback: stats.negative,
      success_rate: stats.positive / (stats.positive + stats.negative),
      calculated_at: new Date().toISOString()
    }));

    console.log('Algorithm performance metrics updated:', performanceData);

  } catch (error) {
    console.error('Error updating recommendation weights:', error);
  }
}