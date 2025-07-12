
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
import { RichTextToolbar } from "./RichTextToolbar";
import { BlockTagsModal } from "./BlockTagsModal";

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
  onUpdateBlock: (updates: Partial<Block>) => void;
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
  onDelete,
  onUpdateBlock
}: NotebookBlockProps) {
  const [content, setContent] = useState(block.content);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
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

  const handleFormatText = (command: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'unorderedList':
        formattedText = `\n- ${selectedText || 'list item'}`;
        break;
      case 'orderedList':
        formattedText = `\n1. ${selectedText || 'list item'}`;
        break;
      case 'blockquote':
        formattedText = `\n> ${selectedText || 'quote'}`;
        break;
      case 'code':
        formattedText = `\`${selectedText || 'code'}\``;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    onContentChange(newContent);
  };

  const handleInsertTable = () => {
    const table = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n';
    setContent(prev => prev + table);
    onContentChange(content + table);
  };

  const handleInsertImage = () => {
    const imageMarkdown = '\n![Image description](image-url)\n';
    setContent(prev => prev + imageMarkdown);
    onContentChange(content + imageMarkdown);
  };

  const handleInsertLink = () => {
    setShowTagsModal(true);
  };

  const handleSaveTagsDomain = (tags: string[], domain: string) => {
    onUpdateBlock({ tags, domain: domain as any });
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
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 list-decimal">$2</li>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/```mermaid\n([\s\S]*?)\n```/g, '<div class="bg-muted p-4 rounded-md font-mono text-sm">Mermaid Diagram: $1</div>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">$1</pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-2" />')
      .replace(/\|([^|\n]+)\|([^|\n]+)\|([^|\n]*)\|/g, '<table class="border-collapse border border-gray-300 my-4"><tr><td class="border border-gray-300 px-2 py-1">$1</td><td class="border border-gray-300 px-2 py-1">$2</td><td class="border border-gray-300 px-2 py-1">$3</td></tr></table>')
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
    <>
      <Card 
        className={`mb-4 transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
        } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
        onClick={onSelect}
      >
        {/* Block Header */}
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
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setShowTagsModal(true); }}>
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
              <RichTextToolbar
                onFormat={handleFormatText}
                onInsertTable={handleInsertTable}
                onInsertImage={handleInsertImage}
                onInsertLink={handleInsertLink}
              />
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

        {/* Add block button */}
        {isSelected && !isEditing && (
          <div className="flex justify-center py-2 border-t bg-muted/20">
            <Button variant="ghost" size="sm" onClick={onAddBlock}>
              <Plus className="h-4 w-4 mr-2" />
              Add Block Below
            </Button>
          </div>
        )}
      </Card>

      {/* Tags & Domain Modal */}
      <BlockTagsModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        currentTags={block.tags}
        currentDomain={block.domain}
        onSave={handleSaveTagsDomain}
      />
    </>
  );
}
