import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Users, Building2, Workflow, Target, GraduationCap, BookOpen, 
  FileText, Video, DollarSign, Library, Globe, Monitor, Shield, 
  Settings, ArrowRight, CheckCircle, Clock, AlertTriangle,
  BarChart3, Zap
} from "lucide-react";

const WorkflowGuide = () => {
  const workflows = [
    {
      id: "setup",
      title: "Initial System Setup",
      icon: Settings,
      priority: "Critical",
      steps: [
        {
          title: "Organization Structure Setup",
          description: "Define company hierarchy, departments, and locations",
          path: "/organization/hierarchy",
          details: [
            "Create organizational units (divisions, departments, teams)",
            "Set up reporting relationships and hierarchies", 
            "Define job roles with skill requirements",
            "Add plants and office locations with Google Maps integration"
          ]
        },
        {
          title: "User Management Configuration",
          description: "Set up user accounts and assign roles",
          path: "/users",
          details: [
            "Add employees individually or via bulk upload",
            "Assign organizational units and reporting managers",
            "Configure user roles (admin, manager, employee)",
            "Set up learning profiles and preferences"
          ]
        },
        {
          title: "Process & Workflow Design",
          description: "Configure approval workflows and business rules",
          path: "/processes/workflow",
          details: [
            "Design training approval workflows",
            "Set up business rules for automatic approvals",
            "Configure user permissions and access controls",
            "Define security policies and access frameworks"
          ]
        }
      ]
    },
    {
      id: "tna",
      title: "Training Needs Analysis Cycle",
      icon: Target,
      priority: "High",
      steps: [
        {
          title: "Create TNI Cycle",
          description: "Launch organization-wide training needs identification",
          path: "/training-needs/create-cycle",
          details: [
            "Define TNI cycle parameters (duration, departments, participants)",
            "Configure skill templates and competency frameworks",
            "Set completion thresholds and deadlines",
            "Launch automated notifications to employees and managers"
          ]
        },
        {
          title: "Monitor Employee Responses", 
          description: "Track completion rates and send reminders",
          path: "/training-needs",
          details: [
            "View real-time completion statistics by department",
            "Send automated reminders to pending employees",
            "Monitor response quality and completeness",
            "Escalate to managers for low participation rates"
          ]
        },
        {
          title: "Manager Review & Approval",
          description: "Managers review and approve training requests",
          path: "/training-needs/enhanced-manager-approval", 
          details: [
            "Managers review subordinate training requests",
            "Approve, reject, or modify requested programs",
            "Add additional training requirements",
            "Prioritize training based on business needs"
          ]
        },
        {
          title: "AI-Powered Analysis",
          description: "Leverage AI to categorize and recommend training",
          path: "/training-needs",
          details: [
            "AI automatically categorizes training requests",
            "Identifies patterns and trends across departments",
            "Suggests program consolidation opportunities",
            "Recommends priority levels based on business impact"
          ]
        }
      ]
    },
    {
      id: "programs",
      title: "Training Program Management",
      icon: GraduationCap,
      priority: "High",
      steps: [
        {
          title: "Program Creation & Categorization",
          description: "Design and organize training programs",
          path: "/programs/create",
          details: [
            "Create programs with detailed descriptions and objectives",
            "Categorize by type (Managerial, Technical, Behavioral, Functional)",
            "Set prerequisites, duration, and skill coverage",
            "Define faculty requirements and venue needs"
          ]
        },
        {
          title: "Session Scheduling",
          description: "Plan and schedule program delivery sessions",
          path: "/programs/sessions",
          details: [
            "Create multiple sessions for popular programs",
            "Set capacity limits and enrollment deadlines",
            "Assign trainers and book venues",
            "Configure calendar integration for automatic scheduling"
          ]
        },
        {
          title: "Trainer Management",
          description: "Manage internal and external trainers",
          path: "/programs/trainers",
          details: [
            "Maintain trainer profiles with expertise areas",
            "Track trainer availability and scheduling",
            "Evaluate trainer performance and feedback",
            "Manage trainer certifications and qualifications"
          ]
        },
        {
          title: "Enrollment Management",
          description: "Handle program enrollment and waiting lists",
          path: "/users/bulk",
          details: [
            "Process individual and bulk enrollments",
            "Manage waiting lists for oversubscribed programs",
            "Send enrollment confirmations and pre-course materials",
            "Handle enrollment changes and cancellations"
          ]
        }
      ]
    },
    {
      id: "learning-paths",
      title: "Learning Path Development",
      icon: BookOpen,
      priority: "Medium",
      steps: [
        {
          title: "Learning Path Design",
          description: "Create structured learning journeys",
          path: "/learning-paths/create",
          details: [
            "Design multi-module learning paths for career development",
            "Set learning objectives and competency mappings", 
            "Define module sequences and dependencies",
            "Configure assessments and certification requirements"
          ]
        },
        {
          title: "Content Integration", 
          description: "Add diverse content types to learning paths",
          path: "/learning-paths/content",
          details: [
            "Integrate internal training programs",
            "Add external MOOC courses and resources",
            "Include multimedia content (videos, documents, interactive modules)",
            "Set up SCORM packages and LTI tool integrations"
          ]
        },
        {
          title: "Enrollment & Progress Tracking",
          description: "Manage learner enrollment and monitor progress",
          path: "/learning-paths/enrollment", 
          details: [
            "Enroll individuals or groups in learning paths",
            "Set completion deadlines and milestones",
            "Track progress across modules and send notifications",
            "Generate completion certificates and badges"
          ]
        }
      ]
    },
    {
      id: "assessments",
      title: "Assessment & Evaluation",
      icon: FileText,
      priority: "Medium",
      steps: [
        {
          title: "Assessment Design",
          description: "Create comprehensive assessments",
          path: "/assessments/create",
          details: [
            "Design pre/post assessments for programs",
            "Set question types (MCQ, descriptive, practical)",
            "Configure time limits and attempt restrictions",
            "Define passing criteria and scoring rubrics"
          ]
        },
        {
          title: "Question Bank Management",
          description: "Maintain repository of assessment questions",
          path: "/assessments/questions",
          details: [
            "Create categorized question banks by competency",
            "Set difficulty levels and point values",
            "Add explanations and learning references",
            "Enable question randomization and anti-cheating measures"
          ]
        },
        {
          title: "Results Analysis",
          description: "Analyze assessment outcomes and trends",
          path: "/assessments/results",
          details: [
            "Generate individual and group performance reports",
            "Identify knowledge gaps and improvement areas",
            "Track assessment effectiveness and question performance",
            "Provide feedback and remedial learning recommendations"
          ]
        }
      ]
    },
    {
      id: "content",
      title: "Content Management",
      icon: Video,
      priority: "Medium",
      steps: [
        {
          title: "Content Library Organization",
          description: "Organize and categorize learning content",
          path: "/content",
          details: [
            "Upload and organize multimedia content",
            "Categorize content by subject, level, and format",
            "Tag content with metadata for easy discovery",
            "Set access permissions and sharing policies"
          ]
        },
        {
          title: "Content Creation Tools",
          description: "Use integrated tools for content development",
          path: "/content/tools",
          details: [
            "Convert PowerPoint presentations to video courses",
            "Create SCORM packages from existing content",
            "Design interactive learning modules",
            "Generate automated transcripts and captions"
          ]
        },
        {
          title: "Content Integration",
          description: "Integrate external content sources",
          path: "/content/upload",
          details: [
            "Connect to MOOC platforms (Coursera, edX, Udemy)",
            "Integrate LTI tools and external learning resources",
            "Set up content syndication and automatic updates",
            "Manage licensing and compliance requirements"
          ]
        }
      ]
    },
    {
      id: "analytics",
      title: "Analytics & ROI Measurement",
      icon: BarChart3,
      priority: "High", 
      steps: [
        {
          title: "Learning Analytics Dashboard",
          description: "Monitor learning effectiveness and engagement",
          path: "/learning-paths/analytics",
          details: [
            "Track completion rates and learning velocities",
            "Analyze engagement patterns and dropout points",
            "Monitor assessment scores and competency development", 
            "Generate automated learning insights and recommendations"
          ]
        },
        {
          title: "ROI Computation & Analysis",
          description: "Measure training return on investment",
          path: "/roi",
          details: [
            "Calculate direct and indirect training costs",
            "Measure business impact metrics (productivity, retention, performance)",
            "Generate ROI reports for stakeholder presentations",
            "Compare program effectiveness and cost-efficiency"
          ]
        },
        {
          title: "Predictive Analytics",
          description: "Leverage AI for predictive insights",
          path: "/ai-recommendations",
          details: [
            "Predict learning outcomes and success rates",
            "Identify at-risk learners and intervention opportunities", 
            "Recommend personalized learning paths",
            "Forecast future training needs and resource requirements"
          ]
        }
      ]
    },
    {
      id: "library",
      title: "Digital Library Management", 
      icon: Library,
      priority: "Low",
      steps: [
        {
          title: "Resource Management",
          description: "Organize physical and digital learning resources",
          path: "/library",
          details: [
            "Catalog books, journals, and digital resources",
            "Manage inventory with ISBN and metadata",
            "Set up resource categories and search functionality",
            "Configure access permissions and borrowing policies"
          ]
        },
        {
          title: "Check-in/Check-out System",
          description: "Manage resource borrowing and returns",
          path: "/library/check-in-out", 
          details: [
            "Process resource checkouts with due dates",
            "Send automated return reminders and overdue notices",
            "Handle renewals and reservation requests",
            "Track resource utilization and popular items"
          ]
        },
        {
          title: "Reservation System",
          description: "Enable resource reservations and waitlists",
          path: "/library/reservations",
          details: [
            "Allow users to reserve resources in advance",
            "Manage waiting lists for popular resources",
            "Send notifications when reserved items become available",
            "Generate usage reports and acquisition recommendations"
          ]
        }
      ]
    },
    {
      id: "integrations",
      title: "System Integrations",
      icon: Monitor,
      priority: "Medium",
      steps: [
        {
          title: "MOOC Platform Integration",
          description: "Connect external learning platforms",
          path: "/mooc",
          details: [
            "Set up API connections to major MOOC platforms",
            "Synchronize course catalogs and enrollment data",
            "Import certificates and completion records",
            "Manage single sign-on (SSO) authentication"
          ]
        },
        {
          title: "LTI Tool Integration", 
          description: "Integrate Learning Tools Interoperability tools",
          path: "/lti/providers",
          details: [
            "Configure LTI provider connections",
            "Set up tool launches and grade passback",
            "Manage security keys and authentication",
            "Monitor tool usage and performance"
          ]
        },
        {
          title: "Security Configuration",
          description: "Ensure system security and compliance",
          path: "/security",
          details: [
            "Configure user authentication and authorization",
            "Set up data encryption and secure communications",
            "Implement audit logging and compliance reporting",
            "Manage backup and disaster recovery procedures"
          ]
        }
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "default"; 
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Manager Workflow Guide</h1>
          <p className="text-muted-foreground">
            Complete workflows for managing your organization's learning and development programs
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg text-green-800">Setup Phase</CardTitle>
            <p className="text-sm text-green-600">Essential configuration workflows to get started</p>
          </CardHeader>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg text-blue-800">Core Operations</CardTitle>
            <p className="text-sm text-blue-600">Day-to-day training management workflows</p>
          </CardHeader>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg text-purple-800">Analytics & Optimization</CardTitle>
            <p className="text-sm text-purple-600">Advanced analytics and system optimization</p>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Workflow Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Workflows</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <workflow.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{workflow.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {workflow.steps.length} key steps
                        </p>
                      </div>
                    </div>
                    <Badge variant={getPriorityColor(workflow.priority)}>
                      {workflow.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workflow.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <workflow.icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{workflow.title}</CardTitle>
                  <Badge variant={getPriorityColor(workflow.priority)}>
                    {workflow.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {workflow.steps.map((step, stepIndex) => (
                    <div key={stepIndex}>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium flex-shrink-0 mt-1">
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Go to {step.path}
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Key Activities:</h4>
                            <ul className="space-y-1">
                              {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      {stepIndex < workflow.steps.length - 1 && (
                        <div className="ml-4 mt-4 mb-2">
                          <div className="w-px h-8 bg-border"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Implementation Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="font-medium text-green-800">Start with Organization Structure</h4>
                    <p className="text-sm text-green-600">Always begin by setting up your organizational hierarchy, job roles, and reporting relationships before adding users or programs.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="font-medium text-blue-800">Pilot with Small Groups</h4>
                    <p className="text-sm text-blue-600">Run TNI cycles and program enrollments with a pilot group first to test workflows and refine processes.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <h4 className="font-medium text-purple-800">Leverage AI Recommendations</h4>
                    <p className="text-sm text-purple-600">Use AI-powered features for training classification, learner recommendations, and predictive analytics to optimize efficiency.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <h4 className="font-medium text-orange-800">Monitor Key Metrics</h4>
                    <p className="text-sm text-orange-600">Regularly review completion rates, engagement scores, and ROI metrics to ensure programs are meeting objectives.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Common Pitfalls to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <h4 className="font-medium text-red-800">Skipping User Training</h4>
                    <p className="text-sm text-red-600">Ensure managers and employees are trained on the system before launching major processes like TNI cycles.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 className="font-medium text-yellow-800">Overcomplicating Workflows</h4>
                    <p className="text-sm text-yellow-600">Start with simple approval workflows and gradually add complexity based on organizational needs.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <h4 className="font-medium text-gray-800">Ignoring Mobile Users</h4>
                    <p className="text-sm text-gray-600">Ensure mobile accessibility for field employees and remote workers who need to access training on mobile devices.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                    <h4 className="font-medium text-indigo-800">Poor Data Governance</h4>
                    <p className="text-sm text-indigo-600">Establish clear data ownership, backup procedures, and user access controls from the beginning.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Training Manager Daily Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Morning Tasks
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Review dashboard metrics and alerts</li>
                    <li>• Check pending approval requests</li> 
                    <li>• Monitor TNI cycle completion rates</li>
                    <li>• Review AI recommendations</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Midday Focus
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Process training enrollments</li>
                    <li>• Review and approve program sessions</li>
                    <li>• Analyze assessment results</li>
                    <li>• Communicate with trainers and managers</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    End of Day
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Generate progress reports</li>
                    <li>• Send reminder notifications</li>
                    <li>• Plan next day's activities</li>
                    <li>• Update stakeholders on key metrics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowGuide;