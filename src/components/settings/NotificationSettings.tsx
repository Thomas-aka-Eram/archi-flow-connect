import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';

interface NotificationPreferences {
  emailNotifications: boolean;
  taskAssignments: boolean;
  reviewRequests: boolean;
  weeklyDigest: boolean;
}

export function NotificationSettings() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    taskAssignments: true,
    reviewRequests: true,
    weeklyDigest: true,
  });

  // Fetch notification preferences
  const { data: fetchedPreferences, isLoading, isError, error } = useQuery<NotificationPreferences>({
    queryKey: ['notificationPreferences', user?.id],
    queryFn: async () => {
      const response = await apiClient.get('/users/notifications');
      return response.data;
    },
    enabled: !!user?.id,
    onSuccess: (data) => {
      setPreferences(data);
    },
  });

  // Mutation for updating notification preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: (updatedPref: Partial<NotificationPreferences>) =>
      apiClient.patch('/users/notifications', updatedPref),
    onSuccess: () => {
      toast({
        title: "Notification preference updated.",
        description: "Your notification settings have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences', user?.id] });
    },
    onError: (err: any) => {
      toast({
        title: "Failed to update preference.",
        description: err.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    updatePreferencesMutation.mutate({ [key]: newPreferences[key] });
  };

  if (isLoading) {
    return <div>Loading notification settings...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to load notification preferences."}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how you receive notifications from the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive important updates and summaries via email.
            </span>
          </Label>
          <Switch
            id="emailNotifications"
            checked={preferences.emailNotifications}
            onCheckedChange={() => handleToggle('emailNotifications')}
            disabled={updatePreferencesMutation.isPending}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="taskAssignments" className="flex flex-col space-y-1">
            <span>Task Assignments</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Get notified when tasks are assigned to you.
            </span>
          </Label>
          <Switch
            id="taskAssignments"
            checked={preferences.taskAssignments}
            onCheckedChange={() => handleToggle('taskAssignments')}
            disabled={updatePreferencesMutation.isPending}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="reviewRequests" className="flex flex-col space-y-1">
            <span>Review Requests</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Alerts for new code review or document review requests.
            </span>
          </Label>
          <Switch
            id="reviewRequests"
            checked={preferences.reviewRequests}
            onCheckedChange={() => handleToggle('reviewRequests')}
            disabled={updatePreferencesMutation.isPending}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="weeklyDigest" className="flex flex-col space-y-1">
            <span>Weekly Digest</span>
            <span className="font-normal leading-snug text-muted-foreground">
              A summary of project activity and your tasks delivered weekly.
            </span>
          </Label>
          <Switch
            id="weeklyDigest"
            checked={preferences.weeklyDigest}
            onCheckedChange={() => handleToggle('weeklyDigest')}
            disabled={updatePreferencesMutation.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
