import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MoreHorizontal, Plus, Settings, Shield, Star, Trophy, Clock, TrendingUp, Users as UsersIcon, CheckCircle, AlertCircle, ChevronRight, Edit3, Eye, Trash2, UserPlus, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { InviteUserDialog } from "@/components/users/InviteUserDialog";

const mockUsers = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@company.com",
    role: "Admin",
    department: "Engineering",
    avatar: "/placeholder.svg",
    status: "active",
    lastActive: "2 hours ago",
    progress: 85,
    competencies: ["React", "Node.js", "Leadership"],
    permissions: ["user_management", "system_config", "reports"],
    badges: ["Expert Developer", "Team Lead", "Mentor"]
  },
  {
    id: "2",
    name: "Sarah Martinez",
    email: "sarah.martinez@company.com",
    role: "Manager",
    department: "Sales",
    avatar: "/placeholder.svg",
    status: "active",
    lastActive: "1 hour ago",
    progress: 92,
    competencies: ["Sales Strategy", "Client Relations", "Team Management"],
    permissions: ["team_management", "reports", "sales_data"],
    badges: ["Top Performer", "Client Champion"]
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@company.com",
    role: "User",
    department: "Marketing",
    avatar: "/placeholder.svg",
    status: "inactive",
    lastActive: "3 days ago",
    progress: 65,
    competencies: ["Digital Marketing", "Content Creation"],
    permissions: ["content_create", "analytics_view"],
    badges: ["Creative Mind"]
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Moderator",
    department: "HR",
    avatar: "/placeholder.svg",
    status: "active",
    lastActive: "30 minutes ago",
    progress: 78,
    competencies: ["HR Policies", "Employee Relations", "Compliance"],
    permissions: ["user_support", "content_moderate"],
    badges: ["People Champion", "Compliance Expert"]
  }
];

const roles = [
  { name: "Admin", color: "bg-red-500", permissions: 15, users: 3 },
  { name: "Manager", color: "bg-blue-500", permissions: 12, users: 8 },
  { name: "Moderator", color: "bg-green-500", permissions: 8, users: 5 },
  { name: "User", color: "bg-gray-500", permissions: 4, users: 124 }
];

const permissions = [
  { id: "user_management", name: "User Management", category: "Core" },
  { id: "system_config", name: "System Configuration", category: "Core" },
  { id: "reports", name: "Reports Access", category: "Analytics" },
  { id: "team_management", name: "Team Management", category: "Core" },
  { id: "sales_data", name: "Sales Data", category: "Department" },
  { id: "content_create", name: "Content Creation", category: "Content" },
  { id: "analytics_view", name: "Analytics View", category: "Analytics" },
  { id: "user_support", name: "User Support", category: "Support" },
  { id: "content_moderate", name: "Content Moderation", category: "Content" }
];

export default function UserRoleManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => {
      const newSelected = prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const getRoleColor = (role: string) => {
    const roleConfig = roles.find(r => r.name === role);
    return roleConfig?.color || "bg-gray-500";
  };

  const getStatusIcon = (status: string) => {
    return status === "active" ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User & Role Management</h1>
          <p className="text-muted-foreground mt-1">Manage users, roles, and permissions with ease</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Quick Invite
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/users/add-employee')}>
              <UsersIcon className="h-4 w-4 mr-2" />
              Add Employee (Full Form)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/users/bulk-enrollment')}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Enrollment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">140</span>
              <UsersIcon className="w-8 h-8 text-primary opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">126</span>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">90% active rate</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Roles Defined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">4</span>
              <Shield className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Admin, Manager, Moderator, User</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Training Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">80%</span>
              <Trophy className="w-8 h-8 text-yellow-500 opacity-60" />
            </div>
            <p className="text-xs text-green-600 mt-2">+5% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Toolbar */}
      {showBulkActions && (
        <Card className="bg-primary/5 border-primary/20 animate-slide-in-right">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedUsers.length} users selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-1" />
                  Bulk Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Shield className="w-4 h-4 mr-1" />
                  Change Role
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-card">
            <CardContent className="py-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserSelect(user.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getRoleColor(user.role)} text-white`}>
                      {user.role}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(user.status)}
                      <span className="text-xs text-muted-foreground">{user.lastActive}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Training Progress</span>
                      <span className="text-sm text-muted-foreground">{user.progress}%</span>
                    </div>
                    <Progress value={user.progress} className="h-2" />
                  </div>

                  <div>
                    <span className="text-sm font-medium text-foreground">Department</span>
                    <p className="text-sm text-muted-foreground">{user.department}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-foreground">Competencies</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.competencies.slice(0, 3).map((comp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                      {user.competencies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.competencies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-foreground">Badges</span>
                    <div className="flex items-center gap-1 mt-1">
                      {user.badges.slice(0, 2).map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">{badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.name} className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                      <CardTitle className="text-foreground">{role.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Permissions</span>
                    <span className="text-sm font-medium text-foreground">{role.permissions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Users</span>
                    <span className="text-sm font-medium text-foreground">{role.users}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Permission Matrix</CardTitle>
              <p className="text-sm text-muted-foreground">Configure role-based permissions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["Core", "Analytics", "Content", "Department", "Support"].map((category) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-foreground">{category} Permissions</h4>
                    <div className="grid gap-3">
                      {permissions
                        .filter(p => p.category === category)
                        .map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium text-foreground">{permission.name}</span>
                            <div className="flex items-center gap-4">
                              {roles.map((role) => (
                                <div key={role.name} className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground w-16 text-right">{role.name}</span>
                                  <Switch className="scale-75" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InviteUserDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}