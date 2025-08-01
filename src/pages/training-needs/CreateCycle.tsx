import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Plus, Trash2, Users, Building2, MapPin, Target } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ProgramManagementSection from "@/components/ProgramManagementSection";

interface MandatoryProgram {
  programId: string;
  departments: string[];
  locations: string[];
  roles: string[];
}

interface CycleData {
  name: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  workflowType: 'individual' | 'manager' | 'tm_batch';
  requiresManagerApproval: boolean;
  minPrograms: number;
  maxPrograms: number;
  autoCloseThreshold: number;
  departments: string[];
  locations: string[];
  mandatoryPrograms: MandatoryProgram[];
  emailTemplate: string;
  reminderEnabled: boolean;
  reminderDays: number[];
}

export default function CreateCycle() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [cycleData, setCycleData] = useState<CycleData>({
    name: '',
    description: '',
    startDate: undefined,
    endDate: undefined,
    workflowType: 'individual',
    requiresManagerApproval: true,
    minPrograms: 3,
    maxPrograms: 8,
    autoCloseThreshold: 80,
    departments: [],
    locations: [],
    mandatoryPrograms: [],
    emailTemplate: `Dear {employee_name},

The Training Needs Identification cycle "{cycle_name}" is now open.

Please complete your TNI by {end_date}.

Access your TNI form: {tni_link}

Best regards,
Training Team`,
    reminderEnabled: true,
    reminderDays: [7, 3, 1]
  });

  // Sample data
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];
  const roles = ['Manager', 'Senior Manager', 'Assistant Manager', 'Executive', 'Senior Executive'];
  
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    }
  };

  const addMandatoryProgram = () => {
    setCycleData(prev => ({
      ...prev,
      mandatoryPrograms: [...prev.mandatoryPrograms, {
        programId: '',
        departments: [],
        locations: [],
        roles: []
      }]
    }));
  };

  const updateMandatoryProgram = (index: number, field: keyof MandatoryProgram, value: any) => {
    setCycleData(prev => ({
      ...prev,
      mandatoryPrograms: prev.mandatoryPrograms.map((mp, i) => 
        i === index ? { ...mp, [field]: value } : mp
      )
    }));
  };

  const removeMandatoryProgram = (index: number) => {
    setCycleData(prev => ({
      ...prev,
      mandatoryPrograms: prev.mandatoryPrograms.filter((_, i) => i !== index)
    }));
  };

  const handleArrayToggle = (array: string[], value: string) => {
    return array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const handleSubmit = () => {
    if (!cycleData.name || !cycleData.startDate || !cycleData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Training cycle created successfully!"
    });
    
    navigate('/training-needs');
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Create TNI Cycle</h1>
        <p className="text-muted-foreground">
          Set up a new Training Needs Identification cycle
        </p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Define the cycle name, description, and duration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cycleName">Cycle Name *</Label>
                  <Input
                    id="cycleName"
                    value={cycleData.name}
                    onChange={(e) => setCycleData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Q1 2024 Training Needs Analysis"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Workflow Type</Label>
                  <Select 
                    value={cycleData.workflowType} 
                    onValueChange={(value: any) => setCycleData(prev => ({ ...prev, workflowType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Input + Manager Approval</SelectItem>
                      <SelectItem value="manager">Manager Input for Team</SelectItem>
                      <SelectItem value="tm_batch">TM Batch Input by Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="manager-approval"
                      checked={cycleData.requiresManagerApproval}
                      onCheckedChange={(checked) => setCycleData(prev => ({ ...prev, requiresManagerApproval: checked }))}
                    />
                    <div className="space-y-0.5">
                      <label htmlFor="manager-approval" className="text-sm font-medium">
                        Requires Manager Approval
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Employee TNI submissions need manager approval before finalization
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={cycleData.description}
                  onChange={(e) => setCycleData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this TNI cycle..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {cycleData.startDate ? format(cycleData.startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={cycleData.startDate}
                        onSelect={(date) => setCycleData(prev => ({ ...prev, startDate: date }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {cycleData.endDate ? format(cycleData.endDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={cycleData.endDate}
                        onSelect={(date) => setCycleData(prev => ({ ...prev, endDate: date }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrograms">Min Programs</Label>
                  <Input
                    id="minPrograms"
                    type="number"
                    value={cycleData.minPrograms}
                    onChange={(e) => setCycleData(prev => ({ ...prev, minPrograms: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxPrograms">Max Programs</Label>
                  <Input
                    id="maxPrograms"
                    type="number"
                    value={cycleData.maxPrograms}
                    onChange={(e) => setCycleData(prev => ({ ...prev, maxPrograms: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="threshold">Auto-close Threshold (%)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={cycleData.autoCloseThreshold}
                    onChange={(e) => setCycleData(prev => ({ ...prev, autoCloseThreshold: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Configuration */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>
                Select departments and locations for this cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Departments</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {departments.map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept}`}
                        checked={cycleData.departments.includes(dept)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCycleData(prev => ({
                              ...prev,
                              departments: [...prev.departments, dept]
                            }));
                          } else {
                            setCycleData(prev => ({
                              ...prev,
                              departments: prev.departments.filter(d => d !== dept)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`dept-${dept}`} className="text-sm">{dept}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Locations</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`loc-${location}`}
                        checked={cycleData.locations.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCycleData(prev => ({
                              ...prev,
                              locations: [...prev.locations, location]
                            }));
                          } else {
                            setCycleData(prev => ({
                              ...prev,
                              locations: prev.locations.filter(l => l !== location)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`loc-${location}`} className="text-sm">{location}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Workflow Type: {cycleData.workflowType.replace('_', ' ').toUpperCase()}</h4>
                <p className="text-sm text-muted-foreground">
                  {cycleData.workflowType === 'individual' && 'Employees fill their own TNI forms, which are then sent to their managers for approval.'}
                  {cycleData.workflowType === 'manager' && 'Managers fill TNI forms on behalf of their team members.'}
                  {cycleData.workflowType === 'tm_batch' && 'Training Manager fills TNI in batch mode by department/role.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programs Configuration */}
        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Programs</CardTitle>
              <CardDescription>
                Select programs from repository and manage program categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgramManagementSection showAddButton={true} showHeader={false} compact={true} />
            </CardContent>
          </Card>

          {/* Mandatory Programs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mandatory Programs</CardTitle>
                  <CardDescription>
                    Define mandatory programs based on department, location, or role
                  </CardDescription>
                </div>
                <Button onClick={addMandatoryProgram}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Mandatory Program
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cycleData.mandatoryPrograms.map((mp, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Mandatory Program {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMandatoryProgram(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <Label>Program</Label>
                        <Select 
                          value={mp.programId} 
                          onValueChange={(value) => updateMandatoryProgram(index, 'programId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.id} value={program.id}>
                                {program.title} ({program.category})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Departments</Label>
                          <div className="space-y-2 mt-1">
                            {departments.slice(0, 3).map((dept) => (
                              <div key={dept} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={mp.departments.includes(dept)}
                                  onCheckedChange={(checked) => {
                                    const newDepts = checked 
                                      ? [...mp.departments, dept]
                                      : mp.departments.filter(d => d !== dept);
                                    updateMandatoryProgram(index, 'departments', newDepts);
                                  }}
                                />
                                <Label className="text-sm">{dept}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Locations</Label>
                          <div className="space-y-2 mt-1">
                            {locations.slice(0, 3).map((location) => (
                              <div key={location} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={mp.locations.includes(location)}
                                  onCheckedChange={(checked) => {
                                    const newLocs = checked 
                                      ? [...mp.locations, location]
                                      : mp.locations.filter(l => l !== location);
                                    updateMandatoryProgram(index, 'locations', newLocs);
                                  }}
                                />
                                <Label className="text-sm">{location}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Roles</Label>
                          <div className="space-y-2 mt-1">
                            {roles.slice(0, 3).map((role) => (
                              <div key={role} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={mp.roles.includes(role)}
                                  onCheckedChange={(checked) => {
                                    const newRoles = checked 
                                      ? [...mp.roles, role]
                                      : mp.roles.filter(r => r !== role);
                                    updateMandatoryProgram(index, 'roles', newRoles);
                                  }}
                                />
                                <Label className="text-sm">{role}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {cycleData.mandatoryPrograms.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No mandatory programs defined. Click "Add Mandatory Program" to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Customize email templates and reminder settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="emailTemplate">Email Template</Label>
                <Textarea
                  id="emailTemplate"
                  value={cycleData.emailTemplate}
                  onChange={(e) => setCycleData(prev => ({ ...prev, emailTemplate: e.target.value }))}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {'{employee_name}'}, {'{cycle_name}'}, {'{start_date}'}, {'{end_date}'}, {'{tni_link}'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send automatic reminder emails</p>
                  </div>
                  <Switch
                    checked={cycleData.reminderEnabled}
                    onCheckedChange={(checked) => setCycleData(prev => ({ ...prev, reminderEnabled: checked }))}
                  />
                </div>

                {cycleData.reminderEnabled && (
                  <div>
                    <Label>Reminder Schedule (days before deadline)</Label>
                    <div className="flex gap-2 mt-2">
                      {[7, 5, 3, 1].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            checked={cycleData.reminderDays.includes(day)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCycleData(prev => ({
                                  ...prev,
                                  reminderDays: [...prev.reminderDays, day].sort((a, b) => b - a)
                                }));
                              } else {
                                setCycleData(prev => ({
                                  ...prev,
                                  reminderDays: prev.reminderDays.filter(d => d !== day)
                                }));
                              }
                            }}
                          />
                          <Label className="text-sm">{day} days</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review */}
        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Configuration</CardTitle>
              <CardDescription>
                Review all settings before creating the cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Basic Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                      <p><strong>Name:</strong> {cycleData.name || 'Not set'}</p>
                      <p><strong>Workflow:</strong> {cycleData.workflowType.replace('_', ' ').toUpperCase()}</p>
                      <p><strong>Duration:</strong> {cycleData.startDate ? format(cycleData.startDate, "PPP") : 'Not set'} - {cycleData.endDate ? format(cycleData.endDate, "PPP") : 'Not set'}</p>
                      <p><strong>Programs:</strong> {cycleData.minPrograms}-{cycleData.maxPrograms}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Target Audience</h4>
                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                      <p><strong>Departments:</strong> {cycleData.departments.length ? cycleData.departments.join(', ') : 'All'}</p>
                      <p><strong>Locations:</strong> {cycleData.locations.length ? cycleData.locations.join(', ') : 'All'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Mandatory Programs</h4>
                    <div className="text-sm text-muted-foreground mt-2">
                      {cycleData.mandatoryPrograms.length ? (
                        <div className="space-y-1">
                          {cycleData.mandatoryPrograms.map((mp, index) => {
                            const program = programs.find(p => p.id === mp.programId);
                            return (
                              <p key={index}>
                                <strong>{program?.title || 'Unknown Program'}</strong> - 
                                {mp.departments.length ? ` ${mp.departments.join(', ')}` : ' All Depts'}
                              </p>
                            );
                          })}
                        </div>
                      ) : (
                        <p>No mandatory programs defined</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                      <p><strong>Reminders:</strong> {cycleData.reminderEnabled ? 'Enabled' : 'Disabled'}</p>
                      {cycleData.reminderEnabled && (
                        <p><strong>Schedule:</strong> {cycleData.reminderDays.join(', ')} days before deadline</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSubmit} className="flex-1">
                  Create TNI Cycle
                </Button>
                <Button variant="outline" onClick={() => navigate('/training-needs')}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}