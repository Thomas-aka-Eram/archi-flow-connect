import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Download, History, Eye, Play } from "lucide-react";
import { NotebookBlock } from "./NotebookBlock";

interface Block {
  id: string;
  content: string;
  rendered: boolean;
  type: 'markdown' | 'text' | 'image' | 'diagram';
  tags: string[];
  domain: 'UI' | 'API' | 'DB' | 'GENERAL';
  connections: string[];
  comments: number;
  title?: string;
}

interface NotebookEditorProps {
  documentId: string;
  onBack: () => void;
}

export function NotebookEditor({ documentId, onBack }: NotebookEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 'block-1',
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
      rendered: true,
      type: 'markdown',
      tags: ['#authentication', '#login', '#security'],
      domain: 'API',
      connections: ['block-design-1'],
      comments: 3,
      title: 'User Login Requirements'
    },
    {
      id: 'block-2',
      content: `**As a** registered user  
**I want to** reset my password when I forget it  
**So that** I can regain access to my account

## Acceptance Criteria
- User can request password reset via email
- Reset link expires after 15 minutes
- User must confirm new password
- Old password becomes invalid after reset`,
      rendered: false,
      type: 'markdown',
      tags: ['#authentication', '#password'],
      domain: 'API',
      connections: [],
      comments: 1,
      title: 'Password Recovery User Story'
    }
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>('block-2');
  const [newlyCreatedBlockId, setNewlyCreatedBlockId] = useState<string | null>(null);

  const handleBlockFinalize = (blockId: string, content: string, title?: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, content, title, rendered: true }
        : block
    ));
    setEditingBlockId(null);
    setNewlyCreatedBlockId(null);
    
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex === blocks.length - 1) {
      addNewBlock(blockId);
    }
  };

  const handleBlockTitleChange = (blockId: string, title: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, title } : block
    ));
  };

  const handleBlockEdit = (blockId: string) => {
    setEditingBlockId(editingBlockId === blockId ? null : blockId);
    setSelectedBlockId(blockId);
    setNewlyCreatedBlockId(null);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const addNewBlock = (afterBlockId?: string) => {
    const newBlockId = `block-${Date.now()}`;
    const newBlock: Block = {
      id: newBlockId,
      content: '',
      rendered: false,
      type: 'markdown',
      tags: [],
      domain: 'GENERAL',
      connections: [],
      comments: 0,
      title: ''
    };

    if (afterBlockId) {
      const index = blocks.findIndex(b => b.id === afterBlockId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks([...blocks, newBlock]);
    }
    
    setEditingBlockId(newBlockId);
    setSelectedBlockId(newBlockId);
    setNewlyCreatedBlockId(newBlockId);
  };

  const handleBlockDelete = (blockId: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== blockId));
      if (selectedBlockId === blockId) setSelectedBlockId(null);
      if (editingBlockId === blockId) setEditingBlockId(null);
      if (newlyCreatedBlockId === blockId) setNewlyCreatedBlockId(null);
    }
  };

  const handleBlockContentChange = (blockId: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  useEffect(() => {
    const firstEmptyBlock = blocks.find(b => !b.content && !b.rendered);
    if (firstEmptyBlock && !editingBlockId) {
      setEditingBlockId(firstEmptyBlock.id);
      setSelectedBlockId(firstEmptyBlock.id);
      setNewlyCreatedBlockId(firstEmptyBlock.id);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingBlockId) {
        setEditingBlockId(null);
        setNewlyCreatedBlockId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingBlockId]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-6 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Functional Requirements</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">Requirements Phase</Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">Auto-saved 30 seconds ago</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              Save All
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-0">
            {blocks.map((block, index) => (
              <NotebookBlock
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                isEditing={editingBlockId === block.id}
                isNewBlock={newlyCreatedBlockId === block.id}
                onEdit={() => handleBlockEdit(block.id)}
                onFinalize={(content, title) => handleBlockFinalize(block.id, content, title)}
                onAddBlock={() => addNewBlock(block.id)}
                onContentChange={(content) => handleBlockContentChange(block.id, content)}
                onTitleChange={(title) => handleBlockTitleChange(block.id, title)}
                onSelect={() => setSelectedBlockId(block.id)}
                onDelete={() => handleBlockDelete(block.id)}
                onUpdateBlock={(updates) => handleUpdateBlock(block.id, updates)}
              />
            ))}
          </div>

          {blocks.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Start your document</h3>
              <p className="text-muted-foreground mb-4">
                Create your first block to begin documenting your requirements
              </p>
              <Button onClick={() => addNewBlock()}>
                <Play className="h-4 w-4 mr-2" />
                Create First Block
              </Button>
            </div>
          )}

          {blocks.length > 0 && !editingBlockId && (
            <div className="text-center py-6">
              <Button 
                variant="outline" 
                onClick={() => addNewBlock()}
                className="bg-background"
              >
                <Play className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </div>
          )}
        </div>
      </div>

      {editingBlockId && (
        <div className="border-t bg-muted/30 px-6 py-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span><kbd className="px-2 py-1 bg-background rounded text-xs">Shift+Enter</kbd> to finalize block</span>
              <span><kbd className="px-2 py-1 bg-background rounded text-xs">Esc</kbd> to cancel editing</span>
            </div>
            <div className="flex items-center gap-4">
              <span><kbd className="px-2 py-1 bg-background rounded text-xs">/image</kbd> for images</span>
              <span><kbd className="px-2 py-1 bg-background rounded text-xs">/code</kbd> for code blocks</span>
              <span><kbd className="px-2 py-1 bg-background rounded text-xs">/diagram</kbd> for diagrams</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
