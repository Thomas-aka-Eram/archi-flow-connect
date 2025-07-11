
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, MessageSquare, Clock } from "lucide-react";

interface ReviewModalProps {
  reviewId: string;
  isOpen: boolean;
  onClose: () => void;
}

const mockReviewDetails = {
  'review-1': {
    id: 'review-1',
    title: 'Login API Schema Design',
    author: 'Raj',
    reviewer: 'Aisha',
    status: 'PENDING_REVIEW',
    submittedAt: '2024-07-11 09:30',
    phase: 'Design',
    priority: 'HIGH',
    type: 'block',
    currentVersion: `# Login API Schema

## Authentication Endpoint
- POST /api/auth/login
- Request Body: { email: string, password: string }
- Response: { token: string, user: User }

## Security Requirements
- Password must be hashed with bcrypt
- JWT tokens expire in 24 hours
- Rate limiting: 5 attempts per minute`,
    previousVersion: `# Login API Schema

## Authentication Endpoint
- POST /api/auth/login
- Request Body: { email: string, password: string }
- Response: { token: string }

## Security Requirements
- Password must be hashed
- JWT tokens expire in 24 hours`,
    comments: [
      {
        id: 1,
        author: 'Aisha',
        message: 'The response should include user information. Also, specify the hashing algorithm.',
        timestamp: '2024-07-11 10:15',
        type: 'suggestion'
      }
    ]
  }
};

export function ReviewModal({ reviewId, isOpen, onClose }: ReviewModalProps) {
  const [reviewComment, setReviewComment] = useState('');
  const [decision, setDecision] = useState<'approve' | 'request_changes' | null>(null);
  
  const review = mockReviewDetails[reviewId as keyof typeof mockReviewDetails];

  if (!review) return null;

  const handleSubmitReview = () => {
    console.log('Submitting review:', { decision, comment: reviewComment });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{review.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{review.status.replace('_', ' ')}</Badge>
                <Badge variant="outline">{review.priority}</Badge>
                <Badge variant="outline">{review.phase}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Submitted {review.submittedAt}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-6">
          {/* Author & Reviewer Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {review.author.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.author}</p>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {review.reviewer.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.reviewer}</p>
                <p className="text-xs text-muted-foreground">Reviewer</p>
              </div>
            </div>
          </div>

          {/* Side-by-side diff */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 gap-4 h-full">
              <Card className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Previous Version</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {review.previousVersion}
                  </pre>
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Current Submission</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {review.currentVersion}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Comments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Review Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {review.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {comment.author.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Review Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Review Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your review comments..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Button
                    variant={decision === 'approve' ? 'default' : 'outline'}
                    onClick={() => setDecision('approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant={decision === 'request_changes' ? 'destructive' : 'outline'}
                    onClick={() => setDecision('request_changes')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Request Changes
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={!decision}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
