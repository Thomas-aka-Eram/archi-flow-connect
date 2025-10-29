
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { actualHours: number; completionNotes: string; commitId?: string }) => void;
}

export function CompletionModal({ isOpen, onClose, onSubmit }: CompletionModalProps) {
  const [actualHours, setActualHours] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [commitId, setCommitId] = useState('');

  const handleSubmit = () => {
    const hours = parseInt(actualHours, 10);
    onSubmit({
      actualHours: !isNaN(hours) ? hours : 0,
      completionNotes,
      commitId: commitId || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="actual-hours">Actual Hours</Label>
            <Input
              id="actual-hours"
              type="number"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
              placeholder="Enter actual hours"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="completion-notes">Completion Notes</Label>
            <Textarea
              id="completion-notes"
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Add completion notes..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commit-id">Commit ID (Optional)</Label>
            <Input
              id="commit-id"
              value={commitId}
              onChange={(e) => setCommitId(e.target.value)}
              placeholder="Enter commit ID"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
