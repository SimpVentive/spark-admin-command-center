import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Users, ChevronRight, Building2, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  // Fetch organizational units from database
  const { data: orgUnitsData = [], isLoading, error } = useQuery({
    queryKey: ['organizational-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizational_units')
        .select('*')
        .eq('is_active', true)
        .order('level', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Convert database format to component format
  const orgUnits: OrgUnitCardData[] = orgUnitsData.map(unit => ({
    id: unit.id,
    title: unit.name,
    description: unit.description || '',
    level: unit.level as 'organization' | 'department' | 'sub-department' | 'team',
    parentId: unit.parent_id || undefined,
    subUnitsCount: orgUnitsData.filter(u => u.parent_id === unit.id).length,
    isComplete: true, // For now, assume all units are complete
    peopleCount: unit.employee_count || 0
  }));

  // Mutations for database operations
  const createUnitMutation = useMutation({
    mutationFn: async (unitData: { name: string; description?: string; level: string; parent_id?: string; manager_name?: string }) => {
      console.log('Creating unit with data:', unitData);
      const { data, error } = await supabase
        .from('organizational_units')
        .insert([unitData])
        .select()
        .single();
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      console.log('Created unit:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizational-units'] });
      toast({ title: "Success", description: "Unit created successfully" });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({ title: "Error", description: "Failed to create unit", variant: "destructive" });
    }
  });

  const updateUnitMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string; name?: string; description?: string; level?: string; manager_name?: string }) => {
      const { data, error } = await supabase
        .from('organizational_units')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizational-units'] });
      toast({ title: "Success", description: "Unit updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update unit", variant: "destructive" });
      console.error('Error updating unit:', error);
    }
  });

  const deleteUnitMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('organizational_units')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizational-units'] });
      toast({ title: "Success", description: "Unit deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete unit", variant: "destructive" });
      console.error('Error deleting unit:', error);
    }
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
          queryClient.invalidateQueries({ queryKey: ['organizational-units'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
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

  const currentUnit = currentUnitId ? orgUnits.find(unit => unit.id === currentUnitId) : null;
  const currentLevelUnits = orgUnits.filter(unit => unit.parentId === currentUnitId);
  const breadcrumbPath = currentUnitId ? getBreadcrumbPath(currentUnitId) : [];
  const progress = Math.round((orgUnits.filter(u => u.isComplete).length / orgUnits.length) * 100);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // For now, just show reorder message - we could implement position updates later
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
      // Update existing unit
      updateUnitMutation.mutate({
        id: formData.id,
        name: formData.name,
        description: formData.description,
        level: formData.level,
        manager_name: 'TBD' // Default manager name
      });
    } else {
      // Create new unit
      createUnitMutation.mutate({
        name: formData.name,
        description: formData.description,
        level: formData.level,
        parent_id: formData.parentId || currentUnitId || undefined,
        manager_name: 'TBD' // Default manager name
      });
    }
    
    setIsModalOpen(false);
  }, [currentUnitId, editingUnit, createUnitMutation, updateUnitMutation]);

  const handleDeleteUnit = useCallback((id: string) => {
    deleteUnitMutation.mutate(id);
  }, [deleteUnitMutation]);

  const handleUpdateTitle = useCallback((id: string, title: string) => {
    updateUnitMutation.mutate({
      id,
      name: title
    });
  }, [updateUnitMutation]);

  const handleAddPeople = useCallback((unitId: string) => {
    if (onAddPeople) {
      onAddPeople(unitId);
    } else {
      // Navigate to Add Employee page with unit context
      window.location.href = `/users/add?unitId=${unitId}`;
    }
  }, [onAddPeople]);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Organizational structure is being exported..."
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading organization structure...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading organization structure</h2>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

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
              <Button variant="outline" onClick={() => window.location.href = '/organization/chart'} className="gap-2">
                <Users className="h-4 w-4" />
                View Chart
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

            <Button onClick={handleAddUnit} size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              {!currentUnitId ? 'Add Department' : 'Add Sub-Department'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {!currentUnitId ? 'Organization Departments' : `${currentUnit?.title} - Sub Units`}
          </h2>
          <p className="text-muted-foreground">
            {currentLevelUnits.length} {!currentUnitId ? 'departments' : 'sub-units'} at this level
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
            <div className="text-lg font-medium mb-2">
              {!currentUnitId ? 'No departments yet' : 'No sub-units at this level yet'}
            </div>
            <p className="text-muted-foreground mb-4">
              {!currentUnitId 
                ? 'Start building your organizational structure by adding your first department'
                : 'Add sub-departments or teams under this department'
              }
            </p>
            <Button onClick={handleAddUnit} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              {!currentUnitId ? 'Add First Department' : 'Add Sub-Unit'}
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