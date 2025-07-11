
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
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
  const [exportType, setExportType] = useState<'pdf' | 'archi'>('pdf');
  const [selectedPhases, setSelectedPhases] = useState<string[]>(['requirements', 'design']);
  const [includeTraceability, setIncludeTraceability] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);

  const handlePhaseToggle = (phaseId: string, checked: boolean) => {
    if (checked) {
      setSelectedPhases([...selectedPhases, phaseId]);
    } else {
      setSelectedPhases(selectedPhases.filter(id => id !== phaseId));
    }
  };

  const handleExport = () => {
    console.log('Exporting:', {
      type: exportType,
      phases: selectedPhases,
      includeTraceability,
      includeComments
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Type */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Export Format</Label>
            <RadioGroup value={exportType} onValueChange={(value) => setExportType(value as 'pdf' | 'archi')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Document
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="archi" id="archi" />
                <Label htmlFor="archi" className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  .archi Archive
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Phase Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Include Phases</Label>
            <div className="space-y-2">
              {phases.filter(p => p.enabled).map((phase) => (
                <div key={phase.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={phase.id}
                    checked={selectedPhases.includes(phase.id)}
                    onCheckedChange={(checked) => handlePhaseToggle(phase.id, checked === true)}
                  />
                  <Label htmlFor={phase.id} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${phase.color}`} />
                    {phase.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Options */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Additional Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="traceability"
                  checked={includeTraceability}
                  onCheckedChange={(checked) => setIncludeTraceability(checked === true)}
                />
                <Label htmlFor="traceability">Include Traceability Matrix</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comments"
                  checked={includeComments}
                  onCheckedChange={(checked) => setIncludeComments(checked === true)}
                />
                <Label htmlFor="comments">Include Comments & Reviews</Label>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export {exportType.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
