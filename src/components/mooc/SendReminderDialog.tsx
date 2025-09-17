import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SendReminderDialogProps {
  enrollment: any;
}

export const SendReminderDialog = ({ enrollment }: SendReminderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reminderType, setReminderType] = useState("email");
  const [message, setMessage] = useState(
    `Hi ${enrollment?.employeeName},\n\nThis is a friendly reminder about your enrolled course "${enrollment?.course}". Your current progress is ${enrollment?.progress}% and the due date is ${enrollment?.due}.\n\nPlease complete the course at your earliest convenience.\n\nBest regards,\nLearning & Development Team`
  );
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendReminder = async () => {
    setSending(true);
    
    // Simulate sending reminder
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Reminder Sent",
      description: `${reminderType === 'email' ? 'Email' : 'SMS'} reminder sent to ${enrollment?.employeeName} successfully.`
    });
    
    setSending(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="w-4 h-4 mr-1" />
          Send Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Course Reminder</DialogTitle>
          <DialogDescription>
            Send a reminder to {enrollment?.employeeName} about their course progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="reminder-type">Reminder Type</Label>
            <Select value={reminderType} onValueChange={setReminderType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="sms">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Enter your reminder message..."
            />
          </div>
          
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p><strong>Course:</strong> {enrollment?.course}</p>
            <p><strong>Progress:</strong> {enrollment?.progress}%</p>
            <p><strong>Due Date:</strong> {enrollment?.due}</p>
            <p><strong>Status:</strong> {enrollment?.status?.replace('_', ' ')}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendReminder} disabled={sending}>
            {sending ? "Sending..." : `Send ${reminderType === 'email' ? 'Email' : 'SMS'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};