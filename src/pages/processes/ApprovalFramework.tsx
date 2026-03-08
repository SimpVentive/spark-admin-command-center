import { useState, useCallback } from "react";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar, 
  MoreHorizontal, 
  ArrowRight, 
  FileText, 
  Eye, 
  MessageSquare,
  UserPlus,
  Filter,
  Search,
  Zap,
  TrendingUp,
  CheckSquare,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

// Mock data for approval requests
const mockApprovalRequests = [
  {
    id: "1",
    title: "Leadership Development Program",
    type: "Training Program",
    requester: { name: "John Smith", avatar: "/placeholder.svg" },
    priority: "high",
    status: "pending",
    daysOverdue: 0,
    estimatedBudget: "$25,000",
    participants: 15,
    deadline: "2024-08-15",
    description: "Advanced leadership training for senior managers",
    approvers: [
      { name: "Sarah Johnson", role: "HR Director", status: "pending" },
      { name: "Mike Davis", role: "Finance Director", status: "waiting" },
      { name: "CEO", role: "Chief Executive", status: "waiting" }
    ]
  },
  {
    id: "2",
    title: "Technical Skills Bootcamp",
    type: "Skills Training",
    requester: { name: "Emily Chen", avatar: "/placeholder.svg" },
    priority: "medium",
    status: "in_review",
    daysOverdue: 0,
    estimatedBudget: "$15,000",
    participants: 25,
    deadline: "2024-08-20",
    description: "React and Node.js training for development team",
    approvers: [
      { name: "Tech Lead", role: "Technical Director", status: "approved" },
      { name: "HR Manager", role: "HR Manager", status: "pending" }
    ]
  },
  {
    id: "3",
    title: "Sales Excellence Workshop",
    type: "Workshop",
    requester: { name: "Mark Wilson", avatar: "/placeholder.svg" },
    priority: "low",
    status: "overdue",
    daysOverdue: 3,
    estimatedBudget: "$8,000",
    participants: 12,
    deadline: "2024-08-10",
    description: "Advanced sales techniques and customer relationship management",
    approvers: [
      { name: "Sales Director", role: "Sales Director", status: "pending" },
      { name: "Budget Manager", role: "Finance", status: "waiting" }
    ]
  },
  {
    id: "4",
    title: "Compliance Training Update",
    type: "Mandatory Training",
    requester: { name: "Lisa Brown", avatar: "/placeholder.svg" },
    priority: "high",
    status: "approved",
    daysOverdue: 0,
    estimatedBudget: "$5,000",
    participants: 100,
    deadline: "2024-09-01",
    description: "Updated compliance training for all employees",
    approvers: [
      { name: "Legal Counsel", role: "Legal", status: "approved" },
      { name: "HR Director", role: "HR", status: "approved" }
    ]
  }
];

