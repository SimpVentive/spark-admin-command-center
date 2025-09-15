import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Video, Download, Plus, Settings, Search, Headphones, Monitor } from "lucide-react";
import { useLibrary } from "@/hooks/useLibrary";

import AddResourceDialog from "@/components/library/AddResourceDialog";

const Resources = () => {
  const { resources, loading } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const resourceTypes = ['eBook', 'Article', 'Video', 'Document', 'Audio', 'Software'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !typeFilter || resource.resource_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="h-4 w-4" />;
      case 'eBook':
        return <BookOpen className="h-4 w-4" />;
      case 'Article':
        return <FileText className="h-4 w-4" />;
      case 'Audio':
        return <Headphones className="h-4 w-4" />;
      case 'Software':
        return <Monitor className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Video': 'bg-red-100 text-red-800',
      'eBook': 'bg-blue-100 text-blue-800',
      'Article': 'bg-green-100 text-green-800',
      'Audio': 'bg-purple-100 text-purple-800',
      'Software': 'bg-orange-100 text-orange-800',
      'Document': 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Digital Resources</h1>
          <p className="text-muted-foreground">Browse and manage digital learning resources</p>
        </div>
        <AddResourceDialog />
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {(searchTerm || typeFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter 
                ? "Try adjusting your search criteria"
                : "Start building your digital library by adding some resources"
              }
            </p>
            <AddResourceDialog 
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Resource
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getResourceIcon(resource.resource_type)}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight truncate">{resource.title}</CardTitle>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {resource.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {getTypeBadge(resource.resource_type)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    {resource.url ? (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        Access Resource
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        No Link Available
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Added: {new Date(resource.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{resources.length}</div>
              <div className="text-sm text-muted-foreground">Total Resources</div>
            </div>
            {resourceTypes.map(type => (
              <div key={type} className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {resources.filter(r => r.resource_type === type).length}
                </div>
                <div className="text-sm text-muted-foreground">{type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;