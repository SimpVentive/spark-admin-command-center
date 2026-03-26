import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyScope } from "@/hooks/useCompanyScope";
import ProgramCategoryManagement from "@/components/ProgramCategoryManagement";
import ResourceSelector from "@/components/library/ResourceSelector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CreateProgram = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { scopeData, scopeArray } = useCompanyScope();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "", category: "", subcategory: "", programType: "", level: "",
    outline: "", theme: "", faculty: "", venue: "", icon: "",
    preReadInfo: "", preTestInfo: "", multipleBatches: false,
    duration: "", maxParticipants: "", prerequisites: "",
    learningObjectives: "", assessmentCriteria: "", certificationOffered: false,
    cost: "", linkedResources: [] as string[],
  });

  const [sessions, setSessions] = useState([{ date: "", startTime: "", endTime: "", venue: "", trainer: "" }]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSession = () => setSessions(prev => [...prev, { date: "", startTime: "", endTime: "", venue: "", trainer: "" }]);
  const removeSession = (index: number) => setSessions(prev => prev.filter((_, i) => i !== index));
  const updateSession = (index: number, field: string, value: string) => {
    setSessions(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category) {
      toast({ title: "Error", description: "Title and category are required", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const durationHours = formData.duration ? parseInt(formData.duration) || null : null;
      const { data: program, error: programError } = await supabase.from('training_programs').insert([scopeData({
        title: formData.title.trim(),
        category: formData.category,
        level: formData.level || null,
        description: formData.outline || null,
        outline: formData.outline || null,
        faculty: formData.faculty || null,
        venue: formData.venue || null,
        duration_hours: durationHours,
        prerequisites: formData.prerequisites ? formData.prerequisites.split(',').map(s => s.trim()) : [],
        skills_covered: formData.learningObjectives ? formData.learningObjectives.split(',').map(s => s.trim()) : [],
      })]).select().single();

      if (programError) throw programError;

      // Insert sessions
      const validSessions = sessions.filter(s => s.date);
      if (validSessions.length > 0 && program) {
        const sessionInserts = validSessions.map(s => ({
          program_id: program.id,
          start_date: s.date,
          end_date: s.date,
          max_participants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          status: 'scheduled',
        }));
        const { error: sessionError } = await supabase.from('program_sessions').insert(scopeArray(sessionInserts));
        if (sessionError) console.error('Session insert error:', sessionError);
      }

      toast({ title: "Success", description: "Program created successfully!" });
      navigate('/programs');
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create program", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/programs">All Programs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create New Program</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <h1 className="text-2xl font-bold">Create New Program</h1>
          <p className="text-muted-foreground">Design a comprehensive training program</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Program Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Enter program title" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Program Category *</Label>
                <ProgramCategoryManagement selectedCategory={formData.category} selectedSubcategory={formData.subcategory} onCategoryChange={(cat, sub) => { handleInputChange('category', cat); if (sub) handleInputChange('subcategory', sub); }} />
              </div>
              <div className="space-y-2">
                <Label>Program Type</Label>
                <Select value={formData.programType} onValueChange={(v) => handleInputChange('programType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ILT">Instructor-Led Training</SelectItem>
                    <SelectItem value="Digital">Digital/Online</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Self-Paced">Self-Paced</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select value={formData.level} onValueChange={(v) => handleInputChange('level', v)}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Duration (hours)</Label><Input type="number" value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} placeholder="e.g., 40" /></div>
              <div className="space-y-2"><Label>Max Participants</Label><Input type="number" value={formData.maxParticipants} onChange={(e) => handleInputChange('maxParticipants', e.target.value)} /></div>
              <div className="space-y-2"><Label>Faculty/Trainer</Label><Input value={formData.faculty} onChange={(e) => handleInputChange('faculty', e.target.value)} placeholder="Primary trainer" /></div>
              <div className="space-y-2"><Label>Venue</Label><Input value={formData.venue} onChange={(e) => handleInputChange('venue', e.target.value)} placeholder="Training venue" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Program Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Program Outline *</Label><Textarea value={formData.outline} onChange={(e) => handleInputChange('outline', e.target.value)} placeholder="Detailed program outline..." rows={6} required /></div>
              <div className="space-y-2"><Label>Learning Objectives</Label><Textarea value={formData.learningObjectives} onChange={(e) => handleInputChange('learningObjectives', e.target.value)} placeholder="Comma-separated objectives..." rows={4} /></div>
              <div className="space-y-2"><Label>Prerequisites</Label><Textarea value={formData.prerequisites} onChange={(e) => handleInputChange('prerequisites', e.target.value)} placeholder="Comma-separated prerequisites..." rows={3} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center justify-between">Training Sessions<Button type="button" variant="outline" size="sm" onClick={addSession}><Plus className="h-4 w-4 mr-2" />Add Session</Button></CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Session {index + 1}</h4>
                    {sessions.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeSession(index)}><Trash2 className="h-4 w-4" /></Button>}
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2"><Label>Date</Label><Input type="date" value={session.date} onChange={(e) => updateSession(index, 'date', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={session.startTime} onChange={(e) => updateSession(index, 'startTime', e.target.value)} /></div>
                    <div className="space-y-2"><Label>End Time</Label><Input type="time" value={session.endTime} onChange={(e) => updateSession(index, 'endTime', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Venue</Label><Input value={session.venue} onChange={(e) => updateSession(index, 'venue', e.target.value)} placeholder="Session venue" /></div>
                    <div className="space-y-2"><Label>Trainer</Label><Input value={session.trainer} onChange={(e) => updateSession(index, 'trainer', e.target.value)} placeholder="Session trainer" /></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Additional Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2"><Checkbox id="multipleBatches" checked={formData.multipleBatches} onCheckedChange={(c) => handleInputChange('multipleBatches', c as boolean)} /><Label htmlFor="multipleBatches">Allow Multiple Batches</Label></div>
              <div className="flex items-center space-x-2"><Checkbox id="certificationOffered" checked={formData.certificationOffered} onCheckedChange={(c) => handleInputChange('certificationOffered', c as boolean)} /><Label htmlFor="certificationOffered">Certification Offered</Label></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Library Resources</CardTitle></CardHeader>
            <CardContent><ResourceSelector selectedResources={formData.linkedResources} onResourcesChange={(r) => handleInputChange('linkedResources', r)} /></CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/programs')}>Cancel</Button>
            <Button type="submit" disabled={isLoading}><Save className="h-4 w-4 mr-2" />{isLoading ? "Creating..." : "Create Program"}</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProgram;
