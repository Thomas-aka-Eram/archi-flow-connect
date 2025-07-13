
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useTagsDomains } from "@/contexts/TagsDomainsContext";

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskCreationModal({ isOpen, onClose }: TaskCreationModalProps) {
  const { tags: availableTags, domains: availableDomains } = useTagsDomains();
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

  const teamMembers = [
    { value: 'luis', name: 'Luis', skills: ['React', 'Node.js'], availability: 90 },
    { value: 'raj', name: 'Raj', skills: ['Python', 'API'], availability: 85 },
    { value: 'aisha', name: 'Aisha', skills: ['UI/UX', 'Frontend'], availability: 75 },
    { value: 'carlos', name: 'Carlos', skills: ['DevOps', 'Backend'], availability: 60 }
  ];

  const flatTags = availableTags.map(tag => tag.name);

  const handleAddTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    console.log('Creating task:', { ...formData, tags: selectedTags });
    onClose();
  };

  return (
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
                  {teamMembers.map((member) => (
                    <SelectItem key={member.value} value={member.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{member.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {member.availability}% available
                        </Badge>
                      </div>
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
                    <SelectItem key={domain} value={domain.toLowerCase()}>
                      {domain}
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

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Available Tags</span>
                <div className="flex flex-wrap gap-1">
                  {flatTags
                    .filter(tag => !selectedTags.includes(tag))
                    .map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleAddTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Selected Tags</span>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
