import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@/lib/api';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";

// Define a simple type for the project, can be expanded later
interface Project {
  id: string;
  name: string;
  description: string;
  // Add other fields as needed from the API response
}

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function InvitationModal({ isOpen, onClose, projectId }) {
  const [role, setRole] = useState('Developer');
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!invitation) return;

    const interval = setInterval(() => {
      const expiresAt = new Date(invitation.expiresAt).getTime();
      const now = new Date().getTime();
      const distance = expiresAt - now;
      setTimeLeft(Math.max(0, distance));
    }, 1000);

    return () => clearInterval(interval);
  }, [invitation]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/invitations', {
        projectId,
        roleOnJoin: role,
      });
      setInvitation(response.data);
    } catch (error: any) {
      console.error('Failed to generate invitation:', error);
      toast({
        title: "Failed to generate invitation",
        description: error.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
        </DialogHeader>
        {!invitation ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                    <SelectItem value="Contributor">Contributor</SelectItem>
                    <SelectItem value="QA">QA</SelectItem>
                    <SelectItem value="Bot">Bot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Invitation'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-4">
            <p>
              Share this code with the person you want to invite. It expires in{' '}
              {formatTime(timeLeft)}.
            </p>
            <div className="flex items-center space-x-2">
              <Input value={invitation.code} readOnly />
              <Button
                onClick={() => navigator.clipboard.writeText(invitation.code)}
                variant="outline"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, switchProject } = useProject();
  const [project, setProject] = useState<Project | null>(currentProject);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(!currentProject);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const [projectResponse, membersResponse] = await Promise.all([
          apiClient.get(`/projects/${projectId}`),
          apiClient.get(`/projects/${projectId}/members`),
        ]);
        setProject(projectResponse.data);
        setMembers(membersResponse.data);
        if (!currentProject || currentProject.id !== projectId) {
          switchProject(projectResponse.data.id);
        }
      } catch (error) {
        console.error('Failed to fetch project data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, currentProject, switchProject]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiClient.patch(`/projects/${projectId}/members/${userId}`, {
        role: newRole,
      });
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === userId ? { ...member, role: newRole } : member,
        ),
      );
    } catch (error) {
      console.error('Failed to update member role:', error);
    }
  };

  if (loading) {
    return <div>Loading project settings...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings for {project.name}</h1>
      <p className="text-muted-foreground mb-6">{project.description}</p>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Members</h2>
          <Button onClick={() => setInviteModalOpen(true)}>Invite</Button>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name ?? member.user?.name}</TableCell>
                  <TableCell>{member.email ?? member.user?.email}</TableCell>
                  <TableCell>
                    <Select
                      value={member.role}
                      onValueChange={(newRole) =>
                        handleRoleChange(member.id, newRole)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Developer">Developer</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                        <SelectItem value="Contributor">Contributor</SelectItem>
                        <SelectItem value="QA">QA</SelectItem>
                        <SelectItem value="Bot">Bot</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <InvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        projectId={project.id}
      />
    </div>
  );
}