
import { useProject } from '@/contexts/ProjectContext';
import Dashboard from '@/pages/Dashboard';
import { Welcome } from '@/pages/Welcome';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { projects, isLoading, currentProject } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && projects.length > 0 && !currentProject) {
      // If projects are loaded, and there's no current project selected,
      // default to the first project.
      // This might happen on initial login.
      const firstProjectId = projects[0].id;
      navigate(`/project/${firstProjectId}/dashboard`);
    }
  }, [projects, isLoading, currentProject, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl">Loading projects...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return <Welcome />;
  }

  // If there are projects but no specific one is selected yet,
  // the useEffect above will handle redirection.
  // We can show a generic loading state or null.
  if (!currentProject) {
     return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl">Selecting project...</div>
      </div>
    );
  }

  // If a project is selected, show the main dashboard
  return <Dashboard />;
}
