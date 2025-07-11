
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Archive } from "lucide-react";

interface Phase {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  phases: Phase[];
}

export function ExportModal({ isOpen, onClose, phases }: ExportModalProps) {
  const [selectedPhases, setSelectedPhases] = useState<string[]>(['requirements', 'design']);
  const [includeTraceability, setIncludeTraceability] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'archi'>('pdf');

  const handlePhaseToggle = (phaseId: string) => {
    setSelectedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const handleExport = () => {
    // Simulate export
    console.log('Exporting:', {
      format: exportFormat,
      phases: selectedPhases,
      includeTraceability,
      includeComments
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export SDLC Documentation</DialogTitle>
          <DialogDescription>
            Choose the phases and options to include in your export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-3">
            <h3 className="font-medium">Export Format</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-colors ${
                  exportFormat === 'pdf' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setExportFormat('pdf')}
              >
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-medium">PDF Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Formatted document with all content
                  </p>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-colors ${
                  exportFormat === 'archi' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setExportFormat('archi')}
              >
                <CardContent className="p-4 text-center">
                  <Archive className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-medium">Archi Archive</h4>
                  <p className="text-sm text-muted-foreground">
                    Encrypted backup with full data
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Phase Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">Select Phases</h3>
            <div className="grid grid-cols-2 gap-3">
              {phases.filter(phase => phase.enabled).map((phase) => (
                <div key={phase.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={phase.id}
                    checked={selectedPhases.includes(phase.id)}
                    onCheckedChange={() => handlePhaseToggle(phase.id)}
                  />
                  <label
                    htmlFor={phase.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                    {phase.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h3 className="font-medium">Additional Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="traceability"
                  checked={includeTraceability}
                  onCheckedChange={setIncludeTraceability}
                />
                <label htmlFor="traceability" className="cursor-pointer">
                  Include traceability matrix
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="comments"
                  checked={includeComments}
                  onCheckedChange={setIncludeComments}
                />
                <label htmlFor="comments" className="cursor-pointer">
                  Include comments and reviews
                </label>
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Export Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <Badge variant="outline">
                    {exportFormat === 'pdf' ? 'PDF Report' : 'Archi Archive'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Phases:</span>
                  <span>{selectedPhases.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated size:</span>
                  <span>~2.5 MB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
