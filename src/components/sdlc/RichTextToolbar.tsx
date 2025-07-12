
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Image,
  Link
} from "lucide-react";

interface RichTextToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onInsertTable: () => void;
  onInsertImage: () => void;
  onInsertLink: () => void;
}

export function RichTextToolbar({ 
  onFormat, 
  onInsertTable, 
  onInsertImage, 
  onInsertLink 
}: RichTextToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('bold')}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('italic')}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('underline')}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('unorderedList')}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('orderedList')}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('blockquote')}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('code')}
        title="Code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertTable}
        title="Insert Table"
      >
        <Table className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertImage}
        title="Insert Image"
      >
        <Image className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertLink}
        title="Insert Link"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
}
