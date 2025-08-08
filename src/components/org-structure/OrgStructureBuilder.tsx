import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Factory, Users, Plus, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrgUnitModal from './OrgUnitModal';

interface OrgUnit {
  id: string;
  name: string;
  description?: string;
  level: string;
  parent_id?: string;
  manager_name?: string;
  employee_count: number;
  is_active: boolean;
}

type StructureType = 'corp' | 'plant';

interface Department {
  id: string;
  name: string;
  description?: string;
  manager_name?: string;
  subDepartments: SubDepartment[];
  employee_count: number;
}

interface SubDepartment {
  id: string;
  name: string;
  description?: string;
  manager_name?: string;
  employee_count: number;
}

interface OrgStructureBuilderProps {
  onAddPeople?: (unitId: string) => void;
}

const OrgStructureBuilder: React.FC<OrgStructureBuilderProps> = ({ onAddPeople }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State
  const [structureType, setStructureType] = useState<StructureType>('corp');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'department' | 'sub-department'>('department');

  // Fetch data
  const { data: orgUnits, isLoading } = useQuery({
    queryKey: ['organizational-units', structureType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizational_units')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as OrgUnit[];
    }
  });

  // Check for plants
  const { data: plants } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      // This would be from a locations/plants table
      // For now, return empty array
      return [];
    }
  });

  // Mutations
  const createUnitMutation = useMutation({
    mutationFn: async (unitData: { name: string; description?: string; level: string; parent_id?: string; manager_name?: string }) => {
      const { data, error } = await supabase
        .from('organizational_units')
        .insert([unitData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizational-units'] });
      toast({ title: "Success", description: "Unit created successfully" });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create unit", variant: "destructive" });
    }
  });

  // Transform data into departments
  const departments: Department[] = orgUnits?.filter(unit => unit.level === 'department' && !unit.parent_id).map(dept => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
    manager_name: dept.manager_name,
    employee_count: dept.employee_count,
    subDepartments: orgUnits.filter(unit => unit.parent_id === dept.id).map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      manager_name: sub.manager_name,
      employee_count: sub.employee_count
    }))
  })) || [];

  const handleSwitchToPlant = () => {
    if (!plants || plants.length === 0) {
      toast({
        title: "No Plants Found",
        description: "Please add plants first from Plant & Locations menu"
      });
      navigate('/organization/locations');
      return;
    }
    setStructureType('plant');
  };

  const handleAddDepartment = () => {
    setModalType('department');
    setIsModalOpen(true);
  };

  const handleAddSubDepartment = (departmentId: string) => {
    setModalType('sub-department');
    setSelectedDepartmentId(departmentId);
    setIsModalOpen(true);
  };

  const handleAddPeople = (unitId: string) => {
    if (onAddPeople) {
      onAddPeople(unitId);
    } else {
      navigate(`/users/add?unitId=${unitId}`);
    }
  };

  const handleSaveUnit = (formData: { name: string; description: string; level: string; manager_name?: string }) => {
    const level = modalType === 'department' ? 'department' : 'sub-department';
    const parent_id = modalType === 'sub-department' ? selectedDepartmentId : undefined;
    
    createUnitMutation.mutate({
      name: formData.name,
      description: formData.description,
      level,
      parent_id,
      manager_name: formData.manager_name || 'TBD'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading organization structure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Organization Structure</h1>
        
        {/* Simple Breadcrumbs */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>Corp Structure</span>
          {structureType === 'plant' && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Factory className="h-4 w-4" />
              <span>Plant Structure</span>
            </>
          )}
        </div>
      </div>

      {/* Structure Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Structure Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Corporate Structure</h3>
                <p className="text-sm text-muted-foreground">Default organizational hierarchy</p>
              </div>
            </div>
            <Badge variant="default">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={handleSwitchToPlant}>
            <div className="flex items-center gap-3">
              <Factory className="h-6 w-6 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Do you want structure for Plant?</h3>
                <p className="text-sm text-muted-foreground">Location-specific hierarchy</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Switch to Plant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Departments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Departments</CardTitle>
            <Button onClick={handleAddDepartment}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {departments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Departments Yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first department</p>
              <Button onClick={handleAddDepartment}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {departments.map((dept) => (
                <Card key={dept.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-lg">{dept.name}</h3>
                        {dept.description && (
                          <p className="text-sm text-muted-foreground">{dept.description}</p>
                        )}
                        {dept.manager_name && (
                          <p className="text-sm">Manager: {dept.manager_name}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleAddSubDepartment(dept.id)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Sub-Department
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddPeople(dept.id)}>
                          <Users className="h-4 w-4 mr-1" />
                          Add People
                        </Button>
                      </div>
                    </div>

                    {/* Sub-departments */}
                    {dept.subDepartments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Sub-Departments:</h4>
                        {dept.subDepartments.map((subDept) => (
                          <div key={subDept.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <div>
                              <h5 className="font-medium">{subDept.name}</h5>
                              {subDept.description && (
                                <p className="text-xs text-muted-foreground">{subDept.description}</p>
                              )}
                              {subDept.manager_name && (
                                <p className="text-xs">Manager: {subDept.manager_name}</p>
                              )}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleAddPeople(subDept.id)}>
                              <Users className="h-3 w-3 mr-1" />
                              Add People
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <OrgUnitModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUnit}
        editingUnit={null}
        parentUnit={modalType === 'sub-department' && selectedDepartmentId ? {
          id: selectedDepartmentId,
          name: departments.find(d => d.id === selectedDepartmentId)?.name || '',
          level: 'department'
        } : undefined}
      />
    </div>
  );
};

export default OrgStructureBuilder;