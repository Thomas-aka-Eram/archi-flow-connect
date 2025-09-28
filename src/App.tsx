import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Layout } from '@/components/layout/Layout';
import { ProjectProvider, useProject } from '@/contexts/ProjectContext';
import { TagsDomainsProvider } from '@/contexts/TagsDomainsContext';
import { UserProvider } from '@/contexts/UserContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster";

// Pages
import Dashboard from '@/pages/Dashboard';
import TaskManagement from '@/pages/TaskManagement';
import SDLCDocumentation from '@/pages/SDLCDocumentation';
import ReviewApproval from '@/pages/ReviewApproval';
import GitHubIntegration from '@/pages/GitHubIntegration';
import ProjectManagement from '@/pages/ProjectManagement';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import Calendar from '@/pages/Calendar';
import Reports from '@/pages/Reports';
import Analytics from '@/pages/Analytics';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import { Home } from '@/pages/Home';
import ProjectSettings from '@/pages/ProjectSettings';

const queryClient = new QueryClient();

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SidebarProvider>
    <Layout>
      {children}
    </Layout>
  </SidebarProvider>
);

// A component to handle redirection to the current project's dashboard
const HomeRedirect: React.FC = () => {
  const { currentProject } = useProject();
  if (currentProject) {
    console.log(`Redirecting to project dashboard: /project/${currentProject.id}/dashboard`);
    return <Navigate to={`/project/${currentProject.id}/dashboard`} replace />;
  }
  // If there's no current project, maybe they have no projects yet.
  // The Dashboard page can handle this case (e.g., show "Create a project" message).
  console.log("No current project, redirecting to dashboard page to handle empty state.");
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ProjectProvider>
          <TagsDomainsProvider>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  {/* Redirect from /home to the current project's dashboard */}
                  <Route path="/home" element={<HomeRedirect />} />
                  
                  {/* Project-scoped routes */}
                  <Route path="/project/:projectId">
                    <Route path="dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                    <Route path="analytics" element={<AppLayout><Analytics /></AppLayout>} />
                    <Route path="manage" element={<AppLayout><ProjectManagement /></AppLayout>} />
                    <Route path="sdlc" element={<AppLayout><SDLCDocumentation /></AppLayout>} />
                    <Route path="tasks" element={<AppLayout><TaskManagement /></AppLayout>} />
                    <Route path="reviews" element={<AppLayout><ReviewApproval /></AppLayout>} />
                    <Route path="github" element={<AppLayout><GitHubIntegration /></AppLayout>} />
                    <Route path="reports" element={<AppLayout><Reports /></AppLayout>} />
                    <Route path="settings" element={<AppLayout><ProjectSettings /></AppLayout>} />
                  </Route>

                  {/* Global routes */}
                  <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                  <Route path="/calendar" element={<AppLayout><Calendar /></AppLayout>} />
                  <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
                  <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
          </TagsDomainsProvider>
        </ProjectProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;