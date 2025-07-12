
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Download, 
  Github, 
  Shield, 
  Bell,
  FileArchive,
  Eye,
  Users
} from "lucide-react";

export default function Settings() {
  const [projectSettings, setProjectSettings] = useState({
    visibility: 'team-only',
    githubRepo: 'https://github.com/org/ecom-checkout',
    aiPrivacy: true,
    notifications: {
      email: true,
      realTime: true,
      digest: 'daily'
    }
  });

  const handleExportArchi = () => {
    console.log('Exporting .archi file...');
    // Mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'project-backup.archi';
    link.click();
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    // Mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'project-export.pdf';
    link.click();
  };

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure project settings, integrations, and export options
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="project" className="h-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="project">Project Settings</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="export">Export & Backup</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="project" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Project Visibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Visibility Level</Label>
                    <Select 
                      value={projectSettings.visibility} 
                      onValueChange={(value) => setProjectSettings({...projectSettings, visibility: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private - Only you</SelectItem>
                        <SelectItem value="team-only">Team Only - Project members</SelectItem>
                        <SelectItem value="public">Public - Everyone can view</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {projectSettings.visibility.replace('-', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Last updated: 2024-07-11 08:15
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    AI Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>AI Privacy Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, AI only sees tags and metadata, not content
                      </p>
                    </div>
                    <Switch 
                      checked={projectSettings.aiPrivacy}
                      onCheckedChange={(checked) => setProjectSettings({...projectSettings, aiPrivacy: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Repository URL</Label>
                    <Input
                      value={projectSettings.githubRepo}
                      onChange={(e) => setProjectSettings({...projectSettings, githubRepo: e.target.value})}
                      placeholder="https://github.com/org/repo"
                    />
                  </div>
                  <Button variant="outline">
                    <Github className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect with Slack, Discord, or Microsoft Teams for notifications
                  </p>
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch 
                      checked={projectSettings.notifications.email}
                      onCheckedChange={(checked) => setProjectSettings({
                        ...projectSettings, 
                        notifications: {...projectSettings.notifications, email: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Real-time Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show in-app notifications immediately
                      </p>
                    </div>
                    <Switch 
                      checked={projectSettings.notifications.realTime}
                      onCheckedChange={(checked) => setProjectSettings({
                        ...projectSettings, 
                        notifications: {...projectSettings.notifications, realTime: checked}
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Daily Digest</Label>
                    <Select 
                      value={projectSettings.notifications.digest}
                      onValueChange={(value) => setProjectSettings({
                        ...projectSettings, 
                        notifications: {...projectSettings.notifications, digest: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">Disabled</SelectItem>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Project Archive (.archi)</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete encrypted backup of all project data
                      </p>
                    </div>
                    <Button onClick={handleExportArchi}>
                      <FileArchive className="h-4 w-4 mr-2" />
                      Export .archi
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">PDF Report</h4>
                      <p className="text-sm text-muted-foreground">
                        Formatted document with selected phases and traceability
                      </p>
                    </div>
                    <Button onClick={handleExportPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>project-backup-2024-07-11.archi</span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>requirements-design-export.pdf</span>
                      <span className="text-muted-foreground">1 week ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
