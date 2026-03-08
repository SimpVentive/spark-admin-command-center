import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Find all completed interventions with impact validations that have post-values
    const { data: validations } = await supabase
      .from("laser_impact_validations")
      .select(`
        *,
        laser_assigned_interventions!inner(
          id, deviation_id, status, cause_intervention_id,
          laser_deviations(kpi_id, employee_id)
        )
      `)
      .not("post_intervention_value", "is", null)
      .in("validation_status", ["pending", "improved", "no_change", "declined"]);

    if (!validations?.length) {
      return new Response(
        JSON.stringify({ message: "No completed validations to process", updated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process each validation and update patterns
    let patternsUpdated = 0;
    let patternsCreated = 0;

    for (const v of validations) {
      const intervention = v.laser_assigned_interventions;
      if (!intervention?.laser_deviations?.kpi_id) continue;

      const kpiId = intervention.laser_deviations.kpi_id;

      // Get the cause_id from the cause_intervention link
      if (!intervention.cause_intervention_id) continue;

      const { data: causeIntervention } = await supabase
        .from("laser_cause_interventions")
        .select("cause_id")
        .eq("id", intervention.cause_intervention_id)
        .single();

      if (!causeIntervention) continue;
      const causeId = causeIntervention.cause_id;

      // Determine if this was a success or failure
      const improvementPct = v.improvement_percentage ?? 0;
      const isSuccess = improvementPct > 0;

      // Update or create pattern in repository
      const { data: existingPattern } = await supabase
        .from("laser_pattern_repository")
        .select("*")
        .eq("kpi_id", kpiId)
        .eq("cause_id", causeId)
        .single();

      if (existingPattern) {
        // Update existing pattern with Bayesian weight refinement
        const newSuccessCount = (existingPattern.success_count || 0) + (isSuccess ? 1 : 0);
        const newFailureCount = (existingPattern.failure_count || 0) + (isSuccess ? 0 : 1);
        const totalObservations = newSuccessCount + newFailureCount;

        // Exponential moving average for improvement percentage
        const alpha = 0.3; // learning rate
        const newAvgImprovement = existingPattern.avg_improvement_percentage != null
          ? (1 - alpha) * existingPattern.avg_improvement_percentage + alpha * improvementPct
          : improvementPct;

        // Refined weight: Bayesian posterior
        // Prior: current refined_weight or default cause weight
        // Evidence: success rate weighted by improvement magnitude
        const successRate = newSuccessCount / totalObservations;
        const improvementFactor = Math.max(0, newAvgImprovement) / 100; // normalize to 0-1
        const refinedWeight = successRate * 0.6 + improvementFactor * 0.4;

        await supabase
          .from("laser_pattern_repository")
          .update({
            success_count: newSuccessCount,
            failure_count: newFailureCount,
            avg_improvement_percentage: Math.round(newAvgImprovement * 100) / 100,
            refined_weight: Math.round(refinedWeight * 1000) / 1000,
            last_updated_at: new Date().toISOString(),
          })
          .eq("id", existingPattern.id);

        patternsUpdated++;
      } else {
        // Create new pattern entry
        const refinedWeight = isSuccess ? Math.max(0.1, improvementPct / 100) : 0.05;

        await supabase.from("laser_pattern_repository").insert({
          kpi_id: kpiId,
          cause_id: causeId,
          success_count: isSuccess ? 1 : 0,
          failure_count: isSuccess ? 0 : 1,
          avg_improvement_percentage: improvementPct,
          refined_weight: Math.round(refinedWeight * 1000) / 1000,
        });

        patternsCreated++;
      }

      // Update validation status based on improvement
      let newStatus = "no_change";
      if (improvementPct > 5) newStatus = "improved";
      else if (improvementPct < -5) newStatus = "declined";

      if (v.validation_status === "pending") {
        await supabase
          .from("laser_impact_validations")
          .update({
            validation_status: newStatus,
            improvement_percentage: improvementPct,
            updated_at: new Date().toISOString(),
          })
          .eq("id", v.id);
      }

      // If improved, also resolve the deviation
      if (newStatus === "improved") {
        await supabase
          .from("laser_deviations")
          .update({ status: "resolved", resolved_at: new Date().toISOString() })
          .eq("id", intervention.deviation_id);

        // Mark intervention as completed
        await supabase
          .from("laser_assigned_interventions")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", intervention.id);
      }

      // Also update the cause_definitions default_weight based on learned patterns
      // (gradually shift towards refined_weight)
      const { data: causeDefn } = await supabase
        .from("laser_cause_definitions")
        .select("default_weight")
        .eq("id", causeId)
        .single();

      if (causeDefn) {
        const { data: latestPattern } = await supabase
          .from("laser_pattern_repository")
          .select("refined_weight, success_count, failure_count")
          .eq("cause_id", causeId)
          .single();

        if (latestPattern) {
          const totalObs = (latestPattern.success_count || 0) + (latestPattern.failure_count || 0);
          // Only update default weight if we have enough observations
          if (totalObs >= 5) {
            const blendFactor = Math.min(totalObs / 20, 0.5); // max 50% shift
            const newDefault =
              (1 - blendFactor) * causeDefn.default_weight +
              blendFactor * (latestPattern.refined_weight || causeDefn.default_weight);

            await supabase
              .from("laser_cause_definitions")
              .update({ default_weight: Math.round(newDefault * 1000) / 1000 })
              .eq("id", causeId);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: "Learning loop completed",
        validations_processed: validations.length,
        patterns_updated: patternsUpdated,
        patterns_created: patternsCreated,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("LASER learning loop error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
