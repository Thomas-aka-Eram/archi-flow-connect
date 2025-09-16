
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
import Analytics from '@/pages/Analytics';
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
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Main app routes with layout */}
              <Route 
                path="/dashboard" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/dashboard/analytics" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </SidebarProvider>
                } 
              />
               <Route 
                path="/dashboard/manage" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <ProjectManagement />
                    </Layout>
                  </SidebarProvider>
                } 
              />
                <Route 
                path="/dashboard/sdlc" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <SDLCDocumentation />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/dashboard/tasks" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <TaskManagement />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/dashboard/reviews" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <ReviewApproval />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/dashboard/github" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <GitHubIntegration />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/dashboard/calendar" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <Calendar />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/dashboard/reports" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <Reports />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/dashboard/notifications" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/dashboard/settings" 
                element={
                  <SidebarProvider>
                    <Layout>
                      <Settings />
                    </Layout>
                  </SidebarProvider>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TagsDomainsProvider>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

export default App;
