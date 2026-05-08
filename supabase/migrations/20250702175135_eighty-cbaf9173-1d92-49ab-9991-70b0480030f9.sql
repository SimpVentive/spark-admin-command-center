
-- Create calendar sync table to store user calendar connections
CREATE TABLE IF NOT EXISTS public.calendar_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  calendar_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Enable RLS on calendar_sync
ALTER TABLE public.calendar_sync ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for calendar_sync
DROP POLICY IF EXISTS "Users can view their own calendar sync settings" ON public.calendar_sync;
CREATE POLICY "Users can view their own calendar sync settings"
  ON public.calendar_sync
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own calendar sync settings" ON public.calendar_sync;
CREATE POLICY "Users can insert their own calendar sync settings"
  ON public.calendar_sync
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own calendar sync settings" ON public.calendar_sync;
CREATE POLICY "Users can update their own calendar sync settings"
  ON public.calendar_sync
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own calendar sync settings" ON public.calendar_sync;
CREATE POLICY "Users can delete their own calendar sync settings"
  ON public.calendar_sync
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create calendar events table to store synced events
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_sync_id UUID NOT NULL REFERENCES public.calendar_sync(id) ON DELETE CASCADE,
  external_event_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_synced BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(calendar_sync_id, external_event_id)
);

-- Enable RLS on calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for calendar_events
DROP POLICY IF EXISTS "Users can view their own calendar events" ON public.calendar_events;
CREATE POLICY "Users can view their own calendar events"
  ON public.calendar_events
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own calendar events" ON public.calendar_events;
CREATE POLICY "Users can insert their own calendar events"
  ON public.calendar_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own calendar events" ON public.calendar_events;
CREATE POLICY "Users can update their own calendar events"
  ON public.calendar_events
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own calendar events" ON public.calendar_events;
CREATE POLICY "Users can delete their own calendar events"
  ON public.calendar_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add SSO provider tracking to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sso_provider TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sso_provider_id TEXT;
