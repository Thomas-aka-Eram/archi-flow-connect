
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserDisplay } from '../user/UserDisplay';
import { 
  Calendar, 
  Clock, 
  Link, 
  MessageSquare, 
  Activity,
  FileText,
  Send,
  Edit,
  GitCommit,
  CheckCircle
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { RelatedDocs } from './RelatedDocs';

import { CompletionModal } from './CompletionModal';
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
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
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
        assignees: (task.assignees || [])
          .filter((a: any) => a && a.user)
          .map((a: any) => ({ userId: a.user.id, role: a.role || 'developer' })),
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
      setIsCompletionModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addFeedbackMutation = useMutation({
    mutationFn: (comments: string) =>
      apiClient.post(`/tasks/${taskId}/feedback`, { comments }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      setNewComment('');
      toast({
        title: "Feedback submitted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit feedback",
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

  const handleCompleteTask = (completionData: { actualHours: number; completionNotes: string; commitId?: string }) => {
    updateTaskMutation.mutate({
      ...completionData,
      status: 'COMPLETED',
    });
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

  const tagIds = (task.tags || [])
    .map((t: any) => t?.tag?.id)
    .filter(Boolean);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      addFeedbackMutation.mutate(newComment.trim());
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const isAssignee = task.assignees.some((a: any) => a.user.id === user?.userId);

    if (!isAssignee) {
      toast({
        title: "Permission denied",
        description: "Only assignees can update the task status.",
        variant: "destructive",
      });
      return;
    }

    if (newStatus === 'COMPLETED') {
      setIsCompletionModalOpen(true);
    } else {
      updateTaskMutation.mutate({ status: newStatus });
    }
  };

  const handleOpenDocument = (blockId: string) => {
    console.log('Opening document:', blockId);
    // Navigate to SDLC document
  };

  return (
    <>
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
                  <Badge variant="outline">{task.phase?.title}</Badge>
                  <Badge variant="outline">{task.domain?.title}</Badge>
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
                  Docs Context
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="comments">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback ({(task.feedback || []).length})
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
                              {(members && members.length > 0) ? (
                                members
                                  .filter((member: any) => member && member.id)
                                  .map((member: any) => (
                                    <SelectItem key={member.id} value={member.id}>
                                      {member.name}
                                    </SelectItem>
                                  ))
                              ) : (
                                <div className="p-2 text-sm text-muted-foreground">No members to assign.</div>
                              )}
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
                          {task.estimateHours}h
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
                        {(task.tags || [])
                          .filter(taskTag => taskTag && taskTag.tag)
                          .map((taskTag) => (
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
                {task.domain?.id && (
                  <RelatedDocs
                    domainId={task.domain.id}
                    tagIds={tagIds}
                  />
                )}
                <div className="space-y-3">
                  <h3 className="font-medium">Linked SDLC Blocks</h3>
                  {(task.linkedBlocks || []).map((block) => (
                    <Card key={block.id} className="cursor-pointer hover-shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{block.title}</h4>
                              <Badge variant="outline" className="text-xs">{block.phase} Phase</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">
                              <ReactMarkdown 
                                rehypePlugins={[rehypeRaw]}
                                className="prose prose-sm max-w-none prose-invert"
                              >
                                {block.content.substring(0, 200) + '...'}
                              </ReactMarkdown>
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
                    {(task.feedback || []).map((feedbackItem) => (
                      <Card key={feedbackItem.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <UserDisplay userId={feedbackItem.userId} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-muted-foreground">{new Date(feedbackItem.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-sm">{feedbackItem.comments}</p>
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
                          <Button onClick={handleSubmitComment} disabled={!newComment.trim() || addFeedbackMutation.isPending}>
                            {addFeedbackMutation.isPending ? 'Submitting...' : 'Comment'}
                            <Send className="h-4 w-4 ml-2" />
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
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onSubmit={handleCompleteTask}
      />
    </>
  );
}

