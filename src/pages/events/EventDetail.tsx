import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Loader2, Calendar, Users, ClipboardCheck, UserCheck, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [eventTrainers, setEventTrainers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [allTrainers, setAllTrainers] = useState<any[]>([]);
  const [eventAssessments, setEventAssessments] = useState<any[]>([]);
  const [allAssessments, setAllAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Session dialog
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({ title: "", session_date: "", start_time: "", end_time: "" });

  // Trainer dialog
  const [isTrainerDialogOpen, setIsTrainerDialogOpen] = useState(false);
  const [trainerForm, setTrainerForm] = useState({ trainer_id: "", role: "primary" });

  // Enrollment dialog
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [enrollEmployeeId, setEnrollEmployeeId] = useState("");

  // Attendance dialog
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [attendanceSessionId, setAttendanceSessionId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});

  // Assessment dialog
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({ assessment_id: "", assessment_purpose: "pre_test", session_id: "", is_mandatory: true });

  useEffect(() => { if (id) fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      const [evRes, sesRes, etRes, enRes, atRes, empRes, trRes, eaRes, asRes] = await Promise.all([
        (supabase as any).from('events').select('*').eq('id', id).single(),
        (supabase as any).from('event_sessions').select('*').eq('event_id', id).eq('is_active', true).order('session_order'),
        (supabase as any).from('event_trainers').select('*, trainers(id, name, type)').eq('event_id', id),
        (supabase as any).from('event_enrollments').select('*, profiles(id, full_name, email)').eq('event_id', id),
        (supabase as any).from('attendance').select('*').eq('event_id', id),
        (supabase as any).from('profiles').select('id, full_name, email').order('full_name'),
        (supabase as any).from('trainers').select('id, name, type').eq('is_active', true),
        (supabase as any).from('event_assessments').select('*, assessments(id, title, assessment_type)').eq('event_id', id),
        (supabase as any).from('assessments').select('id, title, assessment_type').order('title')
      ]);
      setEvent(evRes.data);
      setSessions(sesRes.data || []);
      setEventTrainers(etRes.data || []);
      setEnrollments(enRes.data || []);
      setAttendance(atRes.data || []);
      setEmployees(empRes.data || []);
      setAllTrainers(trRes.data || []);
      setEventAssessments(eaRes.data || []);
      setAllAssessments(asRes.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const addSession = async () => {
    if (!sessionForm.title || !sessionForm.session_date) {
      toast({ title: "Error", description: "Title and date are required", variant: "destructive" }); return;
    }
    try {
      const { error } = await (supabase as any).from('event_sessions').insert([{
        event_id: id, title: sessionForm.title, session_date: sessionForm.session_date,
        start_time: sessionForm.start_time || null, end_time: sessionForm.end_time || null,
        session_order: sessions.length + 1
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Session added" });
      setIsSessionDialogOpen(false);
      setSessionForm({ title: "", session_date: "", start_time: "", end_time: "" });
      fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const removeSession = async (sessionId: string) => {
    try {
      const { error } = await (supabase as any).from('event_sessions').update({ is_active: false }).eq('id', sessionId);
      if (error) throw error;
      fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const addTrainer = async () => {
    if (!trainerForm.trainer_id) return;
    try {
      const { error } = await (supabase as any).from('event_trainers').insert([{
        event_id: id, trainer_id: trainerForm.trainer_id, role: trainerForm.role
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Trainer assigned" });
      setIsTrainerDialogOpen(false);
      setTrainerForm({ trainer_id: "", role: "primary" });
      fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const removeTrainer = async (etId: string) => {
    try {
      const { error } = await (supabase as any).from('event_trainers').delete().eq('id', etId);
      if (error) throw error;
      fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const enrollEmployee = async () => {
    if (!enrollEmployeeId) return;
    try {
      const { error } = await (supabase as any).from('event_enrollments').insert([{ event_id: id, employee_id: enrollEmployeeId }]);
      if (error) throw error;
      toast({ title: "Success", description: "Employee enrolled" });
      setIsEnrollDialogOpen(false);
      setEnrollEmployeeId("");
      fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const openAttendance = (sessionId?: string) => {
    setAttendanceSessionId(sessionId || "");
    const records: Record<string, string> = {};
    enrollments.forEach(en => {
      const existing = attendance.find(a => a.employee_id === en.employee_id && (sessionId ? a.session_id === sessionId : !a.session_id));
      records[en.employee_id] = existing?.status || "present";
    });
    setAttendanceRecords(records);
    setIsAttendanceDialogOpen(true);
  };

  const saveAttendance = async () => {
    try {
      const inserts = Object.entries(attendanceRecords).map(([empId, status]) => ({
        event_id: id, session_id: attendanceSessionId || null, employee_id: empId, status
      }));
      for (const record of inserts) {
        const { error } = await (supabase as any).from('attendance').upsert(record, { onConflict: 'event_id,session_id,employee_id' });
        if (error) throw error;
      }
      toast({ title: "Success", description: "Attendance saved" });
      setIsAttendanceDialogOpen(false);
      fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const addAssessment = async () => {
    if (!assessmentForm.assessment_id || !assessmentForm.assessment_purpose) {
      toast({ title: "Error", description: "Assessment and purpose are required", variant: "destructive" }); return;
    }
    try {
      const { error } = await (supabase as any).from('event_assessments').insert([{
        event_id: id,
        assessment_id: assessmentForm.assessment_id,
        assessment_purpose: assessmentForm.assessment_purpose,
        session_id: assessmentForm.session_id || null,
        is_mandatory: assessmentForm.is_mandatory
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Assessment linked to event" });
      setIsAssessmentDialogOpen(false);
      setAssessmentForm({ assessment_id: "", assessment_purpose: "pre_test", session_id: "", is_mandatory: true });
      fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const removeAssessment = async (eaId: string) => {
    try {
      const { error } = await (supabase as any).from('event_assessments').delete().eq('id', eaId);
      if (error) throw error;
      toast({ title: "Success", description: "Assessment removed" });
      fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const purposeLabels: Record<string, string> = { pre_test: "PRE Test", post_test: "POST Test", feedback: "Feedback", l3_feedback: "L3 Feedback" };
  const purposeColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = { pre_test: "secondary", post_test: "default", feedback: "outline", l3_feedback: "outline" };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!event) return <div className="text-center py-12">Event not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/events')}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <div className="flex gap-2 mt-1">
            <Badge>{event.status}</Badge>
            <Badge variant="outline">{event.event_type.replace('_', ' ')}</Badge>
            <span className="text-sm text-muted-foreground">{event.start_date} → {event.end_date}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions" className="gap-1"><Calendar className="h-4 w-4" />Sessions ({sessions.length})</TabsTrigger>
          <TabsTrigger value="trainers" className="gap-1"><UserCheck className="h-4 w-4" />Trainers ({eventTrainers.length})</TabsTrigger>
          <TabsTrigger value="assessments" className="gap-1"><FileText className="h-4 w-4" />Assessments ({eventAssessments.length})</TabsTrigger>
          <TabsTrigger value="enrollments" className="gap-1"><Users className="h-4 w-4" />Enrollments ({enrollments.length})</TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1"><ClipboardCheck className="h-4 w-4" />Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsSessionDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Add Session</Button>
          </div>
          {sessions.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No sessions. Add sessions for multi-day events.</CardContent></Card>
          ) : sessions.map(s => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.session_date} {s.start_time && `• ${s.start_time}`}{s.end_time && ` - ${s.end_time}`}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => openAttendance(s.id)}>Mark Attendance</Button>
                  <Button variant="ghost" size="icon" onClick={() => removeSession(s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trainers" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsTrainerDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Assign Trainer</Button>
          </div>
          {eventTrainers.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No trainers assigned yet.</CardContent></Card>
          ) : eventTrainers.map(et => (
            <Card key={et.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{et.trainers?.name || 'Unknown'}</p>
                  <div className="flex gap-2"><Badge variant="outline">{et.role}</Badge><Badge variant="secondary">{et.trainers?.type}</Badge></div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeTrainer(et.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsAssessmentDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Link Assessment</Button>
          </div>
          {eventAssessments.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No assessments linked. Add PRE test, POST test, Feedback, or L3 Feedback.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {eventAssessments.map(ea => {
                const sessionName = sessions.find(s => s.id === ea.session_id)?.title;
                return (
                  <Card key={ea.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{ea.assessments?.title || 'Unknown'}</p>
                          <Badge variant={purposeColors[ea.assessment_purpose]}>{purposeLabels[ea.assessment_purpose]}</Badge>
                          {ea.is_mandatory && <Badge variant="outline" className="text-xs">Mandatory</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sessionName ? `Session: ${sessionName}` : 'Event-level'} • Type: {ea.assessments?.assessment_type}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeAssessment(ea.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsEnrollDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Enroll Employee</Button>
          </div>
          {enrollments.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No enrollments yet.</CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead><tr className="border-b"><th className="text-left p-3 text-sm font-medium">Name</th><th className="text-left p-3 text-sm font-medium">Email</th><th className="text-left p-3 text-sm font-medium">Status</th></tr></thead>
                  <tbody>
                    {enrollments.map(en => (
                      <tr key={en.id} className="border-b last:border-0">
                        <td className="p-3 text-sm">{en.profiles?.full_name}</td>
                        <td className="p-3 text-sm text-muted-foreground">{en.profiles?.email}</td>
                        <td className="p-3"><Badge variant="outline">{en.enrollment_status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openAttendance()} className="gap-2"><ClipboardCheck className="h-4 w-4" />Mark Event Attendance</Button>
          </div>
          {attendance.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No attendance recorded yet.</CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead><tr className="border-b"><th className="text-left p-3 text-sm font-medium">Employee</th><th className="text-left p-3 text-sm font-medium">Session</th><th className="text-left p-3 text-sm font-medium">Status</th></tr></thead>
                  <tbody>
                    {attendance.map(a => {
                      const emp = employees.find(e => e.id === a.employee_id);
                      const ses = sessions.find(s => s.id === a.session_id);
                      return (
                        <tr key={a.id} className="border-b last:border-0">
                          <td className="p-3 text-sm">{emp?.full_name || a.employee_id}</td>
                          <td className="p-3 text-sm">{ses?.title || 'Event-level'}</td>
                          <td className="p-3"><Badge variant={a.status === 'present' ? 'default' : 'secondary'}>{a.status}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Session Dialog */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Session</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title *</Label><Input value={sessionForm.title} onChange={e => setSessionForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Date *</Label><Input type="date" value={sessionForm.session_date} onChange={e => setSessionForm(p => ({ ...p, session_date: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={sessionForm.start_time} onChange={e => setSessionForm(p => ({ ...p, start_time: e.target.value }))} /></div>
              <div className="space-y-2"><Label>End Time</Label><Input type="time" value={sessionForm.end_time} onChange={e => setSessionForm(p => ({ ...p, end_time: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>Cancel</Button>
              <Button onClick={addSession}>Add Session</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trainer Dialog */}
      <Dialog open={isTrainerDialogOpen} onOpenChange={setIsTrainerDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Trainer</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Trainer *</Label>
              <Select value={trainerForm.trainer_id} onValueChange={v => setTrainerForm(p => ({ ...p, trainer_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select trainer" /></SelectTrigger>
                <SelectContent>{allTrainers.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.type})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={trainerForm.role} onValueChange={v => setTrainerForm(p => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="co_trainer">Co-Trainer</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTrainerDialogOpen(false)}>Cancel</Button>
              <Button onClick={addTrainer}>Assign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enroll Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enroll Employee</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Employee *</Label>
              <Select value={enrollEmployeeId} onValueChange={setEnrollEmployeeId}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>{employees.filter(e => !enrollments.find(en => en.employee_id === e.id)).map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>Cancel</Button>
              <Button onClick={enrollEmployee}>Enroll</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Mark Attendance</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {enrollments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No enrolled employees</p>
            ) : enrollments.map(en => (
              <div key={en.employee_id} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium">{en.profiles?.full_name}</span>
                <Select value={attendanceRecords[en.employee_id] || "present"} onValueChange={v => setAttendanceRecords(p => ({ ...p, [en.employee_id]: v }))}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveAttendance}>Save Attendance</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assessment Dialog */}
      <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Link Assessment to Event</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assessment *</Label>
              <Select value={assessmentForm.assessment_id} onValueChange={v => setAssessmentForm(p => ({ ...p, assessment_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select assessment" /></SelectTrigger>
                <SelectContent>{allAssessments.map(a => <SelectItem key={a.id} value={a.id}>{a.title} ({a.assessment_type})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Purpose *</Label>
              <Select value={assessmentForm.assessment_purpose} onValueChange={v => setAssessmentForm(p => ({ ...p, assessment_purpose: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre_test">PRE Test</SelectItem>
                  <SelectItem value="post_test">POST Test</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="l3_feedback">L3 Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Link to Session (optional)</Label>
              <Select value={assessmentForm.session_id} onValueChange={v => setAssessmentForm(p => ({ ...p, session_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Event-level (no specific session)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Event-level</SelectItem>
                  {sessions.map(s => <SelectItem key={s.id} value={s.id}>{s.title} ({s.session_date})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="mandatory" checked={assessmentForm.is_mandatory} onCheckedChange={v => setAssessmentForm(p => ({ ...p, is_mandatory: !!v }))} />
              <Label htmlFor="mandatory">Mandatory</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAssessmentDialogOpen(false)}>Cancel</Button>
              <Button onClick={addAssessment}>Link Assessment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetail;
