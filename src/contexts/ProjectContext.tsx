
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '@/lib/api';

// Keeping the detailed interfaces for now, but the API will return a simpler Project object first.
// We can expand this later.
interface Project {
  id: string;
  name:string;
  description: string;
  userRole?: string;
}

// interface ProjectMember {
//   id: string;
//   name: string;
//   email: string;
//   role: 'Developer' | 'Reviewer' | 'PM' | 'Admin';
//   avatar?: string;
//   completedTasks: number;
//   pendingReviews: number;
// }

// interface Milestone {
//   id: string;
//   title: string;
//   dueDate: string;
//   responsibleLead: string;
//   status: 'Pending' | 'In Progress' | 'Completed';
// }

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => void;
  currentProjectUserRole: string | undefined;
  switchProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const params = useParams();
  // const [userRole] = useState<string>('PM'); // This would come from auth context

  const fetchProjects = useCallback(async () => {
    console.log('Fetching projects...');
    try {
      const response = await apiClient.get('/projects');
      console.log('API response for projects:', response);
      const fetchedProjects = response.data;
      setProjects(fetchedProjects);
      console.log('Projects state updated:', fetchedProjects);

      // After fetching, set the current project
      const projectIdFromUrl = params.projectId;
      const savedProjectId = localStorage.getItem('currentProjectId');
      const targetProjectId = projectIdFromUrl || savedProjectId;

      if (targetProjectId) {
        const projectToSet = fetchedProjects.find(p => p.id === targetProjectId);
        if (projectToSet) {
          setCurrentProject(projectToSet);
          console.log('Set current project:', projectToSet);
        } else if (fetchedProjects.length > 0) {
          // If saved project not found, default to the first one
          setCurrentProject(fetchedProjects[0]);
          localStorage.setItem('currentProjectId', fetchedProjects[0].id);
          console.log('Defaulted to first project:', fetchedProjects[0]);
        }
      } else if (fetchedProjects.length > 0) {
        // If no project saved, default to the first one
        setCurrentProject(fetchedProjects[0]);
        localStorage.setItem('currentProjectId', fetchedProjects[0].id);
        console.log('No saved project, defaulted to first project:', fetchedProjects[0]);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Handle error appropriately, maybe clear projects or show a toast
      setProjects([]);
    }
  }, [params.projectId]);

  const addProject = (project: Project) => {
    console.log('Adding new project to context:', project);
    const newProjects = [...projects, project];
    setProjects(newProjects);
    console.log('Projects state after adding:', newProjects);
    // Switch to the new project immediately
    switchProject(project.id);
  };

  const switchProject = (projectId: string) => {
    console.log('Switching to projectId:', projectId);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      localStorage.setItem('currentProjectId', projectId);
      console.log('Current project switched to:', project);
      // Navigate to the new project's dashboard, which will update the URL
      // and ensure all components re-render with the correct context.
      navigate(`/project/${projectId}/dashboard`);
    } else {
      console.warn(`Project with id ${projectId} not found in context.`);
    }
  };

  return (
    <ProjectContext.Provider value={{
      currentProject,
      projects,
      setCurrentProject,
      setProjects,
      fetchProjects,
      addProject,
      currentProjectUserRole: currentProject?.userRole,
      switchProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
