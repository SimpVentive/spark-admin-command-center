import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, TrendingUp } from "lucide-react";

interface Level2LearningFormProps {
  enrollmentId: string;
  programName?: string;
  onSubmit?: () => void;
}

const Level2LearningForm = ({ enrollmentId, programName, onSubmit }: Level2LearningFormProps) => {
  const [preTrainingScore, setPreTrainingScore] = useState([5]);
  const [postTrainingScore, setPostTrainingScore] = useState([7]);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const learningGain = postTrainingScore[0] - preTrainingScore[0];
  const improvementPercentage = ((learningGain / preTrainingScore[0]) * 100).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('kirkpatrick_evaluations')
        .insert({
          enrollment_id: enrollmentId,
          level: '2',
          metric_name: 'knowledge_gain',
          score: learningGain,
          notes: JSON.stringify({
            pre_score: preTrainingScore[0],
            post_score: postTrainingScore[0],
            improvement_percentage: parseFloat(improvementPercentage),
            comments: comments || null
          }),
          evaluation_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Learning Assessment Submitted",
        description: `Great progress! You showed ${improvementPercentage}% improvement.`,
      });

      onSubmit?.();
      
      // Reset form
      setPreTrainingScore([5]);
      setPostTrainingScore([7]);
      setComments("");
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
          <BookOpen className="w-5 h-5 text-primary" />
          Level 2: Learning Assessment
        </CardTitle>
        {programName && (
          <p className="text-sm text-muted-foreground">
            Training Program: <span className="font-medium">{programName}</span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pre-Training Confidence */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              How confident were you with this topic BEFORE the training?
            </Label>
            <div className="px-3">
              <Slider
                value={preTrainingScore}
                onValueChange={setPreTrainingScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Not Confident (1)</span>
                <span className="font-medium text-primary">
                  {preTrainingScore[0]} / 10
                </span>
                <span>Very Confident (10)</span>
              </div>
            </div>
          </div>

          {/* Post-Training Confidence */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              How confident are you with this topic AFTER the training?
            </Label>
            <div className="px-3">
              <Slider
                value={postTrainingScore}
                onValueChange={setPostTrainingScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Not Confident (1)</span>
                <span className="font-medium text-primary">
                  {postTrainingScore[0]} / 10
                </span>
                <span>Very Confident (10)</span>
              </div>
            </div>
          </div>

          {/* Learning Progress Display */}
          <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-medium">Your Learning Progress</span>
            </div>
            <div className="text-sm space-y-1">
              <p>Knowledge Gain: <span className="font-medium text-primary">{learningGain > 0 ? '+' : ''}{learningGain} points</span></p>
              <p>Improvement: <span className="font-medium text-primary">{improvementPercentage}%</span></p>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <Label htmlFor="comments" className="text-base font-medium">
              Describe what you learned (Optional)
            </Label>
            <Textarea
              id="comments"
              placeholder="What new knowledge or skills did you gain from this training?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Learning Assessment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Level2LearningForm;