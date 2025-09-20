
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyDashboardProps {
  openModal: () => void;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ openModal }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-10 text-center border-2 border-dashed rounded-lg">
      <h2 className="text-2xl font-semibold mb-2">No Projects Yet</h2>
      <p className="text-muted-foreground mb-4">
        It looks like you haven't created any projects. Get started by creating your first project.
      </p>
      <Button onClick={openModal}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Project
      </Button>
    </div>
  );
};
