import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Calendar, Clock, BookOpen, User, Mail } from "lucide-react";

interface EnrollmentDetailsDialogProps {
  enrollment: any;
}

export const EnrollmentDetailsDialog = ({ enrollment }: EnrollmentDetailsDialogProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enrollment Details</DialogTitle>
          <DialogDescription>
            Detailed information about this course enrollment
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{enrollment?.course}</h3>
              <p className="text-sm text-muted-foreground">{enrollment?.provider}</p>
            </div>
            <Badge variant={getStatusColor(enrollment?.status)}>
              {enrollment?.status?.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Employee:</span>
                <span>{enrollment?.employeeName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">ID:</span>
                <span>{enrollment?.employeeId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Department:</span>
                <span>{enrollment?.department}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Enrolled:</span>
                <span>{enrollment?.enrolled}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Due:</span>
                <span>{enrollment?.due}</span>
              </div>
              {enrollment?.completed && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Completed:</span>
                  <span>{enrollment.completed}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{enrollment?.progress}%</span>
            </div>
            <Progress value={enrollment?.progress || 0} className="w-full" />
          </div>
          
          {enrollment?.timeSpent && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Time Spent:</span>
              <span>{enrollment.timeSpent}</span>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Actions</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Course
              </Button>
              <Button variant="outline" size="sm">
                Contact Learner
              </Button>
              <Button variant="outline" size="sm">
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};