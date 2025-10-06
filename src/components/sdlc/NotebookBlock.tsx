import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Edit3, 
  Link, 
  MessageSquare,
  Play,
  Plus,
  X,
  MoreHorizontal,
  LayoutTemplate,
  Server,
  Database,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RichTextToolbar } from "./RichTextToolbar";
import { BlockTagsModal } from "./BlockTagsModal";

interface Tag {
  id: string;
  name: string;
  parentId: string | null;
}

interface Block {
  id: string;
  title?: string; // This is now unused, but kept for data model consistency
  content: string;
  rendered: boolean;
  type: 'markdown' | 'text' | 'image' | 'diagram';
  tags: Tag[];
  domain: string;
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
  onFinalize: (content: string) => void;
  onAddBlock: () => void;
  onContentChange: (content: string) => void;
  onSelect: () => void;
  onDelete: () => void;
  onUpdateBlock: (updates: Partial<Block>) => void;
}

// --- Sub-components for UI Enhancement ---

const domainIcons: { [key: string]: React.ReactNode } = {
  FRONTEND: <LayoutTemplate className="h-3 w-3 mr-1.5" />,
  BACKEND: <Server className="h-3 w-3 mr-1.5" />,
  DATABASE: <Database className="h-3 w-3 mr-1.5" />,
  GENERAL: <Package className="h-3 w-3 mr-1.5" />,
};

