
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Users } from "lucide-react";

const taskStats = [
  {
    icon: CheckCircle,
    label: "Completed",
    count: 24,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Clock,
    label: "In Progress",
    count: 12,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: AlertCircle,
    label: "Pending Review",
    count: 5,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Users,
    label: "Backlog",
    count: 18,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
];

export function TasksOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tasks Overview
          <Badge variant="outline" className="text-xs">
            This Sprint
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {taskStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
