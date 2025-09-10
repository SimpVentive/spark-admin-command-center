-- Create user_skills table to track current user competencies
CREATE TABLE public.user_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  competency_id UUID REFERENCES public.competencies(id),
  skill_name TEXT NOT NULL,
  proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100) DEFAULT 50,
  last_assessed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'self_reported' CHECK (source IN ('self_reported', 'assessment', 'course_completion', 'manager_assigned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create learning_preferences table for personalization
CREATE TABLE public.learning_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  job_role TEXT,
  career_goals TEXT[],
  preferred_learning_style TEXT CHECK (preferred_learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading_writing', 'mixed')),
  preferred_duration_minutes INTEGER DEFAULT 30,
  difficulty_preference TEXT DEFAULT 'adaptive' CHECK (difficulty_preference IN ('easy', 'moderate', 'challenging', 'adaptive')),
  topics_of_interest TEXT[],
  learning_schedule JSONB DEFAULT '{"weekdays": ["monday", "tuesday", "wednesday", "thursday", "friday"], "time_slots": ["morning", "afternoon"]}',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_learning_analytics table to track behavior patterns
CREATE TABLE public.user_learning_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  learning_path_id UUID REFERENCES public.learning_paths(id),
  session_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_time_minutes INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  engagement_score NUMERIC(3,2) DEFAULT 0.0,
  learning_velocity NUMERIC(5,2) DEFAULT 0.0, -- topics completed per hour
  preferred_content_types TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create path_recommendations table to store AI-generated suggestions
CREATE TABLE public.path_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  learning_path_id UUID REFERENCES public.learning_paths(id),
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('collaborative', 'content_based', 'hybrid', 'trending', 'skill_gap')),
  confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0.0,
  reasoning TEXT,
  metadata JSONB DEFAULT '{}',
  is_clicked BOOLEAN DEFAULT false,
  is_enrolled BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP WITH TIME ZONE,
  enrolled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days')
);

-- Create recommendation_feedback table for ML improvement
CREATE TABLE public.recommendation_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendation_id UUID REFERENCES public.path_recommendations(id),
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('like', 'dislike', 'not_relevant', 'already_completed', 'too_difficult', 'too_easy', 'not_interested')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create similar_users table for collaborative filtering
CREATE TABLE public.similar_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  similar_user_id UUID NOT NULL,
  similarity_score NUMERIC(3,2) NOT NULL,
  similarity_factors TEXT[],
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, similar_user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.path_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.similar_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_skills
CREATE POLICY "Users can manage their own skills" ON public.user_skills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all skills" ON public.user_skills
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for learning_preferences
CREATE POLICY "Users can manage their own preferences" ON public.learning_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all preferences" ON public.learning_preferences
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for user_learning_analytics
CREATE POLICY "Users can view their own analytics" ON public.user_learning_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics" ON public.user_learning_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all analytics" ON public.user_learning_analytics
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for path_recommendations
CREATE POLICY "Users can view their own recommendations" ON public.path_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their recommendation interactions" ON public.path_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert recommendations" ON public.path_recommendations
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for recommendation_feedback
CREATE POLICY "Users can manage their own feedback" ON public.recommendation_feedback
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for similar_users
CREATE POLICY "Users can view their similar users" ON public.similar_users
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = similar_user_id);

-- Create indexes for performance
CREATE INDEX idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX idx_user_skills_competency ON public.user_skills(competency_id);
CREATE INDEX idx_user_skills_proficiency ON public.user_skills(proficiency_level);

CREATE INDEX idx_learning_analytics_user_id ON public.user_learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_path_id ON public.user_learning_analytics(learning_path_id);
CREATE INDEX idx_learning_analytics_session ON public.user_learning_analytics(session_start);

CREATE INDEX idx_path_recommendations_user_id ON public.path_recommendations(user_id);
CREATE INDEX idx_path_recommendations_type ON public.path_recommendations(recommendation_type);
CREATE INDEX idx_path_recommendations_confidence ON public.path_recommendations(confidence_score DESC);
CREATE INDEX idx_path_recommendations_expires ON public.path_recommendations(expires_at);

CREATE INDEX idx_recommendation_feedback_user_id ON public.recommendation_feedback(user_id);
CREATE INDEX idx_recommendation_feedback_type ON public.recommendation_feedback(feedback_type);

CREATE INDEX idx_similar_users_user_id ON public.similar_users(user_id);
CREATE INDEX idx_similar_users_similarity ON public.similar_users(similarity_score DESC);

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON public.user_skills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_preferences_updated_at
  BEFORE UPDATE ON public.learning_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();