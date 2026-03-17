import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, description, companyName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a technical project analyst for an LMS (Learning Management System) platform. Analyze change requests and provide structured estimates. The platform has modules: Organization, User Management, Programs, Learning Paths, Assessments, Content Library, TNA, ROI/Analytics, LASER, MOOC, LTI, Library, Security, Reports. Always respond with a tool call.`,
          },
          {
            role: "user",
            content: `Analyze this change request for company "${companyName}":\n\nTitle: ${title}\nDescription: ${description}\n\nProvide estimated hours, impact score (1-10), risk level, affected modules, and analysis notes.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_analysis",
              description: "Provide structured analysis of a change request",
              parameters: {
                type: "object",
                properties: {
                  estimated_hours: { type: "number", description: "Estimated implementation hours" },
                  impact_score: { type: "number", description: "Impact score 1-10 (10 = highest)" },
                  risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  affected_modules: { type: "array", items: { type: "string" }, description: "List of affected platform modules" },
                  analysis_notes: { type: "string", description: "Brief analysis and recommendations" },
                },
                required: ["estimated_hours", "impact_score", "risk_level", "affected_modules", "analysis_notes"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_analysis" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    const analysis = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
