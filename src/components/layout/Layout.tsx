
import { useEffect } from "react";
import { Header } from "./Header";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useProject } from "@/contexts/ProjectContext";
import { useUser } from "@/contexts/UserContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { fetchProjects } = useProject();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log('Layout mounted with user, fetching projects...');
      fetchProjects();
    } else {
      console.log('Layout mounted without user, not fetching projects.');
    }
  }, [user, fetchProjects]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
