
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal';
import { JoinProjectModal } from '@/components/dashboard/JoinProjectModal';
import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleProjectCreated = (projectId: string) => {
    setCreateModalOpen(false);
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Archi</h1>
        <p className="text-muted-foreground mt-2">
          Your central hub for actionable, traceable, and first-class documentation. Let's get you started.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Create a New Project Card */}
        <Card 
          className="cursor-pointer hover:border-primary transition-all"
          onClick={() => setCreateModalOpen(true)}
        >
          <CardHeader className="items-center text-center">
            <PlusCircle className="w-12 h-12 mb-4 text-primary" />
            <CardTitle className="text-xl">Create a New Project</CardTitle>
            <CardDescription>
              Build a new workspace from scratch. You'll be able to configure your SDLC phases, invite your team, and start creating documents.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>

        {/* Join an Existing Project Card */}
        <Card 
          className="cursor-pointer hover:border-primary transition-all border-dashed"
          onClick={() => setJoinModalOpen(true)}
        >
          <CardHeader className="items-center text-center">
            <Users className="w-12 h-12 mb-4 text-muted-foreground" />
            <CardTitle className="text-xl">Join an Existing Project</CardTitle>
            <CardDescription>
              Have an invite code from your team? Enter it here to get access to an existing project and start collaborating.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
      
      <JoinProjectModal
        isOpen={isJoinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
    </div>
  );
}
