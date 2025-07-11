
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  Link, 
  MessageSquare, 
  Activity,
  FileText,
  Send,
  Edit
} from "lucide-react";

interface TaskModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

const mockTaskDetails = {
  'task-1': {
    id: 'task-1',
    title: 'Implement OAuth Login',
    assignee: 'Luis',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    phase: 'Development',
    domain: 'API',
    tags: ['#auth', '#login', '#oauth'],
    estimatedHours: 8,
    milestone: 'Authentication System',
    dueDate: '2024-07-15',
    description: 'Implement OAuth2 login flow with Google and GitHub providers. Include JWT token generation and refresh logic.',
    linkedBlocks: [
      { id: 'req-1', title: 'Login Feature', phase: 'Requirements' },
      { id: 'des-1', title: 'OAuth UI Flow', phase: 'Design' }
    ],
    activity: [
      { type: 'commit', message: 'feat: add Google OAuth integration', author: 'Luis', timestamp: '2024-07-11 14:30' },
      { type: 'comment', message: 'Working on JWT token generation', author: 'Luis', timestamp: '2024-07-11 10:15' }
    ],
    comments: [
      { id: 1, author: 'Raj', message: 'Should we include Apple login as well?', timestamp: '2024-07-10 16:20' },
      { id: 2, author: 'Luis', message: 'Let\'s focus on Google and GitHub first, then add Apple in next sprint', timestamp: '2024-07-10 16:25' }
    ]
  }
};

export function TaskModal({ taskId, isOpen, onClose }: TaskModalProps) {
  const [newComment, setNewComment] = useState('');
  const task = mockTaskDetails[taskId as keyof typeof mockTaskDetails];

  if (!task) return null;

  const handleSubmitComment = () => {
    console.log('Submitting comment:', newComment);
    setNewComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{task.status.replace('_', ' ')}</Badge>
                <Badge variant="outline">{task.priority}</Badge>
                <Badge variant="outline">{task.phase}</Badge>
                <Badge variant="outline">{task.domain}</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="details" className="h-full flex flex-col">
            <TabsList className="flex-shrink-0">
              <TabsTrigger value="details">Task Details</TabsTrigger>
              <TabsTrigger value="docs">
                <FileText className="h-4 w-4 mr-2" />
                Docs Context ({task.linkedBlocks.length})
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments ({task.comments.length})
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
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {task.assignee.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Due Date</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        {task.dueDate}
                      </div>
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
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
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
                  <p className="text-sm">{task.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="docs" className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium">Linked SDLC Blocks</h3>
                {task.linkedBlocks.map((block) => (
                  <Card key={block.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{block.title}</h4>
                          <p className="text-sm text-muted-foreground">{block.phase} Phase</p>
                        </div>
                        <Link className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-3">
                {task.activity.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {item.author.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
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
                  {task.comments.map((comment) => (
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