// Initial nodes and edges for approval flow
const initialNodes: Node[] = [
  {
    id: 'request',
    type: 'input',
    position: { x: 50, y: 50 },
    data: { label: 'Training Request Submitted' },
    style: { background: '#e3f2fd', color: '#1976d2', border: '2px solid #1976d2' }
  },
  {
    id: 'hr-review',
    position: { x: 300, y: 50 },
    data: { label: 'HR Review' },
    style: { background: '#fff3e0', color: '#f57c00', border: '2px solid #f57c00' }
  },
  {
    id: 'budget-approval',
    position: { x: 550, y: 50 },
    data: { label: 'Budget Approval' },
    style: { background: '#f3e5f5', color: '#7b1fa2', border: '2px solid #7b1fa2' }
  },
  {
    id: 'final-approval',
    position: { x: 800, y: 50 },
    data: { label: 'Executive Approval' },
    style: { background: '#e8f5e8', color: '#388e3c', border: '2px solid #388e3c' }
  },
  {
    id: 'approved',
    type: 'output',
    position: { x: 1050, y: 50 },
    data: { label: 'Approved & Scheduled' },
    style: { background: '#e8f5e8', color: '#2e7d32', border: '2px solid #2e7d32' }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'request',
    target: 'hr-review',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  {
    id: 'e2-3',
    source: 'hr-review',
    target: 'budget-approval',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  {
    id: 'e3-4',
    source: 'budget-approval',
    target: 'final-approval',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  {
    id: 'e4-5',
    source: 'final-approval',
    target: 'approved',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  }
];

export default function ApprovalFramework() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("kanban");
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const filteredRequests = mockApprovalRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "in_review": return "bg-blue-500";
      case "approved": return "bg-green-500";
      case "overdue": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50";
      case "medium": return "border-l-yellow-500 bg-yellow-50";
      case "low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "in_review": return <Eye className="w-4 h-4 text-blue-600" />;
      case "approved": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "overdue": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleBulkApprove = () => {
    // Handle bulk approval logic
    setSelectedRequests([]);
  };

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const kanbanColumns = [
    { id: "pending", title: "Pending Review", status: "pending" },
    { id: "in_review", title: "In Review", status: "in_review" },
    { id: "approved", title: "Approved", status: "approved" },
    { id: "overdue", title: "Overdue", status: "overdue" }
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Approval Framework</h1>
          <p className="text-muted-foreground mt-1">Streamline your training approval process</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => toast({ title: "Delegation", description: "Select a request first, then choose a delegate from the approval chain." })}>
            <UserPlus className="w-4 h-4" />
            Delegate
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => toast({ title: "New Request", description: "Navigate to Programs > Create Program to submit a new training request." })}>
            <FileText className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">12</span>
              <Clock className="w-8 h-8 text-yellow-500 opacity-60" />
            </div>
            <p className="text-xs text-yellow-600 mt-2">3 overdue</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Approval Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">2.3</span>
              <TrendingUp className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">-0.5 days improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">47</span>
              <CheckSquare className="w-8 h-8 text-green-500 opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">85% approval rate</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">$127K</span>
              <Zap className="w-8 h-8 text-purple-500 opacity-60" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">of $200K budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedRequests.length > 0 && (
        <Card className="bg-primary/5 border-primary/20 animate-slide-in-right">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedRequests.length} requests selected
              </span>
              <div className="flex items-center gap-2">
                <Button onClick={handleBulkApprove} size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Bulk Approve
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Info Requested", description: `Requesting additional info for ${selectedRequests.length} selected request(s).` })}>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Request Info
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => { toast({ title: "Rejected", description: `${selectedRequests.length} request(s) rejected.` }); setSelectedRequests([]); }}>
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="flow" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Approval Flow
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-card">
            <CardContent className="py-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search approval requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                    setSearchTerm(searchTerm ? "" : "high");
                  }}>
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {kanbanColumns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary">
                    {filteredRequests.filter(r => r.status === column.status).length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredRequests
                    .filter(request => request.status === column.status)
                    .map((request) => (
                      <Card 
                        key={request.id} 
                        className={`bg-card hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 ${getPriorityColor(request.priority)} ${
                          request.status === 'overdue' ? 'animate-pulse' : ''
                        }`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedRequests.includes(request.id)}
                                onCheckedChange={() => handleRequestSelect(request.id)}
                                className="mt-1"
                              />
                              <div>
                                <h4 className="font-medium text-foreground text-sm">{request.title}</h4>
                                <p className="text-xs text-muted-foreground">{request.type}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { toast({ title: "Approved", description: `${request.title} has been approved.` }); }}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast({ title: "Info Requested", description: `Additional information requested for ${request.title}.` })}>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Request Info
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast({ title: "Delegated", description: `${request.title} has been delegated.` })}>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Delegate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <span className="text-xs text-muted-foreground">
                              {request.status === 'overdue' ? `${request.daysOverdue} days overdue` : 'On time'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Budget: {request.estimatedBudget}</span>
                            <span className="text-muted-foreground">{request.participants} participants</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{request.requester.name}</span>
                          </div>

                          <div className="space-y-2">
                            <span className="text-xs font-medium text-foreground">Approval Chain:</span>
                            <div className="space-y-1">
                              {request.approvers.map((approver, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">{approver.role}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`${getStatusColor(approver.status)} text-white text-xs px-1 py-0`}
                                  >
                                    {approver.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <Button size="sm" variant="outline" className="text-xs">
                              View Details
                            </Button>
                            {request.status === 'pending' && (
                              <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flow" className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Approval Workflow Visualization</CardTitle>
              <p className="text-sm text-muted-foreground">Visual representation of the approval process flow</p>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  className="bg-background"
                >
                  <MiniMap />
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Approval Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">Track approval history and upcoming deadlines</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockApprovalRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="relative border-l-2 border-primary/20 pl-6 pb-6">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-2 top-1"></div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{request.title}</h4>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Deadline: {request.deadline}</span>
                          <span>Budget: {request.estimatedBudget}</span>
                          <span>{request.participants} participants</span>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} text-white`}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}