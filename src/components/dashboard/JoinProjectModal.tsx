
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api';

interface JoinProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinProjectModal({ isOpen, onClose }: JoinProjectModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleJoinProject = async () => {
    if (!inviteCode.trim()) {
      toast({
        title: "Invite code is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/projects/join', { inviteCode });
      const { projectId } = response.data;
      
      toast({
        title: "Successfully joined project!",
      });
      onClose();
      navigate(`/project/${projectId}`);
    } catch (error: any) {
      toast({
        title: "Failed to join project",
        description: error.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join an Existing Project</DialogTitle>
          <DialogDescription>
            Enter the invite code you received to join a project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="invite-code" className="text-right">
              Invite Code
            </Label>
            <Input
              id="invite-code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="col-span-3"
              placeholder="Paste your invite code here"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleJoinProject} disabled={isLoading}>
            {isLoading ? 'Joining...' : 'Join Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
