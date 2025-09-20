
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  GitBranch, 
  Users, 
  Bell, 
  Settings,
  Calendar,
  FileText,
  BarChart3,
  Briefcase,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProject } from "@/contexts/ProjectContext";
import { ProjectSwitcher } from "./ProjectSwitcher";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const params = useParams();
  const { currentProject } = useProject();
  const isCollapsed = state === "collapsed";
  const [projectOverviewOpen, setProjectOverviewOpen] = useState(true);

  // Use the projectId from the URL if available, otherwise from the context
  const projectId = params.projectId || currentProject?.id;

  // Define routes that are project-specific
  const projectScopedItems = [
    { title: "Dashboard", url: "/project/:projectId/dashboard", icon: LayoutDashboard, roles: ['all'] },
    { title: "Analytics", url: "/project/:projectId/analytics", icon: BarChart3, roles: ['PM', 'Admin'] },
    { title: "Manage", url: "/project/:projectId/manage", icon: Briefcase, roles: ['PM', 'Admin'] },
    { title: "SDLC Docs", url: "/project/:projectId/sdlc", icon: FileText, roles: ['all'] },
    { title: "Tasks", url: "/project/:projectId/tasks", icon: CheckSquare, roles: ['all'] },
    { title: "Reviews", url: "/project/:projectId/reviews", icon: Users, roles: ['all'] },
    { title: "GitHub", url: "/project/:projectId/github", icon: GitBranch, roles: ['Developer', 'PM', 'Admin'] },
    { title: "Reports", url: "/project/:projectId/reports", icon: BarChart3, roles: ['PM', 'Admin'] },
    { title: "Settings", url: "/project/:projectId/settings", icon: Settings, roles: ['all'] },
  ];

  // Define global routes
  const globalItems = [
    { title: "Calendar", url: "/calendar", icon: Calendar, roles: ['all'] },
    { title: "Notifications", url: "/notifications", icon: Bell, roles: ['all'] },
    { title: "Global Settings", url: "/settings", icon: Settings, roles: ['all'] },
  ];

  const getNavClass = (url: string) => {
    const isActive = location.pathname === url || 
                    (url !== "/" && location.pathname.startsWith(url.split('/:')[0])); // Match base path for dynamic routes
    return isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";
  };

  const hasAccess = (itemRoles: string[]) => {
    // In a real app, userRole would come from a user/auth context
    const userRole = 'Admin'; 
    return itemRoles.includes('all') || itemRoles.includes(userRole);
  };

  const renderMenuItems = (items: typeof globalItems, isProjectScoped = false) => {
    return items
      .filter(item => hasAccess(item.roles))
      .map((item) => {
        // If the link is project-scoped and there's no active project, disable it.
        if (isProjectScoped && !projectId) {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className="cursor-not-allowed opacity-50" disabled>
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }
        
        const finalUrl = isProjectScoped ? item.url.replace(':projectId', projectId!) : item.url;
        console.log(`Rendering nav link: ${item.title} -> ${finalUrl}`);

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <NavLink to={finalUrl} className={getNavClass(finalUrl)}>
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      });
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-6">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold">Archi</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Project Section */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setProjectOverviewOpen(!projectOverviewOpen)}
          >
            <span>Project</span>
            {!isCollapsed && (
              projectOverviewOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            )}
          </SidebarGroupLabel>
          
          {projectOverviewOpen && (
            <SidebarGroupContent>
              {!isCollapsed && (
                <div className="px-2 mb-3">
                  <ProjectSwitcher />
                </div>
              )}
              <SidebarMenu>
                {renderMenuItems(projectScopedItems, true)}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Global Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Global</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(globalItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
