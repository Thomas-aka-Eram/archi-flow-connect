
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Github, 
  GitBranch, 
  GitCommit, 
  Link, 
  ExternalLink, 
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Gitlab
} from "lucide-react";
import { CommitExplorer } from "@/components/github/CommitExplorer";
import { CommitModal } from "@/components/github/CommitModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProject } from '@/contexts/ProjectContext';
import { useUser } from '@/contexts/UserContext';
import apiClient from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const vcsProviders = [
  { id: 'github', name: 'GitHub', icon: Github, color: 'text-gray-900' },
  { id: 'gitlab', name: 'GitLab', icon: Gitlab, color: 'text-orange-600' },
  { id: 'bitbucket', name: 'Bitbucket', icon: GitBranch, color: 'text-blue-600' },
];

const availableWebhookEvents = [
  { id: 'push', label: 'Commits' },
  { id: 'pull_request', label: 'Pull Requests' },
  { id: 'create', label: 'Branch Creation' },
  { id: 'release', label: 'Releases' },
];

export default function GitHubIntegration() {
  const [selectedProvider, setSelectedProvider] = useState('github');
  const [isConnected, setIsConnected] = useState(false);
  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);
  const { currentProject } = useProject();
  const { user, loading } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentProvider = vcsProviders.find(p => p.id === selectedProvider);

  useEffect(() => {
    if (currentProject && user) {
      apiClient.get(`/github/projects/${currentProject.id}/integration/github`)
        .then(response => {
          if (response.data.linked) {
            setRepo(response.data.repo);
            setWebhookEvents(response.data.webhookEvents);
            setIsConnected(true);
            fetchCommits();
          } else {
            setIsConnected(false);
          }
        })
        .catch(error => {
          console.error('Error fetching integration status:', error);
        });
    }
  }, [currentProject, user]);

  const fetchCommits = () => {
    if (currentProject) {
      apiClient.get(`/github/projects/${currentProject.id}/github/commits`)
        .then(response => {
          const formattedCommits = response.data.map(commit => ({
            id: commit.sha,
            hash: commit.sha.substring(0, 7),
            message: commit.commit.message,
            author: commit.commit.author.name,
            timestamp: new Date(commit.commit.author.date).toLocaleString(),
            url: commit.html_url,
            linkedTasks: [], // Mocked
            linkedBlocks: [], // Mocked
            filesChanged: 0, // Mocked
          }));
          setCommits(formattedCommits);
        })
        .catch(error => {
          console.error('Error fetching commits:', error);
          toast({
            title: "Failed to fetch commits",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        });
    }
  };

  const handleConnect = () => {
    if (!currentProject) {
      toast({
        title: "No project selected",
        description: "Please select a project before linking a repository.",
        variant: "destructive",
      });
      return;
    }
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to connect to GitHub.",
        variant: "destructive",
      });
      return;
    }
    // Redirect to backend for GitHub OAuth, now including the user's ID
    window.location.href = `http://localhost:3000/api/github/auth?projectId=${currentProject.id}&userId=${user.id}`;
  };

  const handleSync = () => {
    fetchCommits();
  };

  const handleCommitSelect = (commitId: string) => {
    setSelectedCommit(commitId);
  };

  const handleWebhookEventChange = (eventId: string) => {
    setWebhookEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId) 
        : [...prev, eventId]
    );
  };

  const handleConfigureWebhook = () => {
    if (currentProject) {
      apiClient.patch(`/github/projects/${currentProject.id}/integration/github/webhook`, {
        events: webhookEvents,
      })
        .then(() => {
          toast({
            title: "Webhook preferences updated",
            description: "Your webhook configuration has been saved.",
          });
        })
        .catch(error => {
          console.error('Error updating webhook:', error);
          toast({
            title: "Failed to update webhook",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Version Control Integration</h1>
          <p className="text-muted-foreground mt-1">
            Connect code commits with documentation and tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleSync} disabled={!isConnected}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Commits
          </Button>
        </div>
      </div>

      {/* Provider Selection & Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {currentProvider && <currentProvider.icon className="h-5 w-5" />}
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
                <Label>Version Control Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {vcsProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center gap-2">
                          <provider.icon className={`h-4 w-4 ${provider.color}`} />
                          {provider.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleConnect} disabled={loading || !user?.id}>
                {currentProvider && <currentProvider.icon className="h-4 w-4 mr-2" />}
                Connect to {currentProvider?.name}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitBranch className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{repo}</p>
                  <p className="text-sm text-muted-foreground">Last sync: 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {currentProvider && <currentProvider.icon className="h-3 w-3" />}
                  {currentProvider?.name}
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Repository
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <>
          {/* Webhook Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                Webhook Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Listen for these events:</Label>
                {availableWebhookEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={event.id}
                      checked={webhookEvents.includes(event.id)}
                      onCheckedChange={() => handleWebhookEventChange(event.id)}
                    />
                    <label
                      htmlFor={event.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {event.label}
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleConfigureWebhook}>Save Preferences</Button>
            </CardContent>
          </Card>

          {/* Integration Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <GitCommit className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{commits.length}</p>
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
                      {commits.filter(c => c.linkedTasks?.length > 0 || c.linkedBlocks?.length > 0).length}
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
                      {commits.reduce((acc, c) => acc + (c.linkedTasks?.length || 0), 0)}
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
                    commits={commits} 
                    onCommitSelect={handleCommitSelect}
                  />
                </TabsContent>

                <TabsContent value="linked" className="p-6">
                  <CommitExplorer 
                    commits={commits.filter(c => c.linkedTasks?.length > 0 || c.linkedBlocks?.length > 0)} 
                    onCommitSelect={handleCommitSelect}
                  />
                </TabsContent>
                <TabsContent value="unlinked" className="p-6">
                  <CommitExplorer 
                    commits={commits.filter(c => c.linkedTasks?.length === 0 && c.linkedBlocks?.length === 0)} 
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
