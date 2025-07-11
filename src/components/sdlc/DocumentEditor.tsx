
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Save, Download, Link, MessageSquare, History, Eye } from "lucide-react";
import { BlockEditor } from "./BlockEditor";
import { Textarea } from "@/components/ui/textarea";

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

interface DocumentEditorProps {
  documentId: string;
  onBack: () => void;
}

const mockBlocks: Block[] = [
  {
    id: 'block-1',
    title: 'Login Feature',
    content: `# User Login Requirements

The system must support secure user authentication with the following capabilities:

## Authentication Methods
- Email and password
- OAuth integration (Google, GitHub)
- Multi-factor authentication (optional)

## Security Requirements
- Password must be hashed using bcrypt
- JWT tokens for session management
- Rate limiting for login attempts`,
    tags: ['#auth', '#login', '#security'],
    domain: 'API',
    connections: ['block-design-1'],
    comments: 3,
    lastModified: '2024-07-11 10:30'
  },
  {
    id: 'block-2',
    title: 'User Story: Password Recovery',
    content: `# Password Recovery User Story

**As a** registered user  
**I want to** reset my password when I forget it  
**So that** I can regain access to my account

## Acceptance Criteria
- User can request password reset via email
- Reset link expires after 15 minutes
- User must confirm new password
- Old password becomes invalid after reset`,
    tags: ['#auth', '#password', '#recovery'],
    domain: 'API',
    connections: [],
    comments: 1,
    lastModified: '2024-07-10 14:20'
  }
];

export function DocumentEditor({ documentId, onBack }: DocumentEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(mockBlocks);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const handleAddBlock = () => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      title: 'New Block',
      content: '',
      tags: [],
      domain: 'GENERAL',
      connections: [],
      comments: 0,
      lastModified: new Date().toISOString()
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlock(newBlock.id);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Functional Requirements</h1>
              <p className="text-muted-foreground">Requirements Phase • Last saved 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Blocks List */}
        <div className="w-80 border-r p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Document Blocks</h3>
            <Button size="sm" onClick={handleAddBlock}>
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>
          </div>
          
          {blocks.map((block) => (
            <Card 
              key={block.id} 
              className={`cursor-pointer transition-colors ${
                selectedBlock === block.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedBlock(block.id)}
            >
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">{block.title}</h4>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {block.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs">
                      {block.domain}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{block.lastModified}</span>
                    <div className="flex items-center gap-2">
                      {block.connections.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Link className="h-3 w-3" />
                          {block.connections.length}
                        </span>
                      )}
                      {block.comments > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {block.comments}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Block Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedBlock ? (
            <BlockEditor 
              block={blocks.find(b => b.id === selectedBlock)!}
              onUpdate={(updates) => handleBlockUpdate(selectedBlock, updates)}
              isPreviewMode={isPreviewMode}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a block to edit</h3>
                <p className="text-muted-foreground">
                  Choose a block from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
