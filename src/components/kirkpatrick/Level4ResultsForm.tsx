import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Clock } from "lucide-react";

interface Level4ResultsFormProps {
  enrollmentId: string;
  programName?: string;
  onSubmit?: () => void;
}

const Level4ResultsForm = ({ enrollmentId, programName, onSubmit }: Level4ResultsFormProps) => {
  const [businessImpactScore, setBusinessImpactScore] = useState([7]);
  const [improvementExample, setImprovementExample] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!improvementExample.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide an example of business improvement.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('kirkpatrick_evaluations')
        .insert({
          enrollment_id: enrollmentId,
          level: '4',
          metric_name: 'business_impact',
          score: businessImpactScore[0],
          notes: improvementExample,
          evaluation_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Results Assessment Submitted",
        description: "Thank you for documenting the business impact!",
      });

      onSubmit?.();
      
      // Reset form
      setBusinessImpactScore([7]);
      setImprovementExample("");
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Level 4: Business Results
        </CardTitle>
        {programName && (
          <p className="text-sm text-muted-foreground">
            Training Program: <span className="font-medium">{programName}</span>
          </p>
        )}
        <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 dark:bg-green-950 px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          Complete this 90+ days after training completion
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Impact Score */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Has the participant's performance improved as a result of the training?
            </Label>
            <div className="px-3">
              <Slider
                value={businessImpactScore}
                onValueChange={setBusinessImpactScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>No Impact (1)</span>
                <span className="font-medium text-primary">
                  {businessImpactScore[0]} / 10
                </span>
                <span>High Impact (10)</span>
              </div>
            </div>
          </div>

          {/* Business Impact Examples */}
          <div className="space-y-3">
            <Label htmlFor="improvement" className="text-base font-medium">
              Describe one specific business improvement that resulted from this training *
            </Label>
            <Textarea
              id="improvement"
              placeholder="Provide measurable examples of business impact..."
              value={improvementExample}
              onChange={(e) => setImprovementExample(e.target.value)}
              rows={6}
              required
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Examples of business impact:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Increased sales revenue by 15%</li>
                <li>Reduced customer complaints by 30%</li>
                <li>Improved project delivery time by 2 weeks</li>
                <li>Decreased employee turnover in team</li>
                <li>Enhanced quality scores from 85% to 92%</li>
              </ul>
            </div>
          </div>

          {/* Impact Level Indicator */}
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border-l-4 border-green-500">
            <div className="text-sm">
              <strong>Business Impact Level:</strong>
              <span className={`ml-2 ${
                businessImpactScore[0] >= 8 ? 'text-green-600' :
                businessImpactScore[0] >= 6 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {businessImpactScore[0] >= 8 ? 'High Impact' :
                 businessImpactScore[0] >= 6 ? 'Moderate Impact' : 
                 'Low Impact'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Scores 7+ indicate positive ROI from training investment
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Results Assessment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Level4ResultsForm;