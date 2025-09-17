import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MOOC = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('mooc_providers')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching platforms:', error);
        toast({
          title: "Error",
          description: "Failed to load MOOC platforms.",
          variant: "destructive"
        });
        return;
      }

      setPlatforms(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (platformId, platformName) => {
    setSyncing(platformId);
    
    try {
      // Create sync log entry  
      const { error: logError } = await supabase
        .from('mooc_sync_logs')
        .insert([{
          provider_id: platformId,
          sync_type: 'full',
          status: 'running',
          started_at: new Date().toISOString()
        }]);

      if (logError) {
        throw logError;
      }

      // Simulate sync process - in real implementation, this would call external APIs
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update sync completion
      const { error: updateLogError } = await supabase
        .from('mooc_sync_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          records_processed: Math.floor(Math.random() * 100) + 50
        })
        .eq('provider_id', platformId)
        .eq('status', 'running');

      // Update last sync time and add some random data changes
      const { error: updateError } = await supabase
        .from('mooc_providers')
        .update({ 
          last_sync_at: new Date().toISOString(),
          total_courses: Math.floor(Math.random() * 1000) + 3000,
          active_enrollments: Math.floor(Math.random() * 300) + 100
        })
        .eq('id', platformId);

      if (updateError || updateLogError) {
        throw updateError || updateLogError;
      }

      setSyncing(null);
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${platformName} courses and enrollments.`
      });
      fetchPlatforms(); // Refresh data

    } catch (error) {
      console.error('Error syncing:', error);
      setSyncing(null);
      
      // Log the failed sync
      await supabase
        .from('mooc_sync_logs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('provider_id', platformId)
        .eq('status', 'running');

      toast({
        title: "Sync Failed",
        description: `Failed to sync ${platformName}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleConfigure = async (platformId, platformName) => {
    try {
      // Show configuration dialog
      const configData = {
        api_endpoint: `https://api.${platformName.toLowerCase().replace(' ', '')}.com/v1`,
        sync_frequency: 'daily',
        auto_enrollment: true,
        notification_settings: {
          sync_completion: true,
          enrollment_updates: true
        }
      };

      // Update platform configuration
      const { error } = await supabase
        .from('mooc_providers')
        .update({
          config_data: configData,
          updated_at: new Date().toISOString()
        })
        .eq('id', platformId);

      if (error) {
        throw error;
      }

      toast({
        title: "Configuration Updated",
        description: `${platformName} configuration has been updated successfully.`
      });
      
      fetchPlatforms(); // Refresh data
    } catch (error) {
      console.error('Error configuring:', error);
      toast({
        title: "Configuration Failed",
        description: `Failed to update ${platformName} configuration.`,
        variant: "destructive"
      });
    }
  };

  const handleAddPlatform = () => {
    toast({
      title: "Add Platform",
      description: "Opening platform integration wizard..."
    });
    // In a real implementation, this would open an add platform modal
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalCourses = platforms.reduce((sum, p) => sum + (p.total_courses || 0), 0);
  const totalEnrollments = platforms.reduce((sum, p) => sum + (p.active_enrollments || 0), 0);
  const connectedPlatforms = platforms.filter(p => p.is_connected).length;
  const totalBudget = platforms.reduce((sum, p) => sum + (p.monthly_cost || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MOOC Platform Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage connections to MOOC providers and monitor platform integrations.
          </p>
        </div>
        <Button onClick={handleAddPlatform}>
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
            <div className="text-2xl font-bold">{connectedPlatforms}</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Organization-wide</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current spend</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{platform.name}</h3>
                    <Badge variant={platform.is_connected ? "default" : "secondary"}>
                      {platform.is_connected ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {platform.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>{platform.total_courses?.toLocaleString() || 0} courses</span>
                    <span>{platform.active_enrollments || 0} enrollments</span>
                    <span>Last sync: {platform.last_sync_at ? new Date(platform.last_sync_at).toLocaleString() : 'Never'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {platform.is_connected && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSync(platform.id, platform.name)}
                    disabled={syncing === platform.id}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {syncing === platform.id ? 'Syncing...' : 'Sync Now'}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleConfigure(platform.id, platform.name)}
                >
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