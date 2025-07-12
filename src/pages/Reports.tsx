
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter
} from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockProjectMetrics = {
  'proj-1': {
    tasksCompleted: 45,
    tasksInProgress: 12,
    tasksPending: 8,
    blocksCreated: 156,
    reviewsCompleted: 23,
    teamVelocity: 85,
    burndownData: [100, 85, 70, 60, 45, 30, 15],
    memberPerformance: [
      { name: 'Luis', completed: 18, inProgress: 3, efficiency: 92 },
      { name: 'Raj', completed: 15, inProgress: 4, efficiency: 88 },
      { name: 'Aisha', completed: 12, inProgress: 2, efficiency: 95 }
    ]
  }
};

export default function Reports() {
  const { projects, currentProject } = useProject();
  const [selectedProject, setSelectedProject] = useState(currentProject?.id || 'all');
  const [timeRange, setTimeRange] = useState('30d');

  const currentMetrics = selectedProject === 'all' 
    ? mockProjectMetrics['proj-1'] // Aggregate all projects in real implementation
    : mockProjectMetrics[selectedProject as keyof typeof mockProjectMetrics] || mockProjectMetrics['proj-1'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Reports</h1>
          <p className="text-muted-foreground mt-1">
            Analytics and insights across all your projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.tasksInProgress}</div>
            <p className="text-xs text-muted-foreground">
              Active tasks across teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.reviewsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting code review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.teamVelocity}%</div>
            <p className="text-xs text-muted-foreground">
              Sprint completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="sdlc">SDLC Progress</TabsTrigger>
          <TabsTrigger value="burndown">Burndown Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-3/4 h-2 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">{currentMetrics.tasksCompleted}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-1/4 h-2 bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">{currentMetrics.tasksInProgress}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-1/6 h-2 bg-orange-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">{currentMetrics.tasksPending}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm">High Priority</span>
                    </div>
                    <Badge variant="outline" className="bg-red-500/10 text-red-700">8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Medium Priority</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">25</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">Low Priority</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700">32</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Member Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentMetrics.memberPerformance.map((member) => (
                  <div key={member.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{member.name[0]}</span>
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-700">
                        {member.efficiency}% efficiency
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="ml-2 font-medium">{member.completed}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">In Progress:</span>
                        <span className="ml-2 font-medium">{member.inProgress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdlc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SDLC Phase Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { phase: 'Requirements', progress: 95, status: 'completed' },
                  { phase: 'Design', progress: 80, status: 'in-progress' },
                  { phase: 'Development', progress: 45, status: 'in-progress' },
                  { phase: 'Testing', progress: 10, status: 'pending' },
                  { phase: 'Deployment', progress: 0, status: 'pending' }
                ].map((item) => (
                  <div key={item.phase} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.phase}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{item.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="burndown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Burndown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {currentMetrics.burndownData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-primary rounded-t"
                      style={{ height: `${(value / 100) * 200}px` }}
                    />
                    <span className="text-xs text-muted-foreground mt-2">
                      Day {index + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Sprint progress over 7 days showing remaining story points
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
