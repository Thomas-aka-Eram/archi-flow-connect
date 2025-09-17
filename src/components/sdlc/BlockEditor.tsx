
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link, 
  MessageSquare, 
  Tag, 
  Settings, 
  Save,
  Eye,
  Edit3,
  Plus,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Block {
  id: string;
  title: string;
  content: string;
  tags: string[];
  domain: 'UI' | 'API' | 'DB' | 'GENERAL';
  connections: string[];
  comments: number;
  lastModified: string;
}

interface BlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode: boolean;
}

const domainColors = {
  UI: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  API: 'bg-green-500/10 text-green-700 border-green-500/20',
  DB: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  GENERAL: 'bg-gray-500/10 text-gray-700 border-gray-500/20'
};

export function BlockEditor({ block, onUpdate, isPreviewMode }: BlockEditorProps) {
  const [newTag, setNewTag] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !block.tags.includes(newTag.trim())) {
      const formattedTag = newTag.startsWith('#') ? newTag : `#${newTag}`;
      onUpdate({ tags: [...block.tags, formattedTag] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: block.tags.filter(tag => tag !== tagToRemove) });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for preview
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Block Header */}
      <div className="border-b p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {editingTitle ? (
              <Input
                value={block.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                onBlur={() => setEditingTitle(false)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="text-xl font-bold"
                autoFocus
              />
            ) : (
              <h2 
                className="text-xl font-bold cursor-pointer hover:text-primary"
                onClick={() => setEditingTitle(true)}
              >
                {block.title}
                <Edit3 className="h-4 w-4 inline ml-2" />
              </h2>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Last modified: {block.lastModified}
            </p>
          </div>
        </div>

        {/* Tags and Domain */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Tags:</span>
            {block.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="w-32 h-8 text-sm"
              />
              <Button size="sm" onClick={handleAddTag}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Domain:</span>
              <Select value={block.domain} onValueChange={(value) => onUpdate({ domain: value as Block["domain"] })}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UI">UI</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="DB">DB</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className={domainColors[block.domain]}>
              {block.domain}
            </Badge>
          </div>
        </div>
      </div>

      {/* Block Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="content" className="h-full flex flex-col">
          <div className="border-b px-6">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="connections">
                <Link className="h-4 w-4 mr-2" />
                Connections ({block.connections.length})
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments ({block.comments})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="flex-1 p-6 overflow-y-auto">
            {isPreviewMode ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
              />
            ) : (
              <div className="h-full">
                <Textarea
                  value={block.content}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  placeholder="Write your block content in Markdown..."
                  className="h-full resize-none font-mono"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="connections" className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Connected Blocks</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Connection
                </Button>
              </div>
              {block.connections.length === 0 ? (
                <p className="text-muted-foreground">No connections yet</p>
              ) : (
                <div className="space-y-2">
                  {block.connections.map((connectionId) => (
                    <Card key={connectionId}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Login UI Wireframe</p>
                            <p className="text-sm text-muted-foreground">Design Phase</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Comments & Reviews</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">RK</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Raj Kumar</span>
                          <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                        <p className="text-sm">Should we include Apple login as well? It's becoming quite common for mobile apps.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
