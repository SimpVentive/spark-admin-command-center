import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Upload, Video, FileText, Presentation } from "lucide-react";

const ContentLibrary = () => {
  const contentItems = [
    {
      id: 1,
      title: "Leadership Training Video",
      type: "video",
      format: "MP4",
      size: "45.2 MB",
      duration: "12:30",
      uploadDate: "2024-01-15",
      category: "Leadership"
    },
    {
      id: 2,
      title: "Safety Procedures Presentation",
      type: "presentation",
      format: "PPTX",
      size: "8.7 MB",
      slides: 24,
      uploadDate: "2024-01-10",
      category: "Safety"
    },
    {
      id: 3,
      title: "Employee Handbook",
      type: "document",
      format: "PDF",
      size: "2.1 MB",
      pages: 45,
      uploadDate: "2024-01-05",
      category: "HR"
    }
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-6 w-6" />;
      case "presentation":
        return <Presentation className="h-6 w-6" />;
      case "document":
        return <FileText className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "presentation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "document":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Library</h1>
          <p className="text-muted-foreground">Manage and organize all your learning content</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Content
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search content..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contentItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getContentIcon(item.type)}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <Badge className={getTypeBadgeColor(item.type)}>
                  {item.format}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Size: {item.size}</div>
                <div>Category: {item.category}</div>
                {item.duration && <div>Duration: {item.duration}</div>}
                {item.slides && <div>Slides: {item.slides}</div>}
                {item.pages && <div>Pages: {item.pages}</div>}
                <div>Uploaded: {item.uploadDate}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentLibrary;