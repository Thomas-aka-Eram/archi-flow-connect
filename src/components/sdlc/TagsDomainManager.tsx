
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Tag, Settings } from "lucide-react";
import { useTagsDomains } from "@/contexts/TagsDomainsContext";

export function TagsDomainManager() {
  const { tags, domains, addTag, removeTag, addDomain, removeDomain } = useTagsDomains();
  const [newTag, setNewTag] = useState('');
  const [newDomain, setNewDomain] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      addDomain(newDomain.trim());
      setNewDomain('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tags Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Project Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Domains Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Project Domains
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new domain..."
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
            />
            <Button onClick={handleAddDomain} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <Badge key={domain} variant="outline" className="gap-1">
                {domain}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeDomain(domain)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
