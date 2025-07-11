
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, CheckCircle, XCircle } from "lucide-react";
import { ReviewQueue } from "@/components/reviews/ReviewQueue";
import { ReviewModal } from "@/components/reviews/ReviewModal";

const mockReviews = {
  docs: [
    {
      id: 'review-1',
      type: 'block' as const,
      title: 'Login API Schema Design',
      author: 'Raj',
      reviewer: 'Aisha',
      status: 'PENDING_REVIEW',
      submittedAt: '2024-07-11 09:30',
      phase: 'Design',
      priority: 'HIGH'
    },
    {
      id: 'review-2',
      type: 'block' as const,
      title: 'Password Recovery Flow',
      author: 'Luis',
      reviewer: 'Aisha',
      status: 'CHANGES_REQUESTED',
      submittedAt: '2024-07-10 14:20',
      phase: 'Requirements',
      priority: 'MEDIUM'
    }
  ],
  tasks: [
    {
      id: 'review-3',
      type: 'task' as const,
      title: 'Implement OAuth Login',
      author: 'Luis',
      reviewer: 'Carlos',
      status: 'PENDING_REVIEW',
      submittedAt: '2024-07-11 11:45',
      phase: 'Development',
      priority: 'HIGH'
    }
  ]
};

export default function ReviewApproval() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const handleReviewSelect = (reviewId: string) => {
    setSelectedReview(reviewId);
  };

  const getAllReviews = () => [...mockReviews.docs, ...mockReviews.tasks];

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
                <p className="text-2xl font-bold">3</p>
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
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Changes Requested</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">2.1</span>
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
          <Tabs defaultValue="all">
            <div className="border-b px-6 pt-6">
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="docs">Docs Review Queue</TabsTrigger>
                <TabsTrigger value="tasks">Task Review Queue</TabsTrigger>
                <TabsTrigger value="my">My Reviews</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-6">
              <ReviewQueue 
                reviews={getAllReviews()} 
                onReviewSelect={handleReviewSelect}
              />
            </TabsContent>

            <TabsContent value="docs" className="p-6">
              <ReviewQueue 
                reviews={mockReviews.docs} 
                onReviewSelect={handleReviewSelect}
              />
            </TabsContent>

            <TabsContent value="tasks" className="p-6">
              <ReviewQueue 
                reviews={mockReviews.tasks} 
                onReviewSelect={handleReviewSelect}
              />
            </TabsContent>

            <TabsContent value="my" className="p-6">
              <ReviewQueue 
                reviews={getAllReviews().filter(r => r.reviewer === 'Aisha')} 
                onReviewSelect={handleReviewSelect}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedReview && (
        <ReviewModal
          reviewId={selectedReview}
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}
