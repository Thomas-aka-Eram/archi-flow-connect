import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Settings, Download, Search } from "lucide-react";
import { PhaseNavigator } from "@/components/sdlc/PhaseNavigator";
import { DocumentEditor } from "@/components/sdlc/DocumentEditor";
import { DocumentList } from "@/components/sdlc/DocumentList";
import { ExportModal } from "@/components/sdlc/ExportModal";
import { TagsDomainManager } from "@/components/sdlc/TagsDomainManager";

const phases = [
  { id: 'requirements', name: 'Requirements', color: 'bg-blue-500', enabled: true },
  { id: 'design', name: 'Design', color: 'bg-purple-500', enabled: true },
  { id: 'development', name: 'Development', color: 'bg-green-500', enabled: true },
  { id: 'testing', name: 'Testing', color: 'bg-orange-500', enabled: true },
  { id: 'deployment', name: 'Deployment', color: 'bg-red-500', enabled: false },
  { id: 'maintenance', name: 'Maintenance', color: 'bg-gray-500', enabled: false },
];

const mockDocuments = {
  requirements: [
    {
      id: 'req-1',
      title: 'Functional Requirements',
      lastModified: '2024-07-10',
      blocks: 12,
      status: 'active' as const
    },
    {
      id: 'req-2', 
      title: 'Non-Functional Requirements',
      lastModified: '2024-07-08',
      blocks: 8,
      status: 'draft' as const
    }
  ],
  design: [
    {
      id: 'des-1',
      title: 'UI Wireframes',
      lastModified: '2024-07-09',
      blocks: 15,
      status: 'active' as const
    },
    {
      id: 'des-2',
      title: 'API Schema Design',
      lastModified: '2024-07-07',
      blocks: 6,
      status: 'review' as const
    }
  ],
  development: [
    {
      id: 'dev-1',
      title: 'Implementation Guide',
      lastModified: '2024-07-11',
      blocks: 20,
      status: 'active' as const
    }
  ],
  testing: [
    {
      id: 'test-1',
      title: 'Test Cases',
      lastModified: '2024-07-06',
      blocks: 18,
      status: 'draft' as const
    }
  ]
};

export default function SDLCDocumentation() {
  const [activePhase, setActivePhase] = useState('requirements');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [view, setView] = useState<'overview' | 'editor' | 'config'>('overview');

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocument(docId);
    setView('editor');
  };

  const handleBackToOverview = () => {
    setView('overview');
    setSelectedDocument(null);
  };

  const handleCreateDocument = () => {
    // Create new document and open editor
    const newDocId = `doc-${Date.now()}`;
    setSelectedDocument(newDocId);
    setView('editor');
  };

  if (view === 'editor' && selectedDocument) {
    return (
      <div className="h-full">
        <DocumentEditor 
          documentId={selectedDocument} 
          onBack={handleBackToOverview}
        />
      </div>
    );
  }

  if (view === 'config') {
    return (
      <div className="p-6 space-y-6 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SDLC Configuration</h1>
            <p className="text-muted-foreground mt-1">
              Manage tags, domains, and project templates
            </p>
          </div>
          <Button variant="outline" onClick={() => setView('overview')}>
            Back to Overview
          </Button>
        </div>
        <TagsDomainManager />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SDLC Documentation</h1>
          <p className="text-muted-foreground mt-1">
            Structured documentation aligned with your development lifecycle
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Docs
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setView('config')}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Phase Navigation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Project Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <PhaseNavigator 
            phases={phases}
            activePhase={activePhase}
            onPhaseSelect={setActivePhase}
          />
        </CardContent>
      </Card>

      {/* Phase Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Documents List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${phases.find(p => p.id === activePhase)?.color}`} />
                  {phases.find(p => p.id === activePhase)?.name} Documents
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage documents and blocks for this phase
                </p>
              </div>
              <Button size="sm" onClick={handleCreateDocument}>
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </CardHeader>
            <CardContent>
              <DocumentList 
                documents={mockDocuments[activePhase as keyof typeof mockDocuments] || []}
                onDocumentSelect={handleDocumentSelect}
              />
            </CardContent>
          </Card>
        </div>

        {/* Phase Stats & Tools */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Phase Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Documents</span>
                <Badge variant="secondary">
                  {mockDocuments[activePhase as keyof typeof mockDocuments]?.length || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Blocks</span>
                <Badge variant="secondary">
                  {mockDocuments[activePhase as keyof typeof mockDocuments]?.reduce((acc, doc) => acc + doc.blocks, 0) || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Under Review</span>
                <Badge variant="outline">
                  {mockDocuments[activePhase as keyof typeof mockDocuments]?.filter(doc => doc.status === 'review').length || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Create Template
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Search in Phase
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Phase
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal 
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          phases={phases}
        />
      )}
    </div>
  );
}
