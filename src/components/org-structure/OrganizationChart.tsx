import React, { useMemo } from 'react';
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
  ZoomIn,
  ZoomOut,
  Maximize
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample organizational data - this would come from your database
const orgUnits = [
  {
    id: '1',
    name: 'Executive Office',
    level: 'organization',
    parentId: null,
    manager: 'CEO',
    employeeCount: 5,
    description: 'Executive leadership team'
  },
  {
    id: '2',
    name: 'Engineering Department',
    level: 'department',
    parentId: '1',
    manager: 'John Smith',
    employeeCount: 25,
    description: 'Product development and engineering'
  },
  {
    id: '3',
    name: 'Frontend Team',
    level: 'team',
    parentId: '2',
    manager: 'Sarah Johnson',
    employeeCount: 8,
    description: 'UI/UX and frontend development'
  },
  {
    id: '4',
    name: 'Backend Team',
    level: 'team',
    parentId: '2',
    manager: 'Mike Chen',
    employeeCount: 12,
    description: 'Backend services and APIs'
  },
  {
    id: '5',
    name: 'Marketing Department',
    level: 'department',
    parentId: '1',
    manager: 'Lisa Wang',
    employeeCount: 15,
    description: 'Marketing and communications'
  },
  {
    id: '6',
    name: 'Digital Marketing',
    level: 'team',
    parentId: '5',
    manager: 'Alex Rodriguez',
    employeeCount: 7,
    description: 'Online marketing and social media'
  },
  {
    id: '7',
    name: 'Content Team',
    level: 'team',
    parentId: '5',
    manager: 'Emma Davis',
    employeeCount: 5,
    description: 'Content creation and strategy'
  }
];

interface OrgUnit {
  id: string;
  name: string;
  level: string;
  parentId: string | null;
  manager: string;
  employeeCount: number;
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
            <span>Manager: {data.manager}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            <span>{data.employeeCount} employees</span>
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
      if (unit.parentId) {
        edges.push({
          id: `e-${unit.parentId}-${unit.id}`,
          source: unit.parentId,
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
  }, []);

  const handleExport = () => {
    // This would implement actual export functionality
    console.log('Exporting organization chart...');
  };

  const handleBackToBuilder = () => {
    navigate('/organization/hierarchy');
  };

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
            <Button variant="outline" size="sm" onClick={handleExport}>
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