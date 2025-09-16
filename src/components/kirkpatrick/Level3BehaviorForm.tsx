import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Target, Clock } from "lucide-react";

interface Level3BehaviorFormProps {
  enrollmentId: string;
  programName?: string;
  onSubmit?: () => void;
}

const Level3BehaviorForm = ({ enrollmentId, programName, onSubmit }: Level3BehaviorFormProps) => {
  const [applicationScore, setApplicationScore] = useState([7]);
  const [specificExamples, setSpecificExamples] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!specificExamples.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide specific examples of how the training is being applied.",
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
          level: '3',
          metric_name: 'application',
          score: applicationScore[0],
          notes: specificExamples,
          evaluation_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Behavior Assessment Submitted",
        description: "Thank you for providing insights on skill application!",
      });

      onSubmit?.();
      
      // Reset form
      setApplicationScore([7]);
      setSpecificExamples("");
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
          <Target className="w-5 h-5 text-primary" />
          Level 3: Behavior Application
        </CardTitle>
        {programName && (
          <p className="text-sm text-muted-foreground">
            Training Program: <span className="font-medium">{programName}</span>
          </p>
        )}
        <div className="flex items-center gap-1 text-sm text-orange-600 bg-orange-50 dark:bg-orange-950 px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          Complete this 30-60 days after training completion
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application Score */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              To what extent are you applying the skills learned in training on the job?
            </Label>
            <div className="px-3">
              <Slider
                value={applicationScore}
                onValueChange={setApplicationScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Not at all (1)</span>
                <span className="font-medium text-primary">
                  {applicationScore[0]} / 10
                </span>
                <span>Extensively (10)</span>
              </div>
            </div>
          </div>

          {/* Specific Examples */}
          <div className="space-y-3">
            <Label htmlFor="examples" className="text-base font-medium">
              Provide specific examples of how you've applied the training on the job *
            </Label>
            <Textarea
              id="examples"
              placeholder="Describe specific situations where you used the skills or knowledge from the training..."
              value={specificExamples}
              onChange={(e) => setSpecificExamples(e.target.value)}
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Examples: "Used conflict resolution techniques during team meeting", 
              "Applied new project management framework to reduce delivery time"
            </p>
          </div>

          {/* Application Level Indicator */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-500">
            <div className="text-sm">
              <strong>Application Level:</strong>
              <span className={`ml-2 ${
                applicationScore[0] >= 8 ? 'text-green-600' :
                applicationScore[0] >= 6 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {applicationScore[0] >= 8 ? 'High Application' :
                 applicationScore[0] >= 6 ? 'Moderate Application' : 
                 'Low Application'}
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Behavior Assessment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Level3BehaviorForm;