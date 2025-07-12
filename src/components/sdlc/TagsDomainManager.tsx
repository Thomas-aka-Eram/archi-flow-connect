
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Tag, Settings, ChevronRight, ChevronDown } from "lucide-react";
import { useTagsDomains } from "@/contexts/TagsDomainsContext";

export function TagsDomainManager() {
  const { tags, domains, addTag, removeTag, addDomain, removeDomain } = useTagsDomains();
  const [newDomain, setNewDomain] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['auth', 'ui', 'api', 'database', 'testing']));
  const [newTagName, setNewTagName] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | undefined>();

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim(), selectedParent);
      setNewTagName('');
      setSelectedParent(undefined);
    }
  };

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      addDomain(newDomain.trim());
      setNewDomain('');
    }
  };

  const toggleNode = (tagId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTagTree = (parentTags: typeof tags, level = 0) => {
    return parentTags.map(tag => {
      const hasChildren = tag.children.length > 0;
      const isExpanded = expandedNodes.has(tag.id);
      const childTags = tags.filter(t => tag.children.includes(t.id));

      return (
        <div key={tag.id} className="select-none">
          <div 
            className="flex items-center gap-2 py-1 px-2 hover:bg-accent rounded group"
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
            
            <Badge variant="secondary" className="gap-1 flex-1">
              {tag.name}
              <X 
                className="h-3 w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={() => removeTag(tag.id)}
              />
            </Badge>
            
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

  const rootTags = tags.filter(tag => !tag.parent);

  return (
    <div className="space-y-6">
      {/* Hierarchical Tags Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Hierarchical Project Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new tag..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1"
            />
            {selectedParent && (
              <Badge variant="outline" className="gap-1">
                Parent: {tags.find(t => t.id === selectedParent)?.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedParent(undefined)}
                />
              </Badge>
            )}
            <Button onClick={handleAddTag} size="sm" disabled={!newTagName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="border rounded-lg p-3 max-h-80 overflow-y-auto">
            <div className="space-y-1">
              {renderTagTree(rootTags)}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>• Click the + button next to a tag to add a child tag</p>
            <p>• Selecting a child tag automatically includes all parent tags</p>
            <p>• Use the expand/collapse arrows to navigate the hierarchy</p>
          </div>
        </CardContent>
      </Card>

      {/* Domains Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Project Domains
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new domain..."
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
            />
            <Button onClick={handleAddDomain} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <Badge key={domain} variant="outline" className="gap-1">
                {domain}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeDomain(domain)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
