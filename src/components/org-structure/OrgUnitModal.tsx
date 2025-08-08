import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, UserCheck, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface OrgUnitFormData {
  id?: string;
  name: string;
  description: string;
  level: 'organization' | 'department' | 'sub-department' | 'team';
  parentId?: string;
}

interface ParentUnit {
  id: string;
  name: string;
  level: string;
}

interface OrgUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OrgUnitFormData) => void;
  editingUnit?: OrgUnitFormData | null;
  parentUnit?: ParentUnit | null;
  breadcrumbPath?: ParentUnit[];
}

const levelOptions = [
  { value: 'organization', label: 'Organization', icon: Building2 },
  { value: 'department', label: 'Department', icon: Users },
  { value: 'sub-department', label: 'Sub-Department', icon: Users },
  { value: 'team', label: 'Team', icon: UserCheck },
];

const getLevelIcon = (level: string) => {
  const option = levelOptions.find(opt => opt.value === level);
  if (!option) return <Building2 className="h-4 w-4" />;
  const Icon = option.icon;
  return <Icon className="h-4 w-4" />;
};

const OrgUnitModal: React.FC<OrgUnitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingUnit,
  parentUnit,
  breadcrumbPath = []
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<OrgUnitFormData>({
    name: '',
    description: '',
    level: 'department',
    parentId: parentUnit?.id
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingUnit) {
      setFormData(editingUnit);
    } else {
      setFormData({
        name: '',
        description: '',
        level: parentUnit ? 'department' : 'organization',
        parentId: parentUnit?.id
      });
    }
    setErrors({});
  }, [editingUnit, parentUnit, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.level) {
      newErrors.level = 'Level is required';
    }

    // Level hierarchy validation
    if (parentUnit && formData.level) {
      const parentLevel = parentUnit.level;
      const currentLevel = formData.level;
      
      const levelHierarchy = ['organization', 'department', 'sub-department', 'team'];
      const parentIndex = levelHierarchy.indexOf(parentLevel);
      const currentIndex = levelHierarchy.indexOf(currentLevel);
      
      if (currentIndex <= parentIndex) {
        newErrors.level = `Level must be lower in hierarchy than parent ${parentLevel}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    onSave(formData);
    
    toast({
      title: "Success",
      description: `${editingUnit ? 'Updated' : 'Created'} ${formData.level} successfully`
    });
  };

  const handleSaveAndAddAnother = () => {
    if (!validateForm()) {
      return;
    }

    onSave(formData);
    
    // Reset form for next entry
    setFormData({
      name: '',
      description: '',
      level: formData.level,
      parentId: formData.parentId
    });
    
    toast({
      title: "Success",
      description: `Created ${formData.level} successfully. Add another below.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? 'Edit' : 'Add'} Department
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Breadcrumb Preview */}
          {breadcrumbPath.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <Label className="text-sm font-medium mb-2 block">
                Location in Hierarchy
              </Label>
              <div className="flex items-center gap-2 text-sm">
                {breadcrumbPath.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div className="flex items-center gap-1">
                      {getLevelIcon(item.level)}
                      <span>{item.name}</span>
                    </div>
                    {index < breadcrumbPath.length - 1 && (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </React.Fragment>
                ))}
                {formData.name && (
                  <>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    <div className="flex items-center gap-1">
                      {getLevelIcon(formData.level)}
                      <span className="font-medium text-primary">
                        {formData.name}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Name of the Department *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter unit name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Level */}
            <div>
              <Label htmlFor="level">Organizational Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value: any) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger className={errors.level ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.level && (
                <p className="text-sm text-destructive mt-1">{errors.level}</p>
              )}
            </div>

            {/* Parent Unit - Editable */}
            <div>
              <Label htmlFor="parentName">Parent (reporting)</Label>
              <Input
                id="parentName"
                value={parentUnit?.name || 'CEO'}
                placeholder="Enter parent unit name"
                readOnly={!!parentUnit}
                className={parentUnit ? 'bg-muted' : ''}
              />
              {parentUnit && (
                <p className="text-xs text-muted-foreground mt-1">
                  Inherited from hierarchy position
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description of this unit's purpose and responsibilities"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {!editingUnit && (
            <Button variant="outline" onClick={handleSaveAndAddAnother}>
              Save & Add Another
            </Button>
          )}
          
          <Button onClick={handleSave}>
            {editingUnit ? 'Update' : 'Create'} Department
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrgUnitModal;