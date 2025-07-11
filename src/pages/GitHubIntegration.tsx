
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Github, 
  GitBranch, 
  GitCommit, 
  Link, 
  ExternalLink, 
  Settings,
  Sync,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { CommitExplorer } from "@/components/github/CommitExplorer";
import { CommitModal } from "@/components/github/CommitModal";

const mockCommits = [
  {
    id: 'commit-1',
    hash: 'a1b2c3d',
    message: 'feat: add Google OAuth integration #task-1',
    author: 'Luis',
    timestamp: '2024-07-11 14:30',
    linkedTasks: ['task-1'],
    linkedBlocks: ['req-1'],
    filesChanged: 5
  },
  {
    id: 'commit-2',
    hash: 'e4f5g6h',
    message: 'fix: handle password validation #block-login-api',
    author: 'Raj',
    timestamp: '2024-07-11 10:15',
    linkedTasks: [],
    linkedBlocks: ['des-2'],
    filesChanged: 2
  },
  {
    id: 'commit-3',
    hash: 'i7j8k9l',
    message: 'docs: update API documentation',
    author: 'Aisha',
    timestamp: '2024-07-10 16:45',
    linkedTasks: [],
    linkedBlocks: [],
    filesChanged: 1
  }
];

export default function GitHubIntegration() {
  const [isConnected, setIsConnected] = useState(true);
  const [repoUrl, setRepoUrl] = useState('https://github.com/org/ecommerce-auth');
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);

  const handleConnect = () => {
    console.log('Connecting to GitHub...');
    setIsConnected(true);
  };

  const handleSync = () => {
    console.log('Syncing commits...');
  };

  const handleCommitSelect = (commitId: string) => {
    setSelectedCommit(commitId);
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GitHub Integration</h1>
          <p className="text-muted-foreground mt-1">
            Connect code commits with documentation and tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleSync} disabled={!isConnected}>
            <Sync className="h-4 w-4 mr-2" />
            Sync Commits
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure Webhook
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Github className="h-5 w-5" />
            Repository Connection
            {isConnected ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="repo-url">Repository URL</Label>
                <Input
                  id="repo-url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                />
              </div>
              <Button onClick={handleConnect}>
                <Github className="h-4 w-4 mr-2" />
                Connect Repository
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitBranch className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{repoUrl}</p>
                  <p className="text-sm text-muted-foreground">Last sync: 5 minutes ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <>
          {/* Integration Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <GitCommit className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{mockCommits.length}</p>
                    <p className="text-sm text-muted-foreground">Total Commits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Link className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {mockCommits.filter(c => c.linkedTasks.length > 0 || c.linkedBlocks.length > 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Linked Commits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {mockCommits.reduce((acc, c) => acc + c.linkedTasks.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Tasks Linked</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-500">85%</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Traceability</p>
                    <p className="text-sm text-muted-foreground">Coverage Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commit Explorer */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="recent">
                <div className="border-b px-6 pt-6">
                  <TabsList>
                    <TabsTrigger value="recent">Recent Commits</TabsTrigger>
                    <TabsTrigger value="linked">Linked Commits</TabsTrigger>
                    <TabsTrigger value="unlinked">Unlinked Commits</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="recent" className="p-6">
                  <CommitExplorer 
                    commits={mockCommits} 
                    onCommitSelect={handleCommitSelect}
                  />
                </TabsContent>

                <TabsContent value="linked" className="p-6">
                  <CommitExplorer 
                    commits={mockCommits.filter(c => c.linkedTasks.length > 0 || c.linkedBlocks.length > 0)} 
                    onCommitSelect={handleCommitSelect}
                  />
                </TabsContent>

                <TabsContent value="unlinked" className="p-6">
                  <CommitExplorer 
                    commits={mockCommits.filter(c => c.linkedTasks.length === 0 && c.linkedBlocks.length === 0)} 
                    onCommitSelect={handleCommitSelect}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {/* Commit Modal */}
      {selectedCommit && (
        <CommitModal
          commitId={selectedCommit}
          isOpen={!!selectedCommit}
          onClose={() => setSelectedCommit(null)}
        />
      )}
    </div>
  );
}
