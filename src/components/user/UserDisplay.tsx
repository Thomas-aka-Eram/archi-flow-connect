import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserDisplayProps {
  userId: string;
}

export function UserDisplay({ userId }: UserDisplayProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  if (isLoading) return <span>Loading...</span>;
  if (!user) return <span>Unknown User</span>;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-6 h-6">
        <AvatarFallback className="text-xs">
          {(user.name || '').slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm">{user.name}</span>
    </div>
  );
}