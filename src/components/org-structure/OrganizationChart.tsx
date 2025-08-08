import React, { useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Edge,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Crown,
  ArrowLeft,
  Download,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface OrgUnit {
  id: string;
  name: string;
  level: string;
  parent_id: string | null;
  manager_name: string;
  employee_count: number;
  description: string;
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'organization':
      return <Building2 className="h-4 w-4" />;
    case 'department':
      return <Users className="h-4 w-4" />;
    case 'team':
      return <UserCheck className="h-4 w-4" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'organization':
      return 'bg-primary text-primary-foreground';
    case 'department':
      return 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100';
    case 'team':
      return 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100';
    default:
      return 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
  }
};

// Custom node component
const OrgNode = ({ data }: { data: OrgUnit }) => {
  return (
    <Card className="w-64 shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getLevelIcon(data.level)}
            <Badge variant="secondary" className={getLevelColor(data.level)}>
              {data.level.charAt(0).toUpperCase() + data.level.slice(1)}
            </Badge>
          </div>
          {data.level === 'organization' && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-1 text-foreground">
          {data.name}
        </h3>
        
        <div className="text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>Manager: {data.manager_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            <span>{data.employee_count} employees</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {data.description}
        </p>
      </CardContent>
    </Card>
  );
};

const nodeTypes = {
  orgUnit: OrgNode,
};

export const OrganizationChart: React.FC = () => {
  const navigate = useNavigate();

  // Fetch organizational units from database
  const { data: orgUnits = [], isLoading, error } = useQuery({
    queryKey: ['organizational-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizational_units')
        .select('*')
        .eq('is_active', true)
        .order('level', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as OrgUnit[];
    },
  });

  // Set up real-time subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('org-units-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organizational_units'
        },
        () => {
          // Refetch data when changes occur
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Calculate positions for hierarchical layout
    const levels: { [key: string]: OrgUnit[] } = {};
    
    // Group by level and parent
    orgUnits.forEach(unit => {
      if (!levels[unit.level]) {
        levels[unit.level] = [];
      }
      levels[unit.level].push(unit);
    });
    
    // Position nodes
    let yOffset = 0;
    const levelOrder = ['organization', 'department', 'sub-department', 'team'];
    
    levelOrder.forEach(levelName => {
      if (levels[levelName]) {
        const unitsInLevel = levels[levelName];
        const nodeWidth = 280; // Card width + margin
        const totalWidth = unitsInLevel.length * nodeWidth;
        const startX = -totalWidth / 2;
        
        unitsInLevel.forEach((unit, index) => {
          nodes.push({
            id: unit.id,
            type: 'orgUnit',
            position: { 
              x: startX + (index * nodeWidth), 
              y: yOffset 
            },
            data: unit as any,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
          });
        });
        
        yOffset += 200; // Vertical spacing between levels
      }
    });
    
    // Create edges
    orgUnits.forEach(unit => {
      if (unit.parent_id) {
        edges.push({
          id: `e-${unit.parent_id}-${unit.id}`,
          source: unit.parent_id,
          target: unit.id,
          type: 'smoothstep',
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#6366f1',
          },
          style: {
            strokeWidth: 2,
            stroke: '#6366f1',
          },
        });
      }
    });
    
    return { nodes, edges };
  }, [orgUnits]);

  const handleBackToBuilder = () => {
    navigate('/organization/hierarchy');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading organization chart...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading organization chart</h2>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={handleBackToBuilder}>
            Back to Builder
          </Button>
        </div>
      </div>
    );
  }

  if (!orgUnits.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No organizational units found</h2>
          <p className="text-muted-foreground mb-4">Start building your organization structure first</p>
          <Button onClick={handleBackToBuilder}>
            Go to Hierarchy Builder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBackToBuilder}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Builder
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Organization Chart</h1>
              <p className="text-muted-foreground">Visual representation of organizational structure</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => console.log('Export functionality coming soon')}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>
      
      {/* Organization Chart */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 50,
            includeHiddenNodes: false,
          }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          className="bg-background"
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Controls 
            className="bg-card border border-border rounded-lg shadow-lg"
            showZoom={true}
            showFitView={true}
            showInteractive={false}
          />
          <Background 
            gap={20} 
            size={1}
            className="opacity-30"
          />
        </ReactFlow>
      </div>
      
      {/* Legend */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span>Organization</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span>Department</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>Team</span>
          </div>
        </div>
      </div>
    </div>
  );
};