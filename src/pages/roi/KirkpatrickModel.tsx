import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, TrendingUp, Users, BookOpen, Target } from "lucide-react";

const KirkpatrickModel = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Kirkpatrick Model</h1>
          <p className="text-muted-foreground">Understanding Training Effectiveness</p>
        </div>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌐 What is the Kirkpatrick Model?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Kirkpatrick Model, developed by Donald Kirkpatrick in the 1950s, is one of the most widely used frameworks for evaluating the effectiveness of training programs. It goes beyond simply asking "Did participants like the training?" and instead measures how learning translates into behavior and results.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <Badge variant="outline" className="mb-2">Level 1</Badge>
                <h3 className="font-semibold">Reaction</h3>
                <p className="text-sm text-muted-foreground">How participants respond to training</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <Badge variant="outline" className="mb-2">Level 2</Badge>
                <h3 className="font-semibold">Learning</h3>
                <p className="text-sm text-muted-foreground">Knowledge, skills, or attitudes gained</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <Badge variant="outline" className="mb-2">Level 3</Badge>
                <h3 className="font-semibold">Behavior</h3>
                <p className="text-sm text-muted-foreground">Application of learning on the job</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <Badge variant="outline" className="mb-2">Level 4</Badge>
                <h3 className="font-semibold">Results</h3>
                <p className="text-sm text-muted-foreground">Measurable business outcomes</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚙️ How to Use It in ROI Computation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            In your LMS, the Kirkpatrick model acts as a step-by-step evaluation guide:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary">1</Badge>
              <div>
                <strong>Collect feedback surveys</strong> for Reaction.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">2</Badge>
              <div>
                <strong>Use quizzes/assessments</strong> to measure Learning.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">3</Badge>
              <div>
                <strong>Track on-the-job application</strong> via performance data, manager feedback, or self-assessments for Behavior.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">4</Badge>
              <div>
                <strong>Align business KPIs</strong> (revenue growth, reduced costs, efficiency gains) to evaluate Results.
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
            <p className="text-sm">
              These four levels can be tied to financial metrics, allowing you to calculate Return on Investment (ROI) more accurately.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Positives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Positives of the Kirkpatrick Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Simple & Intuitive</strong> – Easy to understand and implement across industries.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Comprehensive</strong> – Covers everything from learner experience to organizational impact.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Widely Accepted</strong> – Recognized globally as a gold standard in training evaluation.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Flexible</strong> – Can be applied to classroom, online, blended, and workplace learning.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>ROI Friendly</strong> – Links training directly to business outcomes.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Limitations to Keep in Mind
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <strong>Time & Cost Intensive</strong> – Measuring beyond Level 2 requires continuous data collection.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <strong>Causality Challenges</strong> – Difficult to isolate training impact from other business factors at Level 4.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <strong>Delayed Results</strong> – Business outcomes may take months to become visible.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <strong>Subjectivity</strong> – Reaction and behavior data may be influenced by biases.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KirkpatrickModel;