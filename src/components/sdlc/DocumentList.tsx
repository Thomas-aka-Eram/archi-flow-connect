
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, MessageSquare, MoreHorizontal, Edit, Trash2, FilePlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { RenameDocumentModal } from './RenameDocumentModal'; // Assuming you create this

interface Document {
  id: string;
  title: string;
  lastModified: string;
  blocks: number;
  status: 'active' | 'draft' | 'review';
}

interface DocumentListProps {
  documents: Document[];
  onDocumentSelect: (docId: string) => void;
  onDocumentRename: (docId: string, newName: string) => void; // Add this prop
  onDocumentDelete: (docId: string) => void; // Add this prop
}

const statusColors = {
  active: 'bg-green-500/10 text-green-700 border-green-500/20',
  draft: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  review: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
};

export function DocumentList({ 
  documents, 
  onDocumentSelect, 
  onDocumentRename,
  onDocumentDelete
}: DocumentListProps) {
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleRenameClick = (doc: Document) => {
    setSelectedDocument(doc);
    setRenameModalOpen(true);
  };

  const handleRenameSave = (newName: string) => {
    if (selectedDocument) {
      onDocumentRename(selectedDocument.id, newName);
    }
    setRenameModalOpen(false);
    setSelectedDocument(null);
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
          <FilePlus className="h-4 w-4 mr-2" />
          Create Document
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => onDocumentSelect(doc.id)}>
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">{doc.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={statusColors[doc.status]}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {doc.lastModified}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {doc.blocks} blocks
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDocumentSelect(doc.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Document
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRenameClick(doc)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDocumentDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDocument && (
        <RenameDocumentModal
          isOpen={renameModalOpen}
          onClose={() => setRenameModalOpen(false)}
          currentName={selectedDocument.title}
          onSave={handleRenameSave}
        />
      )}
    </>
  );
}
