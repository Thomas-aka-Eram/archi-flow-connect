
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MoreHorizontal, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate: string;
  teamMembers: Array<{ name: string; avatar?: string; initials: string }>;
  tasksDone: number;
  totalTasks: number;
  isFavorite?: boolean;
}

export function ProjectCard({
  title,
  description,
  progress,
  priority,
  dueDate,
  teamMembers,
  tasksDone,
  totalTasks,
  isFavorite = false,
}: ProjectCardProps) {
  const priorityColors = {
    HIGH: "bg-red-500/10 text-red-500 border-red-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    LOW: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            {isFavorite && <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={priorityColors[priority]} variant="outline">
              {priority}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due {dueDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Tasks:</span>
            <span className="font-medium">{tasksDone}/{totalTasks}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 4).map((member, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                </Avatar>
              ))}
              {teamMembers.length > 4 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">+{teamMembers.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
