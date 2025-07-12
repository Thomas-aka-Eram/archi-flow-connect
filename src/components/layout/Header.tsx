
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { currentProject, userRole } = useProject();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          {currentProject && (
            <>
              <div className="h-6 w-px bg-border" />
              <ProjectSwitcher />
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

          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-sm">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
