import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Filter, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ReviewQueue } from '@/components/reviews/ReviewQueue';
import { ReviewModal } from '@/components/reviews/ReviewModal';

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-64">
    <p className="text-muted-foreground">{message}</p>
  </div>
);

const fetchReviews = async (projectId: string, status: string) => {
  const url =
    status === 'ALL'
      ? `/reviews/project/${projectId}`
      : `/reviews/project/${projectId}?status=${status}`;
  const { data } = await apiClient.get(url);
  return data;
};

export default function ReviewApproval() {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', projectId, activeTab],
    queryFn: () => fetchReviews(projectId, activeTab.toUpperCase()),
    enabled: !!projectId,
  });

  const handleReviewSelect = (review: any) => {
    setSelectedReview(review);
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews & Approval</h1>
          <p className="text-muted-foreground mt-1">
            Quality gates for documentation blocks and task submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Reviews
          </Button>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {reviews.filter((r) => r.status === 'PENDING').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {reviews.filter((r) => r.status === 'APPROVED').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {
                    reviews.filter(
                      (r) => r.status === 'CHANGES_REQUESTED',
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Changes Requested</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">0</span>
              </div>
              <div>
                <p className="text-2xl font-bold">Days</p>
                <p className="text-sm text-muted-foreground">Avg Review Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs
            defaultValue="all"
            onValueChange={(value) => setActiveTab(value)}
          >
            <div className="border-b px-6 pt-6">
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="changes_requested">
                  Changes Requested
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="p-6">
              {isLoading ? (
                <div>Loading...</div>
              ) : reviews.length > 0 ? (
                <ReviewQueue
                  reviews={reviews}
                  onReviewSelect={handleReviewSelect}
                />
              ) : (
                <EmptyState message="No reviews available." />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}
