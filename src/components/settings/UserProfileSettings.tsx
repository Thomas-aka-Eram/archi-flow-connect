import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  timezone: string;
  language: string;
  theme: string;
}

export function UserProfileSettings() {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data
  const { data: userProfile, isLoading, isError, error } = useQuery<UserProfile>({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },
    enabled: !!user?.id,
    onSuccess: (data) => {
      setFormData({
        fullName: data.name,
        email: data.email,
        timezone: data.timezone,
        language: data.language,
        theme: data.theme,
      });
    },
  });

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: (updatedProfile: Partial<UserProfile>) =>
      apiClient.patch('/users/profile', updatedProfile),
    onSuccess: (data) => {
      toast({
        title: "Profile updated successfully.",
        description: "Your profile information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      // Update user context if name or email changed
      if (user && (data.name !== user.name || data.email !== user.email)) {
        setUser({ ...user, name: data.name, email: data.email });
      }
      setIsEditing(false);
    },
    onError: (err: any) => {
      toast({
        title: "Failed to update profile.",
        description: err.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading profile settings...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to load profile."}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          View and update your personal profile details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.timezone || ''}
              onValueChange={(value) => handleSelectChange('timezone', value)}
              disabled={!isEditing}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                <SelectItem value="UTC+1">UTC+1 (Central European Time)</SelectItem>
                {/* Add more timezones as needed */}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.language || ''}
              onValueChange={(value) => handleSelectChange('language', value)}
              disabled={!isEditing}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                {/* Add more languages as needed */}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={formData.theme || ''}
              onValueChange={(value) => handleSelectChange('theme', value)}
              disabled={!isEditing}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={updateProfileMutation.isPending}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}