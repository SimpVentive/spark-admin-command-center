import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Building2, Users, UserCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface OrgUnit {
  id: string;
  name: string;
  level: 'organization' | 'department' | 'sub-department' | 'team';
  parentId?: string;
  children?: OrgUnit[];
  isComplete: boolean;
  subUnitsCount: number;
}

interface OrgTreeSidebarProps {
  orgData: OrgUnit[];
  currentUnitId: string;
  onSelectUnit: (unitId: string) => void;
  onAddSubUnit: (parentId: string) => void;
  className?: string;
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'organization':
      return <Building2 className="h-4 w-4" />;
    case 'department':
      return <Users className="h-4 w-4" />;
    case 'sub-department':
      return <Users className="h-3 w-3" />;
    case 'team':
      return <UserCheck className="h-3 w-3" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'organization':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'department':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'sub-department':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'team':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-muted-foreground bg-muted border-border';
  }
};

interface TreeNodeProps {
  unit: OrgUnit;
  currentUnitId: string;
  onSelectUnit: (unitId: string) => void;
  onAddSubUnit: (parentId: string) => void;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  unit, 
  currentUnitId, 
  onSelectUnit, 
  onAddSubUnit, 
  level 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = unit.children && unit.children.length > 0;
  const isSelected = unit.id === currentUnitId;

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors group",
          isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
          getLevelColor(unit.level)
        )}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={() => onSelectUnit(unit.id)}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        ) : (
          <div className="h-4 w-4" />
        )}

        {getLevelIcon(unit.level)}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">{unit.name}</span>
            <div className="flex items-center gap-1">
              {unit.subUnitsCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {unit.subUnitsCount}
                </span>
              )}
              <div 
                className={cn(
                  "h-2 w-2 rounded-full",
                  unit.isComplete ? "bg-green-500" : "bg-yellow-500"
                )}
              />
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onAddSubUnit(unit.id);
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {unit.children!.map((child) => (
            <TreeNode
              key={child.id}
              unit={child}
              currentUnitId={currentUnitId}
              onSelectUnit={onSelectUnit}
              onAddSubUnit={onAddSubUnit}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OrgTreeSidebar: React.FC<OrgTreeSidebarProps> = ({
  orgData,
  currentUnitId,
  onSelectUnit,
  onAddSubUnit,
  className
}) => {
  return (
    <div className={cn("w-80 bg-card border-r p-4 space-y-2", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Organization Tree</h3>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground mr-2">Complete</span>
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="text-xs text-muted-foreground">Incomplete</span>
        </div>
      </div>

      <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
        {orgData.map((unit) => (
          <TreeNode
            key={unit.id}
            unit={unit}
            currentUnitId={currentUnitId}
            onSelectUnit={onSelectUnit}
            onAddSubUnit={onAddSubUnit}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

export default OrgTreeSidebar;