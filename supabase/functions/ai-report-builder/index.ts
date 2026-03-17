import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AVAILABLE_TABLES = [
  "profiles (id, email, full_name, company_id, department, designation, employee_id, is_active)",
  "companies (id, name, slug, is_active, created_at)",
  "training_programs (id, title, category, company_id, is_active, created_at)",
  "events (id, title, event_type, status, start_date, end_date, company_id, program_id)",
  "assessments (id, title, assessment_type, passing_score, company_id)",
  "assessment_results (id, assessment_id, user_id, score, status, completed_at)",
  "departments (id, name, company_id, employee_count, is_active)",
  "locations (id, name, city, country, company_id, is_active)",
  "trainers (id, name, specialization, is_active)",
  "event_enrollments (id, event_id, employee_id, enrollment_status, completed_at)",
  "content_items (id, title, content_type, company_id, created_at)",
  "user_roles (id, user_id, role, company_id)",
  "company_payments (id, company_id, plan_name, plan_status, amount, billing_cycle)",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an AI report builder for an LMS (Learning Management System) platform. You help super admins create custom reports and insights.

Available database tables:
${AVAILABLE_TABLES.join("\n")}

When the user asks for a report:
1. Understand what data they need
2. Suggest a clear report structure with columns, filters, and grouping
3. Generate a Supabase JS query (using .from().select() syntax) to fetch the data
4. Suggest a visualization type (table, bar chart, pie chart, line chart)
5. Format your response with markdown sections: ## Report Title, ### Query, ### Visualization

IMPORTANT: Only use SELECT queries. Never modify data. Always reference the exact table and column names from the schema above.
Keep responses concise and actionable. If the user's request is vague, ask clarifying questions.`;

    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...(messages || [{ role: "user", content: prompt }]),
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
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
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
