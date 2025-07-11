
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GitCommit, CheckCircle, MessageCircle, FileText } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "commit",
    icon: GitCommit,
    user: { name: "Raj Kumar", initials: "RK", avatar: undefined },
    action: "committed code for",
    target: "OAuth Login Implementation",
    time: "2 minutes ago",
    badge: "COMMIT",
    badgeColor: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 2,
    type: "task",
    icon: CheckCircle,
    user: { name: "Luis Garcia", initials: "LG", avatar: undefined },
    action: "completed task",
    target: "Cart Page Component",
    time: "15 minutes ago",
    badge: "TASK",
    badgeColor: "bg-green-500/10 text-green-500",
  },
  {
    id: 3,
    type: "review",
    icon: MessageCircle,
    user: { name: "Aisha Patel", initials: "AP", avatar: undefined },
    action: "requested review for",
    target: "Login API Documentation",
    time: "1 hour ago",
    badge: "REVIEW",
    badgeColor: "bg-orange-500/10 text-orange-500",
  },
  {
    id: 4,
    type: "docs",
    icon: FileText,
    user: { name: "Sophie Martinez", initials: "SM", avatar: undefined },
    action: "updated documentation",
    target: "User Authentication Flow",
    time: "2 hours ago",
    badge: "DOCS",
    badgeColor: "bg-purple-500/10 text-purple-500",
  },
];

export function RecentActivity() {
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
