import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Tag as TagIcon } from "lucide-react";
import { useTagsDomains } from "@/contexts/TagsDomainsContext";
import { HierarchicalTagPicker } from "@/components/sdlc/HierarchicalTagPicker";

import { useProject } from '@/contexts/ProjectContext';
import apiClient from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskCreationModal({ isOpen, onClose }: TaskCreationModalProps) {
  const { domains: availableDomains, getTagColor, tags } = useTagsDomains();
  const { currentProject } = useProject();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: '',
    phase: '',
    domain: '',
    estimatedHours: '',
    milestone: '',
    dueDate: ''
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const createTaskMutation = useMutation({
    mutationFn: (taskPayload: any) => apiClient.post(`/tasks/project/${currentProject!.id}`, taskPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', currentProject!.id] });
      toast({
        title: "Task Created",
        description: "The new task has been added to the project.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create task",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (currentProject) {
        try {
          const response = await apiClient.get(`/projects/${currentProject.id}/members`);
          setTeamMembers(response.data);
        } catch (error) {
          console.error("Failed to fetch team members", error);
        }
      }
    };

    fetchTeamMembers();
  }, [currentProject]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (currentProject && (selectedTags.length > 0 || formData.domain)) {
        try {
          const response = await apiClient.post('/tasks/suggestions', {
            projectId: currentProject.id,
            tagIds: selectedTags,
            domainId: formData.domain,
            estimateHours: formData.estimatedHours ? parseInt(formData.estimatedHours, 10) : undefined,
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error("Failed to fetch suggestions", error);
        }
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 500); // Debounce to avoid too many requests

    return () => clearTimeout(debounce);
  }, [selectedTags, formData.domain, formData.estimatedHours, currentProject]);

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!currentProject) {
      toast({
        title: "No project selected",
        description: "Please select a project before creating a task.",
        variant: "destructive",
      });
      return;
    }

    const tagIds = selectedTags.map(tagName => {
      const tag = tags.find(t => t.name === tagName);
      return tag ? tag.id : tagName;
    });

    const taskPayload = {
      title: formData.title,
      description: formData.description,
      assignees: [{ userId: formData.assignee, role: 'developer' }], // Assuming role, adjust as needed
      priority: formData.priority,
      phase: formData.phase,
      domainId: formData.domain,
      estimateHours: formData.estimatedHours ? parseInt(formData.estimatedHours, 10) : undefined,
      milestone: formData.milestone,
      dueDate: formData.dueDate,
      tags: tagIds,
    };

    console.log("Task Payload:", taskPayload);
    createTaskMutation.mutate(taskPayload);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title..."
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the task..."
                  rows={3}
                />
              </div>
            </div>

            {/* Assignment & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assignee</Label>
                <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {suggestions.length > 0 && (
                      <>
                        <Label className="px-2 py-1.5 text-sm font-semibold">Suggestions</Label>
                        {suggestions.map((suggestion: any) => (
                          <SelectItem key={suggestion.user.id} value={suggestion.user.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{suggestion.user.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {Math.round(suggestion.score * 100)}% match
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                        <hr className="my-1" />
                      </>
                    )}
                    {teamMembers.map((member) => (
                      <SelectItem key={member.user.id} value={member.user.id}>
                        {member.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Phase & Domain */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SDLC Phase</Label>
                <Select value={formData.phase} onValueChange={(value) => setFormData({ ...formData, phase: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requirements">Requirements</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="deployment">Deployment</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Domain</Label>
                <Select value={formData.domain} onValueChange={(value) => setFormData({ ...formData, domain: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDomains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hours">Estimated Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  placeholder="8"
                />
              </div>

              <div>
                <Label htmlFor="milestone">Milestone</Label>
                <Input
                  id="milestone"
                  value={formData.milestone}
                  onChange={(e) => setFormData({ ...formData, milestone: e.target.value })}
                  placeholder="Authentication System"
                />
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            {/* Enhanced Tags Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tags</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTagPicker(true)}
                  className="gap-2"
                >
                  <TagIcon className="h-4 w-4" />
                  Choose Tags
                </Button>
              </div>
              
              <div className="min-h-[100px] p-4 border rounded-lg bg-muted/30">
                {selectedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tagName) => {
                      const tag = tags.find(t => t.name === tagName);
                      const tagColor = tag ? getTagColor(tag.id) : '#6B7280';
                      
                      return (
                        <Badge key={tagName} variant="secondary" className="gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: tagColor }}
                          />
                          {tagName}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-destructive" 
                            onClick={() => handleRemoveTag(tagName)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <TagIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tags selected</p>
                    <p className="text-xs">Click "Choose Tags" to add hierarchical tags</p>
                  </div>
                )}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <p>• Selected tags include their parent hierarchy automatically</p>
                  <p>• Colors indicate tag hierarchy and phase relationships</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <HierarchicalTagPicker
        isOpen={showTagPicker}
        onClose={() => setShowTagPicker(false)}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        currentPhase={formData.phase}
      />
    </>
  );
}