
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { currentProject, userRole } = useProject();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole: string) => {
    // This would update the context in a real app
    console.log(`Switching to role: ${newRole}`);
  };

  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          {currentProject && (
            <>
              <div className="h-6 w-px bg-border" />
              <Badge variant="secondary" className="text-xs">
                {userRole}
              </Badge>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>John Doe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {isAdmin && (
                <>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Switch Role (Admin Only)
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleRoleSwitch('Developer')}>
                    View as Developer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch('PM')}>
                    View as PM
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch('Reviewer')}>
                    View as Reviewer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
