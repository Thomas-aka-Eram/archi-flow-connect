
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Layout } from "@/components/layout/Layout";
import SDLCDocumentation from "./pages/SDLCDocumentation";
import TaskManagement from "./pages/TaskManagement";
import ReviewApproval from "./pages/ReviewApproval";
import GitHubIntegration from "./pages/GitHubIntegration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sdlc" element={<Layout><SDLCDocumentation /></Layout>} />
          <Route path="/tasks" element={<Layout><TaskManagement /></Layout>} />
          <Route path="/reviews" element={<Layout><ReviewApproval /></Layout>} />
          <Route path="/github" element={<Layout><GitHubIntegration /></Layout>} />
          <Route path="/calendar" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div></Layout>} />
          <Route path="/reports" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div></Layout>} />
          <Route path="/notifications" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div></Layout>} />
          <Route path="/settings" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
