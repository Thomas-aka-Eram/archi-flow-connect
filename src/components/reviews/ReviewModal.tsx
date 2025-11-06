import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import apiClient from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';

const approveReview = (reviewId: string) => {
  return apiClient.post(`/reviews/${reviewId}/approve`);
};

const assignReviewer = ({ reviewId, reviewerId }: { reviewId: string; reviewerId: string }) => {
  return apiClient.post(`/reviews/${reviewId}/assign`, { reviewerId });
};

const requestChanges = ({ reviewId, comments }: { reviewId: string; comments: string }) => {
  return apiClient.post(`/reviews/${reviewId}/request-changes`, { comments });
};

export function ReviewModal({ review, isOpen, onClose }) {
  const [comments, setComments] = useState('');
  const queryClient = useQueryClient();
  const { user } = useUser();

  console.log('ReviewModal review object:', review);

  const approveMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      await assignReviewer({ reviewId, reviewerId: user.id });
      return approveReview(reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', review.task.projectId] });
      onClose();
    },
  });

  const assignAndRequestChangesMutation = useMutation({
    mutationFn: async ({ reviewId, reviewerId, comments }) => {
      await assignReviewer({ reviewId, reviewerId });
      return requestChanges({ reviewId, comments });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', review.task.projectId] });
      onClose();
    },
  });

  const handleApprove = () => {
    approveMutation.mutate(review.id);
  };

  const handleRequestChanges = () => {
    if (user) {
      assignAndRequestChangesMutation.mutate({
        reviewId: review.id,
        reviewerId: user.id,
        comments,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Task: {review.task.title}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Hours:</span>
              <span>{review.task.estimateHours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actual Hours:</span>
              <span>{review.task.actualHours}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Completion Message:</span>
              <p>{review.task.completionNotes}</p>
            </div>
            {review.task.commits && review.task.commits.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Linked Commit:</span>
                <Button asChild variant="outline" size="sm">
                  <a href={review.task.commits[0].commit.url} target="_blank" rel="noopener noreferrer">
                    <GitCommit className="h-4 w-4 mr-2" />
                    {review.task.commits[0].commit.commitHash.substring(0, 7)}
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <div>
          <p>{review.task.description}</p>
          {/* TODO: Display linked commits and documents */}
        </div>
        <div className="mt-4">
          <Textarea
            placeholder="Add comments for rework..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRequestChanges}
            disabled={!comments || assignAndRequestChangesMutation.isPending}
          >
            Request Changes
          </Button>
          <Button onClick={handleApprove} disabled={approveMutation.isPending}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
