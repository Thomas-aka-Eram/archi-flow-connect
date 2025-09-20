
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

export interface TaskStat {
  icon: LucideIcon;
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

interface TasksOverviewProps {
  taskStats: TaskStat[];
}

export function TasksOverview({ taskStats }: TasksOverviewProps) {
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
