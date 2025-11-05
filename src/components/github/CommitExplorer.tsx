
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GitCommit, Link, FileText, Clock } from "lucide-react";

interface Commit {
  id: string;
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  url: string;
  linkedTasks: string[];
  linkedBlocks: string[];
  filesChanged: number;
}

interface CommitExplorerProps {
  commits: Commit[];
  onCommitSelect: (commitId: string) => void;
}

export function CommitExplorer({ commits, onCommitSelect }: CommitExplorerProps) {
  if (commits.length === 0) {
    return (
      <div className="text-center py-12">
        <GitCommit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No commits found</h3>
        <p className="text-muted-foreground">
          Commits will appear here when they are synced from GitHub
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {commits.map((commit) => (
        <a href={commit.url} target="_blank" rel="noopener noreferrer" key={commit.id}>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <GitCommit className="h-5 w-5 text-muted-foreground" />
                    <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {commit.hash}
                    </code>
                    <h3 className="font-medium">{commit.message}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {commit.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{commit.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {commit.timestamp}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {commit.filesChanged} files changed
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {commit.linkedTasks.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Link className="h-3 w-3 mr-1" />
                        {commit.linkedTasks.length} tasks
                      </Badge>
                    )}
                    {commit.linkedBlocks.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {commit.linkedBlocks.length} blocks
                      </Badge>
                    )}
                    {commit.linkedTasks.length === 0 && commit.linkedBlocks.length === 0 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        No links
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
