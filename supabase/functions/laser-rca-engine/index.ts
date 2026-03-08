import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RCAResult {
  deviation_id: string;
  cause_id: string;
  probability_score: number;
  is_primary_cause: boolean;
  analysis_data: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { deviation_id, mode } = await req.json();

    // Mode: "analyze" (single deviation) or "scan" (all open deviations)
    let deviationIds: string[] = [];

    if (mode === "scan") {
      // Find all open deviations without RCA results
      const { data: openDevs } = await supabase
        .from("laser_deviations")
        .select("id")
        .eq("status", "open");

      if (!openDevs?.length) {
        return new Response(
          JSON.stringify({ message: "No open deviations to analyze", results: [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Filter out deviations that already have RCA results
      const { data: existingRca } = await supabase
        .from("laser_rca_results")
        .select("deviation_id")
        .in("deviation_id", openDevs.map((d) => d.id));

      const analyzedIds = new Set((existingRca || []).map((r) => r.deviation_id));
      deviationIds = openDevs.filter((d) => !analyzedIds.has(d.id)).map((d) => d.id);
    } else {
      if (!deviation_id) {
        return new Response(
          JSON.stringify({ error: "deviation_id is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      deviationIds = [deviation_id];
    }

    if (!deviationIds.length) {
      return new Response(
        JSON.stringify({ message: "All deviations already analyzed", results: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch deviations with KPI info
    const { data: deviations } = await supabase
      .from("laser_deviations")
      .select("*, laser_kpi_definitions(id, name, unit)")
      .in("id", deviationIds);

    if (!deviations?.length) {
      return new Response(
        JSON.stringify({ error: "Deviations not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all causes with their interventions
    const kpiIds = [...new Set(deviations.map((d) => d.kpi_id))];
    const { data: causes } = await supabase
      .from("laser_cause_definitions")
      .select("*")
      .in("kpi_id", kpiIds)
      .eq("is_active", true);

    // Fetch pattern repository for Bayesian refinement
    const { data: patterns } = await supabase
      .from("laser_pattern_repository")
      .select("*")
      .in("kpi_id", kpiIds);

    // Fetch cause interventions
    const causeIds = (causes || []).map((c) => c.id);
    const { data: interventions } = await supabase
      .from("laser_cause_interventions")
      .select("*")
      .in("cause_id", causeIds)
      .eq("is_active", true);

    const patternMap = new Map<string, { refined_weight: number; success_count: number; failure_count: number }>();
    for (const p of patterns || []) {
      patternMap.set(`${p.kpi_id}:${p.cause_id}`, {
        refined_weight: p.refined_weight ?? p.avg_improvement_percentage ?? 0,
        success_count: p.success_count ?? 0,
        failure_count: p.failure_count ?? 0,
      });
    }

    const allRcaResults: RCAResult[] = [];
    const allInterventionAssignments: any[] = [];

    for (const deviation of deviations) {
      const kpiCauses = (causes || []).filter((c) => c.kpi_id === deviation.kpi_id);
      if (!kpiCauses.length) continue;

      // === Bayesian Probability Scoring ===
      // P(cause | deviation) ∝ P(deviation | cause) × P(cause)
      // P(cause) = prior from default_weight, refined by pattern repository
      // P(deviation | cause) = likelihood based on severity and deviation magnitude

      const scored = kpiCauses.map((cause) => {
        const patternKey = `${deviation.kpi_id}:${cause.id}`;
        const pattern = patternMap.get(patternKey);

        // Prior: use refined weight from patterns if available, else default_weight
        let prior = cause.default_weight || 0.25;
        if (pattern && (pattern.success_count + pattern.failure_count) > 0) {
          const totalObservations = pattern.success_count + pattern.failure_count;
          // Bayesian update: blend default weight with observed success rate
          // More observations → more weight to observed data
          const alpha = Math.min(totalObservations / 10, 1); // confidence factor
          const observedRate = pattern.success_count / totalObservations;
          prior = (1 - alpha) * cause.default_weight + alpha * observedRate;

          // Also factor in refined_weight if available
          if (pattern.refined_weight > 0) {
            prior = prior * 0.7 + (pattern.refined_weight / 100) * 0.3;
          }
        }

        // Likelihood: based on deviation severity and category match
        let likelihood = 0.5; // base
        const devMagnitude = Math.abs(deviation.deviation_percentage);

        // Higher deviation → skill_gap and human_error more likely
        if (devMagnitude > 30) {
          if (cause.cause_category === "skill_gap" || cause.cause_category === "human_error") {
            likelihood += 0.2;
          }
        }
        // Severity boost
        if (deviation.severity === "critical") {
          likelihood += 0.15;
        } else if (deviation.severity === "warning") {
          likelihood += 0.05;
        }

        // Training-required causes get slight boost for training-solvable problems
        if (cause.requires_training) {
          likelihood += 0.05;
        }

        const posteriorUnnormalized = prior * likelihood;

        return {
          cause,
          prior,
          likelihood,
          posteriorUnnormalized,
          pattern,
        };
      });

      // Normalize posteriors
      const totalPosterior = scored.reduce((sum, s) => sum + s.posteriorUnnormalized, 0);
      const normalized = scored.map((s) => ({
        ...s,
        probability: totalPosterior > 0 ? s.posteriorUnnormalized / totalPosterior : 1 / scored.length,
      }));

      // Sort by probability descending
      normalized.sort((a, b) => b.probability - a.probability);

      // Store RCA results
      const rcaInserts = normalized.map((n, idx) => ({
        deviation_id: deviation.id,
        cause_id: n.cause.id,
        probability_score: Math.round(n.probability * 1000) / 1000,
        is_primary_cause: idx === 0,
        analysis_data: {
          prior: n.prior,
          likelihood: n.likelihood,
          deviation_magnitude: deviation.deviation_percentage,
          severity: deviation.severity,
          pattern_observations: n.pattern
            ? n.pattern.success_count + n.pattern.failure_count
            : 0,
        },
      }));

      allRcaResults.push(...rcaInserts);

      // === Auto-assign interventions for top causes ===
      // Assign interventions for causes with probability > 0.15 (or top 3, whichever is smaller)
      const topCauses = normalized
        .filter((n) => n.probability > 0.15)
        .slice(0, 3);

      for (const tc of topCauses) {
        if (!tc.cause.requires_training) continue; // skip non-training causes

        const causeInterventions = (interventions || []).filter(
          (i) => i.cause_id === tc.cause.id
        );

        if (!causeInterventions.length) continue;

        // Pick highest priority intervention
        const bestIntervention = causeInterventions.sort(
          (a, b) => (a.priority || 99) - (b.priority || 99)
        )[0];

        allInterventionAssignments.push({
          deviation_id: deviation.id,
          employee_id: deviation.employee_id,
          rca_result_id: null, // will be set after RCA insert
          cause_intervention_id: bestIntervention.id,
          intervention_type: bestIntervention.intervention_type,
          learning_path_id: bestIntervention.learning_path_id,
          program_id: bestIntervention.program_id,
          micro_intervention_title: bestIntervention.micro_intervention_title,
          micro_intervention_content: bestIntervention.micro_intervention_content,
          status: "assigned",
          _cause_id: tc.cause.id, // temp for linking
        });
      }
    }

    // Insert RCA results
    let insertedRca: any[] = [];
    if (allRcaResults.length) {
      const { data, error: rcaError } = await supabase
        .from("laser_rca_results")
        .insert(allRcaResults)
        .select();

      if (rcaError) {
        console.error("RCA insert error:", rcaError);
        return new Response(
          JSON.stringify({ error: "Failed to store RCA results", details: rcaError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      insertedRca = data || [];
    }

    // Map rca_result_ids to intervention assignments
    let interventionsCreated = 0;
    if (allInterventionAssignments.length && insertedRca.length) {
      const assignmentsToInsert = allInterventionAssignments.map((a) => {
        // Find matching RCA result
        const rcaResult = insertedRca.find(
          (r) => r.deviation_id === a.deviation_id && r.cause_id === a._cause_id
        );
        const { _cause_id, ...rest } = a;
        return {
          ...rest,
          rca_result_id: rcaResult?.id || insertedRca[0].id,
        };
      });

      const { data: interventionData, error: intError } = await supabase
        .from("laser_assigned_interventions")
        .insert(assignmentsToInsert)
        .select();

      if (intError) {
        console.error("Intervention assignment error:", intError);
      } else {
        interventionsCreated = interventionData?.length || 0;
      }

      // Create impact validation records for each assigned intervention
      if (interventionData?.length) {
        const validationInserts = interventionData.map((intervention) => {
          const deviation = deviations.find((d) => d.id === intervention.deviation_id);
          return {
            intervention_id: intervention.id,
            kpi_id: deviation?.kpi_id,
            pre_intervention_value: deviation?.actual_value || 0,
            validation_status: "pending",
          };
        });

        await supabase.from("laser_impact_validations").insert(validationInserts);
      }
    }

    // Update deviation status to "analyzing" for processed ones
    await supabase
      .from("laser_deviations")
      .update({ status: "analyzing" })
      .in("id", deviationIds);

    return new Response(
      JSON.stringify({
        message: `RCA completed for ${deviationIds.length} deviation(s)`,
        rca_results: insertedRca.length,
        interventions_assigned: interventionsCreated,
        deviations_processed: deviationIds.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("LASER RCA Engine error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
