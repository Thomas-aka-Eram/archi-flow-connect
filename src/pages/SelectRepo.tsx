
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProject } from '@/contexts/ProjectContext';
import { useUser } from '@/contexts/UserContext';
import apiClient from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { Github } from "lucide-react";

export default function SelectRepo() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const { currentProject } = useProject();
  const { user, loading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    console.log('SelectRepo user:', user);
    console.log('SelectRepo loading:', loading);
    if (currentProject && !loading && user) {
      apiClient.get('/github/user/repos')
        .then(response => {
          setRepos(response.data);
        })
        .catch(error => {
          console.error('Error fetching repositories:', error);
          toast({
            title: "Failed to fetch repositories",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        });
    }
  }, [currentProject, toast, user, loading]);

  const handleLinkRepository = () => {
    if (!selectedRepo) {
      toast({
        title: "No repository selected",
        description: "Please select a repository to link.",
        variant: "destructive",
      });
      return;
    }

    apiClient.post(`/github/projects/${currentProject.id}/repos`, {
      repoName: selectedRepo,
    })
    .then(() => {
      toast({
        title: "Repository linked successfully",
        description: "You can now see your commits in the GitHub integration page.",
      });
      // Redirect to the GitHub integration page
      window.location.href = `/project/${currentProject.id}/github`;
    })
    .catch(error => {
      console.error('Error linking repository:', error);
      toast({
        title: "Failed to link repository",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Select a Repository</h1>
          <p className="text-muted-foreground mt-1">
            Choose a repository to link to your project.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Github className="h-5 w-5" />
            Your Repositories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {repos.map((repo: any) => (
              <div
                key={repo.id}
                className={`p-4 border rounded-md cursor-pointer ${selectedRepo === repo.full_name ? 'border-primary' : ''}`}
                onClick={() => setSelectedRepo(repo.full_name)}
              >
                <p className="font-medium">{repo.full_name}</p>
                <p className="text-sm text-muted-foreground">{repo.description}</p>
              </div>
            ))}
          </div>
          <Button onClick={handleLinkRepository} disabled={!selectedRepo}>
            Link Repository
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
