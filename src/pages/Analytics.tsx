
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

const mockAnalyticsData = {
  totalProjects: 5,
  activeProjects: 3,
  completedTasks: 142,
  teamMembers: 12,
  avgProjectDuration: 45,
  projectPerformance: [
    { name: 'Ecommerce Storefront', completion: 75, tasks: 28, team: 4 },
    { name: 'Mobile Banking App', completion: 45, tasks: 32, team: 5 },
    { name: 'CRM Dashboard', completion: 90, tasks: 18, team: 3 }
  ]
};

export default function Analytics() {
  const { projects } = useProject();
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground mt-1">
            Cross-project insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {mockAnalyticsData.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +18% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.teamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.avgProjectDuration}d</div>
            <p className="text-xs text-muted-foreground">
              Project completion time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsData.projectPerformance.map((project) => (
              <div key={project.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{project.name}</h4>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700">
                    {project.completion}% complete
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{project.tasks} tasks</span>
                  <span>{project.team} team members</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${project.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
