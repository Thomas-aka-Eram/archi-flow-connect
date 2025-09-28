
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  title?: string;
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
  isUpdating: boolean;
  isNewBlock?: boolean;
  onEdit: () => void;
  onFinalize: (content: string, title?: string) => void;
  onAddBlock: () => void;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onSelect: () => void;
  onDelete: () => void;
  onUpdateBlock: (updates: Partial<Block>) => void;
}

export function NotebookBlock({
  block,
  isSelected,
  isEditing,
  isUpdating,
  isNewBlock = false,
  onEdit,
  onFinalize,
  onAddBlock,
  onContentChange,
  onTitleChange,
  onSelect,
  onDelete,
  onUpdateBlock
}: NotebookBlockProps) {
  const [content, setContent] = useState(block.content);
  const [title, setTitle] = useState(block.title || '');
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [showTitleHint, setShowTitleHint] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus behavior for new blocks vs existing blocks
  useEffect(() => {
    if (isEditing && isNewBlock) {
      // For new blocks, focus on title first
      if (titleRef.current) {
        titleRef.current.focus();
        // Add glow animation
        titleRef.current.style.boxShadow = '0 0 0 2px hsl(var(--primary))';
        setTimeout(() => {
          if (titleRef.current) {
            titleRef.current.style.boxShadow = '';
          }
        }, 500);
      }
    } else if (isEditing && !isNewBlock) {
      // For existing blocks, focus on content
      if (textareaRef.current) {
        textareaRef.current.focus();
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditing, isNewBlock]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      onFinalize(content, title);
    } else if (e.key === 'Escape') {
      setContent(block.content);
      setTitle(block.title || '');
      onEdit();
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textareaRef.current?.focus();
    } else if (e.key === 'Escape') {
      setTitle(block.title || '');
      onEdit();
    } else if (e.key === 'ArrowUp' && e.metaKey) {
      e.preventDefault();
      // Jump to previous block's header (would need parent component implementation)
    }
  };

  const handleTitleFocus = () => {
    setTitleFocused(true);
    if (!title && isNewBlock) {
      setShowTitleHint(true);
    }
  };

  const handleTitleBlur = () => {
    setTitleFocused(false);
    setShowTitleHint(false);
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
    const renderTable = (tableMarkdown: string) => {
      const rows = tableMarkdown.trim().split('\n');
      const header = rows[0];
      const body = rows.slice(2);

      const renderRow = (row: string, isHeader: boolean) => {
        const cells = row.split('|').map(c => c.trim());
        // Remove the first and last empty cells
        cells.shift();
        cells.pop();

        return (
                  `<tr>
         ${cells.map(cell => `<${isHeader ? 'th' : 'td'} class="border border-gray-600 px-4 py-2 text-left">${cell}</${isHeader ? 'th' : 'td'}>`).join('')}
       </tr>`        );
      };

      return (
        `<table class="border-collapse w-full my-4">
          <thead>
            ${renderRow(header, true)}
          </thead>
          <tbody>
            ${body.map(row => renderRow(row, false)).join('')}
          </tbody>
        </table>`
      );
    };

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
      .replace(/```mermaid\n([\s\S]*?)\n```/g, '<div class="bg-muted p-4 rounded-md font-mono text-sm border-2 border-dashed border-blue-300"><div class="text-blue-600 font-semibold mb-2">📊 Mermaid Diagram</div><pre>$1</pre></div>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto border">$1</pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-2 border" />')
      .replace(/\|([^|\n]+)\|/g, (match) => renderTable(match))
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

  const getCharacterCount = () => {
    return title.length;
  };

  const maxTitleLength = 100;

  return (
    <>
      <Card 
        className={`mb-4 transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
        } ${isEditing ? 'ring-2 ring-blue-500' : ''} ${isNewBlock ? 'animate-scale-in' : ''}`}
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Block Header */}
        {(isSelected || isHovered || !isEditing) && (
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
              {isUpdating && <Badge variant="outline">Loading...</Badge>}
            </div>
            <div className={`flex items-center gap-1 transition-opacity duration-200 ${
              isHovered || isSelected ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="group"
              >
                <Edit3 className="h-4 w-4" />
                <span className="sr-only group-hover:not-sr-only ml-1 text-xs">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); setShowTagsModal(true); }}
                className="group"
              >
                <Link className="h-4 w-4" />
                <span className="sr-only group-hover:not-sr-only ml-1 text-xs">Link</span>
              </Button>
              <Button variant="ghost" size="sm" className="group">
                <MessageSquare className="h-4 w-4" />
                {block.comments > 0 && <span className="ml-1 text-xs">{block.comments}</span>}
                <span className="sr-only group-hover:not-sr-only ml-1 text-xs">Comment</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="group">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only group-hover:not-sr-only ml-1 text-xs">Options</span>
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
              
              {/* Enhanced Block Title Input */}
              <div className="relative">
                <Input
                  ref={titleRef}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    onTitleChange(e.target.value);
                  }}
                  onKeyDown={handleTitleKeyDown}
                  onFocus={handleTitleFocus}
                  onBlur={handleTitleBlur}
                  placeholder="Block title (e.g., 'Login API Auth')"
                  maxLength={maxTitleLength}
                  className={`
                    border-0 border-b-2 rounded-none focus:ring-0 font-semibold text-lg px-4 py-3 
                    bg-card border-border hover:border-primary/50 focus:border-primary
                    transition-all duration-200
                    ${titleFocused ? 'bg-primary/5' : 'bg-muted/20'}
                  `}
                />
                
                {/* Character Counter */}
                {titleFocused && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    {getCharacterCount()}/{maxTitleLength}
                  </div>
                )}
                
                {/* Title Hint */}
                {showTitleHint && (
                  <div className="absolute left-4 -bottom-6 text-xs text-primary bg-primary/10 px-2 py-1 rounded animate-fade-in">
                    Give this block a clear, meaningful title
                  </div>
                )}
              </div>
              
              {/* Block Content */}
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  onContentChange(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your content here... Press Shift+Enter to finalize, Escape to cancel"
                className="min-h-[120px] border-0 resize-none focus:ring-0 font-mono px-4 mt-2"
                style={{ minHeight: Math.max(120, content.split('\n').length * 24) + 'px' }}
              />
              
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <Button size="sm" onClick={() => onFinalize(content, title)} className="bg-primary hover:bg-primary/90">
                  <Play className="h-4 w-4 mr-1" />
                  Run (Shift+Enter)
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Rendered Title */}
              {block.title && (
                <div className="mb-4 pb-2 border-b">
                  <h2 className="text-xl font-bold text-primary cursor-pointer hover:text-primary/80 transition-colors" 
                      onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                    {block.title}
                  </h2>
                </div>
              )}
              
              {/* Rendered Content */}
              {block.content ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
                />
              ) : (
                <div className="text-muted-foreground italic text-center py-8 cursor-pointer hover:text-primary/70 transition-colors"
                     onClick={(e) => { e.stopPropagation(); onEdit(); }}>
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
