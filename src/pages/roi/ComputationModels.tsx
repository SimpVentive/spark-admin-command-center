import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ComputationModels = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">ROI Computation Models</h1>
          <p className="text-muted-foreground">Choose the right evaluation framework for your training programs</p>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Models Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Selecting the right evaluation model is crucial for measuring training effectiveness and calculating ROI. 
            Each model offers different levels of depth and complexity in measuring training impact.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kirkpatrick Model Card */}
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">Kirkpatrick Model</CardTitle>
                      <Badge variant="outline" className="mt-1">4 Levels</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The foundational framework for training evaluation, focusing on reaction, learning, behavior, and results.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">1</Badge>
                    <span>Reaction (Satisfaction)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">2</Badge>
                    <span>Learning (Knowledge & Skills)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">3</Badge>
                    <span>Behavior (Application)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">4</Badge>
                    <span>Results (Business Impact)</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Best For:</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• General training evaluation</li>
                    <li>• Comprehensive program assessment</li>
                    <li>• Organizations new to evaluation</li>
                  </ul>
                </div>

                <Button asChild className="w-full">
                  <Link to="/roi/models/kirkpatrick">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phillips Model Card */}
            <Card className="border-green-500/20 hover:border-green-500/40 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-500" />
                    <div>
                      <CardTitle className="text-xl">Phillips Model</CardTitle>
                      <Badge variant="default" className="mt-1 bg-green-500">5 Levels + ROI</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Extends Kirkpatrick with Level 5 ROI calculation, providing comprehensive financial justification for training investments.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">1-4</Badge>
                    <span>Kirkpatrick Levels</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="w-6 h-6 p-0 flex items-center justify-center text-xs bg-green-500">5</Badge>
                    <span>Return on Investment (ROI)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span className="w-6 h-6 flex items-center justify-center">+</span>
                    <span>Benefit-Cost Ratio (BCR)</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Best For:</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Financial ROI measurement</li>
                    <li>• High-investment programs</li>
                    <li>• Stakeholder reporting</li>
                  </ul>
                </div>

                <Button asChild className="w-full bg-green-500 hover:bg-green-600">
                  <Link to="/roi/models/phillips">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Model Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Aspect</th>
                  <th className="text-center py-3 px-4">Kirkpatrick Model</th>
                  <th className="text-center py-3 px-4">Phillips Model</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Levels of Evaluation</td>
                  <td className="py-3 px-4 text-center">4 Levels</td>
                  <td className="py-3 px-4 text-center">5 Levels</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">ROI Calculation</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Implementation Complexity</td>
                  <td className="py-3 px-4 text-center">Moderate</td>
                  <td className="py-3 px-4 text-center">High</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Resource Requirements</td>
                  <td className="py-3 px-4 text-center">Medium</td>
                  <td className="py-3 px-4 text-center">High</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Financial Justification</td>
                  <td className="py-3 px-4 text-center">Limited</td>
                  <td className="py-3 px-4 text-center">Comprehensive</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Best Use Case</td>
                  <td className="py-3 px-4 text-center">General Evaluation</td>
                  <td className="py-3 px-4 text-center">ROI-Focused Analysis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Start with Kirkpatrick if:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                  <span>You're new to training evaluation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                  <span>Resources for evaluation are limited</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                  <span>You need a simple, proven framework</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                  <span>Focus is on improving training quality</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Choose Phillips if:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <span>You need to justify training investments financially</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <span>Stakeholders require ROI data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <span>You have resources for comprehensive evaluation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <span>Training programs have high investment costs</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComputationModels;