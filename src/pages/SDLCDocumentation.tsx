
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Settings, Download, Search } from "lucide-react";
import { PhaseNavigator } from "@/components/sdlc/PhaseNavigator";
import { DocumentEditor } from "@/components/sdlc/DocumentEditor";
import { DocumentTree } from "@/components/sdlc/DocumentTree";
import { ExportModal } from "@/components/sdlc/ExportModal";
import { TagsDomainManager } from "@/components/sdlc/TagsDomainManager";
import apiClient from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { useProject } from '@/contexts/ProjectContext'; // Assuming you have a project context

// Define types for the data structures
interface Document {
  id: string;
  title: string;
  lastModified: string; // This might need to be createdAt or updatedAt from the API
  blocks: Block[];
  status: 'active' | 'draft';
}

interface Block {
  id: string;
  title: string;
  tags: string[];
  domain: string;
  description: string;
  lastModified: string;
}

const phases = [
  { id: 'requirements', name: 'Requirements', color: 'bg-blue-500', enabled: true },
  { id: 'design', name: 'Design', color: 'bg-purple-500', enabled: true },
  { id: 'development', name: 'Development', color: 'bg-green-500', enabled: true },
  { id: 'testing', name: 'Testing', color: 'bg-orange-500', enabled: true },
  { id: 'deployment', name: 'Deployment', color: 'bg-red-500', enabled: false },
  { id: 'maintenance', name: 'Maintenance', color: 'bg-gray-500', enabled: false },
];

export default function SDLCDocumentation() {
  const [activePhase, setActivePhase] = useState('requirements');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [view, setView] = useState<'overview' | 'editor' | 'config'>('overview');
  const { currentProject } = useProject(); // Get the current project
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!currentProject) return;

      setLoading(true);
      try {
        const response = await apiClient.get(
          `/documents/project/${currentProject.id}?phase=${activePhase}`
        );
        // The API returns a simpler document structure, so we map it to the frontend type
        const formattedDocuments = response.data.map((doc: any) => ({
          ...doc,
          lastModified: doc.updatedAt,
          blocks: [], // Blocks will be fetched inside the editor
          status: 'active', // Placeholder
        }));
        setDocuments(formattedDocuments);
      } catch (error: any) {
        toast({
          title: "Failed to fetch documents",
          description: error.message || "Could not load documents for this phase.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [activePhase, currentProject, toast]);

  const handleBlockSelect = (docId: string, blockId: string) => {
    setSelectedDocument(docId);
    setView('editor');
    console.log(`Navigating to block ${blockId} in document ${docId}`);
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocument(docId);
    setView('editor');
  };

  const handleBackToOverview = () => {
    setView('overview');
    setSelectedDocument(null);
  };

  const handleCreateDocument = async () => {
    if (!currentProject) return;

    try {
      // For simplicity, creating a document with a default title.
      // A modal would be better here.
      const response = await apiClient.post(`/documents/project/${currentProject.id}`, {
        title: `New Document in ${activePhase}`,
        phaseId: activePhase, // Assuming phaseId is the key
      });
      setDocuments(prev => [...prev, response.data]);
      setSelectedDocument(response.data.id);
      setView('editor');
    } catch (error: any) {
       toast({
        title: "Failed to create document",
        description: error.message,
        variant: "destructive",
      });
    }
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
        {/* Documents Tree */}
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
              {loading ? (
                <p>Loading documents...</p>
              ) : (
                <DocumentTree 
                  documents={documents}
                  onDocumentSelect={handleDocumentSelect}
                  onBlockSelect={handleBlockSelect}
                />
              )}
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
                  {documents.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Blocks</span>
                <Badge variant="secondary">
                  {documents.reduce((acc, doc) => acc + (doc.blocks?.length || 0), 0)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Draft Status</span>
                <Badge variant="outline">
                  {documents.filter(doc => doc.status === 'draft').length}
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
