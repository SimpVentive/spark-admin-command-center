import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Settings, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Workflow,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import WorkflowCreationWizard from "@/components/workflow/WorkflowCreationWizard";

const WorkflowManagement = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeWorkflows, setActiveWorkflows] = useState([
    {
      id: 1,
      name: "Employee Onboarding",
      status: "running",
      progress: 75,
      assignedTo: "HR Team",
      dueDate: "2024-02-15",
      priority: "high",
      steps: 8,
      completedSteps: 6
    },
    {
      id: 2,
      name: "Training Approval",
      status: "pending",
      progress: 25,
      assignedTo: "Manager Review",
      dueDate: "2024-02-12",
      priority: "medium",
      steps: 4,
      completedSteps: 1
    },
    {
      id: 3,
      name: "Performance Review",
      status: "completed",
      progress: 100,
      assignedTo: "Team Lead",
      dueDate: "2024-02-10",
      priority: "low",
      steps: 5,
      completedSteps: 5
    }
  ]);

  const [workflowTemplates] = useState([
    { id: 1, name: "Employee Onboarding", category: "HR", usage: 45 },
    { id: 2, name: "Training Request", category: "Learning", usage: 32 },
    { id: 3, name: "Equipment Request", category: "IT", usage: 28 },
    { id: 4, name: "Leave Approval", category: "HR", usage: 67 }
  ]);

  // Detailed stats data for modals
  const statsDetails = {
    "Active Workflows": {
      data: [
        { name: "Employee Onboarding", status: "Running", department: "HR", startDate: "2024-01-28", assignee: "Sarah Johnson" },
        { name: "Training Approval", status: "Running", department: "Learning", startDate: "2024-01-29", assignee: "Mike Chen" },
        { name: "Equipment Request", status: "Running", department: "IT", startDate: "2024-01-30", assignee: "Alex Rodriguez" },
        { name: "Performance Review", status: "Running", department: "HR", startDate: "2024-01-31", assignee: "Jessica Lee" },
        { name: "Leave Approval", status: "Running", department: "HR", startDate: "2024-02-01", assignee: "David Kim" }
      ]
    },
    "Completed Today": {
      data: [
        { name: "Security Training", status: "Completed", department: "Security", completedAt: "14:30", assignee: "Tom Wilson" },
        { name: "Vendor Approval", status: "Completed", department: "Finance", completedAt: "13:15", assignee: "Lisa Parker" },
        { name: "Project Review", status: "Completed", department: "Operations", completedAt: "11:45", assignee: "James Brown" },
        { name: "Code Review", status: "Completed", department: "Engineering", completedAt: "10:20", assignee: "Emma Davis" }
      ]
    },
    "Pending Approval": {
      data: [
        { name: "Budget Request", status: "Pending", department: "Finance", waitingFor: "CFO Approval", submittedBy: "John Smith" },
        { name: "Policy Update", status: "Pending", department: "Legal", waitingFor: "Legal Review", submittedBy: "Mary Jones" },
        { name: "System Upgrade", status: "Pending", department: "IT", waitingFor: "IT Director", submittedBy: "Robert Chen" }
      ]
    },
    "Error Rate": {
      data: [
        { workflow: "Data Migration", error: "Connection timeout", timestamp: "15:42", severity: "Medium" },
        { workflow: "Email Notification", error: "SMTP failure", timestamp: "14:18", severity: "Low" },
        { workflow: "File Processing", error: "Invalid format", timestamp: "13:55", severity: "High" }
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const handleWorkflowAction = (action: string, workflowId: number) => {
    setActiveWorkflows(prev => prev.map(w =>
      w.id === workflowId
        ? {
            ...w,
            status: action === "paused" ? "paused" : action === "resumed" ? "running" : "stopped"
          }
        : w
    ));
    toast(`Workflow ${action} successfully`, {
      description: `Workflow ID: ${workflowId}`,
    });
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6 -m-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Workflow Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Mission control for your business processes
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              onClick={() => setIsWizardOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Active Workflows", value: "24", change: "+12%", icon: Activity, color: "from-blue-500 to-blue-600" },
          { title: "Completed Today", value: "18", change: "+8%", icon: CheckCircle, color: "from-green-500 to-green-600" },
          { title: "Pending Approval", value: "7", change: "-5%", icon: Clock, color: "from-yellow-500 to-yellow-600" },
          { title: "Error Rate", value: "2.1%", change: "-15%", icon: AlertTriangle, color: "from-red-500 to-red-600" }
        ].map((stat, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm border-white/20 max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <stat.icon className="w-5 h-5" />
                  {stat.title} Details
                </DialogTitle>
                <DialogDescription>
                  Detailed breakdown of {stat.title.toLowerCase()}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                {stat.title === "Active Workflows" && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Assignee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statsDetails["Active Workflows"].data.map((workflow, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{workflow.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {workflow.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{workflow.department}</TableCell>
                          <TableCell>{workflow.startDate}</TableCell>
                          <TableCell>{workflow.assignee}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                {stat.title === "Completed Today" && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Completed At</TableHead>
                        <TableHead>Assignee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statsDetails["Completed Today"].data.map((workflow, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{workflow.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {workflow.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{workflow.department}</TableCell>
                          <TableCell>{workflow.completedAt}</TableCell>
                          <TableCell>{workflow.assignee}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                {stat.title === "Pending Approval" && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Waiting For</TableHead>
                        <TableHead>Submitted By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statsDetails["Pending Approval"].data.map((workflow, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{workflow.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              {workflow.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{workflow.department}</TableCell>
                          <TableCell>{workflow.waitingFor}</TableCell>
                          <TableCell>{workflow.submittedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                {stat.title === "Error Rate" && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow</TableHead>
                        <TableHead>Error</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statsDetails["Error Rate"].data.map((error, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{error.workflow}</TableCell>
                          <TableCell>{error.error}</TableCell>
                          <TableCell>{error.timestamp}</TableCell>
                          <TableCell>
                            <Badge variant={error.severity === "High" ? "destructive" : error.severity === "Medium" ? "default" : "secondary"}>
                              {error.severity}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm">
          <TabsTrigger value="active" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Active Workflows
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Templates
          </TabsTrigger>
          <TabsTrigger value="builder" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Workflow Builder
          </TabsTrigger>
        </TabsList>

        {/* Active Workflows */}
        <TabsContent value="active" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Live Workflow Status
              </CardTitle>
              <CardDescription>
                Monitor real-time workflow execution and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeWorkflows.map((workflow) => (
                  <div 
                    key={workflow.id} 
                    className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)} animate-pulse`}></div>
                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                          {workflow.name}
                        </h3>
                        <Badge variant={getPriorityColor(workflow.priority)} className="capitalize">
                          {workflow.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white/95 backdrop-blur-sm border-white/20 w-96">
                            <DialogHeader>
                              <DialogTitle>Workflow Actions</DialogTitle>
                              <DialogDescription>
                                Choose an action for {workflow.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-3 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => handleWorkflowAction("paused", workflow.id)}
                                className="hover:bg-yellow-50 w-full justify-start"
                              >
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleWorkflowAction("resumed", workflow.id)}
                                className="hover:bg-green-50 w-full justify-start"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleWorkflowAction("stopped", workflow.id)}
                                className="w-full justify-start"
                              >
                                <Square className="w-4 h-4 mr-2" />
                                Stop
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {workflow.assignedTo}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Due: {workflow.dueDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Workflow className="w-4 h-4" />
                        {workflow.completedSteps}/{workflow.steps} steps
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <Progress 
                        value={workflow.progress} 
                        className="h-2 bg-gradient-to-r from-blue-200 to-purple-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                Pre-built workflow templates to accelerate your process automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflowTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="bg-white/60 backdrop-blur-sm border-white/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Used {template.usage} times this month
                      </p>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        onClick={() => toast("Template selected!", { description: `Creating workflow from ${template.name}` })}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Builder */}
        <TabsContent value="builder" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Drag & Drop Workflow Builder</CardTitle>
              <CardDescription>
                Design custom workflows with our intuitive visual builder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-slate-100 to-blue-100 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <Workflow className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Interactive Workflow Canvas</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop workflow components to create powerful automation
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                      onClick={() => toast("Workflow builder launching!", { description: "Opening advanced workflow designer..." })}
                    >
                      Launch Builder
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Workflow Creation Wizard */}
      <WorkflowCreationWizard 
        open={isWizardOpen} 
        onOpenChange={setIsWizardOpen} 
      />
    </div>
  );
};

export default WorkflowManagement;