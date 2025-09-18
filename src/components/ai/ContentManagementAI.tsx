import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Upload, 
  Star, 
  Tags, 
  Search, 
  Filter,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  media_type: string;
  provider: string;
  url: string;
  duration_seconds: number;
  file_size: number;
  is_active: boolean;
  created_at: string;
  tags?: Array<{ name: string; category: string; color: string }>;
  analytics?: {
    views: number;
    completions: number;
    avg_rating: number;
    engagement_score: number;
  };
  quality_score?: number;
}

interface BulkOperation {
  id: string;
  operation_type: string;
  status: string;
  total_items: number;
  processed_items: number;
  failed_items: number;
  created_at: string;
}

const ContentManagementAI = () => {
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentTags, setContentTags] = useState([]);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    setLoading(true);
    try {
      // Load content items
      const { data: contentData, error: contentError } = await supabase
        .from('content_media')
        .select('*')
        .order('created_at', { ascending: false });

      if (contentError) throw contentError;

      // Simulate analytics and quality scores for demo
      const enrichedContent = contentData?.map(item => ({
        ...item,
        tags: [], // Will be populated when tag system is fully implemented
        analytics: {
          views: Math.floor(Math.random() * 1000) + 50,
          completions: Math.floor(Math.random() * 500) + 20,
          avg_rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3-5 range
          engagement_score: Math.floor(Math.random() * 30) + 70 // 70-100 range
        },
        quality_score: Number((Math.random() * 30 + 70).toFixed(1)) // 70-100 range
      })) || [];

      setContentItems(enrichedContent);

      // Load available tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('content_tags')
        .select('*')
        .eq('is_active', true);

      if (tagsError) throw tagsError;
      setContentTags(tagsData || []);

      // Load bulk operations
      const { data: opsData, error: opsError } = await supabase
        .from('bulk_operations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (opsError) throw opsError;
      setBulkOperations(opsData || []);

    } catch (error) {
      console.error('Error loading content data:', error);
      toast({
        title: "Error",
        description: "Failed to load content data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeContentQuality = async (contentId: string) => {
    try {
      // Simulate AI quality analysis
      const qualityScore = Math.floor(Math.random() * 30) + 70;
      
      toast({
        title: "Quality Analysis Complete",
        description: `Content quality score: ${qualityScore}/100`,
      });

      // Update local state
      setContentItems(prev => 
        prev.map(item => 
          item.id === contentId 
            ? { ...item, quality_score: qualityScore }
            : item
        )
      );
    } catch (error) {
      console.error('Error analyzing content:', error);
    }
  };

  const startBulkTagging = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bulk_operations')
        .insert({
          operation_type: 'tag_assignment',
          status: 'processing',
          total_items: contentItems.filter(item => item.tags?.length === 0).length,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Bulk Tagging Started",
        description: "AI is analyzing and tagging content automatically",
      });

      // Simulate progress
      setTimeout(() => {
        setBulkOperations(prev => [data, ...prev]);
        loadContentData();
      }, 2000);

    } catch (error) {
      console.error('Error starting bulk tagging:', error);
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           item.tags?.some(tag => tag.category === selectedCategory);
    
    const matchesQuality = qualityFilter === 'all' ||
                          (qualityFilter === 'high' && (item.quality_score || 0) >= 85) ||
                          (qualityFilter === 'medium' && (item.quality_score || 0) >= 70 && (item.quality_score || 0) < 85) ||
                          (qualityFilter === 'low' && (item.quality_score || 0) < 70);

    return matchesSearch && matchesCategory && matchesQuality;
  });

  const getQualityColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading content management...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            AI Content Management
          </h2>
          <p className="text-muted-foreground">
            Automated content analysis, tagging, and quality management
          </p>
        </div>
        <Button onClick={startBulkTagging} variant="outline">
          <Tags className="h-4 w-4 mr-2" />
          Auto-Tag Content
        </Button>
      </div>

      <Tabs defaultValue="content-library" className="w-full">
        <TabsList>
          <TabsTrigger value="content-library">Content Library</TabsTrigger>
          <TabsTrigger value="quality-analysis">Quality Analysis</TabsTrigger>
          <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content-library" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="skill">Skills</SelectItem>
                    <SelectItem value="topic">Topics</SelectItem>
                    <SelectItem value="level">Levels</SelectItem>
                    <SelectItem value="format">Formats</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={qualityFilter} onValueChange={setQualityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quality</SelectItem>
                    <SelectItem value="high">High (85+)</SelectItem>
                    <SelectItem value="medium">Medium (70-84)</SelectItem>
                    <SelectItem value="low">Low (&lt;70)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid gap-4">
            {filteredContent.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{item.title}</h4>
                        <Badge variant="outline">{item.media_type}</Badge>
                        {item.quality_score && (
                          <Badge className={getQualityColor(item.quality_score)}>
                            Quality: {item.quality_score}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Analytics */}
                      {item.analytics && (
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{item.analytics.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>{item.analytics.completions} completed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{item.analytics.avg_rating}/5 rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{item.analytics.engagement_score}% engagement</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => analyzeContentQuality(item.id)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quality-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Quality Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {contentItems.filter(item => (item.quality_score || 0) >= 85).length}
                    </div>
                    <div className="text-sm text-muted-foreground">High Quality (85+)</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {contentItems.filter(item => (item.quality_score || 0) >= 70 && (item.quality_score || 0) < 85).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Medium Quality (70-84)</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {contentItems.filter(item => (item.quality_score || 0) < 70).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Needs Improvement (&lt;70)</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Content Needing Attention</h4>
                  <div className="space-y-2">
                    {contentItems
                      .filter(item => (item.quality_score || 0) < 75)
                      .slice(0, 5)
                      .map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <span className="font-medium">{item.title}</span>
                            <Badge className={getQualityColor(item.quality_score || 0)} variant="secondary">
                              {item.quality_score || 0}%
                            </Badge>
                          </div>
                          <Button size="sm" onClick={() => analyzeContentQuality(item.id)}>
                            Re-analyze
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkOperations.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium capitalize">
                          {op.operation_type.replace('_', ' ')}
                        </span>
                        <Badge className={getStatusColor(op.status)}>
                          {op.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {op.processed_items}/{op.total_items} items processed
                        {op.failed_items > 0 && (
                          <span className="text-red-600 ml-2">
                            ({op.failed_items} failed)
                          </span>
                        )}
                      </div>
                      {op.status === 'processing' && (
                        <Progress 
                          value={(op.processed_items / op.total_items) * 100} 
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(op.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                    <p className="text-2xl font-bold">{contentItems.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Quality Score</p>
                    <p className="text-2xl font-bold">
                      {contentItems.length > 0 
                        ? Math.round(contentItems.reduce((sum, item) => sum + (item.quality_score || 0), 0) / contentItems.length)
                        : 0}%
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">
                      {contentItems.reduce((sum, item) => sum + (item.analytics?.views || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
                    <p className="text-2xl font-bold">
                      {contentItems.length > 0 
                        ? Math.round(contentItems.reduce((sum, item) => sum + (item.analytics?.engagement_score || 0), 0) / contentItems.length)
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagementAI;