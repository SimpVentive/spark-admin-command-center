import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useLibrary } from "@/contexts/LibraryContext";
import { useToast } from "@/hooks/use-toast";

interface AddResourceDialogProps {
  trigger?: React.ReactNode;
}

const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ trigger }) => {
  const { addResource } = useLibrary();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as 'eBook' | 'Article' | 'Video' | 'Document' | '',
    url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addResource({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      url: formData.url,
    });

    toast({
      title: "Success",
      description: "Resource added successfully!",
    });

    // Reset form and close dialog
    setFormData({
      title: '',
      description: '',
      type: '',
      url: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter resource title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as 'eBook' | 'Article' | 'Video' | 'Document' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eBook">eBook</SelectItem>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter resource description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL (Optional)</Label>
            <Input
              id="url"
              placeholder="Enter resource URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceDialog;