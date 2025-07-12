
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Layout } from '@/components/layout/Layout';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { TagsDomainsProvider } from '@/contexts/TagsDomainsContext';

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
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <TagsDomainsProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Main app routes with layout */}
              <Route path="/*" element={
                <SidebarProvider>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/manage" element={<ProjectManagement />} />
                      <Route path="/sdlc" element={<SDLCDocumentation />} />
                      <Route path="/tasks" element={<TaskManagement />} />
                      <Route path="/reviews" element={<ReviewApproval />} />
                      <Route path="/github" element={<GitHubIntegration />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </SidebarProvider>
              } />
            </Routes>
          </Router>
        </TagsDomainsProvider>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

export default App;
