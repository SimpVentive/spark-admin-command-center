import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !data?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { file, settings } = await req.json();
    
    console.log('PPT to Video conversion started', { userId: data.claims.sub, settings });

    const conversionSteps = [
      'Analyzing PowerPoint file...',
      'Extracting slides...',
      'Applying transition timing...',
      'Processing audio narration...',
      'Generating video frames...',
      'Encoding to MP4...',
      'Optimizing for web delivery...'
    ];

    const result = {
      success: true,
      videoUrl: '/demo-converted-video.mp4',
      steps: conversionSteps,
      metadata: {
        originalFile: file?.name || 'presentation.pptx',
        outputFormat: 'MP4',
        resolution: settings?.resolution || '1080p',
        duration: '3:45',
        fileSize: '45.2 MB',
        fps: settings?.fps || 30
      },
      downloadUrl: '/downloads/converted-presentation.mp4'
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in PPT to Video conversion:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An internal error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
