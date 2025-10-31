import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import apiClient from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';

const approveReview = (reviewId: string) => {
  return apiClient.post(`/projects/projectId/reviews/${reviewId}/approve`);
};

const assignReviewer = ({ reviewId, reviewerId }: { reviewId: string; reviewerId: string }) => {
  return apiClient.patch(`/projects/projectId/reviews/${reviewId}/assign`, { reviewerId });
};

const requestChanges = ({ reviewId, comments }: { reviewId: string; comments: string }) => {
  return apiClient.post(`/projects/projectId/reviews/${reviewId}/request-changes`, { comments });
};

export function ReviewModal({ review, isOpen, onClose }) {
  const [comments, setComments] = useState('');
  const queryClient = useQueryClient();
  const { user } = useUser();

  const approveMutation = useMutation({
    mutationFn: approveReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', review.tasks.projectId] });
      onClose();
    },
  });

  const assignReviewerMutation = useMutation({
    mutationFn: assignReviewer,
    onSuccess: () => {
      requestChangesMutation.mutate({ reviewId: review.task_reviews.id, comments });
    },
  });

  const requestChangesMutation = useMutation({
    mutationFn: requestChanges,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', review.tasks.projectId] });
      onClose();
    },
  });

  const handleApprove = () => {
    approveMutation.mutate(review.task_reviews.id);
  };

  const handleRequestChanges = () => {
    if (user) {
      assignReviewerMutation.mutate({
        reviewId: review.task_reviews.id,
        reviewerId: user.userId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Task: {review.tasks.title}</DialogTitle>
        </DialogHeader>
        <div>
          <p>{review.tasks.description}</p>
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
            disabled={!comments || assignReviewerMutation.isPending || requestChangesMutation.isPending}
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