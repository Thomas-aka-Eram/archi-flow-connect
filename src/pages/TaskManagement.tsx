
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskCreationModal } from "@/components/tasks/TaskCreationModal";
import { SmartAssignment } from "@/components/tasks/SmartAssignment";
import { ReviewQueue } from "@/components/reviews/ReviewQueue";
import { ReviewModal } from '@/components/reviews/ReviewModal';
import apiClient from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';

const fetchTasks = async (projectId: string, assigneeId?: string) => {
  const url = assigneeId
    ? `/tasks/project/${projectId}?assigneeId=${assigneeId}`
    : `/tasks/project/${projectId}`;
  const { data } = await apiClient.get(url);
  return data;
};

export default function TaskManagement() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks', projectId, activeTab],
    queryFn: () => {
      const assigneeId = activeTab === 'my' ? user?.id : undefined;
      return fetchTasks(projectId!, assigneeId);
    },
    enabled: !!projectId && !!user,
  });

  const { data: reviewQueue = [] } = useQuery({
    queryKey: ['review-queue', projectId],
    queryFn: async () => {
      const response = await apiClient.get('/reviews/queue');
      return response.data;
    },
    enabled: !!projectId && activeTab === 'review',
    onSuccess: (data) => {
      console.log('Review queue data:', data);
    }
  });

  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId);
  };

  const handleReviewSelect = (review: any) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const getTasksByTab = (tab: string) => {
    if (!tasks) return [];
    switch (tab) {
      case 'my':
        return tasks; // The query is already filtered
      case 'review':
        return tasks.filter(task => task.status === 'IN_REVIEW');
      case 'completed':
        return tasks.filter(task => task.status === 'COMPLETED');
      case 'backlog':
        return tasks.filter(task => task.status === 'OPEN');
      default:
        return tasks;
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks.</div>;
  }

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all project tasks across SDLC phases
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Task Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-6 pt-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="my">My Tasks</TabsTrigger>
                <TabsTrigger value="smart">Smart Assignment</TabsTrigger>
                <TabsTrigger value="review">Review Queue</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="backlog">Backlog</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-6">
              <TaskList 
                tasks={getTasksByTab('all')} 
                onTaskSelect={handleTaskSelect}
                viewMode={viewMode}
              />
            </TabsContent>

            <TabsContent value="my" className="p-6">
              <TaskList 
                tasks={getTasksByTab('my')} 
                onTaskSelect={handleTaskSelect}
                viewMode={viewMode}
              />
            </TabsContent>

            <TabsContent value="smart" className="p-6">
              <SmartAssignment projectId={projectId} />
            </TabsContent>

            <TabsContent value="review" className="p-6">
              <ReviewQueue reviews={reviewQueue} onReviewSelect={handleReviewSelect} />
            </TabsContent>

            <TabsContent value="completed" className="p-6">
              <TaskList 
                tasks={getTasksByTab('completed')} 
                onTaskSelect={handleTaskSelect}
                viewMode={viewMode}
              />
            </TabsContent>

            <TabsContent value="backlog" className="p-6">
              <TaskList 
                tasks={getTasksByTab('backlog')} 
                onTaskSelect={handleTaskSelect}
                viewMode={viewMode}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          taskId={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Review Modal */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
