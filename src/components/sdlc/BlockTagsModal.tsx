
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTagsDomains } from "@/contexts/TagsDomainsContext";
import { HierarchicalTagPicker } from "./HierarchicalTagPicker";
import { X, Tag as TagIcon } from "lucide-react";

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
  const { domains, tags } = useTagsDomains();
  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags);
  const [selectedDomain, setSelectedDomain] = useState(currentDomain);
  const [showTagPicker, setShowTagPicker] = useState(false);

  const handleSave = () => {
    const tagIds = selectedTags.map(tagName => {
      const tag = tags.find(t => t.name === tagName);
      return tag ? tag.id : tagName;
    });
    const domainId = domains.find(d => d.title === selectedDomain)?.id || selectedDomain;
    onSave(tagIds, domainId);
    onClose();
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  return (
    <>
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
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.title}>
                      {domain.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tags</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTagPicker(true)}
                  className="gap-2"
                >
                  <TagIcon className="h-4 w-4" />
                  Choose Tags
                </Button>
              </div>
              
              <div className="min-h-[100px] p-4 border rounded-lg bg-muted/30">
                {selectedTags.length > 0 ? (
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
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <TagIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tags selected</p>
                    <p className="text-xs">Click "Choose Tags" to add tags</p>
                  </div>
                )}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <p>Selected tags include their parent hierarchy automatically</p>
                </div>
              )}
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

      <HierarchicalTagPicker
        isOpen={showTagPicker}
        onClose={() => setShowTagPicker(false)}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />
    </>
  );
}
