import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Users, ChevronRight, Building2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

import OrgUnitCard, { OrgUnitCardData } from './OrgUnitCard';
import OrgUnitModal, { OrgUnitFormData } from './OrgUnitModal';

interface OrgStructureBuilderProps {
  onAddPeople?: (unitId: string) => void;
}

const OrgStructureBuilder: React.FC<OrgStructureBuilderProps> = ({ onAddPeople }) => {
  const { toast } = useToast();
  
  // Sample data - in real app this would come from props or context
  const [orgUnits, setOrgUnits] = useState<OrgUnitCardData[]>([
    {
      id: '1',
      title: 'Executive Office',
      description: 'Top-level executive leadership and strategic direction',
      level: 'organization',
      subUnitsCount: 3,
      isComplete: false,
      peopleCount: 5
    },
    {
      id: '2',
      title: 'Engineering Department',
      description: 'Product development and technical innovation',
      level: 'department',
      parentId: '1',
      subUnitsCount: 2,
      isComplete: true,
      peopleCount: 25
    },
    {
      id: '3',
      title: 'Sales Department',
      description: 'Revenue generation and customer acquisition',
      level: 'department',
      parentId: '1',
      subUnitsCount: 1,
      isComplete: false,
      peopleCount: 15
    },
    {
      id: '4',
      title: 'Frontend Team',
      description: 'User interface and experience development',
      level: 'team',
      parentId: '2',
      subUnitsCount: 0,
      isComplete: true,
      peopleCount: 8
    },
  ]);

  const [currentUnitId, setCurrentUnitId] = useState('1');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrgUnitFormData | null>(null);

  // Get breadcrumb path
  const getBreadcrumbPath = (unitId: string) => {
    const path: { id: string; name: string; level: string }[] = [];
    let currentId = unitId;
    
    while (currentId) {
      const unit = orgUnits.find(u => u.id === currentId);
      if (unit) {
        path.unshift({
          id: unit.id,
          name: unit.title,
          level: unit.level
        });
        currentId = unit.parentId || '';
      } else {
        break;
      }
    }
    
    return path;
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'organization':
        return <Building2 className="h-4 w-4" />;
      case 'department':
        return <Users className="h-4 w-4" />;
      case 'sub-department':
        return <Users className="h-3 w-3" />;
      case 'team':
        return <Users className="h-3 w-3" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const currentUnit = orgUnits.find(unit => unit.id === currentUnitId);
  const currentLevelUnits = orgUnits.filter(unit => unit.parentId === currentUnitId);
  const breadcrumbPath = getBreadcrumbPath(currentUnitId);
  const progress = Math.round((orgUnits.filter(u => u.isComplete).length / orgUnits.length) * 100);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setOrgUnits((units) => {
        const activeIndex = units.findIndex((unit) => unit.id === active.id);
        const overIndex = units.findIndex((unit) => unit.id === over.id);
        
        return arrayMove(units, activeIndex, overIndex);
      });
      
      toast({
        title: "Reordered",
        description: "Unit order updated successfully"
      });
    }
    
    setActiveId(null);
  };

  const handleAddUnit = useCallback(() => {
    setEditingUnit(null);
    setIsModalOpen(true);
  }, []);

  const handleEditUnit = useCallback((unit: OrgUnitCardData) => {
    setEditingUnit({
      id: unit.id,
      name: unit.title,
      description: unit.description || '',
      level: unit.level,
      parentId: unit.parentId
    });
    setIsModalOpen(true);
  }, []);

  const handleSaveUnit = useCallback((formData: OrgUnitFormData) => {
    if (formData.id) {
      setOrgUnits(prev => prev.map(unit => 
        unit.id === formData.id 
          ? { ...unit, title: formData.name, description: formData.description, level: formData.level }
          : unit
      ));
    } else {
      const newUnit: OrgUnitCardData = {
        id: Date.now().toString(),
        title: formData.name,
        description: formData.description,
        level: formData.level,
        parentId: formData.parentId || currentUnitId,
        subUnitsCount: 0,
        isComplete: false,
        peopleCount: 0
      };
      setOrgUnits(prev => [...prev, newUnit]);
    }
    
    if (!editingUnit) {
      setIsModalOpen(false);
    }
  }, [currentUnitId, editingUnit]);

  const handleDeleteUnit = useCallback((id: string) => {
    setOrgUnits(prev => prev.filter(unit => unit.id !== id));
    toast({
      title: "Deleted",
      description: "Unit deleted successfully"
    });
  }, [toast]);

  const handleUpdateTitle = useCallback((id: string, title: string) => {
    setOrgUnits(prev => prev.map(unit => 
      unit.id === id ? { ...unit, title } : unit
    ));
  }, []);

  const handleAddPeople = useCallback((unitId: string) => {
    if (onAddPeople) {
      onAddPeople(unitId);
    } else {
      toast({
        title: "Add People",
        description: `Adding people to unit ${unitId}`
      });
    }
  }, [onAddPeople, toast]);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Organizational structure is being exported..."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Organization Structure</h1>
              <p className="text-muted-foreground">Build your organizational hierarchy and structure</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setCurrentUnitId('1')} className="gap-2">
                <Users className="h-4 w-4" />
                Phase 2: People
              </Button>
              <Button variant="outline" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Phase 1: Structure
            </Badge>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Completion Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between bg-muted/30 px-4 py-4 rounded-lg border">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbPath.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <BreadcrumbItem>
                      {index === breadcrumbPath.length - 1 ? (
                        <BreadcrumbPage className="flex items-center gap-2 font-medium text-lg">
                          {getLevelIcon(item.level)}
                          <span>{item.name}</span>
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink 
                          onClick={() => setCurrentUnitId(item.id)}
                          className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors text-base"
                        >
                          {getLevelIcon(item.level)}
                          <span>{item.name}</span>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbPath.length - 1 && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <Button onClick={handleAddUnit} size="lg" className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Sub-Unit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {currentUnit ? `${currentUnit.title} - Sub Units` : 'Organization Units'}
          </h2>
          <p className="text-muted-foreground">
            {currentLevelUnits.length} units at this level
          </p>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={currentLevelUnits.map(u => u.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {currentLevelUnits.map((unit) => (
                <OrgUnitCard
                  key={unit.id}
                  unit={unit}
                  onEdit={handleEditUnit}
                  onDelete={handleDeleteUnit}
                  onAddSubUnit={() => {
                    setCurrentUnitId(unit.id);
                    handleAddUnit();
                  }}
                  onAddPeople={handleAddPeople}
                  onUpdateTitle={handleUpdateTitle}
                  hasChildren={orgUnits.some(u => u.parentId === unit.id)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="opacity-90">
                <div className="bg-card border rounded-lg p-4 shadow-lg">
                  <div className="font-semibold">
                    {orgUnits.find(u => u.id === activeId)?.title}
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {currentLevelUnits.length === 0 && (
          <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-medium mb-2">No units at this level yet</div>
            <p className="text-muted-foreground mb-4">
              Start building your organizational structure by adding the first unit
            </p>
            <Button onClick={handleAddUnit} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add First Unit
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <OrgUnitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUnit}
        editingUnit={editingUnit}
        parentUnit={currentUnit ? {
          id: currentUnit.id,
          name: currentUnit.title,
          level: currentUnit.level
        } : undefined}
        breadcrumbPath={breadcrumbPath}
      />
    </div>
  );
};

export default OrgStructureBuilder;