-- Create learning_preferences table to store user learning preferences
CREATE TABLE IF NOT EXISTS public.learning_preferences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    career_goals TEXT[],
    topics_of_interest TEXT[],
    preferred_learning_style TEXT,
    preferred_content_format TEXT[],
    time_availability INTEGER, -- minutes per week
    motivation_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS on learning_preferences
ALTER TABLE public.learning_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_preferences
DROP POLICY IF EXISTS "Users can view their own learning preferences" ON public.learning_preferences;
CREATE POLICY "Users can view their own learning preferences"
ON public.learning_preferences
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own learning preferences" ON public.learning_preferences;
CREATE POLICY "Users can insert their own learning preferences"
ON public.learning_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own learning preferences" ON public.learning_preferences;
CREATE POLICY "Users can update their own learning preferences"
ON public.learning_preferences
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all learning preferences" ON public.learning_preferences;
CREATE POLICY "Admins can manage all learning preferences"
ON public.learning_preferences
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
DROP TRIGGER IF EXISTS update_learning_preferences_updated_at ON public.learning_preferences;
CREATE TRIGGER update_learning_preferences_updated_at
    BEFORE UPDATE ON public.learning_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();