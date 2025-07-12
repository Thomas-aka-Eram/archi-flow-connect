
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
  Briefcase
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { currentProject, userRole } = useProject();
  const isCollapsed = state === "collapsed";

  const projectItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ['all'] },
    { title: "Project Management", url: "/manage", icon: Briefcase, roles: ['PM', 'Admin'] },
  ];

  const developmentItems = [
    { title: "SDLC Docs", url: "/sdlc", icon: FileText, roles: ['all'] },
    { title: "Tasks", url: "/tasks", icon: CheckSquare, roles: ['all'] },
    { title: "Reviews", url: "/reviews", icon: Users, roles: ['all'] },
    { title: "GitHub", url: "/github", icon: GitBranch, roles: ['Developer', 'PM', 'Admin'] },
  ];

  const analyticsItems = [
    { title: "Calendar", url: "/calendar", icon: Calendar, roles: ['all'] },
    { title: "Reports", url: "/reports", icon: BarChart3, roles: ['PM', 'Admin'] },
  ];

  const systemItems = [
    { title: "Notifications", url: "/notifications", icon: Bell, roles: ['all'] },
    { title: "Settings", url: "/settings", icon: Settings, roles: ['all'] },
  ];

  const getNavClass = (url: string) => {
    const isActive = location.pathname === url || 
                    (url !== "/" && location.pathname.startsWith(url));
    return isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";
  };

  const hasAccess = (itemRoles: string[]) => {
    return itemRoles.includes('all') || itemRoles.includes(userRole);
  };

  const renderMenuItems = (items: typeof projectItems) => {
    return items
      .filter(item => hasAccess(item.roles))
      .map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink to={item.url} className={getNavClass(item.url)}>
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ));
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
        {currentProject && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Project Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderMenuItems(projectItems)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Development</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderMenuItems(developmentItems)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderMenuItems(analyticsItems)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(systemItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
