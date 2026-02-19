import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Upload, Video, FileText, Presentation, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  file_format: string | null;
  file_size: number | null;
  duration_seconds: number | null;
  page_count: number | null;
  slide_count: number | null;
  created_at: string;
  category?: { name: string } | null;
}

const ContentLibrary = () => {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('content_items')
        .select('*, category:content_categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setContentItems(data || []);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-6 w-6" />;
      case "presentation": return <Presentation className="h-6 w-6" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "presentation": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "document": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = contentItems.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Library</h1>
          <p className="text-muted-foreground">Manage and organize all your learning content</p>
        </div>
        <Button onClick={() => navigate('/content/upload')}><Upload className="h-4 w-4 mr-2" />Upload Content</Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search content..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No content found. Upload your first content item.</CardContent></Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getContentIcon(item.content_type)}
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <Badge className={getTypeBadgeColor(item.content_type)}>{item.file_format || item.content_type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Size: {formatSize(item.file_size)}</div>
                  <div>Category: {(item as any).category?.name || 'Uncategorized'}</div>
                  {item.duration_seconds && <div>Duration: {Math.floor(item.duration_seconds / 60)}:{(item.duration_seconds % 60).toString().padStart(2, '0')}</div>}
                  {item.slide_count && <div>Slides: {item.slide_count}</div>}
                  {item.page_count && <div>Pages: {item.page_count}</div>}
                  <div>Uploaded: {new Date(item.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">View</Button>
                  <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
