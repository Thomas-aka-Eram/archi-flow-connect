
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronDown, Plus, X, Tag as TagIcon } from "lucide-react";
import { useTagsDomains, Tag } from "@/contexts/TagsDomainsContext";

interface HierarchicalTagPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function HierarchicalTagPicker({ 
  isOpen, 
  onClose, 
  selectedTags, 
  onTagsChange 
}: HierarchicalTagPickerProps) {
  const { tags, getTagHierarchy, addTag } = useTagsDomains();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [newTagName, setNewTagName] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | undefined>();

  const toggleNode = (tagId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleTagSelect = (tagId: string) => {
    const hierarchy = getTagHierarchy(tagId);
    const newSelectedTags = [...new Set([...selectedTags, ...hierarchy])];
    onTagsChange(newSelectedTags);
  };

  const handleTagRemove = (tagName: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagName));
  };

  const handleAddNewTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim(), selectedParent);
      setNewTagName('');
      setSelectedParent(undefined);
    }
  };

  const renderTagTree = (parentTags: Tag[], level = 0) => {
    return parentTags.map(tag => {
      const hasChildren = tag.children.length > 0;
      const isExpanded = expandedNodes.has(tag.id);
      const isSelected = selectedTags.includes(tag.name);
      const childTags = tags.filter(t => tag.children.includes(t.id));

      return (
        <div key={tag.id} className="select-none">
          <div 
            className={`flex items-center gap-2 py-1 px-2 hover:bg-accent rounded cursor-pointer ${
              isSelected ? 'bg-accent' : ''
            }`}
            style={{ marginLeft: `${level * 20}px` }}
          >
            {hasChildren ? (
              <button
                onClick={() => toggleNode(tag.id)}
                className="p-0.5 hover:bg-accent-foreground/10 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
            
            <TagIcon className="h-3 w-3 text-muted-foreground" />
            
            <span 
              className="flex-1 text-sm"
              onClick={() => handleTagSelect(tag.id)}
            >
              {tag.name}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setSelectedParent(tag.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {hasChildren && isExpanded && (
            <div>
              {renderTagTree(childTags, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const rootTags = tags.filter(tag => !tag.parent);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Tags</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Tag Tree */}
          <div className="flex-1 border rounded-lg p-3 overflow-y-auto">
            <div className="space-y-1">
              {renderTagTree(rootTags)}
            </div>
          </div>

          {/* Selected Tags & Add New */}
          <div className="w-80 space-y-4">
            <div>
              <Label className="text-sm font-medium">Selected Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg min-h-[100px]">
                {selectedTags.map((tagName) => (
                  <Badge key={tagName} variant="secondary" className="gap-1">
                    {tagName}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTagRemove(tagName)}
                    />
                  </Badge>
                ))}
                {selectedTags.length === 0 && (
                  <span className="text-sm text-muted-foreground">No tags selected</span>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Add New Tag</Label>
              <div className="space-y-2 mt-2">
                <Input
                  placeholder="Tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
                {selectedParent && (
                  <div className="text-xs text-muted-foreground">
                    Parent: {tags.find(t => t.id === selectedParent)?.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2"
                      onClick={() => setSelectedParent(undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Button
                  size="sm"
                  onClick={handleAddNewTag}
                  disabled={!newTagName.trim()}
                  className="w-full"
                >
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
