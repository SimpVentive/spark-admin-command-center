import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Users, Star, BookOpen } from "lucide-react";

interface CoursePreviewDialogProps {
  course: any;
}

export const CoursePreviewDialog = ({ course }: CoursePreviewDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{course?.title}</DialogTitle>
          <DialogDescription>
            Course preview and details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {course?.image_url && (
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={course.image_url} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{course?.provider_name}</Badge>
              <Badge variant="outline">{course?.level}</Badge>
              <Badge variant="outline">{course?.category}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {course?.duration_weeks} weeks
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {course?.student_count?.toLocaleString()} students
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                {course?.rating} rating
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                {course?.organization_enrollments} org enrollments
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {course?.description || "No description available."}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Instructor</h4>
              <p className="text-sm text-muted-foreground">
                {course?.instructor || "Not specified"}
              </p>
            </div>
            
            {course?.skills_covered && course.skills_covered.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Skills Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {course.skills_covered.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {course?.prerequisites && course.prerequisites.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Prerequisites</h4>
                <div className="flex flex-wrap gap-2">
                  {course.prerequisites.map((prereq: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  ${course?.price || 0}
                  {course?.price && course.price > 0 && (
                    <span className="text-sm text-muted-foreground ml-1">
                      /{course?.currency || 'USD'}
                    </span>
                  )}
                </span>
                <Button>
                  Add to Catalog
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};