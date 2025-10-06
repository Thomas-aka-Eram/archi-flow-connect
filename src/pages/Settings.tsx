
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings as SettingsIcon, Bell } from "lucide-react";
import { UserProfileSettings } from "@/components/settings/UserProfileSettings";
import { ThemeCustomization } from "@/components/settings/ThemeCustomization";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { useProject } from "@/contexts/ProjectContext"; // Keep useProject for currentProject display

export default function Settings() {
  const { currentProject } = useProject(); // Only currentProject is needed
  const [activeTab, setActiveTab] = useState('profile');

  // canManageProject and isAdmin are no longer needed here as project-related tabs are removed.
  // ThemeCustomization's canCustomize prop can be removed or set to true if it's a personal setting.

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile and personal preferences
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <UserProfileSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <ThemeCustomization /> {/* canCustomize prop removed */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
