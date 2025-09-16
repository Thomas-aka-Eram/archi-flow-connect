
import React, { useState, useEffect } from 'react';
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { TasksOverview } from "@/components/dashboard/TasksOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Zap, Target, Plus } from "lucide-react";
import apiClient from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { CreateProjectModal } from "@/components/dashboard/CreateProjectModal";

// Define a type for the project structure
interface Project {
  id: string;
  name: string;
  description: string;
  // Add other properties that you expect from the API
  // For now, we'll keep it simple and match the ProjectCard props loosely
}

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/projects');
        setProjects(response.data);
      } catch (error: any) {
        toast({
          title: "Failed to fetch projects",
          description: error.message || "Could not load project data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome back, Sophie!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your projects today.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
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
              <Badge variant="outline">{projects.length} Projects</Badge>
            </div>
            <div className="grid gap-6">
              {loading ? (
                <p>Loading projects...</p>
              ) : (
                projects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    title={project.name}
                    description={project.description}
                    // The following props are placeholders as the API doesn't provide them yet
                    progress={50}
                    priority="MEDIUM"
                    dueDate="N/A"
                    teamMembers={[]}
                    tasksDone={0}
                    totalTasks={0}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TasksOverview />
            <RecentActivity />
          </div>
        </div>
      </div>
      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}
