
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Filter,
  Users,
  Clock,
  MapPin
} from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

const mockEvents = [
  {
    id: '1',
    title: 'Sprint Planning',
    project: 'Ecommerce Storefront',
    date: '2024-07-15',
    time: '10:00',
    duration: '2h',
    type: 'meeting',
    attendees: ['Sophie', 'Luis', 'Raj'],
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'API Review Session',
    project: 'Ecommerce Storefront',
    date: '2024-07-16',
    time: '14:00',
    duration: '1h',
    type: 'review',
    attendees: ['Aisha', 'Raj'],
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Design System Milestone',
    project: 'Mobile Banking App',
    date: '2024-07-18',
    time: '09:00',
    duration: 'All day',
    type: 'milestone',
    attendees: ['Sophie'],
    status: 'pending'
  }
];

const mockTasks = [
  {
    id: 't1',
    title: 'Implement OAuth Login',
    project: 'Ecommerce Storefront',
    assignee: 'Luis',
    dueDate: '2024-07-17',
    priority: 'high',
    status: 'in-progress'
  },
  {
    id: 't2',
    title: 'Design Password Recovery Flow',
    project: 'Ecommerce Storefront',
    assignee: 'Aisha',
    dueDate: '2024-07-19',
    priority: 'medium',
    status: 'pending'
  }
];

export default function Calendar() {
  const { projects } = useProject();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-700';
      case 'pending': return 'bg-yellow-500/10 text-yellow-700';
      case 'cancelled': return 'bg-red-500/10 text-red-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'review': return 'bg-purple-500';
      case 'milestone': return 'bg-orange-500';
      case 'deadline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700';
      case 'low': return 'bg-green-500/10 text-green-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Calendar</h1>
          <p className="text-muted-foreground mt-1">
            View milestones, deadlines, and team schedules across all projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Main View */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {/* Simple Calendar Grid for Month View */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i - 6; // Assuming month starts on 7th cell
                  const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                  const hasEvents = isCurrentMonth && [15, 16, 18].includes(dayNum);
                  
                  return (
                    <div
                      key={i}
                      className={`p-2 h-20 border rounded-lg ${
                        isCurrentMonth ? 'bg-background' : 'bg-muted/50'
                      } ${hasEvents ? 'border-primary' : 'border-border'}`}
                    >
                      {isCurrentMonth && (
                        <>
                          <div className="font-medium">{dayNum}</div>
                          {hasEvents && (
                            <div className="mt-1 space-y-1">
                              <div className={`w-2 h-2 rounded-full ${getTypeColor('meeting')}`} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="outline" className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time} ({event.duration})
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.attendees.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Overdue Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Due Soon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Assigned to: {task.assignee}</div>
                    <div>Due: {task.dueDate}</div>
                    <div>Project: {task.project}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Project Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter by Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                All Projects
              </Button>
              {projects.map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  {project.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
