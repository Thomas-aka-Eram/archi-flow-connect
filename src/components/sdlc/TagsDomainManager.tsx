import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Tag, Settings, ChevronRight, ChevronDown, Search, Edit3, Palette, Grid3X3 } from "lucide-react";
import { useTagsDomains } from "@/contexts/TagsDomainsContext";
import { ColorPicker } from "./ColorPicker";
import { useToast } from '@/hooks/use-toast';

export function TagsDomainManager() {
  const { tags, domains, addTag, removeTag, addDomain, removeDomain, getTagColor, getTagDisplayName } = useTagsDomains();
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['auth', 'ui', 'api', 'database', 'testing']));
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [newTagPhase, setNewTagPhase] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

  const phases = ['requirements', 'design', 'development', 'testing', 'deployment', 'maintenance'];

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const tagExists = tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase());
      if (tagExists) {
        toast({ title: "Tag already exists", variant: "destructive" });
        return;
      }
      addTag(newTagName.trim(), newTagColor, selectedParent, newTagPhase);
      setNewTagName('');
      setNewTagColor('#3B82F6');
      setNewTagPhase('');
      setSelectedParent(undefined);
    }
  };

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      const domainExists = domains.some(domain => domain.title.toLowerCase() === newDomain.trim().toLowerCase());
      if (domainExists) {
        toast({ title: "Domain already exists", variant: "destructive" });
        return;
      }
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

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = phaseFilter === 'all' || tag.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  const renderTagGrid = () => {
    const rootTags = filteredTags.filter(tag => !tag.parentId);
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rootTags.map(tag => {
          const tagColor = getTagColor(tag.id);
          const displayName = getTagDisplayName(tag.id);
          const childTags = tags.filter(t => tag.children.includes(t.id));
          
          return (
            <Card key={tag.id} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-border"
                      style={{ backgroundColor: tagColor }}
                    />
                    <Badge variant="compact" className="font-mono text-sm max-w-32">
                      {displayName}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setSelectedParent(tag.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:text-destructive"
                      onClick={() => removeTag(tag.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {tag.phase && (
                  <Badge variant="outline" className="text-xs mb-2">
                    {tag.phase}
                  </Badge>
                )}
                
                {childTags.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground font-medium">
                      Children ({childTags.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {childTags.slice(0, 3).map(childTag => {
                        const childColor = getTagColor(childTag.id);
                        const childDisplayName = getTagDisplayName(childTag.id);
                        
                        return (
                          <Badge 
                            key={childTag.id} 
                            variant="secondary" 
                            className="text-xs gap-1 max-w-24"
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: childColor }}
                            />
                            <span className="truncate">{childDisplayName}</span>
                          </Badge>
                        );
                      })}
                      {childTags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{childTags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderTagTree = (parentTags: typeof tags) => {
    return parentTags.map(tag => {
      const hasChildren = tag.children.length > 0;
      const isExpanded = expandedNodes.has(tag.id);
      const childTags = tags.filter(t => tag.children.includes(t.id));
      const tagColor = getTagColor(tag.id);
      const displayName = getTagDisplayName(tag.id);

      return (
        <div key={tag.id} className="select-none">
          <div 
            className="flex items-center gap-2 py-2 px-2 hover:bg-accent rounded group transition-colors"
            style={{ marginLeft: `${tag.level * 20}px` }}
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
            
            <Badge variant="compact" className="gap-2 flex-1 font-mono">
              {displayName}
              {tag.phase && (
                <span className="text-xs opacity-60">({tag.phase})</span>
              )}
            </Badge>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setSelectedParent(tag.id)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:text-destructive"
                onClick={() => removeTag(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div>
              {renderTagTree(childTags)}
            </div>
          )}
        </div>
      );
    });
  };

  const rootTags = filteredTags.filter(tag => !tag.parentId);

  return (
    <div className="space-y-6">
      {/* Hierarchical Tags Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Hierarchical Project Tags
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'tree' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tree')}
                className="gap-2"
              >
                <Tag className="h-4 w-4" />
                Tree
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Tag Form */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-4 w-4" />
                <Label className="text-sm font-medium">Add New Tag</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Tag Name</Label>
                  <Input
                    placeholder="Enter tag name..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">SDLC Phase</Label>
                  <Select value={newTagPhase} onValueChange={setNewTagPhase}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select phase (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map(phase => (
                        <SelectItem key={phase} value={phase}>
                          {phase.charAt(0).toUpperCase() + phase.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">
                  Color {selectedParent && "(auto-generated for child tags)"}
                </Label>
                <ColorPicker
                  selectedColor={newTagColor}
                  onColorSelect={setNewTagColor}
                  disabled={!!selectedParent}
                />
              </div>

              {selectedParent && (
                <Badge variant="outline" className="gap-1">
                  Parent: {tags.find(t => t.id === selectedParent)?.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedParent(undefined)}
                  />
                </Badge>
              )}

              <Button onClick={handleAddTag} disabled={!newTagName.trim()} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="flex gap-4">
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
              <SelectTrigger className="w-48">
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
          
          {/* Tags Display */}
          <div className="min-h-80">
            {viewMode === 'grid' ? (
              renderTagGrid()
            ) : (
              <div className="border rounded-lg p-3 max-h-80 overflow-y-auto">
                <div className="space-y-1">
                  {renderTagTree(rootTags)}
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg">
            <p>• <strong>Grid View:</strong> See all parent tags with their children in cards</p>
            <p>• <strong>Tree View:</strong> Navigate the full hierarchy with expand/collapse</p>
            <p>• <strong>Hover Actions:</strong> Hover over tags to add children or delete</p>
            <p>• <strong>Auto Colors:</strong> Child tags inherit softened colors from parents</p>
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
              <Badge key={domain.id} variant="outline" className="gap-1">
                {domain.title}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeDomain(domain.id)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}