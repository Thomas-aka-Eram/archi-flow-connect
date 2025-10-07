
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";

interface WebhookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: string[];
  onEventChange: (eventId: string) => void;
  onSave: () => void;
}

const availableWebhookEvents = [
  { id: 'push', label: 'Commits' },
  { id: 'pull_request', label: 'Pull Requests' },
  { id: 'create', label: 'Branch Creation' },
  { id: 'release', label: 'Releases' },
];

export function WebhookSettingsModal({ isOpen, onClose, events, onEventChange, onSave }: WebhookSettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Settings className="h-5 w-5" />
            Configure Webhook
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Listen for these events:</Label>
            {availableWebhookEvents.map(event => (
              <div key={event.id} className="flex items-center space-x-2">
                <Checkbox
                  id={event.id}
                  checked={events.includes(event.id)}
                  onCheckedChange={() => onEventChange(event.id)}
                />
                <label
                  htmlFor={event.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {event.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
