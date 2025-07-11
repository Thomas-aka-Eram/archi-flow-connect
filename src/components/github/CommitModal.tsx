
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  GitCommit, 
  ExternalLink, 
  Link, 
  FileText, 
  Clock,
  User,
  Hash
} from "lucide-react";

interface CommitModalProps {
  commitId: string;
  isOpen: boolean;
  onClose: () => void;
}

const mockCommitDetails = {
  'commit-1': {
    id: 'commit-1',
    hash: 'a1b2c3d',
    fullHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    message: 'feat: add Google OAuth integration #task-1',
    author: 'Luis',
    timestamp: '2024-07-11 14:30',
    linkedTasks: [
      { id: 'task-1', title: 'Implement OAuth Login' }
    ],
    linkedBlocks: [
      { id: 'req-1', title: 'Login Feature', phase: 'Requirements' }
    ],
    filesChanged: [
      { name: 'src/auth/oauth.ts', additions: 45, deletions: 0 },
      { name: 'src/auth/google.ts', additions: 32, deletions: 0 },
      { name: 'src/components/LoginButton.tsx', additions: 15, deletions: 8 },
      { name: 'package.json', additions: 2, deletions: 0 },
      { name: 'src/types/auth.ts', additions: 12, deletions: 0 }
    ],
    diff: `@@ -0,0 +1,45 @@
+import { GoogleAuth } from 'google-auth-library';
+import { config } from '../config';
+
+export class OAuthProvider {
+  private googleAuth: GoogleAuth;
+
+  constructor() {
+    this.googleAuth = new GoogleAuth({
+      scopes: ['openid', 'email', 'profile'],
+      credentials: {
+        client_id: config.google.clientId,
+        client_secret: config.google.clientSecret
+      }
+    });
+  }
+
+  async verifyToken(token: string) {
+    try {
+      const ticket = await this.googleAuth.verifyIdToken({
+        idToken: token,
+        audience: config.google.clientId
+      });
+      
+      return ticket.getPayload();
+    } catch (error) {
+      throw new Error('Invalid token');
+    }
+  }
+}`
  }
};

export function CommitModal({ commitId, isOpen, onClose }: CommitModalProps) {
  const commit = mockCommitDetails[commitId as keyof typeof mockCommitDetails];

  if (!commit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-3">
                <GitCommit className="h-5 w-5" />
                {commit.message}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {commit.hash}
                </code>
                <Badge variant="outline">{commit.linkedTasks.length + commit.linkedBlocks.length} linked</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`https://github.com/org/repo/commit/${commit.fullHash}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Commit Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Commit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Author</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {commit.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{commit.author}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Timestamp</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    {commit.timestamp}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hash</span>
                  <code className="text-xs font-mono">{commit.fullHash}</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Files Changed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commit.filesChanged.map((file, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-mono">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="text-green-600">+{file.additions}</span>
                        {file.deletions > 0 && (
                          <span className="text-red-600 ml-2">-{file.deletions}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Linked Items */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Linked Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commit.linkedTasks.length > 0 ? (
                    commit.linkedTasks.map((task) => (
                      <div key={task.id} className="p-2 rounded-lg border cursor-pointer hover:bg-muted/50">
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="text-xs text-muted-foreground">{task.id}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tasks linked</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Linked Blocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commit.linkedBlocks.length > 0 ? (
                    commit.linkedBlocks.map((block) => (
                      <div key={block.id} className="p-2 rounded-lg border cursor-pointer hover:bg-muted/50">
                        <div className="font-medium text-sm">{block.title}</div>
                        <div className="text-xs text-muted-foreground">{block.phase} Phase</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No blocks linked</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Diff */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Code Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs font-mono whitespace-pre">
                  {commit.diff}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
