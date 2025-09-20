
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

export interface Activity {
  id: number;
  type: string;
  icon: LucideIcon;
  user: { name: string; initials: string; avatar?: string };
  action: string;
  target: string;
  time: string;
  badge: string;
  badgeColor: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <activity.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Badge className={`${activity.badgeColor} text-xs`} variant="outline">
                    {activity.badge}
                  </Badge>
                </div>
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
