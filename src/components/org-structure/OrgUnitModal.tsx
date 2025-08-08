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
import { Building2, Users, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ParentUnit {
  id: string;
  name: string;
  level: string;
}

interface OrgUnitModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; level: string; manager_name?: string }) => void;
  editingUnit?: any;
  parentUnit?: ParentUnit | null;
}

const levelOptions = [
  { value: 'organization', label: 'Organization', icon: Building2 },
  { value: 'department', label: 'Department', icon: Users },
  { value: 'sub-department', label: 'Sub-Department', icon: Users },
  { value: 'team', label: 'Team', icon: UserCheck },
];

const OrgUnitModal: React.FC<OrgUnitModalProps> = ({
  open,
  onClose,
  onSave,
  editingUnit,
  parentUnit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'department',
    manager_name: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingUnit) {
      setFormData({
        name: editingUnit.name || '',
        description: editingUnit.description || '',
        level: editingUnit.level || 'department',
        manager_name: editingUnit.manager_name || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        level: 'department',
        manager_name: ''
      });
    }
    setErrors({});
  }, [editingUnit, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.level) {
      newErrors.level = 'Level is required';
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
      manager_name: ''
    });
    
    toast({
      title: "Success",
      description: `Created ${formData.level} successfully. Add another below.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? 'Edit' : 'Add'} Department
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                onValueChange={(value) => setFormData({ ...formData, level: value })}
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

            {/* Reports To - Now editable */}
            <div>
              <Label htmlFor="manager">Reports to</Label>
              <Input
                id="manager"
                value={formData.manager_name}
                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                placeholder={parentUnit?.name || 'CEO'}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {parentUnit ? 'Manager of this unit' : 'Default top-level reporting'}
              </p>
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