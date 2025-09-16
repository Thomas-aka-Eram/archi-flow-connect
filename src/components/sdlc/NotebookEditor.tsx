import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Download, History, Eye, Play } from "lucide-react";
import { NotebookBlock } from "./NotebookBlock";
import apiClient from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

// Updated Block type to match backend schema more closely
interface Block {
  id: string; // This is the block version ID
  blockGroupId: string;
  content: string;
  type: 'markdown' | 'text' | 'image' | 'diagram';
  tags: { tag: { id: string; name: string } }[];
  domains: { domain: { id: string; name: string } }[];
  title?: string;
  version: number;
}

interface NotebookEditorProps {
  documentId: string;
  onBack: () => void;
}

export function NotebookEditor({ documentId, onBack }: NotebookEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/documents/${documentId}/blocks`);
      setBlocks(response.data);
    } catch (error: any) {
      toast({
        title: "Failed to fetch blocks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [documentId, toast]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleSaveBlock = async (blockId: string, content: string, title?: string) => {
    const blockToUpdate = blocks.find(b => b.id === blockId);
    if (!blockToUpdate) return;

    try {
      const response = await apiClient.patch(`/documents/blocks/${blockToUpdate.blockGroupId}`, {
        content,
        title,
        expectedVersion: blockToUpdate.version,
      });
      // Replace the old version with the new one
      setBlocks(blocks.map(b => b.id === blockId ? response.data : b));
      setEditingBlockId(null);
    } catch (error: any) {
       toast({
        title: `Failed to save block`,
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const addNewBlock = async (afterBlockId?: string) => {
    try {
      const response = await apiClient.post(`/documents/${documentId}/blocks`, {
        type: 'markdown',
        content: '',
        title: 'New Block',
      });
      
      const newBlock = response.data;
      
      if (afterBlockId) {
        const index = blocks.findIndex(b => b.id === afterBlockId);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        setBlocks(newBlocks);
      } else {
        setBlocks([...blocks, newBlock]);
      }
      
      setEditingBlockId(newBlock.id);
      setSelectedBlockId(newBlock.id);

    } catch (error: any) {
      toast({
        title: "Failed to add new block",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Other handlers like delete, edit, select would also need to be implemented
  // For now, we focus on the core CRUD.

  if (loading) {
    return <div>Loading editor...</div>;
  }

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
              <h1 className="text-2xl font-bold">Document Editor</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">Editing Document</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save All (Not Implemented)
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-0">
            {blocks.map((block) => (
              <NotebookBlock
                key={block.id}
                // The NotebookBlock component will need to be adapted to this new data structure
                // This is a simplified mapping for now
                block={{
                  ...block,
                  rendered: true, // Assume rendered for now
                  connections: [],
                  comments: 0,
                  tags: block.tags.map(t => t.tag.name),
                  domain: block.domains[0]?.domain.name || 'GENERAL',
                }}
                isSelected={selectedBlockId === block.id}
                isEditing={editingBlockId === block.id}
                onEdit={() => setEditingBlockId(block.id)}
                onFinalize={(content, title) => handleSaveBlock(block.id, content, title)}
                onAddBlock={() => addNewBlock(block.id)}
                onContentChange={(content) => {
                  // This should ideally be debounced and saved automatically
                  // For now, we just update local state
                  setBlocks(blocks.map(b => b.id === block.id ? {...b, content} : b))
                }}
                onTitleChange={(title) => {
                   setBlocks(blocks.map(b => b.id === block.id ? {...b, title} : b))
                }}
                onSelect={() => setSelectedBlockId(block.id)}
                onDelete={() => { /* API call to delete block needed */ }}
                onUpdateBlock={(updates) => { /* API call to update tags/domains needed */ }}
              />
            ))}
          </div>

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
        </div>
      </div>
    </div>
  );
}
