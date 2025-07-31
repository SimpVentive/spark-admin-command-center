import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Clock, 
  Users, 
  Star, 
  Search,
  Play,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings,
  Calendar,
  UserCheck,
  Zap,
  Rocket,
  Save,
  Eye,
  TestTube,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  Mail,
  Bell,
  Smartphone,
  MessageSquare,
  Timer,
  UserPlus,
  Shield,
  Target,
  Hash
} from "lucide-react";
import { toast } from "sonner";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface WorkflowCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'task' | 'approval' | 'notification' | 'decision';
  timeLimit: number;
  timeLimitUnit: 'hours' | 'days';
}

interface WorkflowParticipant {
  id: string;
  name: string;
  role: string;
  type: 'initiator' | 'approver' | 'reviewer' | 'recipient';
}

interface WorkflowData {
  // Basic Info
  id: string;
  name: string;
  category: string;
  description: string;
  
  // Trigger Config
  triggerType: 'manual' | 'form' | 'scheduled' | 'email';
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly';
  scheduleTime?: string;
  
  // Steps
  steps: WorkflowStep[];
  
  // Participants
  participants: WorkflowParticipant[];
  
  // Rules
  globalTimeLimit: number;
  globalTimeLimitUnit: 'hours' | 'days';
  escalationType: 'reminder' | 'auto-approve' | 'reassign';
  completionCriteria: string[];
  
  // Notifications
  notifications: {
    sendStart: boolean;
    sendReminders: boolean;
    reminderFrequency: 'hourly' | 'daily' | 'weekly';
    sendCompletion: boolean;
  };
  
  // Legacy fields for template mode
  type?: string;
  template?: string;
  department?: string[];
  priority?: string;
  duration?: string;
  settings?: any;
}

