import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Users, 
  Activity, 
  Bell, 
  Search, 
  Filter, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Database,
  Network,
  Key,
  FileText,
  UserCheck,
  AlertCircle,
  Wifi,
  Monitor,
  Smartphone,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for security monitoring
const mockSecurityEvents = [
  {
    id: "1",
    type: "login_attempt",
    user: "john.doe@company.com",
    timestamp: "2024-08-15T14:30:00Z",
    status: "success",
    location: "New York, US",
    device: "Chrome on Windows",
    riskLevel: "low"
  },
  {
    id: "2",
    type: "permission_change",
    user: "admin@company.com",
    timestamp: "2024-08-15T14:25:00Z",
    status: "success",
    action: "Granted admin access to training module",
    riskLevel: "medium"
  },
  {
    id: "3",
    type: "failed_login",
    user: "suspicious@external.com",
    timestamp: "2024-08-15T14:20:00Z",
    status: "blocked",
    location: "Unknown",
    attempts: 5,
    riskLevel: "high"
  },
  {
    id: "4",
    type: "data_access",
    user: "sarah.manager@company.com",
    timestamp: "2024-08-15T14:15:00Z",
    status: "success",
    resource: "Employee Training Records",
    riskLevel: "low"
  }
];

const mockAccessRequests = [
  {
    id: "1",
    requester: "Emily Chen",
    role: "HR Manager",
    requestedAccess: "Payroll System - Read Access",
    businessJustification: "Need to review training budget allocations",
    urgency: "medium",
    status: "pending",
    submittedDate: "2024-08-14",
    approvers: ["Finance Director", "System Admin"]
  },
  {
    id: "2",
    requester: "Mike Johnson",
    role: "Training Coordinator",
    requestedAccess: "Advanced Analytics Dashboard",
    businessJustification: "Required for quarterly training effectiveness analysis",
    urgency: "high",
    status: "approved",
    submittedDate: "2024-08-13",
    approvers: ["HR Director"]
  },
  {
    id: "3",
    requester: "Alex Rodriguez",
    role: "Team Lead",
    requestedAccess: "Employee Performance Data",
    businessJustification: "Team performance review and training needs assessment",
    urgency: "low",
    status: "under_review",
    submittedDate: "2024-08-12",
    approvers: ["HR Manager", "Legal Counsel"]
  }
];

const mockPermissionMatrix = [
  {
    resource: "User Management",
    admin: true,
    manager: false,
    trainer: false,
    employee: false,
    category: "core"
  },
  {
    resource: "Training Content",
    admin: true,
    manager: true,
    trainer: true,
    employee: false,
    category: "content"
  },
  {
    resource: "Analytics Dashboard",
    admin: true,
    manager: true,
    trainer: false,
    employee: false,
    category: "analytics"
  },
  {
    resource: "Employee Records",
    admin: true,
    manager: true,
    trainer: false,
    employee: false,
    category: "data"
  },
  {
    resource: "Training Enrollment",
    admin: true,
    manager: true,
    trainer: true,
    employee: true,
    category: "training"
  }
];

const networkNodes = [
  { id: "admin", label: "Admin Portal", type: "secure", connections: 4, x: 150, y: 100 },
  { id: "training", label: "Training System", type: "normal", connections: 8, x: 350, y: 150 },
  { id: "analytics", label: "Analytics DB", type: "secure", connections: 3, x: 250, y: 250 },
  { id: "user", label: "User Portal", type: "normal", connections: 12, x: 450, y: 100 },
  { id: "api", label: "API Gateway", type: "critical", connections: 15, x: 300, y: 50 }
];

