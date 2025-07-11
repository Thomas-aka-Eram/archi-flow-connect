
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, FileText, CheckSquare } from "lucide-react";

interface Review {
  id: string;
  type: 'block' | 'task';
  title: string;
  author: string;
  reviewer: string;
  status: string;
  submittedAt: string;
  phase: string;
  priority: string;
}

interface ReviewQueueProps {
  reviews: Review[];
  onReviewSelect: (reviewId: string) => void;
}

const statusColors = {
  PENDING_REVIEW: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  CHANGES_REQUESTED: 'bg-red-500/10 text-red-700 border-red-500/20',
  APPROVED: 'bg-green-500/10 text-green-700 border-green-500/20'
};

const priorityColors = {
  HIGH: 'bg-red-500/10 text-red-700 border-red-500/20',
  MEDIUM: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  LOW: 'bg-green-500/10 text-green-700 border-green-500/20'
};

export function ReviewQueue({ reviews, onReviewSelect }: ReviewQueueProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No reviews pending</h3>
        <p className="text-muted-foreground">
          All items have been reviewed and approved
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card 
          key={review.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onReviewSelect(review.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {review.type === 'block' ? (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <CheckSquare className="h-5 w-5 text-muted-foreground" />
                  )}
                  <h3 className="font-medium">{review.title}</h3>
                  <Badge variant="outline" className={statusColors[review.status as keyof typeof statusColors]}>
                    {review.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={priorityColors[review.priority as keyof typeof priorityColors]}>
                    {review.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-2">
                    <span>Author:</span>
                    <div className="flex items-center gap-1">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {review.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{review.author}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Reviewer:</span>
                    <div className="flex items-center gap-1">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {review.reviewer.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{review.reviewer}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {review.submittedAt}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {review.phase}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {review.type === 'block' ? 'Documentation Block' : 'Task Submission'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