const WorkflowCreationWizard = ({ open, onOpenChange }: WorkflowCreationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowData, setWorkflowData] = useState<WorkflowData>({
    id: `workflow-${Date.now()}`,
    name: "",
    category: "",
    description: "",
    triggerType: 'manual',
    steps: [],
    participants: [],
    globalTimeLimit: 7,
    globalTimeLimitUnit: 'days',
    escalationType: 'reminder',
    completionCriteria: [],
    notifications: {
      sendStart: true,
      sendReminders: true,
      reminderFrequency: 'daily',
      sendCompletion: true
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Sample workflow templates
  const workflowTemplates = [
    {
      id: "onboarding",
      name: "Employee Onboarding",
      description: "Complete new hire process with training modules and documentation",
      category: "HR",
      duration: "5-7 days",
      complexity: "Medium",
      popularity: 95,
      steps: 8,
      preview: ["Welcome Email", "Document Collection", "IT Setup", "Training Modules", "Manager Introduction"]
    },
    {
      id: "compliance",
      name: "Compliance Training",
      description: "Mandatory compliance training with assessments and certifications",
      category: "Compliance",
      duration: "2-3 days",
      complexity: "Low",
      popularity: 87,
      steps: 5,
      preview: ["Training Assignment", "Module Completion", "Assessment", "Certification", "Renewal Tracking"]
    },
    {
      id: "skills",
      name: "Skills Assessment",
      description: "Evaluate and track employee skill development progress",
      category: "Development",
      duration: "1-2 weeks",
      complexity: "High",
      popularity: 72,
      steps: 10,
      preview: ["Skill Evaluation", "Gap Analysis", "Training Plan", "Progress Tracking", "Reassessment"]
    },
    {
      id: "approval",
      name: "Training Approval",
      description: "Multi-level approval process for training requests",
      category: "Operations",
      duration: "3-5 days",
      complexity: "Low",
      popularity: 68,
      steps: 4,
      preview: ["Request Submission", "Manager Review", "Budget Approval", "Final Authorization"]
    }
  ];

  // Sample workflow steps for builder
  const stepComponents = [
    { type: "training", name: "Training Module", icon: FileText, color: "from-blue-500 to-blue-600" },
    { type: "approval", name: "Approval", icon: UserCheck, color: "from-green-500 to-green-600" },
    { type: "assessment", name: "Assessment", icon: CheckCircle, color: "from-purple-500 to-purple-600" },
    { type: "notification", name: "Notification", icon: Zap, color: "from-yellow-500 to-yellow-600" },
    { type: "delay", name: "Wait/Delay", icon: Clock, color: "from-gray-500 to-gray-600" },
    { type: "condition", name: "Condition", icon: AlertTriangle, color: "from-orange-500 to-orange-600" }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Different step flows for template vs custom workflows
  const templateSteps = [
    { number: 1, title: "Template Selection", icon: Star },
    { number: 2, title: "Basic Information", icon: FileText },
    { number: 3, title: "Workflow Builder", icon: Settings },
    { number: 4, title: "Participants", icon: Users },
    { number: 5, title: "Review & Launch", icon: Rocket }
  ];

  const customSteps = [
    { number: 1, title: "Workflow Basics", icon: FileText },
    { number: 2, title: "Trigger Configuration", icon: Zap },
    { number: 3, title: "Workflow Steps", icon: Settings },
    { number: 4, title: "Participants", icon: Users },
    { number: 5, title: "Basic Rules", icon: Shield },
    { number: 6, title: "Notifications", icon: Bell }
  ];

  const steps = workflowData.type === "custom" ? customSteps : templateSteps;
  const maxSteps = steps.length;

  const filteredTemplates = workflowTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleNext = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
      toast("Step completed!", { 
        description: `Moving to ${steps[currentStep].title}`,
        icon: <Check className="w-4 h-4" />
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    toast("Workflow saved!", { 
      description: "Your progress has been auto-saved",
      icon: <Save className="w-4 h-4" />
    });
  };

  const handleLaunch = () => {
    toast.success("Workflow launched successfully!", { 
      description: `${workflowData.name} is now active`,
      icon: <Rocket className="w-4 h-4" />
    });
    onOpenChange(false);
    // Reset wizard
    setCurrentStep(1);
    setWorkflowData({
      id: `workflow-${Date.now()}`,
      name: "",
      category: "",
      description: "",
      triggerType: 'manual',
      steps: [],
      participants: [],
      globalTimeLimit: 7,
      globalTimeLimitUnit: 'days',
      escalationType: 'reminder',
      completionCriteria: [],
      notifications: {
        sendStart: true,
        sendReminders: true,
        reminderFrequency: 'daily',
        sendCompletion: true
      }
    });
  };

  const addStepToFlow = (stepType: string) => {
    const newNode: Node = {
      id: `step-${nodes.length + 1}`,
      type: 'default',
      position: { x: 100 + nodes.length * 200, y: 100 },
      data: { 
        label: stepComponents.find(s => s.type === stepType)?.name || stepType 
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    setNodes(prev => [...prev, newNode]);

    // Add edge if there's a previous node
    if (nodes.length > 0) {
      const newEdge: Edge = {
        id: `edge-${edges.length + 1}`,
        source: nodes[nodes.length - 1].id,
        target: newNode.id,
        animated: true,
        style: { stroke: '#3b82f6' }
      };
      setEdges(prev => [...prev, newEdge]);
    }
  };

  // Helper functions for custom workflow
  const addWorkflowStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: `Step ${workflowData.steps.length + 1}`,
      description: "",
      type: 'task',
      timeLimit: 24,
      timeLimitUnit: 'hours'
    };
    setWorkflowData(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const removeWorkflowStep = (stepId: string) => {
    setWorkflowData(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== stepId) }));
  };

  const updateWorkflowStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, ...updates } : s)
    }));
  };

  const addParticipant = (type: WorkflowParticipant['type']) => {
    const newParticipant: WorkflowParticipant = {
      id: `participant-${Date.now()}`,
      name: "",
      role: "",
      type
    };
    setWorkflowData(prev => ({ ...prev, participants: [...prev.participants, newParticipant] }));
  };

  const removeParticipant = (participantId: string) => {
    setWorkflowData(prev => ({ ...prev, participants: prev.participants.filter(p => p.id !== participantId) }));
  };

  const renderStepContent = () => {
    // Custom workflow flow
    if (workflowData.type === "custom") {
      switch (currentStep) {
        case 1: // Workflow Basics
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Workflow Basics</h3>
                <p className="text-muted-foreground">Set up the fundamental information for your custom workflow</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name *</Label>
                  <Input
                    id="workflow-name"
                    placeholder="Enter workflow name (max 50 characters)"
                    value={workflowData.name}
                    onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value.slice(0, 50) }))}
                    className="transition-all duration-200"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{workflowData.name.length > 0 ? "✓ Valid name" : "Required field"}</span>
                    <span>{workflowData.name.length}/50</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={workflowData.category} onValueChange={(value) => setWorkflowData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose and goals of this workflow (max 200 characters)"
                    value={workflowData.description}
                    onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value.slice(0, 200) }))}
                    className="min-h-[100px]"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {workflowData.description.length}/200 characters
                  </div>
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="w-4 h-4" />
                      <span className="font-medium">Workflow ID:</span>
                      <code className="bg-background px-2 py-1 rounded text-xs">{workflowData.id}</code>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );

        case 2: // Trigger Configuration
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Trigger Configuration</h3>
                <p className="text-muted-foreground">Define how this workflow gets started</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                  <Label>Trigger Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: 'manual', label: 'Manual Start', desc: 'Started manually by users', icon: Play },
                      { value: 'form', label: 'Form Submission', desc: 'Triggered by form submission', icon: FileText },
                      { value: 'scheduled', label: 'Scheduled', desc: 'Runs on a schedule', icon: Calendar },
                      { value: 'email', label: 'Email Trigger', desc: 'Triggered by email', icon: Mail }
                    ].map((trigger) => (
                      <Card 
                        key={trigger.value}
                        className={`cursor-pointer transition-all ${workflowData.triggerType === trigger.value ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setWorkflowData(prev => ({ ...prev, triggerType: trigger.value as any }))}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <trigger.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{trigger.label}</h4>
                              <p className="text-sm text-muted-foreground">{trigger.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {workflowData.triggerType === 'scheduled' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <Label>Schedule Settings</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select 
                          value={workflowData.scheduleFrequency} 
                          onValueChange={(value) => setWorkflowData(prev => ({ ...prev, scheduleFrequency: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input 
                          type="time"
                          value={workflowData.scheduleTime || "09:00"}
                          onChange={(e) => setWorkflowData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case 3: // Workflow Steps
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Workflow Steps</h3>
                <p className="text-muted-foreground">Build your workflow by adding and configuring steps</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {workflowData.steps.length}/10 steps (minimum 1 required)
                  </div>
                  <Button 
                    onClick={addWorkflowStep}
                    disabled={workflowData.steps.length >= 10}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>

                <div className="space-y-4">
                  {workflowData.steps.length === 0 ? (
                    <Card className="p-8 text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                          <Settings className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">No steps added yet</h4>
                          <p className="text-sm text-muted-foreground">Click "Add Step" to start building your workflow</p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    workflowData.steps.map((step, index) => (
                      <Card key={step.id} className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                                <span className="font-medium">Step {index + 1}</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeWorkflowStep(step.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Step Name</Label>
                              <Input
                                value={step.name}
                                onChange={(e) => updateWorkflowStep(step.id, { name: e.target.value })}
                                placeholder="Enter step name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Step Type</Label>
                              <Select 
                                value={step.type} 
                                onValueChange={(value) => updateWorkflowStep(step.id, { type: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="task">Task</SelectItem>
                                  <SelectItem value="approval">Approval</SelectItem>
                                  <SelectItem value="notification">Notification</SelectItem>
                                  <SelectItem value="decision">Decision</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Textarea
                              value={step.description}
                              onChange={(e) => updateWorkflowStep(step.id, { description: e.target.value })}
                              placeholder="Describe what happens in this step"
                              className="min-h-[60px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Time Limit</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  min="1"
                                  max="720"
                                  value={step.timeLimit}
                                  onChange={(e) => updateWorkflowStep(step.id, { timeLimit: parseInt(e.target.value) || 1 })}
                                />
                                <Select 
                                  value={step.timeLimitUnit}
                                  onValueChange={(value) => updateWorkflowStep(step.id, { timeLimitUnit: value as any })}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="hours">Hours</SelectItem>
                                    <SelectItem value="days">Days</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          );

        case 4: // Participants
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Participants & Roles</h3>
                <p className="text-muted-foreground">Define who will be involved in this workflow</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: 'initiator', label: 'Initiators', icon: UserPlus, desc: 'Can start workflow' },
                    { type: 'approver', label: 'Approvers', icon: UserCheck, desc: 'Approve steps' },
                    { type: 'reviewer', label: 'Reviewers', icon: Eye, desc: 'Review content' },
                    { type: 'recipient', label: 'Recipients', icon: Users, desc: 'Receive notifications' }
                  ].map((role) => (
                    <Card key={role.type} className="text-center">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                            <role.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{role.label}</h4>
                            <p className="text-xs text-muted-foreground">{role.desc}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addParticipant(role.type as any)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  {workflowData.participants.length === 0 ? (
                    <Card className="p-8 text-center">
                      <div className="space-y-4">
                        <Users className="w-16 h-16 text-muted-foreground mx-auto" />
                        <div>
                          <h4 className="font-medium">No participants added</h4>
                          <p className="text-sm text-muted-foreground">Add participants using the role cards above</p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      <Label>Workflow Participants</Label>
                      {workflowData.participants.map((participant) => (
                        <Card key={participant.id} className="p-4">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="capitalize">
                              {participant.type}
                            </Badge>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <Input
                                placeholder="Name/Email"
                                value={participant.name}
                                onChange={(e) => {
                                  setWorkflowData(prev => ({
                                    ...prev,
                                    participants: prev.participants.map(p => 
                                      p.id === participant.id ? { ...p, name: e.target.value } : p
                                    )
                                  }));
                                }}
                              />
                              <Input
                                placeholder="Role/Title"
                                value={participant.role}
                                onChange={(e) => {
                                  setWorkflowData(prev => ({
                                    ...prev,
                                    participants: prev.participants.map(p => 
                                      p.id === participant.id ? { ...p, role: e.target.value } : p
                                    )
                                  }));
                                }}
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeParticipant(participant.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

        case 5: // Basic Rules
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Basic Rules</h3>
                <p className="text-muted-foreground">Configure time limits, escalation, and completion criteria</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Timer className="w-5 h-5" />
                      Time Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Global Time Limit for Workflow</Label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Slider
                            value={[workflowData.globalTimeLimit]}
                            onValueChange={(value) => setWorkflowData(prev => ({ ...prev, globalTimeLimit: value[0] }))}
                            min={1}
                            max={30}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-sm font-medium w-8">{workflowData.globalTimeLimit}</span>
                          <Select 
                            value={workflowData.globalTimeLimitUnit}
                            onValueChange={(value) => setWorkflowData(prev => ({ ...prev, globalTimeLimitUnit: value as any }))}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Escalation Action</Label>
                      <Select 
                        value={workflowData.escalationType}
                        onValueChange={(value) => setWorkflowData(prev => ({ ...prev, escalationType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reminder">Send Reminder</SelectItem>
                          <SelectItem value="auto-approve">Auto Approve</SelectItem>
                          <SelectItem value="reassign">Reassign</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Completion Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      'All steps complete',
                      'Final approval received',
                      'All participants notified',
                      'Documentation submitted'
                    ].map((criteria) => (
                      <div key={criteria} className="flex items-center space-x-2">
                        <Checkbox
                          id={criteria}
                          checked={workflowData.completionCriteria.includes(criteria)}
                          onCheckedChange={(checked) => {
                            setWorkflowData(prev => ({
                              ...prev,
                              completionCriteria: checked
                                ? [...prev.completionCriteria, criteria]
                                : prev.completionCriteria.filter(c => c !== criteria)
                            }));
                          }}
                        />
                        <Label htmlFor={criteria} className="text-sm">{criteria}</Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          );

        case 6: // Notifications
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Notification Settings</h3>
                <p className="text-muted-foreground">Configure how participants receive workflow updates</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notification Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-primary" />
                        <div>
                          <span className="font-medium">Send Start Notification</span>
                          <p className="text-sm text-muted-foreground">Notify when workflow begins</p>
                        </div>
                      </div>
                      <Switch
                        checked={workflowData.notifications.sendStart}
                        onCheckedChange={(checked) => 
                          setWorkflowData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, sendStart: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <span className="font-medium">Send Reminder Notifications</span>
                          <p className="text-sm text-muted-foreground">Periodic reminders for pending tasks</p>
                        </div>
                      </div>
                      <Switch
                        checked={workflowData.notifications.sendReminders}
                        onCheckedChange={(checked) => 
                          setWorkflowData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, sendReminders: checked }
                          }))
                        }
                      />
                    </div>

                    {workflowData.notifications.sendReminders && (
                      <div className="ml-8 space-y-2">
                        <Label>Reminder Frequency</Label>
                        <Select 
                          value={workflowData.notifications.reminderFrequency}
                          onValueChange={(value) => 
                            setWorkflowData(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, reminderFrequency: value as any }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Every Hour</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <div>
                          <span className="font-medium">Send Completion Notification</span>
                          <p className="text-sm text-muted-foreground">Notify when workflow completes</p>
                        </div>
                      </div>
                      <Switch
                        checked={workflowData.notifications.sendCompletion}
                        onCheckedChange={(checked) => 
                          setWorkflowData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, sendCompletion: checked }
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Email Template Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">Workflow Notification</span>
                        </div>
                        <p className="text-sm">
                          <strong>Subject:</strong> Action Required - {workflowData.name || "Your Workflow"}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          <p>Hello [Participant Name],</p>
                          <p className="mt-2">You have a new task in the workflow "{workflowData.name}".</p>
                          <p className="mt-2">Please complete your assigned steps within the specified timeframe.</p>
                          <p className="mt-2">Best regards,<br />Workflow System</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );

        default:
          return null;
      }
    }

    // Template workflow flow (existing logic)
    switch (currentStep) {
      case 1: // Template Selection
        return (
          <div className="space-y-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base bg-muted/30"
              />
            </div>

            <div className="grid grid-cols-3 gap-8 min-h-[400px]">
              {/* Templates Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-muted-foreground text-center">Templates</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedTemplate === template.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setWorkflowData(prev => ({ ...prev, template: template.id, type: "template" }));
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription className="mt-1 text-sm">{template.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs">{template.popularity}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                          <Badge className={`text-xs ${getComplexityColor(template.complexity)}`}>
                            {template.complexity}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Most Popular Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-muted-foreground text-center">Most Popular</h3>
                <div className="space-y-4">
                  {workflowTemplates
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 3)
                    .map((template) => (
                      <Card 
                        key={`popular-${template.id}`} 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedTemplate === template.id ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setWorkflowData(prev => ({ ...prev, template: template.id, type: "template" }));
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-base">{template.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500 ml-2">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">{template.popularity}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Start from Scratch Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground text-center">Start from Scratch</h3>
                <div className="flex flex-col items-center justify-center h-80 space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center space-y-3">
                    <h4 className="text-xl font-semibold">Start from Scratch</h4>
                    <p className="text-muted-foreground max-w-sm">
                      Build a completely custom workflow tailored to your specific needs
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedTemplate("custom");
                      setWorkflowData(prev => ({ ...prev, type: "custom" }));
                      setCurrentStep(1); // Skip to custom workflow basics
                    }}
                    className="mt-4 bg-foreground text-background hover:bg-foreground/90"
                  >
                    Create Custom Workflow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Basic Information
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Workflow Details</h3>
              <p className="text-muted-foreground">Set up the basic information for your workflow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name *</Label>
                  <Input
                    id="workflow-name"
                    placeholder="Enter workflow name..."
                    value={workflowData.name}
                    onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  {workflowData.name.length > 0 && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Check className="w-3 h-3" />
                      Valid name
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={workflowData.priority} onValueChange={(value) => setWorkflowData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Low Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Medium Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          High Priority
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration</Label>
                  <Select value={workflowData.duration} onValueChange={(value) => setWorkflowData(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-day">1 Day</SelectItem>
                      <SelectItem value="2-3-days">2-3 Days</SelectItem>
                      <SelectItem value="1-week">1 Week</SelectItem>
                      <SelectItem value="2-weeks">2 Weeks</SelectItem>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose and goals of this workflow..."
                    value={workflowData.description}
                    onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {workflowData.description.length}/500 characters
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Department Assignment</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["HR", "IT", "Finance", "Operations", "Sales", "Marketing"].map((dept) => (
                      <Button
                        key={dept}
                        variant={workflowData.department.includes(dept) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setWorkflowData(prev => ({
                            ...prev,
                            department: prev.department.includes(dept) 
                              ? prev.department.filter(d => d !== dept)
                              : [...prev.department, dept]
                          }));
                        }}
                        className="justify-start"
                      >
                        {dept}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Save className="w-4 h-4" />
                  <span className="text-sm font-medium">Auto-save enabled</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Your progress is automatically saved every 30 seconds
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 3: // Workflow Builder
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Build Your Workflow</h3>
              <p className="text-muted-foreground">Drag and drop components to create your workflow</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Component Library */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Workflow Components
                </h4>
                <div className="space-y-2">
                  {stepComponents.map((component) => (
                    <Button
                      key={component.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addStepToFlow(component.type)}
                      className="w-full justify-start h-auto p-3 hover:shadow-md transition-all duration-200"
                    >
                      <div className={`w-8 h-8 rounded bg-gradient-to-r ${component.color} flex items-center justify-center mr-3`}>
                        <component.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{component.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Workflow Canvas */}
              <div className="lg:col-span-3">
                <Card className="h-96">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Workflow Canvas</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <TestTube className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="h-full w-full">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                        style={{ height: '100%' }}
                      >
                        <Controls />
                        <Background />
                      </ReactFlow>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 4: // Participants
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Assign Participants</h3>
              <p className="text-muted-foreground">Define who will be involved in this workflow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Role-Based Assignment</CardTitle>
                  <CardDescription>Assign workflow steps to specific roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Manager", "HR Representative", "IT Support", "Training Coordinator"].map((role) => (
                    <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{role}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Assign
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notification Settings</CardTitle>
                  <CardDescription>Configure how participants receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { type: "Email", enabled: true },
                    { type: "In-App", enabled: true },
                    { type: "SMS", enabled: false },
                    { type: "Slack", enabled: false }
                  ].map((notification) => (
                    <div key={notification.type} className="flex items-center justify-between">
                      <span>{notification.type} Notifications</span>
                      <Button 
                        variant={notification.enabled ? "default" : "outline"} 
                        size="sm"
                      >
                        {notification.enabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5: // Review & Launch
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Review & Launch</h3>
              <p className="text-muted-foreground">Review your workflow configuration before launching</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workflow Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{workflowData.name || "Untitled Workflow"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Template:</span>
                      <span className="font-medium">
                        {workflowData.template === "custom" ? "Custom" : 
                         workflowTemplates.find(t => t.id === workflowData.template)?.name || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant={workflowData.priority === "high" ? "destructive" : "default"}>
                        {workflowData.priority || "Not set"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{workflowData.duration || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Steps:</span>
                      <span className="font-medium">{nodes.length} steps</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Validation Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { item: "Workflow name provided", valid: !!workflowData.name },
                      { item: "Template selected", valid: !!workflowData.template },
                      { item: "Priority level set", valid: !!workflowData.priority },
                      { item: "Workflow steps defined", valid: nodes.length > 0 },
                      { item: "Participants assigned", valid: true }
                    ].map((check, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          check.valid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {check.valid ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        </div>
                        <span className={check.valid ? 'text-green-700' : 'text-red-700'}>
                          {check.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Ready to Launch!</h4>
                    <p className="text-muted-foreground">
                      Your workflow is configured and ready to activate
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                    <Button onClick={handleLaunch} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Workflow
          </DialogTitle>
          
          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === step.number 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : currentStep > step.number 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 transition-all duration-300 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <span className="text-xs text-muted-foreground">
              Last saved: Just now
            </span>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={
                currentStep === maxSteps || 
                (workflowData.type !== "custom" && currentStep === 1 && !selectedTemplate) ||
                (workflowData.type === "custom" && currentStep === 1 && !workflowData.name) ||
                (workflowData.type === "custom" && currentStep === 3 && workflowData.steps.length === 0)
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentStep === maxSteps ? "Complete" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowCreationWizard;