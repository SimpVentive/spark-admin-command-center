import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Building2, 
  Users, 
  UserCheck, 
  Edit, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface OrgUnitCardData {
  id: string;
  title: string;
  description?: string;
  level: 'organization' | 'department' | 'sub-department' | 'team';
  parentId?: string;
  subUnitsCount: number;
  isComplete: boolean;
  peopleCount: number;
}

interface OrgUnitCardProps {
  unit: OrgUnitCardData;
  onEdit: (unit: OrgUnitCardData) => void;
  onDelete: (id: string) => void;
  onAddSubUnit: (parentId: string) => void;
  onAddPeople: (unitId: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
  hasChildren?: boolean;
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'organization':
      return <Building2 className="h-5 w-5" />;
    case 'department':
      return <Users className="h-5 w-5" />;
    case 'sub-department':
      return <Users className="h-4 w-4" />;
    case 'team':
      return <UserCheck className="h-4 w-4" />;
    default:
      return <Building2 className="h-5 w-5" />;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'organization':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'department':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'sub-department':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'team':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getLevelName = (level: string) => {
  switch (level) {
    case 'organization':
      return 'Organization';
    case 'department':
      return 'Department';
    case 'sub-department':
      return 'Sub-Department';
    case 'team':
      return 'Team';
    default:
      return 'Unit';
  }
};

const OrgUnitCard: React.FC<OrgUnitCardProps> = ({
  unit,
  onEdit,
  onDelete,
  onAddSubUnit,
  onAddPeople,
  onUpdateTitle,
  isExpanded = false,
  onToggleExpand,
  hasChildren = false
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(unit.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: unit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== unit.title) {
      onUpdateTitle(unit.id, editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditTitle(unit.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
      <Card className="mb-4 hover:shadow-md transition-shadow group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <div 
              className="flex flex-col items-center gap-1 pt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Expand/Collapse */}
            {hasChildren && onToggleExpand && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 mt-1"
                onClick={() => onToggleExpand(unit.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Icon */}
            <div className={cn("p-2 rounded-lg", getLevelColor(unit.level))}>
              {getLevelIcon(unit.level)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  {isEditingTitle ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={handleSaveTitle}
                      onKeyDown={handleKeyPress}
                      className="h-8 font-semibold"
                      autoFocus
                    />
                  ) : (
                    <h3 
                      className="text-lg font-semibold truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      {unit.title}
                    </h3>
                  )}

                  {/* Description */}
                  {unit.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {unit.description}
                    </p>
                  )}

                  {/* Level Badge */}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getLevelColor(unit.level))}
                    >
                      {getLevelName(unit.level)}
                    </Badge>

                    {/* Status */}
                    <div className="flex items-center gap-1">
                      <div 
                        className={cn(
                          "h-2 w-2 rounded-full",
                          unit.isComplete ? "bg-green-500" : "bg-yellow-500"
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {unit.isComplete ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                  </div>

                  {/* Counters */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    {unit.subUnitsCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{unit.subUnitsCount} sub-units</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{unit.peopleCount} people</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddPeople(unit.id)}
                    className="gap-1"
                  >
                    <User className="h-3 w-3" />
                    Add People
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddSubUnit(unit.id)}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Sub-unit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(unit)}
                    className="gap-1"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(unit.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgUnitCard;