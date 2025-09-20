
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  CheckCheck, 
} from "lucide-react";

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-64">
    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default function Notifications() {
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
            0 unread
          </Badge>
          <Button variant="outline">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-6 pt-6">
              <TabsList>
                <TabsTrigger value="all">All Notifications</TabsTrigger>
                <TabsTrigger value="unread">Unread (0)</TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <EmptyState message="No notifications found." />
            </TabsContent>
            <TabsContent value="unread">
              <EmptyState message="No unread notifications." />
            </TabsContent>
            <TabsContent value="read">
              <EmptyState message="No read notifications." />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
