import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const method = req.method;

    // POST /analyze-content - Extract keywords and topics from content
    if (method === 'POST' && pathSegments.includes('analyze-content')) {
      const body = await req.json();
      const { contentId, title, description, contentType } = body;

      if (!openAIApiKey) {
        return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Use AI to analyze content and extract metadata
      const prompt = `Analyze this learning content and extract relevant information:
      
Title: ${title}
Description: ${description}
Content Type: ${contentType}

Please provide:
1. Keywords (5-10 relevant keywords)
2. Topics/Categories (3-5 main topics)
3. Skill Level (beginner, intermediate, advanced)
4. Estimated Duration (in minutes)
5. Prerequisites (if any)
6. Learning Outcomes (3-5 outcomes)

Return as JSON with this structure:
{
  "keywords": ["keyword1", "keyword2", ...],
  "topics": ["topic1", "topic2", ...],
  "skillLevel": "beginner|intermediate|advanced",
  "estimatedDuration": 60,
  "prerequisites": ["prereq1", "prereq2", ...],
  "learningOutcomes": ["outcome1", "outcome2", ...]
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert learning content analyst. Analyze content and return structured metadata as JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 800
        }),
      });

      const aiResponse = await response.json();
      let analysis;

      try {
        analysis = JSON.parse(aiResponse.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Fallback to basic analysis
        analysis = {
          keywords: extractKeywords(title + ' ' + description),
          topics: [contentType],
          skillLevel: 'intermediate',
          estimatedDuration: 30,
          prerequisites: [],
          learningOutcomes: ['Complete the content successfully']
        };
      }

      // Store analysis results
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('content_analytics')
        .insert({
          content_id: contentId,
          action_type: 'content_analysis',
          metadata: {
            analysis,
            analyzed_at: new Date().toISOString()
          }
        });

      if (analyticsError) {
        console.error('Failed to store analytics:', analyticsError);
      }

      return new Response(JSON.stringify({ data: analysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /similarity-matrix - Create content similarity matrix
    if (method === 'POST' && pathSegments.includes('similarity-matrix')) {
      const { data: allContent, error } = await supabase
        .from('learning_paths')
        .select('id, title, description, category, level');

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate similarity scores between content items
      const similarityMatrix = {};
      
      for (let i = 0; i < allContent.length; i++) {
        const content1 = allContent[i];
        similarityMatrix[content1.id] = {};
        
        for (let j = 0; j < allContent.length; j++) {
          const content2 = allContent[j];
          
          if (i === j) {
            similarityMatrix[content1.id][content2.id] = 1.0;
          } else {
            // Calculate similarity based on category, level, and text similarity
            let score = 0;
            
            // Category match
            if (content1.category === content2.category) score += 0.4;
            
            // Level match
            if (content1.level === content2.level) score += 0.2;
            
            // Text similarity (simple keyword overlap)
            const text1 = (content1.title + ' ' + content1.description).toLowerCase();
            const text2 = (content2.title + ' ' + content2.description).toLowerCase();
            const keywords1 = extractKeywords(text1);
            const keywords2 = extractKeywords(text2);
            
            const intersection = keywords1.filter(k => keywords2.includes(k));
            const union = [...new Set([...keywords1, ...keywords2])];
            const textSimilarity = union.length > 0 ? intersection.length / union.length : 0;
            
            score += textSimilarity * 0.4;
            
            similarityMatrix[content1.id][content2.id] = Math.min(score, 1.0);
          }
        }
      }

      return new Response(JSON.stringify({ data: similarityMatrix }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /skill-match - Match content to user skills
    if (method === 'POST' && pathSegments.includes('skill-match')) {
      const body = await req.json();
      const { userId, jobRole } = body;

      // Get user's current skills
      const { data: userSkills } = await supabase
        .from('user_skills')
        .select('skill_name, proficiency_level')
        .eq('user_id', userId);

      // Get job role requirements
      const { data: jobRoleData } = await supabase
        .from('job_roles')
        .select('skill_requirements')
        .eq('title', jobRole)
        .single();

      // Get available learning paths
      const { data: learningPaths } = await supabase
        .from('learning_paths')
        .select('*');

      // Calculate skill gaps and recommend content
      const skillGaps = [];
      const requiredSkills = jobRoleData?.skill_requirements || [];
      
      for (const requiredSkill of requiredSkills) {
        const userSkill = userSkills?.find(s => s.skill_name === requiredSkill.name);
        if (!userSkill || getLevelScore(userSkill.proficiency_level) < getLevelScore(requiredSkill.level)) {
          skillGaps.push({
            skill: requiredSkill.name,
            currentLevel: userSkill?.proficiency_level || 'none',
            requiredLevel: requiredSkill.level,
            gap: getLevelScore(requiredSkill.level) - getLevelScore(userSkill?.proficiency_level || 'none')
          });
        }
      }

      // Recommend learning paths for skill gaps
      const recommendations = [];
      
      for (const gap of skillGaps) {
        const relevantPaths = learningPaths?.filter(path => {
          const pathText = (path.title + ' ' + path.description).toLowerCase();
          return pathText.includes(gap.skill.toLowerCase());
        }) || [];

        for (const path of relevantPaths) {
          recommendations.push({
            learningPathId: path.id,
            title: path.title,
            relevanceScore: gap.gap * 0.1, // Higher gap = higher relevance
            skillsAddressed: [gap.skill],
            estimatedImpact: calculateSkillImpact(gap.gap)
          });
        }
      }

      // Sort by relevance score
      recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

      return new Response(JSON.stringify({ 
        data: {
          skillGaps,
          recommendations: recommendations.slice(0, 10) // Top 10 recommendations
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-content-analysis:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'your', 'what', 'when', 'where', 'them'].includes(word));
  
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return Object.keys(wordFreq)
    .sort((a, b) => wordFreq[b] - wordFreq[a])
    .slice(0, 10);
}

function getLevelScore(level: string): number {
  const scores = {
    'none': 0,
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4
  };
  return scores[level.toLowerCase()] || 0;
}

function calculateSkillImpact(gap: number): string {
  if (gap >= 3) return 'high';
  if (gap >= 2) return 'medium';
  return 'low';
}