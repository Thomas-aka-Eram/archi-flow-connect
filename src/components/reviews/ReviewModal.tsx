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