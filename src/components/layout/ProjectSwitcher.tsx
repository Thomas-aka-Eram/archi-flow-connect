
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, FolderOpen } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

export function ProjectSwitcher() {
  const { currentProject, projects, switchProject } = useProject();

  if (!currentProject) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-700';
      case 'Draft': return 'bg-yellow-500/10 text-yellow-700';
      case 'Archived': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="justify-between w-full max-w-[280px]">
          <div className="flex items-center gap-2 min-w-0">
            <FolderOpen className="h-4 w-4 flex-shrink-0" />
            <span className="truncate font-medium">{currentProject.name}</span>
            <Badge variant="outline" className={`text-xs flex-shrink-0 ${getStatusColor(currentProject.status)}`}>
              {currentProject.status}
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => switchProject(project.id)}
            className={`p-3 ${currentProject.id === project.id ? 'bg-muted' : ''}`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">{project.name}</span>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{project.members.length} members</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{project.milestones.length} milestones</span>
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
