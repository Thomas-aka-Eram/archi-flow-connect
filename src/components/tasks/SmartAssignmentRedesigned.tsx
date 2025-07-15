import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, Clock, Star, TrendingUp, Users, Zap, CheckCircle } from "lucide-react";

const mockTasks = [
  {
    id: '1',
    title: 'Implement JWT Refresh Logic',
    description: 'Add automatic token refresh functionality',
    tags: ['#auth', '#jwt', '#api'],
    domain: 'Backend',
    estimatedHours: 6,
    status: 'unassigned'
  },
  {
    id: '2',
    title: 'Design Password Strength UI',
    description: 'Create password strength indicator component',
    tags: ['#ui', '#password', '#component'],
    domain: 'Frontend',
    estimatedHours: 4,
    status: 'unassigned'
  },
  {
    id: '3',
    title: 'Fix Cart Sync Issues',
    description: 'Resolve synchronization problems in shopping cart',
    tags: ['#cart', '#sync', '#bug'],
    domain: 'E-commerce',
    estimatedHours: 8,
    status: 'unassigned'
  },
  {
    id: '4',
    title: 'Implement Checkout Handler',
    description: 'Build secure payment processing workflow',
    tags: ['#payment', '#checkout', '#security'],
    domain: 'Backend',
    estimatedHours: 12,
    status: 'unassigned'
  }
];

const mockCoworkers = {
  '1': [
    { 
      id: 'luis', 
      name: 'Luis', 
      avatar: 'LU', 
      score: 95, 
      skillMatch: 88, 
      workload: 15, 
      velocity: 92,
      reasons: ['Expert in JWT', 'Available 8h/day', 'High velocity']
    },
    { 
      id: 'raj', 
      name: 'Raj', 
      avatar: 'RA', 
      score: 88, 
      skillMatch: 82, 
      workload: 25, 
      velocity: 85,
      reasons: ['Auth experience', 'Available 6h/day', 'Good velocity']
    },
    { 
      id: 'carlos', 
      name: 'Carlos', 
      avatar: 'CA', 
      score: 72, 
      skillMatch: 70, 
      workload: 40, 
      velocity: 75,
      reasons: ['API knowledge', 'Available 4h/day', 'Medium velocity']
    }
  ],
  '2': [
    { 
      id: 'aisha', 
      name: 'Aisha', 
      avatar: 'AI', 
      score: 92, 
      skillMatch: 95, 
      workload: 20, 
      velocity: 88,
      reasons: ['UI/UX expert', 'Available 7h/day', 'Component specialist']
    },
    { 
      id: 'luis', 
      name: 'Luis', 
      avatar: 'LU', 
      score: 78, 
      skillMatch: 75, 
      workload: 15, 
      velocity: 92,
      reasons: ['React expertise', 'Available 8h/day', 'Good design sense']
    },
    { 
      id: 'raj', 
      name: 'Raj', 
      avatar: 'RA', 
      score: 65, 
      skillMatch: 60, 
      workload: 25, 
      velocity: 85,
      reasons: ['Frontend knowledge', 'Available 6h/day', 'Learning UI']
    }
  ],
  '3': [
    { 
      id: 'carlos', 
      name: 'Carlos', 
      avatar: 'CA', 
      score: 89, 
      skillMatch: 85, 
      workload: 40, 
      velocity: 75,
      reasons: ['E-commerce expert', 'Cart system knowledge', 'Debug specialist']
    },
    { 
      id: 'sophia', 
      name: 'Sophia', 
      avatar: 'SO', 
      score: 84, 
      skillMatch: 80, 
      workload: 30, 
      velocity: 90,
      reasons: ['Sync algorithms', 'Available 6h/day', 'High velocity']
    },
    { 
      id: 'aisha', 
      name: 'Aisha', 
      avatar: 'AI', 
      score: 71, 
      skillMatch: 65, 
      workload: 20, 
      velocity: 88,
      reasons: ['Frontend debugging', 'UI logic', 'Good availability']
    }
  ],
  '4': [
    { 
      id: 'luis', 
      name: 'Luis', 
      avatar: 'LU', 
      score: 94, 
      skillMatch: 90, 
      workload: 15, 
      velocity: 92,
      reasons: ['Payment systems expert', 'Security knowledge', 'High availability']
    },
    { 
      id: 'carlos', 
      name: 'Carlos', 
      avatar: 'CA', 
      score: 87, 
      skillMatch: 85, 
      workload: 40, 
      velocity: 75,
      reasons: ['Backend architecture', 'Checkout experience', 'API design']
    },
    { 
      id: 'raj', 
      name: 'Raj', 
      avatar: 'RA', 
      score: 76, 
      skillMatch: 70, 
      workload: 25, 
      velocity: 85,
      reasons: ['Security protocols', 'Testing experience', 'Documentation skills']
    }
  ]
};

