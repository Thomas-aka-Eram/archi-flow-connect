
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Save, Download, Link, MessageSquare, History, Eye } from "lucide-react";
import { NotebookEditor } from "./NotebookEditor";

interface DocumentEditorProps {
  documentId: string;
  onBack: () => void;
}

export function DocumentEditor({ documentId, onBack }: DocumentEditorProps) {
  const [viewMode, setViewMode] = useState<'notebook' | 'blocks'>('notebook');

  return (
    <div className="h-full">
      <NotebookEditor documentId={documentId} onBack={onBack} />
    </div>
  );
}
