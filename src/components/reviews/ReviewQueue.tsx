import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserDisplay } from '../user/UserDisplay';

export function ReviewQueue({
  reviews,
  onReviewSelect,
}: {
  reviews: any[];
  onReviewSelect: (review: any) => void;
}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(reviews) &&
            reviews.map((review: any) => (
              <TableRow key={review.id}>
                <TableCell>{review.task?.title || 'Task not found'}</TableCell>
                <TableCell>
                  <UserDisplay userId={review.requester?.id} />
                </TableCell>
                <TableCell>
                  <Badge>{review.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => onReviewSelect(review)}>
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}