import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, TrendingUp, Users, BookOpen, Target, DollarSign } from "lucide-react";

const PhillipsModel = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Phillips Model</h1>
          <p className="text-muted-foreground">ROI-Focused Training Evaluation</p>
        </div>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌐 What is the Phillips Model?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Phillips Model, developed by Jack Phillips, builds upon the Kirkpatrick Model by adding a fifth level focused specifically on Return on Investment (ROI). This model provides a comprehensive framework for measuring the financial impact of training programs and comparing the monetary benefits to the program costs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <Badge variant="outline" className="mb-2">Level 1</Badge>
                <h3 className="font-semibold">Reaction</h3>
                <p className="text-sm text-muted-foreground">Satisfaction & engagement</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <Badge variant="outline" className="mb-2">Level 2</Badge>
                <h3 className="font-semibold">Learning</h3>
                <p className="text-sm text-muted-foreground">Knowledge & skills acquired</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <Badge variant="outline" className="mb-2">Level 3</Badge>
                <h3 className="font-semibold">Behavior</h3>
                <p className="text-sm text-muted-foreground">Application on the job</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <Badge variant="outline" className="mb-2">Level 4</Badge>
                <h3 className="font-semibold">Results</h3>
                <p className="text-sm text-muted-foreground">Business impact</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-500/20">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <Badge variant="default" className="mb-2 bg-green-500">Level 5</Badge>
                <h3 className="font-semibold">ROI</h3>
                <p className="text-sm text-muted-foreground">Return on Investment</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* ROI Calculation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚙️ ROI Calculation Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Basic ROI Formula</h3>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ROI% = (Benefits - Costs) / Costs × 100
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Benefit-Cost Ratio (BCR)</h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    BCR = Benefits / Costs
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Key Components:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Benefits Include:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Increased productivity</li>
                    <li>• Quality improvements</li>
                    <li>• Cost savings</li>
                    <li>• Revenue increases</li>
                    <li>• Time savings</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">Costs Include:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Program development</li>
                    <li>• Delivery costs</li>
                    <li>• Participant time</li>
                    <li>• Materials & technology</li>
                    <li>• Evaluation costs</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation in Your LMS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: 1, title: "Data Collection", desc: "Gather quantitative data on performance improvements, cost savings, and revenue increases." },
              { step: 2, title: "Isolation Methods", desc: "Use control groups, trend analysis, or participant estimates to isolate training impact." },
              { step: 3, title: "Convert to Monetary Value", desc: "Assign dollar values to performance improvements and business outcomes." },
              { step: 4, title: "Calculate Fully-Loaded Costs", desc: "Include all direct and indirect costs associated with the training program." },
              { step: 5, title: "Compute ROI", desc: "Apply the ROI formula and present results with confidence intervals." }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 rounded-lg border">
                <Badge variant="secondary" className="mt-1">{item.step}</Badge>
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advantages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Advantages of the Phillips Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Financial Focus</strong> – Directly measures monetary impact and ROI.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Stakeholder Credibility</strong> – Provides concrete financial justification for training investments.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Systematic Approach</strong> – Builds on proven Kirkpatrick foundation with enhanced methodology.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Data-Driven Decisions</strong> – Enables evidence-based program improvements and budget allocation.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Comprehensive Methodology</strong> – Includes detailed guidance on data collection and analysis.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Implementation Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <strong>Resource Intensive</strong> – Requires significant time, expertise, and budget for proper implementation.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <strong>Data Quality Issues</strong> – Success depends on accurate, reliable, and complete data collection.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <strong>Complexity</strong> – Converting soft benefits to monetary values can be challenging and subjective.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <strong>Organizational Readiness</strong> – Requires buy-in from leadership and robust data infrastructure.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhillipsModel;