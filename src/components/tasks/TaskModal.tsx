
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  Link, 
  MessageSquare, 
  Activity,
  FileText,
  Send,
  Edit,
  GitCommit
} from "lucide-react";

import { useUser } from '@/contexts/UserContext';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface TaskModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ taskId, isOpen, onClose }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState<any>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await apiClient.get(`/tasks/${taskId}`);
      return response.data;
    },
    enabled: !!taskId,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        assignees: task.assignees.map((a: any) => ({ userId: a.user.id, role: a.role || 'developer' })),
      });
    }
  }, [task]);

  const { data: members } = useQuery({
    queryKey: ['project-members', task?.projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${task.projectId}/members`);
      return response.data;
    },
    enabled: !!task?.projectId,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updatedFields: any) =>
      apiClient.patch(`/tasks/${taskId}`, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      toast({
        title: "Task updated",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAssigneeChange = (userId: string) => {
    handleFieldChange('assignees', [{ userId, role: 'developer' }]);
  };

  const handleSave = () => {
    updateTaskMutation.mutate(formData);
  };

  

  

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>Loading...</DialogContent>
      </Dialog>
    );
  }

  if (isError || !task) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>Error loading task.</DialogContent>
      </Dialog>
    );
  }

  const handleSubmitComment = () => {
    console.log('Submitting comment:', newComment);
    setNewComment('');
  };

  const handleStatusChange = (newStatus: string) => {
    console.log("Current user:", user);
    console.log("Task assignees:", task.assignees);
    const isAssignee = task.assignees.some((a: any) => a.user.id === user?.userId);
    console.log("Is current user an assignee?", isAssignee);

    if (isAssignee) {
      updateTaskMutation.mutate({ status: newStatus });
    } else {
      toast({
        title: "Permission denied",
        description: "Only assignees can update the task status.",
        variant: "destructive",
      });
    }
  };

  const handleOpenDocument = (blockId: string) => {
    console.log('Opening document:', blockId);
    // Navigate to SDLC document
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              {isEditing ? (
                <Input
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="text-xl font-bold"
                />
              ) : (
                <DialogTitle className="text-xl">{task.title}</DialogTitle>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{task.status.replace('_', ' ')}</Badge>
                <Badge variant="outline">{task.priority}</Badge>
                <Badge variant="outline">{task.phase}</Badge>
                <Badge variant="outline">{task.domain}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {isEditing && (
                <Button size="sm" onClick={handleSave} disabled={updateTaskMutation.isPending}>
                  {updateTaskMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="details" className="h-full flex flex-col">
            <TabsList className="flex-shrink-0">
              <TabsTrigger value="details">Task Details</TabsTrigger>
              <TabsTrigger value="docs">
                <FileText className="h-4 w-4 mr-2" />
                Docs Context ({(task.linkedBlocks || []).length})
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments ({(task.comments || []).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Task Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Assignee</span>
                      {isEditing ? (
                        <Select
                          value={formData.assignees[0]?.userId}
                          onValueChange={handleAssigneeChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {(members || []).map((member: any) => (
                              <SelectItem key={member.user.id} value={member.user.id}>
                                {member.user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {(task.assignees[0]?.user?.name || '').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignees[0]?.user?.name || 'Unassigned'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Due Date</span>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          {task.dueDate}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Hours</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        {task.estimatedHours}h
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Milestone</span>
                      <span className="text-sm">{task.milestone}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {(task.tags || []).map((taskTag) => (
                        <Badge key={taskTag.id} variant="secondary" className="text-xs">
                          {taskTag.tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      rows={5}
                    />
                  ) : (
                    <p className="text-sm">{task.description}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="docs" className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium">Linked SDLC Blocks</h3>
                {(task.linkedBlocks || []).map((block) => (
                  <Card key={block.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{block.title}</h4>
                            <Badge variant="outline" className="text-xs">{block.phase} Phase</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">
                            <div 
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ 
                                __html: block.content.replace(/\n/g, '<br />').substring(0, 200) + '...' 
                              }}
                            />
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDocument(block.id)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Open Document
                          </Button>
                        </div>
                        <Link className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-3">
                {(task.activity || []).map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {item.type === 'commit' ? (
                            <GitCommit className="h-4 w-4 text-green-500" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{item.author}</span>
                            <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                          </div>
                          <p className="text-sm">{item.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  {(task.comments || []).map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {comment.author.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm">{comment.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
