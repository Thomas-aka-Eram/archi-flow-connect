
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTagsDomains } from "@/contexts/TagsDomainsContext";
import { X } from "lucide-react";

interface BlockTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTags: string[];
  currentDomain: string;
  onSave: (tags: string[], domain: string) => void;
}

export function BlockTagsModal({ 
  isOpen, 
  onClose, 
  currentTags, 
  currentDomain, 
  onSave 
}: BlockTagsModalProps) {
  const { tags: availableTags, domains: availableDomains } = useTagsDomains();
  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags);
  const [selectedDomain, setSelectedDomain] = useState(currentDomain);

  const handleTagAdd = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleSave = () => {
    onSave(selectedTags, selectedDomain);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Block Tags & Domain</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Domain Selection */}
          <div className="space-y-2">
            <Label>Domain</Label>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {availableDomains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags Selection */}
          <div className="space-y-3">
            <Label>Tags</Label>
            
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">Available Tags</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleTagAdd(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">Selected Tags</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTagRemove(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Tags & Domain
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
