import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Star } from "lucide-react";

interface Level1ReactionFormProps {
  enrollmentId: string;
  programName?: string;
  onSubmit?: () => void;
}

const Level1ReactionForm = ({ enrollmentId, programName, onSubmit }: Level1ReactionFormProps) => {
  const [satisfaction, setSatisfaction] = useState([7]);
  const [wouldRecommend, setWouldRecommend] = useState<string>("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wouldRecommend) {
      toast({
        title: "Missing Information",
        description: "Please select whether you would recommend this training.",
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
          level: '1',
          metric_name: 'satisfaction',
          score: satisfaction[0],
          notes: comments || null,
          evaluation_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Evaluation Submitted",
        description: "Thank you for your feedback on the training program!",
      });

      onSubmit?.();
      
      // Reset form
      setSatisfaction([7]);
      setWouldRecommend("");
      setComments("");
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your evaluation. Please try again.",
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
          <Users className="w-5 h-5 text-primary" />
          Level 1: Reaction Survey
        </CardTitle>
        {programName && (
          <p className="text-sm text-muted-foreground">
            Training Program: <span className="font-medium">{programName}</span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Satisfaction Score */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              How satisfied were you with this training program?
            </Label>
            <div className="px-3">
              <Slider
                value={satisfaction}
                onValueChange={setSatisfaction}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Very Dissatisfied (1)</span>
                <span className="font-medium text-primary">
                  {satisfaction[0]} / 10
                </span>
                <span>Very Satisfied (10)</span>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Would you recommend this training to a colleague?
            </Label>
            <RadioGroup value={wouldRecommend} onValueChange={setWouldRecommend}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes, definitely</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No, I wouldn't recommend it</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <Label htmlFor="comments" className="text-base font-medium">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="comments"
              placeholder="Please share any additional feedback about the training program..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Evaluation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Level1ReactionForm;