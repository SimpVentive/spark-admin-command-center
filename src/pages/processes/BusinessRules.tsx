import { useState, useCallback, useRef } from "react";
import { 
  Plus, 
  Play, 
  Save, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Copy,
  Trash2,
  Eye,
  Edit3,
  FileText,
  BarChart3,
  Target,
  GitBranch,
  Layers,
  Code,
  TestTube
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  MarkerType,
  Position
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

// Mock data for business rules
const mockRules = [
  {
    id: "1",
    name: "Training Budget Approval",
    description: "Automatically approve training requests under $5,000 for senior employees",
    category: "Financial",
    status: "active",
    priority: "high",
    lastModified: "2024-08-01",
    executions: 1247,
    successRate: 98.5,
    conditions: [
      { field: "employee_level", operator: "equals", value: "senior" },
      { field: "training_cost", operator: "less_than", value: "5000" }
    ],
    actions: [
      { type: "approve_request", notify: true },
      { type: "update_budget", amount: "subtract" }
    ]
  },
  {
    id: "2",
    name: "Mandatory Compliance Training",
    description: "Assign compliance training to all employees in regulated departments",
    category: "Compliance",
    status: "active",
    priority: "critical",
    lastModified: "2024-07-28",
    executions: 567,
    successRate: 100,
    conditions: [
      { field: "department", operator: "in", value: ["finance", "legal", "hr"] },
      { field: "last_compliance_training", operator: "older_than", value: "365_days" }
    ],
    actions: [
      { type: "assign_training", course: "Annual Compliance Update" },
      { type: "set_deadline", days: 30 }
    ]
  },
  {
    id: "3",
    name: "Skills Gap Identification",
    description: "Identify skill gaps based on role requirements and suggest training",
    category: "Development",
    status: "draft",
    priority: "medium",
    lastModified: "2024-08-03",
    executions: 0,
    successRate: 0,
    conditions: [
      { field: "skill_assessment_score", operator: "less_than", value: "70" },
      { field: "role_requirements", operator: "not_met", value: "core_skills" }
    ],
    actions: [
      { type: "suggest_training", priority: "high" },
      { type: "notify_manager", include_recommendations: true }
    ]
  }
];

const ruleTemplates = [
  {
    id: "budget-approval",
    name: "Budget Approval Workflow",
    description: "Automate training budget approvals based on amount and employee level",
    category: "Financial",
    difficulty: "Easy",
    conditions: 3,
    actions: 2
  },
  {
    id: "compliance-auto-assign",
    name: "Compliance Auto-Assignment",
    description: "Automatically assign mandatory training based on role and date requirements",
    category: "Compliance",
    difficulty: "Medium",
    conditions: 4,
    actions: 3
  },
  {
    id: "performance-based-training",
    name: "Performance-Based Training",
    description: "Trigger training recommendations based on performance reviews",
    category: "Development",
    difficulty: "Advanced",
    conditions: 5,
    actions: 4
  }
];

// Initial nodes for rule builder
const initialNodes: Node[] = [
  {
    id: 'trigger',
    type: 'input',
    position: { x: 50, y: 50 },
    data: { label: 'Training Request Submitted', type: 'trigger' },
    style: { background: '#e3f2fd', color: '#1976d2', border: '2px solid #1976d2' }
  },
  {
    id: 'condition-1',
    position: { x: 300, y: 50 },
    data: { label: 'Employee Level = Senior', type: 'condition' },
    style: { background: '#fff3e0', color: '#f57c00', border: '2px solid #f57c00' }
  },
  {
    id: 'condition-2',
    position: { x: 300, y: 200 },
    data: { label: 'Training Cost < $5,000', type: 'condition' },
    style: { background: '#fff3e0', color: '#f57c00', border: '2px solid #f57c00' }
  },
  {
    id: 'action-1',
    type: 'output',
    position: { x: 600, y: 125 },
    data: { label: 'Auto-Approve Request', type: 'action' },
    style: { background: '#e8f5e8', color: '#388e3c', border: '2px solid #388e3c' }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'trigger',
    target: 'condition-1',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  {
    id: 'e1-3',
    source: 'trigger',
    target: 'condition-2',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  {
    id: 'e2-4',
    source: 'condition-1',
    target: 'action-1',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: 'AND'
  },
  {
    id: 'e3-4',
    source: 'condition-2',
    target: 'action-1',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: 'AND'
  }
];

export default function BusinessRules() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("rules");
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [testData, setTestData] = useState("");
  const [testResults, setTestResults] = useState<any>(null);
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const filteredRules = mockRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "all" || rule.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "draft": return "bg-yellow-500";
      case "inactive": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-blue-600 bg-blue-50 border-blue-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleTestRule = () => {
    if (!testData.trim()) return;
    
    try {
      const data = JSON.parse(testData);
      // Mock test results
      setTestResults({
        passed: true,
        executionTime: "0.023s",
        matchedConditions: 2,
        triggeredActions: 1,
        result: "Request approved automatically"
      });
    } catch (error) {
      setTestResults({
        passed: false,
        error: "Invalid JSON format"
      });
    }
  };

  const handleExportRules = () => {
    const dataStr = JSON.stringify(mockRules, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'business_rules.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportRules = () => {
    fileInputRef.current?.click();
  };

  const addNewNode = (type: 'condition' | 'action') => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: type === 'condition' ? 'New Condition' : 'New Action',
        type 
      },
      style: { 
        background: type === 'condition' ? '#fff3e0' : '#e8f5e8',
        color: type === 'condition' ? '#f57c00' : '#388e3c',
        border: `2px solid ${type === 'condition' ? '#f57c00' : '#388e3c'}`
      }
    };
    
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Rules Engine</h1>
          <p className="text-muted-foreground mt-1">Create and manage intelligent training automation rules</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleImportRules} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportRules} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Rule
          </Button>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Handle file import logic here
            console.log('Importing file:', file.name);
          }
        }}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">24</span>
              <Zap className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">+3 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">1,847</span>
              <BarChart3 className="w-8 h-8 text-green-500 opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">97.8%</span>
              <Target className="w-8 h-8 text-purple-500 opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">Above target</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">0.15s</span>
              <Clock className="w-8 h-8 text-orange-500 opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">-0.03s improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Rule Builder
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-card">
            <CardContent className="py-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search rules by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Rules List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredRules.map((rule) => (
              <Card key={rule.id} className="bg-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
                        <Badge className={`${getStatusColor(rule.status)} text-white`}>
                          {rule.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(rule.priority)}>
                          {rule.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Category: {rule.category}</span>
                        <span>Last modified: {rule.lastModified}</span>
                        <span>Executions: {rule.executions}</span>
                        <span>Success rate: {rule.successRate}%</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="w-4 h-4 mr-2" />
                          Test Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Conditions ({rule.conditions.length})</h4>
                      <div className="space-y-1">
                        {rule.conditions.map((condition, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                            {condition.field} {condition.operator} {condition.value}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Actions ({rule.actions.length})</h4>
                      <div className="space-y-1">
                        {rule.actions.map((action, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                            {action.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.status === 'active'} />
                        <span className="text-sm text-muted-foreground">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Code className="w-4 h-4 mr-1" />
                        Edit Logic
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Toolbox */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Rule Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addNewNode('condition')}
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addNewNode('action')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Add Action
                </Button>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Quick Templates</h4>
                  {ruleTemplates.slice(0, 2).map((template) => (
                    <Button
                      key={template.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rule Builder Canvas */}
            <div className="lg:col-span-3">
              <Card className="bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Visual Rule Builder</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96 w-full border border-border rounded-lg">
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
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ruleTemplates.map((template) => (
              <Card key={template.id} className="bg-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    </div>
                    <Badge variant="outline">{template.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conditions</span>
                    <span className="text-foreground">{template.conditions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Actions</span>
                    <span className="text-foreground">{template.actions}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Plus className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Input */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Rule Testing Sandbox</CardTitle>
                <p className="text-sm text-muted-foreground">Test your rules with sample data</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Select Rule to Test</label>
                  <Select value={selectedRule || ""} onValueChange={setSelectedRule}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a rule..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRules.map((rule) => (
                        <SelectItem key={rule.id} value={rule.id}>
                          {rule.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Test Data (JSON)</label>
                  <Textarea
                    placeholder='{\n  "employee_level": "senior",\n  "training_cost": 3500,\n  "department": "engineering"\n}'
                    value={testData}
                    onChange={(e) => setTestData(e.target.value)}
                    className="mt-1 font-mono text-sm"
                    rows={8}
                  />
                </div>
                
                <Button onClick={handleTestRule} className="w-full" disabled={!selectedRule || !testData.trim()}>
                  <Play className="w-4 h-4 mr-2" />
                  Run Test
                </Button>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {testResults ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {testResults.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${testResults.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.passed ? 'Test Passed' : 'Test Failed'}
                      </span>
                    </div>
                    
                    {testResults.passed ? (
                      <div className="space-y-3">
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <h4 className="font-medium text-foreground mb-2">Execution Details</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Execution Time:</span>
                              <span className="text-foreground">{testResults.executionTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Matched Conditions:</span>
                              <span className="text-foreground">{testResults.matchedConditions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Triggered Actions:</span>
                              <span className="text-foreground">{testResults.triggeredActions}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">Result</h4>
                          <p className="text-sm text-green-700">{testResults.result}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-1">Error</h4>
                        <p className="text-sm text-red-700">{testResults.error}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TestTube className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Run a test to see results here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}