export default function SecurityAccessControl() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(3);

  // Simulate real-time updates
  useEffect(() => {
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        setSecurityAlerts(prev => prev + Math.floor(Math.random() * 2));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "login_attempt": return <UserCheck className="w-4 h-4" />;
      case "permission_change": return <Key className="w-4 h-4" />;
      case "failed_login": return <XCircle className="w-4 h-4" />;
      case "data_access": return <Database className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "critical": return "text-red-500 bg-red-500/20 border-red-500/30 animate-pulse";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-400";
      case "blocked": return "text-red-400";
      case "pending": return "text-yellow-400";
      case "approved": return "text-green-400";
      case "under_review": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes("Mobile")) return <Smartphone className="w-4 h-4" />;
    if (device.includes("Chrome") || device.includes("Firefox")) return <Monitor className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6 relative overflow-hidden">
      {/* Matrix background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.1),transparent_50%)]" />
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-green-500/10" />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-400" />
            Security & Access Control
          </h1>
          <p className="text-gray-400 mt-1">Advanced security monitoring and access management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-yellow-400" />
              {securityAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                  {securityAlerts}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-400">{securityAlerts} alerts</span>
          </div>
          <Button 
            onClick={() => navigate('/security')}
            className="bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30"
          >
            <Settings className="w-4 h-4 mr-2" />
            Security Settings
          </Button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-green-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Threat Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-2xl font-bold text-green-400">LOW</span>
              </div>
              <Shield className="w-8 h-8 text-green-400 opacity-60" />
            </div>
            <p className="text-xs text-green-400 mt-2 glow-text">All systems secure</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-400">1,247</span>
              <Activity className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <p className="text-xs text-green-400">+12% from yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-yellow-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-yellow-400">23</span>
              <AlertTriangle className="w-8 h-8 text-yellow-400 opacity-60" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown className="w-3 h-3 text-green-400" />
              <p className="text-xs text-green-400">-5% from last hour</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-purple-400">94.8</span>
              <Zap className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
            <Progress value={94.8} className="mt-2 h-2" />
            <p className="text-xs text-purple-400 mt-1">Excellent security posture</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex bg-gray-900/50 border border-gray-700/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
              <Key className="w-4 h-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2 data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-400">
              <FileText className="w-4 h-4" />
              Audit Trail
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400">
              <Users className="w-4 h-4" />
              Access Requests
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2 data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400">
              <Network className="w-4 h-4" />
              Network Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Real-time Security Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-400" />
                      Real-time Security Feed
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                  {mockSecurityEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                      <div className={`p-2 rounded-full ${getRiskColor(event.riskLevel)}`}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{event.user}</span>
                          <Badge className={`${getRiskColor(event.riskLevel)} border`}>
                            {event.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          {event.type.replace('_', ' ')} • {event.location || event.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className={`text-sm ${getStatusColor(event.status)}`}>
                        {event.status}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Alerts */}
              <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">High Risk Login Attempt</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Multiple failed login attempts from suspicious location detected
                    </p>
                    <p className="text-xs text-red-400 mt-1">5 minutes ago</p>
                  </div>

                  <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Unusual Access Pattern</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      User accessing system outside normal hours
                    </p>
                    <p className="text-xs text-yellow-400 mt-1">12 minutes ago</p>
                  </div>

                  <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Security Update Applied</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      System security patches successfully deployed
                    </p>
                    <p className="text-xs text-blue-400 mt-1">2 hours ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Permission Matrix</CardTitle>
                <p className="text-sm text-gray-400">Manage role-based access permissions</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">Resource</th>
                        <th className="text-center py-3 px-4 text-gray-400">Admin</th>
                        <th className="text-center py-3 px-4 text-gray-400">Manager</th>
                        <th className="text-center py-3 px-4 text-gray-400">Trainer</th>
                        <th className="text-center py-3 px-4 text-gray-400">Employee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPermissionMatrix.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4 text-blue-400" />
                              <span className="text-white">{row.resource}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Switch 
                              checked={row.admin} 
                              className="data-[state=checked]:bg-green-600"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Switch 
                              checked={row.manager}
                              className="data-[state=checked]:bg-green-600"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Switch 
                              checked={row.trainer}
                              className="data-[state=checked]:bg-green-600"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Switch 
                              checked={row.employee}
                              className="data-[state=checked]:bg-green-600"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            {/* Filters */}
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="py-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search audit events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full lg:w-48 bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="login_attempt">Login Attempts</SelectItem>
                      <SelectItem value="permission_change">Permission Changes</SelectItem>
                      <SelectItem value="data_access">Data Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audit Timeline */}
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Audit Trail Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSecurityEvents.map((event, idx) => (
                    <div key={event.id} className="relative">
                      {idx !== mockSecurityEvents.length - 1 && (
                        <div className="absolute left-4 top-8 w-px h-16 bg-gray-600" />
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRiskColor(event.riskLevel)} border`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{event.type.replace('_', ' ').toUpperCase()}</h4>
                            <span className="text-xs text-gray-400">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">User:</span>
                              <span className="text-white ml-2">{event.user}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Status:</span>
                              <span className={`ml-2 ${getStatusColor(event.status)}`}>{event.status}</span>
                            </div>
                            {event.location && (
                              <div>
                                <span className="text-gray-400">Location:</span>
                                <span className="text-white ml-2">{event.location}</span>
                              </div>
                            )}
                            {event.device && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">Device:</span>
                                {getDeviceIcon(event.device)}
                                <span className="text-white">{event.device}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {mockAccessRequests.map((request) => (
                <Card key={request.id} className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{request.requestedAccess}</h3>
                        <p className="text-sm text-gray-400 mt-1">{request.businessJustification}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`
                          ${request.urgency === 'high' ? 'bg-red-600/20 text-red-400 border-red-600/30' : ''}
                          ${request.urgency === 'medium' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' : ''}
                          ${request.urgency === 'low' ? 'bg-green-600/20 text-green-400 border-green-600/30' : ''}
                          border
                        `}>
                          {request.urgency} priority
                        </Badge>
                        <Badge className={`
                          ${request.status === 'approved' ? 'bg-green-600/20 text-green-400 border-green-600/30' : ''}
                          ${request.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' : ''}
                          ${request.status === 'under_review' ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' : ''}
                          border
                        `}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Requester:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gray-700 text-white text-xs">
                              {request.requester.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white">{request.requester}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Role:</span>
                        <span className="text-white ml-2">{request.role}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Submitted:</span>
                        <span className="text-white ml-2">{request.submittedDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Approvers:</span>
                        <span className="text-white ml-2">{request.approvers.join(', ')}</span>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-700" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          Submitted {Math.floor(Math.random() * 5 + 1)} days ago
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="border-red-600/30 text-red-400 hover:bg-red-600/20">
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" className="bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-gray-700">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-blue-400" />
                  Network Security Topology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gray-800/30 rounded-lg border border-gray-700/30 overflow-hidden">
                  {/* Network visualization */}
                  <svg width="100%" height="100%" className="absolute inset-0">
                    {/* Connection lines */}
                    <line x1="150" y1="100" x2="300" y2="50" stroke="#00FF41" strokeWidth="2" className="opacity-60" />
                    <line x1="300" y1="50" x2="350" y2="150" stroke="#00FF41" strokeWidth="2" className="opacity-60" />
                    <line x1="350" y1="150" x2="450" y2="100" stroke="#00FF41" strokeWidth="2" className="opacity-60" />
                    <line x1="350" y1="150" x2="250" y2="250" stroke="#FFD93D" strokeWidth="2" className="opacity-60" />
                    <line x1="300" y1="50" x2="450" y2="100" stroke="#FF6B6B" strokeWidth="3" className="opacity-80" />
                  </svg>
                  
                  {/* Network nodes */}
                  {networkNodes.map((node) => (
                    <div
                      key={node.id}
                      className={`
                        absolute w-16 h-16 rounded-full flex items-center justify-center text-xs font-medium
                        ${node.type === 'secure' ? 'bg-green-600/20 border-2 border-green-400 text-green-400 glow-border-green' : ''}
                        ${node.type === 'normal' ? 'bg-blue-600/20 border-2 border-blue-400 text-blue-400' : ''}
                        ${node.type === 'critical' ? 'bg-red-600/20 border-2 border-red-400 text-red-400 glow-border-red animate-pulse' : ''}
                      `}
                      style={{ left: node.x, top: node.y }}
                    >
                      <div className="text-center">
                        <div className="text-xs">{node.label}</div>
                        <div className="text-xs opacity-70">{node.connections}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Animated data flow */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
                        style={{
                          left: Math.random() * 500,
                          top: Math.random() * 300,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">5</div>
                    <div className="text-xs text-gray-400">Secure Nodes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">23</div>
                    <div className="text-xs text-gray-400">Active Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">0</div>
                    <div className="text-xs text-gray-400">Compromised</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Custom CSS for glow effects */}
      <style>
        {`
          .glow-text {
            text-shadow: 0 0 10px currentColor;
          }
          .glow-border-green {
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
          }
          .glow-border-red {
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
          }
        `}
      </style>
    </div>
  );
}