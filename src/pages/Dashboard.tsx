
import React, { useState } from 'react';
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { TasksOverview } from "@/components/dashboard/TasksOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateProjectModal } from "@/components/dashboard/CreateProjectModal";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { useUser } from '@/contexts/UserContext';
import { useProject } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const { projects, addProject, currentProject } = useProject();
  const navigate = useNavigate();

  const handleProjectCreated = (newProject: { id: string }) => {
    console.log('New project created in modal, adding to context:', newProject);
    addProject(newProject);
    // The addProject function now handles switching to the new project.
    // We can also navigate to a project-specific page.
    console.log(`Navigating to /project/${newProject.id}/settings`);
    navigate(`/project/${newProject.id}/settings`); // Or another default page
  };

  // The project fetching is now handled in the Layout, so we can assume `projects` is populated.
  // We can add a loading state to the context if we want to show a spinner here.
  const loading = !projects;

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your projects today.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <EmptyDashboard openModal={() => setIsModalOpen(true)} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Projects</h2>
                </div>
                <div className="grid gap-6">
                  {projects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      title={project.name}
                      description={project.description}
                      // These are placeholders until the project model is expanded
                      progress={0} 
                      priority="N/A"
                      dueDate="N/A"
                      teamMembers={[]}
                      tasksDone={0}
                      totalTasks={0}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <TasksOverview taskStats={[]}/>
                <RecentActivity activities={[]}/>
              </div>
            </div>
          </>
        )}
      </div>
      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}
