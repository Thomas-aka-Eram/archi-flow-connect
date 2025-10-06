
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useUser } from '@/contexts/UserContext';
import { ProjectSwitcher } from './ProjectSwitcher';

export function Header() {
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { user, logout, loading } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="h-6 w-px bg-border" />
          <ProjectSwitcher />
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
                  <AvatarImage 
                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                    alt={user?.name || 'User'} 
                  />
                  <AvatarFallback className="text-sm">
                    {loading ? '...' : getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
