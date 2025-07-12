
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  MoreHorizontal,
  Hash,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Block {
  id: string;
  title: string;
  tags: string[];
  domain: 'UI' | 'API' | 'DB' | 'GENERAL';
  description?: string;
  lastModified: string;
}

interface Document {
  id: string;
  title: string;
  lastModified: string;
  blocks: Block[];
  status: 'active' | 'draft' | 'review';
}

interface DocumentTreeProps {
  documents: Document[];
  onDocumentSelect: (docId: string) => void;
  onBlockSelect: (docId: string, blockId: string) => void;
}

const statusColors = {
  active: 'bg-green-500/10 text-green-700',
  draft: 'bg-yellow-500/10 text-yellow-700',
  review: 'bg-blue-500/10 text-blue-700'
};

const domainColors = {
  UI: 'bg-blue-500/10 text-blue-700',
  API: 'bg-green-500/10 text-green-700',
  DB: 'bg-orange-500/10 text-orange-700',
  GENERAL: 'bg-gray-500/10 text-gray-700'
};

export function DocumentTree({ documents, onDocumentSelect, onBlockSelect }: DocumentTreeProps) {
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());

  const toggleDocument = (docId: string) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocs(newExpanded);
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No documents yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first document to start documenting this phase
        </p>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create Document
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Document Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <div className="flex items-center gap-3 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleDocument(doc.id)}
                  className="p-1 h-6 w-6"
                >
                  {expandedDocs.has(doc.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                
                <FileText className="h-5 w-5 text-muted-foreground" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => onDocumentSelect(doc.id)}
                    >
                      {doc.title}
                    </h3>
                    <Badge variant="outline" className={statusColors[doc.status]}>
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {doc.blocks.length} blocks • Updated {doc.lastModified}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDocumentSelect(doc.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Document
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Blocks Tree */}
            {expandedDocs.has(doc.id) && (
              <div className="border-l-2 border-muted ml-6">
                {doc.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="ml-4 py-2 px-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                    onClick={() => onBlockSelect(doc.id, block.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <h4 className="text-sm font-medium truncate">
                            {block.title || `Block ${index + 1}`}
                          </h4>
                          <Badge variant="outline" className={`text-xs ${domainColors[block.domain]}`}>
                            {block.domain}
                          </Badge>
                        </div>
                        
                        {block.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {block.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          {block.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {block.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{block.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
