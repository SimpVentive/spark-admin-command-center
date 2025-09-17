import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  Plus,
  MoreVertical,
  Activity
} from "lucide-react";

const MOOC = () => {
  const platforms = [
    {
      id: 1,
      name: "Coursera Business",
      status: "connected",
      coursesCount: 4500,
      activeEnrollments: 234,
      lastSync: "2 minutes ago",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "LinkedIn Learning",
      status: "connected",
      coursesCount: 3200,
      activeEnrollments: 156,
      lastSync: "1 hour ago",
      logo: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=40&h=40&fit=crop&crop=center"
    },
    {
      id: 3,
      name: "Udemy Business",
      status: "disconnected",
      coursesCount: 0,
      activeEnrollments: 0,
      lastSync: "Never",
      logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=40&h=40&fit=crop&crop=center"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MOOC Platform Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage connections to MOOC providers and monitor platform integrations.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Platform
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Platforms</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,700</div>
            <p className="text-xs text-muted-foreground">Total courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">390</div>
            <p className="text-xs text-muted-foreground">Organization-wide</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,850</div>
            <p className="text-xs text-muted-foreground">$1,200 remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Platform Connections
          </CardTitle>
          <CardDescription>
            Manage your MOOC platform integrations and monitor connection status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{platform.name}</h3>
                    <Badge variant={platform.status === "connected" ? "default" : "secondary"}>
                      {platform.status === "connected" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {platform.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>{platform.coursesCount.toLocaleString()} courses</span>
                    <span>{platform.activeEnrollments} enrollments</span>
                    <span>Last sync: {platform.lastSync}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {platform.status === "connected" && (
                  <Button variant="outline" size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <p className="font-medium">Course catalog sync completed</p>
                <p className="text-sm text-muted-foreground">Coursera Business - 45 new courses added</p>
              </div>
              <span className="text-sm text-muted-foreground">2 min ago</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <p className="font-medium">Bulk enrollment processed</p>
                <p className="text-sm text-muted-foreground">25 employees enrolled in Data Science track</p>
              </div>
              <span className="text-sm text-muted-foreground">1 hour ago</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium">New platform connection</p>
                <p className="text-sm text-muted-foreground">LinkedIn Learning integration configured</p>
              </div>
              <span className="text-sm text-muted-foreground">3 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MOOC;