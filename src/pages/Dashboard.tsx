
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { TasksOverview } from "@/components/dashboard/TasksOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Zap, Target } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Complete redesign of the shopping experience with modern UI/UX",
    progress: 75,
    priority: "HIGH" as const,
    dueDate: "Mar 21",
    teamMembers: [
      { name: "Raj Kumar", initials: "RK" },
      { name: "Luis Garcia", initials: "LG" },
      { name: "Aisha Patel", initials: "AP" },
      { name: "Sophie Martinez", initials: "SM" },
    ],
    tasksDone: 18,
    totalTasks: 24,
    isFavorite: true,
  },
  {
    title: "Authentication System",
    description: "OAuth integration with multi-factor authentication support",
    progress: 45,
    priority: "MEDIUM" as const,
    dueDate: "Apr 5",
    teamMembers: [
      { name: "Carlos Rodriguez", initials: "CR" },
      { name: "Raj Kumar", initials: "RK" },
    ],
    tasksDone: 9,
    totalTasks: 20,
  },
];

const metrics = [
  {
    icon: TrendingUp,
    label: "Sprint Velocity",
    value: "32 pts",
    change: "+12%",
    positive: true,
  },
  {
    icon: Calendar,
    label: "Days Remaining",
    value: "14",
    change: "Current Sprint",
    positive: null,
  },
  {
    icon: Zap,
    label: "Team Productivity",
    value: "94%",
    change: "+8%",
    positive: true,
  },
  {
    icon: Target,
    label: "Goals Met",
    value: "7/8",
    change: "This Month",
    positive: true,
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, Sophie!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    {metric.positive !== null && (
                      <Badge 
                        variant="outline" 
                        className={
                          metric.positive 
                            ? "text-green-500 border-green-500/20 bg-green-500/10" 
                            : "text-red-500 border-red-500/20 bg-red-500/10"
                        }
                      >
                        {metric.change}
                      </Badge>
                    )}
                    {metric.positive === null && (
                      <span className="text-xs text-muted-foreground">{metric.change}</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Projects</h2>
            <Badge variant="outline">2 Projects</Badge>
          </div>
          <div className="grid gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TasksOverview />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
