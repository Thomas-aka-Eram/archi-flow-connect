
import React from 'react';
import { Button } from "@/components/ui/button";
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

  // Don't render the switcher if there are no projects to switch between.
  if (!currentProject || !projects || projects.length === 0) {
    return (
        <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">No Projects</span>
        </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="justify-between w-full max-w-[280px]">
          <div className="flex items-center gap-2 min-w-0">
            <FolderOpen className="h-4 w-4 flex-shrink-0" />
            <span className="truncate font-medium">{currentProject.name}</span>
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
                </div>
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
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
