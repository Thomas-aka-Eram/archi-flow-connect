import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronDown, Plus, X, Tag as TagIcon, Search } from "lucide-react";
import { useTagsDomains, Tag } from "@/contexts/TagsDomainsContext";
import { ColorPicker } from "./ColorPicker";

interface HierarchicalTagPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  currentPhase?: string;
}

export function HierarchicalTagPicker({ 
  isOpen, 
  onClose, 
  selectedTags, 
  onTagsChange,
  currentPhase 
}: HierarchicalTagPickerProps) {
  const { tags, getTagHierarchy, addTag, getTagColor, getTagsByPhase, getTagDisplayName, getTagTooltip } = useTagsDomains();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [selectedParent, setSelectedParent] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');

  const phases = ['requirements', 'design', 'development', 'testing', 'deployment', 'maintenance'];

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
    const newSelectedTags = [...new Set([...selectedTags, ...hierarchy.map(t => t.name)])];
    onTagsChange(newSelectedTags);
  };

  const handleTagRemove = (tagName: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagName));
  };

  const handleAddNewTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim(), newTagColor, selectedParent, currentPhase);
      setNewTagName('');
      setNewTagColor('#3B82F6');
      setSelectedParent(undefined);
    }
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = phaseFilter === 'all' || tag.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  const renderTagTree = (parentTags: Tag[], level = 0) => {
    return parentTags.map(tag => {
      const hasChildren = tag.children.length > 0;
      const isExpanded = expandedNodes.has(tag.id);
      const displayName = getTagDisplayName(tag.id);
      const isSelected = selectedTags.includes(tag.name);
      const childTags = tags.filter(t => tag.children.includes(t.id));
      const tagColor = getTagColor(tag.id);
      const tooltip = getTagTooltip(tag.id);

      return (
        <div key={tag.id} className="select-none">
          <div 
            className={`flex items-center gap-2 py-2 px-3 hover:bg-accent rounded cursor-pointer transition-colors group ${
              isSelected ? 'bg-accent/50' : ''
            }`}
            style={{ marginLeft: `${level * 16}px` }}
            title={tooltip}
          >
            {hasChildren ? (
              <button
                onClick={() => toggleNode(tag.id)}
                className="p-0.5 hover:bg-accent-foreground/10 rounded transition-colors"
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
            
            <div 
              className="w-3 h-3 rounded-full border border-border"
              style={{ backgroundColor: tagColor }}
            />
            
            <Badge
              variant="compact"
              className="flex-1 cursor-pointer font-mono text-xs"
              onClick={() => handleTagSelect(tag.id)}
            >
              {displayName}
            </Badge>

            {tag.phase && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                {tag.phase}
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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

  const rootTags = filteredTags.filter(tag => !tag.parentId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Tags</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Tag Tree */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {phases.map(phase => (
                    <SelectItem key={phase} value={phase}>
                      {phase.charAt(0).toUpperCase() + phase.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-3 overflow-y-auto flex-1">
              <div className="space-y-1">
                {renderTagTree(rootTags)}
              </div>
            </div>
          </div>

          {/* Selected Tags & Add New */}
          <div className="w-80 space-y-4">
            <div>
              <Label className="text-sm font-medium">Selected Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg min-h-[100px] max-h-60 overflow-y-auto">
                {selectedTags.map((tagName) => {
                  const tag = tags.find(t => getTagDisplayName(t.id) === tagName);
                  const tagColor = tag ? getTagColor(tag.id) : '#6B7280';
                  
                  return (
                    <Badge 
                      key={tagName} 
                      variant="secondary" 
                      className="gap-2 font-mono text-xs max-w-full"
                      title={tag ? getTagTooltip(tag.id) : ''}
                    >
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tagColor }}
                      />
                      <span className="truncate">{tagName}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive flex-shrink-0" 
                        onClick={() => handleTagRemove(tagName)}
                      />
                    </Badge>
                  );
                })}
                {selectedTags.length === 0 && (
                  <span className="text-sm text-muted-foreground">No tags selected</span>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Add New Tag</Label>
              <div className="space-y-3 mt-2">
                <Input
                  placeholder="Tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
                
                <div>
                  <Label className="text-xs text-muted-foreground">Color</Label>
                  <div className="mt-1">
                    <ColorPicker
                      selectedColor={newTagColor}
                      onColorSelect={setNewTagColor}
                      disabled={!!selectedParent}
                    />
                  </div>
                </div>

                {selectedParent && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
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
