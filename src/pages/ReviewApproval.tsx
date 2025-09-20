
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, CheckCircle, XCircle } from "lucide-react";
import { ReviewQueue } from "@/components/reviews/ReviewQueue";
import { ReviewModal } from "@/components/reviews/ReviewModal";

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-64">
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default function ReviewApproval() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const handleReviewSelect = (reviewId: string) => {
    setSelectedReview(reviewId);
  };

  const reviews: any[] = [];

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
                <p className="text-2xl font-bold">0</p>
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
                <p className="text-2xl font-bold">0</p>
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
                <p className="text-2xl font-bold">0</p>
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
              {reviews.length > 0 ? (
                <ReviewQueue 
                  reviews={reviews} 
                  onReviewSelect={handleReviewSelect}
                />
              ) : (
                <EmptyState message="No reviews available." />
              )}
            </TabsContent>

            <TabsContent value="docs" className="p-6">
              <EmptyState message="No document reviews available." />
            </TabsContent>

            <TabsContent value="tasks" className="p-6">
              <EmptyState message="No task reviews available." />
            </TabsContent>

            <TabsContent value="my" className="p-6">
              <EmptyState message="You have no reviews assigned." />
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
