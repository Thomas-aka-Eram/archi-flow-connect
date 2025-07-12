
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings as SettingsIcon, Database, GitBranch, Download, Shield } from "lucide-react";
import { UserProfileSettings } from "@/components/settings/UserProfileSettings";
import { useProject } from "@/contexts/ProjectContext";

export default function Settings() {
  const { currentProject, userRole } = useProject();
  const [activeTab, setActiveTab] = useState('profile');

  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';
  const canManageProject = isAdmin || userRole === 'PM';

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile and project configuration
          </p>
        </div>
        {currentProject && (
          <Badge variant="secondary" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            {currentProject.name}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="project" disabled={!canManageProject} className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Project
          </TabsTrigger>
          <TabsTrigger value="integrations" disabled={!canManageProject} className="gap-2">
            <GitBranch className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="export" disabled={!canManageProject} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <UserProfileSettings />
        </TabsContent>

        <TabsContent value="project" className="space-y-6">
          {canManageProject ? (
            <>
              {/* Project Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    Project Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Project Name</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentProject?.name || 'No project selected'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Visibility</label>
                      <p className="text-sm text-muted-foreground mt-1">Team-Only</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Project Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Data & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Data & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">AI Privacy Mode</label>
                        <p className="text-sm text-muted-foreground">
                          Model sees tags only, not content
                        </p>
                      </div>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Data Residency</label>
                        <p className="text-sm text-muted-foreground">
                          Where your data is stored
                        </p>
                      </div>
                      <Badge variant="outline">US-East</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
                <p className="text-muted-foreground">
                  You need Admin or PM privileges to access project settings.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {canManageProject ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  GitHub Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Repository URL</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      https://github.com/org/ecom-checkout
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Sync</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure Integration
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
                <p className="text-muted-foreground">
                  You need Admin or PM privileges to manage integrations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          {canManageProject ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export & Backup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Database className="h-4 w-4" />
                    Export .archi
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Last export: 2025-07-11 08:15</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
                <p className="text-muted-foreground">
                  You need Admin or PM privileges to export data.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
