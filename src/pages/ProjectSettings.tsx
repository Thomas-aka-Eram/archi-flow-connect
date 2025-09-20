
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@/lib/api';
import { useProject } from '@/contexts/ProjectContext';

// Define a simple type for the project, can be expanded later
interface Project {
  id: string;
  name: string;
  description: string;
  // Add other fields as needed from the API response
}

export default function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, switchProject } = useProject();
  const [project, setProject] = useState<Project | null>(currentProject);
  const [loading, setLoading] = useState(!currentProject);

  useEffect(() => {
    // If the project is already the current one in context, no need to fetch
    if (currentProject && currentProject.id === projectId) {
      console.log('Project already in context:', currentProject);
      setProject(currentProject);
      setLoading(false);
      return;
    }

    // If the project is not in context, or the ID is different, fetch it
    const fetchProject = async () => {
      console.log('Fetching project with id:', projectId);
      setLoading(true);
      try {
        const response = await apiClient.get(`/projects/${projectId}`);
        console.log('Fetched project data:', response.data);
        setProject(response.data);
        // Optionally, update the global context that this is the current project
        switchProject(response.data.id);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        // Handle error (e.g., show a not found message)
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, currentProject, switchProject]);

  if (loading) {
    return <div>Loading project settings...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings for {project.name}</h1>
      <p className="text-muted-foreground mb-6">
        {project.description}
      </p>
      {/* Project settings form and content will go here */}
      <pre className="mt-4 p-4 bg-muted rounded-lg">
        <code>{JSON.stringify(project, null, 2)}</code>
      </pre>
    </div>
  );
}
