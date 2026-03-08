import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Settings
} from "lucide-react";

const BudgetLicensing = () => {
  const budgetOverview = {
    totalBudget: 50000,
    spentAmount: 32500,
    remainingAmount: 17500,
    monthlySpend: 2850,
    projectedAnnual: 42500
  };

  const subscriptions = [
    {
      id: 1,
      provider: "Coursera Business",
      plan: "Enterprise",
      monthlyCost: 1200,
      annualCost: 14400,
      seats: 250,
      usedSeats: 234,
      renewalDate: "2024-06-15",
      status: "active",
      features: ["Unlimited access", "Analytics", "Admin tools", "Certificates"]
    },
    {
      id: 2,
      provider: "LinkedIn Learning",
      plan: "Enterprise", 
      monthlyCost: 950,
      annualCost: 11400,
      seats: 200,
      usedSeats: 156,
      renewalDate: "2024-08-22",
      status: "active",
      features: ["Full course library", "Learning paths", "Skills assessments"]
    },
    {
      id: 3,
      provider: "Udemy Business",
      plan: "Team",
      monthlyCost: 700,
      annualCost: 8400,
      seats: 100,
      usedSeats: 0,
      renewalDate: "2024-12-10",
      status: "pending",
      features: ["5,000+ courses", "Team management", "Usage analytics"]
    }
  ];

  const costBreakdown = [
    { category: "Platform Subscriptions", amount: 28500, percentage: 88 },
    { category: "Individual Courses", amount: 2800, percentage: 8 },
    { category: "Certification Fees", amount: 1200, percentage: 4 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "expired":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MOOC Budget & Licensing</h1>
          <p className="text-muted-foreground mt-2">
            Manage subscriptions, track spending, and optimize your MOOC investment.
          </p>
        </div>
        <Button onClick={() => window.open('/reports', '_self')}>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetOverview.totalBudget.toLocaleString()}</div>
            <Progress value={(budgetOverview.spentAmount / budgetOverview.totalBudget) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent This Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetOverview.spentAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">65% of budget used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetOverview.remainingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">35% remaining</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetOverview.monthlySpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Cost Breakdown
          </CardTitle>
          <CardDescription>
            Where your MOOC budget is being allocated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{item.category}</h3>
                    <div className="text-right">
                      <div className="font-medium">${item.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Active Subscriptions
          </CardTitle>
          <CardDescription>
            Manage your MOOC platform subscriptions and renewals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{subscription.provider}</h3>
                      <p className="text-sm text-muted-foreground">{subscription.plan} Plan</p>
                    </div>
                    <Badge variant={getStatusColor(subscription.status)}>
                      {getStatusIcon(subscription.status)}
                      <span className="ml-1 capitalize">{subscription.status}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium">Cost</div>
                      <div className="text-lg font-bold">${subscription.monthlyCost}/month</div>
                      <div className="text-xs text-muted-foreground">${subscription.annualCost}/year</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">Seat Usage</div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(subscription.usedSeats / subscription.seats) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-sm">
                          {subscription.usedSeats}/{subscription.seats}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((subscription.usedSeats / subscription.seats) * 100)}% utilized
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">Renewal</div>
                      <div className="text-sm">{new Date(subscription.renewalDate).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.ceil((new Date(subscription.renewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Features</div>
                    <div className="flex flex-wrap gap-2">
                      {subscription.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => alert(`Managing ${subscription.provider} ${subscription.plan} subscription settings.`)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                  {subscription.status === "pending" && (
                    <Button size="sm" onClick={() => alert(`Activating ${subscription.provider} subscription.`)}>
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Budget Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Budget Usage Alert</p>
                <p className="text-sm text-muted-foreground">
                  You've used 65% of your annual budget with 4 months remaining. Consider optimizing seat utilization.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Cost Optimization Opportunity</p>
                <p className="text-sm text-muted-foreground">
                  LinkedIn Learning has low seat utilization (78%). Consider reallocating licenses or negotiating a smaller plan.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-950/20">
              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Renewal Reminder</p>
                <p className="text-sm text-muted-foreground">
                  Coursera Business renews in 45 days. Time to negotiate better rates or explore alternatives.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetLicensing;