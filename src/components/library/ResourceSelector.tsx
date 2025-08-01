import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, FileText, Video, Download, Plus, Trash2, Search } from "lucide-react";
import { useLibrary, Resource } from "@/contexts/LibraryContext";

interface ResourceSelectorProps {
  selectedResources: string[];
  onResourcesChange: (resources: string[]) => void;
}

const ResourceSelector: React.FC<ResourceSelectorProps> = ({ 
  selectedResources, 
  onResourcesChange 
}) => {
  const { state } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllResources, setShowAllResources] = useState(false);

  const filteredResources = state.resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'eBook':
        return <BookOpen className="h-4 w-4" />;
      case 'Article':
        return <FileText className="h-4 w-4" />;
      case 'Video':
        return <Video className="h-4 w-4" />;
      case 'Document':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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

  const handleResourceToggle = (resourceId: string) => {
    const updatedResources = selectedResources.includes(resourceId)
      ? selectedResources.filter(id => id !== resourceId)
      : [...selectedResources, resourceId];
    onResourcesChange(updatedResources);
  };

  const removeResource = (resourceId: string) => {
    onResourcesChange(selectedResources.filter(id => id !== resourceId));
  };

  const selectedResourceDetails = selectedResources.map(id => 
    state.resources.find(r => r.id === id)
  ).filter(Boolean) as Resource[];

  return (
    <div className="space-y-4">
      {/* Selected Resources Display */}
      {selectedResources.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Library Resources ({selectedResources.length})</Label>
          <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
            {selectedResourceDetails.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-2 bg-background rounded border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{resource.title}</div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getResourceBadgeColor(resource.type)}`}>
                        {resource.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {resource.description.substring(0, 50)}...
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeResource(resource.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resource Browser */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Link Library Resources</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAllResources(!showAllResources)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showAllResources ? 'Hide Resources' : 'Browse Resources'}
          </Button>
        </div>

        {showAllResources && (
          <div className="border rounded-lg p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Resources List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredResources.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {searchTerm ? 'No resources found matching your search.' : 'No resources available.'}
                </p>
              ) : (
                filteredResources.map((resource) => (
                  <div key={resource.id} className="flex items-center space-x-3 p-2 border rounded hover:bg-accent/50">
                    <Checkbox
                      checked={selectedResources.includes(resource.id)}
                      onCheckedChange={() => handleResourceToggle(resource.id)}
                    />
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{resource.title}</span>
                        <Badge className={`text-xs ${getResourceBadgeColor(resource.type)}`}>
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedResources.length > 0 && (
        <div className="text-sm text-muted-foreground">
          💡 These resources will be recommended to learners as supplementary materials for this program.
        </div>
      )}
    </div>
  );
};

export default ResourceSelector;