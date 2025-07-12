
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Edit3, 
  Link, 
  MessageSquare, 
  Settings, 
  Play,
  Plus,
  X,
  Hash,
  Image,
  Code,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Block {
  id: string;
  content: string;
  rendered: boolean;
  type: 'markdown' | 'text' | 'image' | 'diagram';
  tags: string[];
  domain: 'UI' | 'API' | 'DB' | 'GENERAL';
  connections: string[];
  comments: number;
}

interface NotebookBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onFinalize: (content: string) => void;
  onAddBlock: () => void;
  onContentChange: (content: string) => void;
  onSelect: () => void;
  onDelete: () => void;
}

export function NotebookBlock({
  block,
  isSelected,
  isEditing,
  onEdit,
  onFinalize,
  onAddBlock,
  onContentChange,
  onSelect,
  onDelete
}: NotebookBlockProps) {
  const [content, setContent] = useState(block.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Position cursor at end
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      onFinalize(content);
    } else if (e.key === 'Escape') {
      setContent(block.content);
      onEdit();
    }
  };

  const handleSlashCommand = (command: string) => {
    const commands = {
      '/image': '![Image description](url)',
      '/code': '```\n// Your code here\n```',
      '/diagram': '```mermaid\ngraph TD\n    A --> B\n```',
      '/table': '| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |',
    };
    
    if (commands[command as keyof typeof commands]) {
      setContent(prev => prev + '\n' + commands[command as keyof typeof commands]);
      onContentChange(content + '\n' + commands[command as keyof typeof commands]);
    }
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/```mermaid\n([\s\S]*?)\n```/g, '<div class="bg-muted p-4 rounded-md font-mono text-sm">Mermaid Diagram: $1</div>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">$1</pre>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-2" />')
      .replace(/\n/g, '<br />');
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'UI': return 'bg-blue-500/10 text-blue-700';
      case 'API': return 'bg-green-500/10 text-green-700';
      case 'DB': return 'bg-orange-500/10 text-orange-700';
      case 'GENERAL': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <Card 
      className={`mb-4 transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
      } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      {/* Block Header - Only show when not editing or when selected */}
      {(isSelected || !isEditing) && (
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getDomainColor(block.domain)}>
              {block.domain}
            </Badge>
            {block.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4" />
              {block.comments > 0 && <span className="ml-1 text-xs">{block.comments}</span>}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSlashCommand('/image')}>
                  <Image className="h-4 w-4 mr-2" />
                  Add Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSlashCommand('/code')}>
                  <Code className="h-4 w-4 mr-2" />
                  Add Code Block
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSlashCommand('/diagram')}>
                  <Hash className="h-4 w-4 mr-2" />
                  Add Diagram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <X className="h-4 w-4 mr-2" />
                  Delete Block
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <CardContent className="p-0">
        {isEditing ? (
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                onContentChange(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your content here... Press Shift+Enter to finalize, Escape to cancel"
              className="min-h-[120px] border-0 resize-none focus:ring-0 font-mono"
              style={{ minHeight: Math.max(120, content.split('\n').length * 24) + 'px' }}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <Button size="sm" onClick={() => onFinalize(content)}>
                <Play className="h-4 w-4 mr-1" />
                Run (Shift+Enter)
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {block.content ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
              />
            ) : (
              <div className="text-muted-foreground italic text-center py-8">
                Empty block - click to edit
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Add block button - only show when selected and not editing */}
      {isSelected && !isEditing && (
        <div className="flex justify-center py-2 border-t bg-muted/20">
          <Button variant="ghost" size="sm" onClick={onAddBlock}>
            <Plus className="h-4 w-4 mr-2" />
            Add Block Below
          </Button>
        </div>
      )}
    </Card>
  );
}
