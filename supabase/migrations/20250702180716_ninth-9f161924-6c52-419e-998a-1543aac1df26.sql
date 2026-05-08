
-- Create SSO configurations table
CREATE TABLE IF NOT EXISTS public.sso_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('okta', 'auth0', 'microsoft', 'saml')),
  domain TEXT NOT NULL,
  client_id TEXT,
  client_secret_encrypted TEXT,
  issuer_url TEXT,
  metadata_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create content media table for video/document management
CREATE TABLE IF NOT EXISTS public.content_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'document', 'pdf')),
  provider TEXT CHECK (provider IN ('vimeo', 'youtube', 'google_docs', 'local')),
  external_id TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  file_size BIGINT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create badges/certificates table for gamification
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('achievement', 'skill', 'completion', 'certification')),
  criteria TEXT,
  image_url TEXT,
  external_badge_id TEXT,
  provider TEXT CHECK (provider IN ('badgr', 'credly', 'internal')),
  points_value INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user badges earned table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  external_credential_id TEXT,
  verification_url TEXT,
  UNIQUE(user_id, badge_id)
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  phone_number TEXT,
  motivation_emails BOOLEAN DEFAULT true,
  progress_updates BOOLEAN DEFAULT true,
  achievement_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.sso_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_media (public read)
DROP POLICY IF EXISTS "Anyone can view active content media" ON public.content_media;
CREATE POLICY "Anyone can view active content media"
  ON public.content_media
  FOR SELECT
  USING (is_active = true);

-- RLS policies for badges (public read)
DROP POLICY IF EXISTS "Anyone can view active badges" ON public.badges;
CREATE POLICY "Anyone can view active badges"
  ON public.badges
  FOR SELECT
  USING (is_active = true);

-- RLS policies for user_badges
DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;
CREATE POLICY "Users can view their own badges"
  ON public.user_badges
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own badges" ON public.user_badges;
CREATE POLICY "Users can insert their own badges"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for notification_preferences
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can view their own notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert their own notification preferences"
  ON public.notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert sample badges
INSERT INTO public.badges (name, description, badge_type, criteria, points_value) VALUES
('First Login', 'Welcome to SkillSpark! Complete your first login.', 'achievement', 'Complete first successful login', 10),
('Course Starter', 'Begin your learning journey by starting your first course.', 'achievement', 'Start first course', 25),
('Week Warrior', 'Maintain a 7-day learning streak.', 'achievement', 'Learn for 7 consecutive days', 50),
('Quiz Master', 'Score 90% or higher on 5 assessments.', 'skill', 'Score 90%+ on 5 assessments', 100),
('Learning Champion', 'Complete 10 courses successfully.', 'completion', 'Complete 10 courses', 200);

-- Insert sample content media
INSERT INTO public.content_media (title, description, media_type, provider, url, thumbnail_url) VALUES
('Introduction to Learning Management', 'Welcome video introducing the platform features', 'video', 'youtube', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'),
('User Guide PDF', 'Comprehensive guide to using the platform', 'document', 'local', '/docs/user-guide.pdf', '/images/pdf-icon.png'),
('Getting Started Tutorial', 'Step-by-step tutorial for new users', 'video', 'vimeo', 'https://player.vimeo.com/video/example', 'https://i.vimeocdn.com/video/example.jpg');
