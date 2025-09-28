
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Link } from "lucide-react";

interface Tag {
  id: string;
  name: string;
}

interface TaskTag {
  id: string;
  tag: Tag;
}

interface User {
  id: string;
  name: string;
}

interface UserTask {
  user: User;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  phase: string;
  domain: string;
  tags: TaskTag[];
  assignees: UserTask[];
  estimatedHours: number;
  milestone: string;
  linkedBlocks: string[];
  dueDate: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  viewMode: 'list' | 'kanban';
}

const statusColors = {
  TODO: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  PENDING_REVIEW: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  COMPLETED: 'bg-green-500/10 text-green-700 border-green-500/20'
};

const priorityColors = {
  HIGH: 'bg-red-500/10 text-red-700 border-red-500/20',
  MEDIUM: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  LOW: 'bg-green-500/10 text-green-700 border-green-500/20'
};

export function TaskList({ tasks, onTaskSelect, viewMode }: TaskListProps) {
  if (viewMode === 'kanban') {
    const columns = ['TODO', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED'];
    
    return (
      <div className="grid grid-cols-4 gap-6">
        {columns.map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{status.replace('_', ' ')}</h3>
              <Badge variant="secondary">
                {tasks.filter(task => task.status === status).length}
              </Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter(task => task.status === status).map((task) => (
                <Card 
                  key={task.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTaskSelect(task.id)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{task.title}</h4>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {(task.tags || []).map((taskTag) => (
                          <Badge key={taskTag.id} variant="secondary" className="text-xs">
                            {taskTag.tag.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs">
                              {(task.assignees[0]?.user?.name || '').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{task.assignees[0]?.user?.name || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedHours}h
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onTaskSelect(task.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <Badge variant="outline" className={statusColors[task.status as keyof typeof statusColors]}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs">
                        {(task.assignees[0]?.user?.name || '').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.assignees[0]?.user?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {task.dueDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {task.estimatedHours}h
                  </div>
                  {task.linkedBlocks && task.linkedBlocks.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Link className="h-4 w-4" />
                      {task.linkedBlocks.length} linked
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(task.tags || []).map((taskTag) => (
                    <Badge key={taskTag.id} variant="secondary" className="text-xs">
                      {taskTag.tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
