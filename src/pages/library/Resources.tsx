import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Video, Download } from "lucide-react";
import { useLibrary } from "@/contexts/LibraryContext";
import { useToast } from "@/hooks/use-toast";

const Resources = () => {
  const { state } = useLibrary();
  const { toast } = useToast();

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'eBook':
        return <BookOpen className="h-6 w-6" />;
      case 'Article':
        return <FileText className="h-6 w-6" />;
      case 'Video':
        return <Video className="h-6 w-6" />;
      case 'Document':
        return <Download className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getResourceBadgeColor = (type: string) => {
    switch (type) {
      case 'eBook':
        return 'bg-blue-100 text-blue-800';
      case 'Article':
        return 'bg-green-100 text-green-800';
      case 'Video':
        return 'bg-purple-100 text-purple-800';
      case 'Document':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewResource = (resource: any) => {
    toast({
      title: "Viewing Resource",
      description: `Opening ${resource.title}...`,
    });
    console.log('Viewing resource:', resource);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resources</h1>
        <p className="text-muted-foreground">Access digital learning resources and materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {state.resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getResourceIcon(resource.type)}
                </div>
                <Badge className={getResourceBadgeColor(resource.type)}>
                  {resource.type}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {resource.description}
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleViewResource(resource)}
              >
                View Resource
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {state.resources.filter(r => r.type === 'eBook').length}
              </div>
              <div className="text-sm text-muted-foreground">eBooks</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {state.resources.filter(r => r.type === 'Article').length}
              </div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {state.resources.filter(r => r.type === 'Video').length}
              </div>
              <div className="text-sm text-muted-foreground">Videos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {state.resources.filter(r => r.type === 'Document').length}
              </div>
              <div className="text-sm text-muted-foreground">Documents</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;