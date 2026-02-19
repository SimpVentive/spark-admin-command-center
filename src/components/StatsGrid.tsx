import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Award, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  loading?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, gradient, iconBg, loading }: StatCardProps) {
  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg ${gradient}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">
              {loading ? "..." : value}
            </p>
            <p className="text-xs text-white/70 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid() {
  const { data: userCount, isLoading: usersLoading } = useQuery({
    queryKey: ['dashboard-user-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: programCount, isLoading: programsLoading } = useQuery({
    queryKey: ['dashboard-program-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('training_programs')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: deptCount, isLoading: deptsLoading } = useQuery({
    queryKey: ['dashboard-dept-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: assessmentCount, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['dashboard-assessment-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('assessments')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: trainerCount, isLoading: trainersLoading } = useQuery({
    queryKey: ['dashboard-trainer-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('trainers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: locationCount, isLoading: locationsLoading } = useQuery({
    queryKey: ['dashboard-location-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) throw error;
      return count || 0;
    }
  });

  const stats = [
    {
      title: "Total Employees",
      value: userCount?.toLocaleString() ?? "0",
      subtitle: "Registered profiles",
      icon: Users,
      gradient: "bg-gradient-to-br from-[hsl(220,90%,56%)] to-[hsl(250,80%,50%)]",
      iconBg: "bg-white/20",
      loading: usersLoading,
    },
    {
      title: "Active Programs",
      value: programCount?.toLocaleString() ?? "0",
      subtitle: "Training programs",
      icon: BookOpen,
      gradient: "bg-gradient-to-br from-[hsl(160,70%,40%)] to-[hsl(180,60%,35%)]",
      iconBg: "bg-white/20",
      loading: programsLoading,
    },
    {
      title: "Departments",
      value: deptCount?.toLocaleString() ?? "0",
      subtitle: "Active departments",
      icon: Award,
      gradient: "bg-gradient-to-br from-[hsl(30,95%,55%)] to-[hsl(15,90%,50%)]",
      iconBg: "bg-white/20",
      loading: deptsLoading,
    },
    {
      title: "Assessments",
      value: assessmentCount?.toLocaleString() ?? "0",
      subtitle: "Created assessments",
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-[hsl(280,70%,55%)] to-[hsl(310,60%,45%)]",
      iconBg: "bg-white/20",
      loading: assessmentsLoading,
    },
    {
      title: "Trainers",
      value: trainerCount?.toLocaleString() ?? "0",
      subtitle: "Active trainers",
      icon: Clock,
      gradient: "bg-gradient-to-br from-[hsl(340,75%,55%)] to-[hsl(360,70%,50%)]",
      iconBg: "bg-white/20",
      loading: trainersLoading,
    },
    {
      title: "Locations",
      value: locationCount?.toLocaleString() ?? "0",
      subtitle: "Active locations",
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-[hsl(190,80%,45%)] to-[hsl(210,70%,40%)]",
      iconBg: "bg-white/20",
      loading: locationsLoading,
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