export function SmartAssignmentRedesigned() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('1');
  const [assignmentModal, setAssignmentModal] = useState<{
    isOpen: boolean;
    task: any;
    coworker: any;
  }>({
    isOpen: false,
    task: null,
    coworker: null
  });

  const selectedTask = mockTasks.find(task => task.id === selectedTaskId);
  const recommendations = mockCoworkers[selectedTaskId] || [];

  const handleAssignment = (coworker: any) => {
    setAssignmentModal({
      isOpen: true,
      task: selectedTask,
      coworker: coworker
    });
  };

  const confirmAssignment = () => {
    // Here you would implement the actual assignment logic
    console.log('Assigning task', assignmentModal.task?.title, 'to', assignmentModal.coworker?.name);
    setAssignmentModal({ isOpen: false, task: null, coworker: null });
  };

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-2rem)] gap-6">
        {/* Left Pane - Task List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Unassigned Tasks</h2>
              <p className="text-muted-foreground text-sm">
                Select a task to see AI recommendations
              </p>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {mockTasks.map((task) => (
              <Card 
                key={task.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTaskId === task.id ? 'ring-2 ring-primary bg-accent/50' : ''
                }`}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <p className="text-muted-foreground text-sm">{task.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {task.domain}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {task.estimatedHours}h
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Pane - Recommendations */}
        <div className="w-96 space-y-4">
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Best Match for Selected Task
              </CardTitle>
              {selectedTask && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{selectedTask.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {selectedTask.estimatedHours}h estimate
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {recommendations.map((coworker, index) => (
                <div key={coworker.id} className="space-y-3 p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{coworker.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{coworker.name}</span>
                          {index === 0 && <Badge variant="default" className="text-xs">Best Match</Badge>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{coworker.score}%</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant={index === 0 ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleAssignment(coworker)}
                    >
                      {index === 0 ? 'Assign' : 'Select'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-medium">{coworker.skillMatch}%</div>
                          <div className="text-muted-foreground">Skill Match</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>How well their skills match this task</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-medium">{coworker.workload}%</div>
                          <div className="text-muted-foreground">Workload</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current capacity utilization</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-medium">{coworker.velocity}%</div>
                          <div className="text-muted-foreground">Velocity</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Recent delivery performance</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="space-y-1">
                    {coworker.reasons.map((reason, reasonIdx) => (
                      <div key={reasonIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        {reason}
                      </div>
                    ))}
                  </div>

                  <Progress value={coworker.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assignment Confirmation Modal */}
      <Dialog open={assignmentModal.isOpen} onOpenChange={(open) => 
        setAssignmentModal({ isOpen: open, task: null, coworker: null })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Confirm Task Assignment
            </DialogTitle>
          </DialogHeader>
          
          {assignmentModal.task && assignmentModal.coworker && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Task Details</h4>
                <div className="p-3 bg-muted/50 rounded">
                  <p className="font-medium">{assignmentModal.task.title}</p>
                  <p className="text-sm text-muted-foreground">{assignmentModal.task.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{assignmentModal.task.estimatedHours}h estimated</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Assignee</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <Avatar>
                    <AvatarFallback>{assignmentModal.coworker.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{assignmentModal.coworker.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{assignmentModal.coworker.score}% match score</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Score Breakdown</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="font-medium">{assignmentModal.coworker.skillMatch}%</div>
                    <div className="text-muted-foreground">Skills</div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="font-medium">{100 - assignmentModal.coworker.workload}%</div>
                    <div className="text-muted-foreground">Capacity</div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="font-medium">{assignmentModal.coworker.velocity}%</div>
                    <div className="text-muted-foreground">Velocity</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => 
              setAssignmentModal({ isOpen: false, task: null, coworker: null })
            }>
              Cancel
            </Button>
            <Button onClick={confirmAssignment}>
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}