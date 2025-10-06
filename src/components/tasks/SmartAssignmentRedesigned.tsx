import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Clock, Star, TrendingUp, Users, Zap, CheckCircle, Filter } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useProject } from '@/contexts/ProjectContext';

// API Functions
const fetchUnassignedTasks = async (projectId: string, filters: any) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value && value !== 'all')
  );
  const { data } = await apiClient.get(`/tasks/project/${projectId}/unassigned`, { params: cleanFilters });
  return data;
};

const fetchRecommendations = async (taskId: string) => {
  const { data } = await apiClient.get(`/tasks/${taskId}/recommendations`);
  return data;
};

const assignTask = async ({ taskId, userId }: { taskId: string, userId: string }) => {
  const { data } = await apiClient.patch(`/tasks/${taskId}`, { assigneeId: userId });
  return data;
};

const fetchProjectPhases = async (projectId: string) => {
  const { data } = await apiClient.get(`/projects/${projectId}/phases`);
  return data;
};

export function SmartAssignmentRedesigned({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();
  const { currentProjectUserRole } = useProject();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    phaseId: 'all',
    priority: 'all',
  });
  const [assignmentModal, setAssignmentModal] = useState<{
    isOpen: boolean;
    task: any;
    coworker: any;
  }>({ isOpen: false, task: null, coworker: null });

  const canAssign = currentProjectUserRole === 'Admin' || currentProjectUserRole === 'Manager';

  const { data: projectPhases = [] } = useQuery({
    queryKey: ['projectPhases', projectId],
    queryFn: () => fetchProjectPhases(projectId),
  });

  const { data: unassignedTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['unassignedTasks', projectId, filters],
    queryFn: () => fetchUnassignedTasks(projectId, filters),
  });

  useEffect(() => {
    if (!selectedTaskId && unassignedTasks.length > 0) {
      setSelectedTaskId(unassignedTasks[0].id);
    }
  }, [unassignedTasks, selectedTaskId]);

  const { data: recommendations = [], isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['recommendations', selectedTaskId],
    queryFn: () => fetchRecommendations(selectedTaskId!),
    enabled: !!selectedTaskId,
  });

  const assignmentMutation = useMutation({
    mutationFn: assignTask,
    onSuccess: () => {
      toast({ title: "Task assigned successfully!" });
      queryClient.invalidateQueries({ queryKey: ['unassignedTasks', projectId, filters] });
      setAssignmentModal({ isOpen: false, task: null, coworker: null });
    },
    onError: (error: any) => {
      toast({
        title: "Assignment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAssignment = (coworker: any) => {
    if (!canAssign) return;
    const selectedTask = unassignedTasks.find(task => task.id === selectedTaskId);
    setAssignmentModal({ isOpen: true, task: selectedTask, coworker: coworker });
  };

  const confirmAssignment = () => {
    if (assignmentModal.task && assignmentModal.coworker) {
      assignmentMutation.mutate({ taskId: assignmentModal.task.id, userId: assignmentModal.coworker.id });
    }
  };

  const selectedTask = unassignedTasks.find(task => task.id === selectedTaskId);

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-2rem)] gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Unassigned Tasks</h2>
              <p className="text-muted-foreground text-sm">Select a task to see AI recommendations</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Select value={filters.phaseId} onValueChange={(value) => setFilters(f => ({...f, phaseId: value}))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by phase..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {projectPhases.map((phase: any) => (
                    <SelectItem key={phase.id} value={phase.id}>{phase.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.priority} onValueChange={(value) => setFilters(f => ({...f, priority: value}))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
            {isLoadingTasks ? (
              <p>Loading tasks...</p>
            ) : unassignedTasks.length === 0 ? (
              <p>No unassigned tasks match the current filters.</p>
            ) : (
              unassignedTasks.map((task) => (
                <Card key={task.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedTaskId === task.id ? 'ring-2 ring-primary bg-accent/50' : ''}`} onClick={() => setSelectedTaskId(task.id)}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">{task.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">{task.priority}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag: any) => (
                            <Badge key={tag.tag.id} variant="secondary" className="text-xs">{tag.tag.name}</Badge>
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
              ))
            )}
          </div>
        </div>

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
              {isLoadingRecommendations ? (
                <p>Loading recommendations...</p>
              ) : recommendations.length === 0 ? (
                <p>No recommendations available for this task.</p>
              ) : (
                recommendations.map((coworker: any, index: number) => (
                  <div key={coworker.id} className="space-y-3 p-3 rounded-lg border bg-card/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10"><AvatarFallback>{coworker.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{coworker.name}</span>
                            {index === 0 && <Badge variant="default" className="text-xs">Best Match</Badge>}
                          </div>
                          <div className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /><span className="text-sm font-medium">{coworker.score}%</span></div>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div style={{ display: 'inline-block' }}>
                            <Button variant={index === 0 ? "default" : "outline"} size="sm" onClick={() => handleAssignment(coworker)} disabled={!canAssign}>{index === 0 ? 'Assign' : 'Select'}</Button>
                          </div>
                        </TooltipTrigger>
                        {!canAssign && (
                          <TooltipContent>
                            <p>You don't have permission to assign tasks.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <Tooltip><TooltipTrigger><div className="text-center p-2 bg-muted/50 rounded"><div className="font-medium">{coworker.skillMatch}%</div><div className="text-muted-foreground">Skill Match</div></div></TooltipTrigger><TooltipContent><p>How well their skills match this task</p></TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger><div className="text-center p-2 bg-muted/50 rounded"><div className="font-medium">{coworker.workload}%</div><div className="text-muted-foreground">Workload</div></div></TooltipTrigger><TooltipContent><p>Current capacity utilization</p></TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger><div className="text-center p-2 bg-muted/50 rounded"><div className="font-medium">{coworker.velocity}%</div><div className="text-muted-foreground">Velocity</div></div></TooltipTrigger><TooltipContent><p>Recent delivery performance</p></TooltipContent></Tooltip>
                    </div>
                    <div className="space-y-1">
                      {coworker.reasons.map((reason: string, reasonIdx: number) => (
                        <div key={reasonIdx} className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="h-3 w-3" />{reason}</div>
                      ))}
                    </div>
                    <Progress value={coworker.score} className="h-2" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={assignmentModal.isOpen} onOpenChange={(open) => setAssignmentModal({ isOpen: open, task: null, coworker: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Confirm Task Assignment</DialogTitle></DialogHeader>
          {assignmentModal.task && assignmentModal.coworker && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Task Details</h4>
                <div className="p-3 bg-muted/50 rounded">
                  <p className="font-medium">{assignmentModal.task.title}</p>
                  <p className="text-sm text-muted-foreground">{assignmentModal.task.description}</p>
                  <div className="flex items-center gap-2 mt-2"><Clock className="h-4 w-4" /><span className="text-sm">{assignmentModal.task.estimatedHours}h estimated</span></div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Assignee</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <Avatar><AvatarFallback>{assignmentModal.coworker.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-medium">{assignmentModal.coworker.name}</p>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /><span className="text-sm">{assignmentModal.coworker.score}% match score</span></div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Score Breakdown</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted/30 rounded"><div className="font-medium">{assignmentModal.coworker.skillMatch}%</div><div className="text-muted-foreground">Skills</div></div>
                  <div className="text-center p-2 bg-muted/30 rounded"><div className="font-medium">{100 - assignmentModal.coworker.workload}%</div><div className="text-muted-foreground">Capacity</div></div>
                  <div className="text-center p-2 bg-muted/30 rounded"><div className="font-medium">{assignmentModal.coworker.velocity}%</div><div className="text-muted-foreground">Velocity</div></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignmentModal({ isOpen: false, task: null, coworker: null })}>Cancel</Button>
            <Button onClick={confirmAssignment} disabled={assignmentMutation.isLoading}>{assignmentMutation.isLoading ? 'Assigning...' : 'Confirm Assignment'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
