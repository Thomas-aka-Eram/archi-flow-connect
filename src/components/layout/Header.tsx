
import { Search, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { useProject } from "@/contexts/ProjectContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

export function Header() {
  const { currentProject, userRole } = useProject();
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (!currentProject) return [];
    
    const breadcrumbs = [
      { label: currentProject.name, href: `/projects/${currentProject.id}` }
    ];
    
    if (segments.includes('sdlc')) {
      breadcrumbs.push({ label: 'SDLC Docs', href: '/sdlc' });
    } else if (segments.includes('tasks')) {
      breadcrumbs.push({ label: 'Tasks', href: '/tasks' });
    } else if (segments.includes('reviews')) {
      breadcrumbs.push({ label: 'Reviews', href: '/reviews' });
    } else if (segments.includes('manage')) {
      breadcrumbs.push({ label: 'Project Management', href: `/projects/${currentProject.id}/manage` });
    }
    
    return breadcrumbs;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-500/10 text-red-700';
      case 'PM': return 'bg-blue-500/10 text-blue-700';
      case 'Developer': return 'bg-green-500/10 text-green-700';
      case 'Reviewer': return 'bg-purple-500/10 text-purple-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center gap-4 px-6">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        
        {/* Project Switcher */}
        <ProjectSwitcher />
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <>
            <div className="h-4 w-px bg-border" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem key={crumb.href}>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
        
        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={currentProject ? `Search in ${currentProject.name}...` : "Search tasks, docs, or projects..."} 
              className="pl-10 bg-background/50 border-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Role Badge */}
          {userRole && (
            <Badge variant="outline" className={getRoleColor(userRole)}>
              {userRole}
            </Badge>
          )}
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm">Sophie Martinez</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
