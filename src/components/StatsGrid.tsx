
import { DashboardCard } from "./DashboardCard";
import { Users, BookOpen, Award, TrendingUp, Clock, CheckCircle } from "lucide-react";

export function StatsGrid() {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      subtitle: "Active employees",
      icon: Users,
      trend: { value: "12%", isPositive: true }
    },
    {
      title: "Active Courses",
      value: "156",
      subtitle: "Available courses",
      icon: BookOpen,
      trend: { value: "8%", isPositive: true }
    },
    {
      title: "Skills Tracked",
      value: "89",
      subtitle: "Skill categories",
      icon: Award,
      trend: { value: "3%", isPositive: true }
    },
    {
      title: "Completion Rate",
      value: "87%",
      subtitle: "Course completion",
      icon: CheckCircle,
      trend: { value: "5%", isPositive: true }
    },
    {
      title: "Avg. Learning Time",
      value: "4.2h",
      subtitle: "Per week per user",
      icon: Clock,
      trend: { value: "0.3h", isPositive: true }
    },
    {
      title: "Engagement Score",
      value: "94%",
      subtitle: "User activity rate",
      icon: TrendingUp,
      trend: { value: "2%", isPositive: true }
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <DashboardCard key={index} {...stat} />
      ))}
    </div>
  );
}
