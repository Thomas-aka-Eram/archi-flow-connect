
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Users, 
  Calendar, 
  GitBranch, 
  Edit3, 
  Plus, 
  Trash2,
  Eye,
  BarChart3,
  Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/contexts/ProjectContext";

export default function ProjectManagement() {
  const { currentProject } = useProject();
  const [editingInfo, setEditingInfo] = useState(false);

  if (!currentProject) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Project Selected</h1>
          <p className="text-muted-foreground">Please select a project to manage</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'Draft': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Archived': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-500/10 text-red-700';
      case 'PM': return 'bg-blue-500/10 text-blue-700';
      case 'Developer': return 'bg-green-500/10 text-green-700';
      case 'Reviewer': return 'bg-purple-500/10 text-purple-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-700';
      case 'In Progress': return 'bg-blue-500/10 text-blue-700';
      case 'Pending': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground mt-1">Configure and oversee project structure</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Project Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              {currentProject.name}
              <Badge variant="outline" className={getStatusColor(currentProject.status)}>
                {currentProject.status}
              </Badge>
            </CardTitle>
            <p className="text-muted-foreground mt-1">{currentProject.description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditingInfo(!editingInfo)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Info
          </Button>
        </CardHeader>
        <CardContent>
          {editingInfo ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input defaultValue={currentProject.name} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea defaultValue={currentProject.description} rows={3} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue={currentProject.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Visibility</label>
                  <Select defaultValue={currentProject.visibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Team-only">Team-only</SelectItem>
                      <SelectItem value="Public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm">Save Changes</Button>
                <Button variant="outline" size="sm" onClick={() => setEditingInfo(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Client</span>
                <p className="font-medium">{currentProject.client || 'Internal'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Created</span>
                <p className="font-medium">{currentProject.createdAt}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Visibility</span>
                <p className="font-medium">{currentProject.visibility}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Repository</span>
                <p className="font-medium text-blue-600 truncate">
                  {currentProject.githubRepo ? 'Connected' : 'Not set'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="milestones" className="space-y-6">
        <TabsList>
          <TabsTrigger value="milestones">
            <Calendar className="h-4 w-4 mr-2" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Team ({currentProject.members.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Project Milestones</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
          <div className="grid gap-4">
            {currentProject.milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <Badge variant="outline" className={getMilestoneStatusColor(milestone.status)}>
                          {milestone.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {milestone.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Lead: {milestone.responsibleLead}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Team Members</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
          <div className="grid gap-4">
            {currentProject.members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="font-medium">{member.completedTasks} tasks completed</p>
                        <p className="text-muted-foreground">{member.pendingReviews} pending reviews</p>
                      </div>
                      <Badge variant="outline" className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                      <Select defaultValue={member.role}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Developer">Developer</SelectItem>
                          <SelectItem value="Reviewer">Reviewer</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">GitHub Integration</h4>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="https://github.com/org/repo" 
                    defaultValue={currentProject.githubRepo}
                  />
                  <Button variant="outline">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Project Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {currentProject.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
                <div className="flex gap-3">
                  <Button variant="outline">Archive Project</Button>
                  <Button variant="outline">Duplicate Project</Button>
                  <Button variant="destructive">Delete Project</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
