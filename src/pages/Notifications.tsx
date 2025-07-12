
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  CheckCheck, 
  Eye, 
  MessageSquare, 
  GitCommit,
  Calendar,
  UserCheck,
  AlertTriangle
} from "lucide-react";

const mockNotifications = [
  {
    id: '1',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'Luis marked task "OAuth Login" as completed.',
    timestamp: '2024-07-12 14:30',
    read: false,
    author: 'Luis',
    actionUrl: '/tasks/task-1'
  },
  {
    id: '2',
    type: 'review_request',
    title: 'Review Requested',
    message: 'You have a pending review: "Login Feature".',
    timestamp: '2024-07-12 12:15', 
    read: false,
    author: 'Aisha',
    actionUrl: '/reviews/review-1'
  },
  {
    id: '3',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Sophie mentioned you in "Login Feature" block.',
    timestamp: '2024-07-12 10:45',
    read: true,
    author: 'Sophie',
    actionUrl: '/sdlc/req-1'
  },
  {
    id: '4',
    type: 'commit',
    title: 'New Commit',
    message: 'Raj committed to "Login API Schema"',
    timestamp: '2024-07-12 09:20',
    read: true,
    author: 'Raj',
    actionUrl: '/github/commits/abc123'
  },
  {
    id: '5',
    type: 'milestone',
    title: 'Milestone Due',
    message: 'Milestone "Design Complete" is due tomorrow',
    timestamp: '2024-07-11 16:00',
    read: false,
    author: 'System',
    actionUrl: '/projects/manage'
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'task_completed': return <UserCheck className="h-4 w-4 text-green-500" />;
    case 'review_request': return <Eye className="h-4 w-4 text-blue-500" />;
    case 'mention': return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'commit': return <GitCommit className="h-4 w-4 text-orange-500" />;
    case 'milestone': return <Calendar className="h-4 w-4 text-red-500" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with project activities and mentions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs value={filter} onValueChange={setFilter}>
            <div className="border-b px-6 pt-6">
              <TabsList>
                <TabsTrigger value="all">All Notifications</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={filter} className="p-0">
              <div className="space-y-0">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-6 border-b hover:bg-muted/30 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-xs">
                                  {notification.author.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {notification.author} • {notification.timestamp}
                              </span>
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
