
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Draft' | 'Active' | 'Archived';
  client?: string;
  tags: string[];
  createdAt: string;
  visibility: 'Private' | 'Team-only' | 'Public';
  githubRepo?: string;
  members: ProjectMember[];
  milestones: Milestone[];
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Reviewer' | 'PM' | 'Admin';
  avatar?: string;
  completedTasks: number;
  pendingReviews: number;
}

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  responsibleLead: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project) => void;
  userRole: string;
  switchProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Ecommerce Storefront',
    description: 'Full-stack e-commerce platform with React frontend and Node.js backend',
    status: 'Active',
    client: 'TechCorp Inc.',
    tags: ['ecommerce', 'react', 'nodejs'],
    createdAt: '2024-06-15',
    visibility: 'Team-only',
    githubRepo: 'https://github.com/org/ecom-storefront',
    members: [
      { id: '1', name: 'Sophie Martinez', email: 'sophie@devhouse.com', role: 'PM', completedTasks: 15, pendingReviews: 3 },
      { id: '2', name: 'Luis Rodriguez', email: 'luis@devhouse.com', role: 'Developer', completedTasks: 12, pendingReviews: 2 },
      { id: '3', name: 'Raj Kumar', email: 'raj@devhouse.com', role: 'Developer', completedTasks: 18, pendingReviews: 1 },
      { id: '4', name: 'Aisha Patel', email: 'aisha@devhouse.com', role: 'Reviewer', completedTasks: 8, pendingReviews: 5 },
      { id: '5', name: 'Carlos Admin', email: 'carlos@devhouse.com', role: 'Admin', completedTasks: 5, pendingReviews: 0 }
    ],
    milestones: [
      { id: 'm1', title: 'Design Complete', dueDate: '2024-08-21', responsibleLead: 'Sophie', status: 'Completed' },
      { id: 'm2', title: 'API v1 Ready', dueDate: '2024-09-05', responsibleLead: 'Raj', status: 'In Progress' },
      { id: 'm3', title: 'Frontend MVP', dueDate: '2024-09-20', responsibleLead: 'Luis', status: 'Pending' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication',
    status: 'Draft',
    client: 'SecureBank',
    tags: ['mobile', 'banking', 'security'],
    createdAt: '2024-07-01',
    visibility: 'Private',
    members: [
      { id: '1', name: 'Sophie Martinez', email: 'sophie@devhouse.com', role: 'PM', completedTasks: 3, pendingReviews: 1 },
      { id: '3', name: 'Raj Kumar', email: 'raj@devhouse.com', role: 'Developer', completedTasks: 5, pendingReviews: 0 }
    ],
    milestones: [
      { id: 'm4', title: 'Security Audit', dueDate: '2024-08-15', responsibleLead: 'Raj', status: 'Pending' }
    ]
  }
];

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(mockProjects[0]);
  const [projects] = useState<Project[]>(mockProjects);
  const [userRole] = useState<string>('PM'); // This would come from auth context

  const switchProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      localStorage.setItem('currentProjectId', projectId);
    }
  };

  useEffect(() => {
    const savedProjectId = localStorage.getItem('currentProjectId');
    if (savedProjectId) {
      const project = projects.find(p => p.id === savedProjectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projects]);

  return (
    <ProjectContext.Provider value={{
      currentProject,
      projects,
      setCurrentProject,
      userRole,
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
