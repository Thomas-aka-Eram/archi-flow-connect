
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskCreationModal } from "@/components/tasks/TaskCreationModal";
import { SmartAssignment } from "@/components/tasks/SmartAssignment";

const mockTasks = {
  all: [
    {
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
      linkedBlocks: ['req-1', 'des-1'],
      dueDate: '2024-07-15'
    },
    {
      id: 'task-2',
      title: 'Design Password Recovery Flow',
      assignee: 'Aisha',
      status: 'PENDING_REVIEW',
      priority: 'MEDIUM',
      phase: 'Design',
      domain: 'UI',
      tags: ['#auth', '#password', '#recovery'],
      estimatedHours: 4,
      milestone: 'Authentication System',
      linkedBlocks: ['req-2'],
      dueDate: '2024-07-13'
    },
    {
      id: 'task-3',
      title: 'User Profile API',
      assignee: 'Raj',
      status: 'TODO',
      priority: 'LOW',
      phase: 'Development',
      domain: 'API',
      tags: ['#user', '#profile', '#api'],
      estimatedHours: 6,
      milestone: 'User Management',
      linkedBlocks: [],
      dueDate: '2024-07-20'
    }
  ]
};

export default function TaskManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId);
  };

  const getTasksByTab = (tab: string) => {
    switch (tab) {
      case 'my':
        return mockTasks.all.filter(task => task.assignee === 'Luis'); // Mock current user
      case 'review':
        return mockTasks.all.filter(task => task.status === 'PENDING_REVIEW');
      case 'completed':
        return mockTasks.all.filter(task => task.status === 'COMPLETED');
      case 'backlog':
        return mockTasks.all.filter(task => task.status === 'TODO');
      default:
        return mockTasks.all;
    }
  };

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
              <SmartAssignment />
            </TabsContent>

            <TabsContent value="review" className="p-6">
              <TaskList 
                tasks={getTasksByTab('review')} 
                onTaskSelect={handleTaskSelect}
                viewMode={viewMode}
              />
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

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