const getDomainInfo = (domain: string) => {
  const domainUpper = domain.toUpperCase();
  if (domainUpper.includes('FRONTEND') || domainUpper.includes('UI')) {
    return { icon: domainIcons.FRONTEND, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Frontend' };
  }
  if (domainUpper.includes('BACKEND') || domainUpper.includes('API')) {
    return { icon: domainIcons.BACKEND, color: 'bg-green-500/10 text-green-400 border-green-500/20', label: 'Backend' };
  }
  if (domainUpper.includes('DATABASE') || domainUpper.includes('DB')) {
    return { icon: domainIcons.DATABASE, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'Database' };
  }
  return { icon: domainIcons.GENERAL, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', label: domain };
};

const DomainBadge = ({ domain }: { domain: string }) => {
  const { icon, color, label } = getDomainInfo(domain);
  return (
    <Badge variant="outline" className={`flex items-center text-xs font-semibold ${color}`}>
      {icon}
      {label}
    </Badge>
  );
};

const TagDisplay = ({ tags, isSelected }: { tags: Tag[]; isSelected: boolean }) => {
  const [hoveredPath, setHoveredPath] = useState<Tag[] | null>(null);

  if (!tags || tags.length === 0) {
    return <span className="text-xs text-muted-foreground">No tags</span>;
  }

  const tagMap = new Map(tags.map(t => [t.id, t]));

  const getPath = (node: Tag): Tag[] => {
    const path: Tag[] = [];
    let current: Tag | undefined = node;
    while (current) {
      path.unshift(current);
      const parentId = current.parentId;
      current = parentId ? tagMap.get(parentId) : undefined;
    }
    return path;
  };

  const roots = tags.filter(t => !t.parentId || !tagMap.has(t.parentId));

  const renderPath = (path: Tag[]) => {
    const elements = [];
    for (let j = 0; j < path.length; j++) {
      const tag = path[j];
      elements.push(
        <Badge
          key={tag.id}
          variant="secondary"
          className="tag-pill text-xs"
          style={{
            backgroundColor: `hsl(210, 6%, ${25 - j * 5}%)`,
            border: `1px solid hsl(210, 6%, ${35 - j * 5}%)`,
            color: `hsl(210, 10%, ${85 - j * 10}%)`,
          }}
        >
          {tag.name}
        </Badge>
      );
      if (j < path.length - 1) {
        elements.push(<span key={`sep-${tag.id}`} className="text-muted-foreground text-xs font-bold">></span>);
      }
    }
    return (
      <div className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded-md">
        {elements}
      </div>
    );
  };

  if (isSelected) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {roots.map(root => (
          <div key={root.id}>
            {renderPath(getPath(root))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 flex-wrap" onMouseLeave={() => setHoveredPath(null)}>
        {hoveredPath ? (
          renderPath(hoveredPath)
        ) : (
          roots.map(root => (
            <div key={root.id} onMouseEnter={() => setHoveredPath(getPath(root))}>
              {renderPath([root])}
            </div>
          ))
        )}
        {roots.length < tags.length && !hoveredPath && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="text-xs font-bold">+{tags.length - roots.length}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>This block has {tags.length - roots.length} nested tags.</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};


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
  onSelect,
  onDelete,
  onUpdateBlock
}: NotebookBlockProps) {
  const [content, setContent] = useState(block.content);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      onFinalize(content);
    } else if (e.key === 'Escape') {
      setContent(block.content);
      onEdit(); // Exits editing mode
    }
  };

  const handleFormatText = (command: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = '';
    switch (command) {
      case 'bold': formattedText = `**${selectedText || 'bold text'}**`; break;
      case 'italic': formattedText = `*${selectedText || 'italic text'}*`; break;
      case 'underline': formattedText = `<u>${selectedText || 'underlined text'}</u>`; break;
      case 'unorderedList': formattedText = `\n- ${selectedText || 'list item'}`; break;
      case 'orderedList': formattedText = `\n1. ${selectedText || 'list item'}`; break;
      case 'blockquote': formattedText = `\n> ${selectedText || 'quote'}`; break;
      case 'code': formattedText = `\`${selectedText || 'code'}\``; break;
      default: return;
    }
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    onContentChange(newContent);
  };

  const handleInsertTable = () => {
    const table = '\n| Column 1 | Column 2 |\n|---|---|\n| Cell 1 | Cell 2 |\n';
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
    onUpdateBlock({ tags: tags as any, domain: domain as any });
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br />');
  };

  useEffect(() => {
    setContent(block.content);
  }, [block]);

  return (
    <>
      <Card 
        className={`mb-4 transition-all duration-200 rounded-lg overflow-hidden ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        } ${isEditing ? 'ring-2 ring-blue-500' : ''} ${isNewBlock ? 'animate-scale-in' : ''}` }
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* --- Enhanced Block Header --- */}
        <div className="flex items-center justify-between p-2 pr-3 border-b bg-muted/30">
          <div className="flex items-center gap-3 flex-grow min-w-0">
            <DomainBadge domain={block.domain} />
            <div className="h-4 w-px bg-border" />
            <div className="flex-grow min-w-0">
              <TagDisplay tags={block.tags} isSelected={isSelected} />
            </div>
          </div>
          <div className={`flex items-center gap-1 transition-opacity duration-200 ${
              isHovered || isSelected ? 'opacity-100' : 'opacity-0'
            }`}>
            {isUpdating && <Badge variant="outline" className="mr-2">Saving...</Badge>}
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }} className="h-7 w-7">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowTagsModal(true); }} className="h-7 w-7">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <X className="h-4 w-4 mr-2" />
                  Delete Block
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-0">
          {isEditing ? (
            <div className="relative">
              <RichTextToolbar onFormat={handleFormatText} onInsertTable={handleInsertTable} onInsertImage={handleInsertImage} onInsertLink={handleInsertLink} />
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => { setContent(e.target.value); onContentChange(e.target.value); }}
                onKeyDown={handleKeyDown}
                placeholder="Type your content..."
                className="min-h-[120px] w-full border-0 resize-none focus:ring-0 font-mono px-4 py-2 bg-card"
              />
              <div className="absolute bottom-2 right-2">
                <Button size="sm" onClick={() => onFinalize(content)}>
                  <Play className="h-4 w-4 mr-1" />
                  Save
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
                <div className="text-muted-foreground italic text-center py-8" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  Empty block - click to edit
                </div>
              )}
            </div>
          )}
        </CardContent>

        {isSelected && !isEditing && (
          <div className="flex justify-center py-2 border-t bg-muted/20">
            <Button variant="ghost" size="sm" onClick={onAddBlock}>
              <Plus className="h-4 w-4 mr-2" />
              Add Block Below
            </Button>
          </div>
        )}
      </Card>

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