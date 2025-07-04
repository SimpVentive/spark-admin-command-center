
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "Completed course",
      target: "React Advanced Patterns",
      time: "2 minutes ago",
      type: "completion"
    },
    {
      id: 2,
      user: "Mike Chen",
      action: "Started course",
      target: "TypeScript Fundamentals",
      time: "15 minutes ago",
      type: "enrollment"
    },
    {
      id: 3,
      user: "Emma Davis",
      action: "Earned skill badge",
      target: "Frontend Development",
      time: "1 hour ago",
      type: "achievement"
    },
    {
      id: 4,
      user: "Alex Thompson",
      action: "Updated profile",
      target: "Skills & Preferences",
      time: "2 hours ago",
      type: "profile"
    },
    {
      id: 5,
      user: "Lisa Wang",
      action: "Completed assessment",
      target: "JavaScript Basics Quiz",
      time: "3 hours ago",
      type: "assessment"
    }
  ];

  const getActivityBadge = (type: string) => {
    const badges = {
      completion: { label: "Completed", variant: "default" as const },
      enrollment: { label: "Started", variant: "secondary" as const },
      achievement: { label: "Badge", variant: "default" as const },
      profile: { label: "Updated", variant: "outline" as const },
      assessment: { label: "Quiz", variant: "secondary" as const }
    };
    return badges[type as keyof typeof badges] || badges.profile;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const badge = getActivityBadge(activity.type);
          return (
            <div key={activity.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{activity.user}</span>
                  <Badge variant={badge.variant} className="text-xs">
                    {badge.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
