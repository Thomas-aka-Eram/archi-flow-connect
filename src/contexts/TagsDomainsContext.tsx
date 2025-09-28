import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api';
import { useProject } from './ProjectContext';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  children: string[];
  phase?: string;
  depth: number;
}

export interface Domain {
  id: string;
  title: string;
}

interface TagsDomainsContextType {
  tags: Tag[];
  domains: Domain[];
  addTag: (name: string, color: string, parentId?: string, phase?: string) => void;
  removeTag: (id: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  addDomain: (domain: string) => void;
  removeDomain: (domain: string) => void;
  getTagHierarchy: (tagId: string) => Tag[];
  getFlatTagNames: () => string[];
  getTagTree: () => Tag[];
  getTagColor: (tagId: string) => string;
  getTagsByPhase: (phase: string) => Tag[];
  getTagDisplayName: (tagId: string) => string;
  getTagTooltip: (tagId: string) => string;
}

const TagsDomainsContext = createContext<TagsDomainsContextType | undefined>(undefined);

export function TagsDomainsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { toast } = useToast();

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['tags', currentProject?.id],
    queryFn: async () => {
      const response = await apiClient.get(`/tags?projectId=${currentProject?.id}`);
      return response.data;
    },
    enabled: !!currentProject,
  });

  const { data: domains = [] } = useQuery<Domain[]>({
    queryKey: ['domains', currentProject?.id],
    queryFn: async () => {
      const response = await apiClient.get(`/domains?projectId=${currentProject?.id}`);
      return response.data;
    },
    enabled: !!currentProject,
  });

  const addTagMutation = useMutation({
    mutationFn: (newTag: { name: string; color: string; parentId?: string; phase?: string; projectId: string }) =>
      apiClient.post('/tags', newTag),
    onMutate: () => {
      toast({ title: 'Creating tag...' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', currentProject?.id] });
      toast({ title: 'Tag created successfully' });
    },
    onError: (error: any) => {
      if (error.response && error.response.status === 409) {
        toast({
          title: 'Tag already exists',
          description: 'A tag with this name already exists in the project.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error creating tag',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    },
  });

  const addDomainMutation = useMutation({
    mutationFn: (newDomain: { name: string; projectId: string }) => apiClient.post('/domains', newDomain),
    onMutate: () => {
      toast({ title: 'Creating domain...' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains', currentProject?.id] });
      toast({ title: 'Domain created successfully' });
    },
    onError: (error: any) => {
      if (error.response && error.response.status === 409) {
        toast({
          title: 'Domain already exists',
          description: 'A domain with this name already exists in the project.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error creating domain',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    },
  });

  const addTag = (name: string, color: string, parentId?: string, phase?: string) => {
    if (!currentProject) return;
    addTagMutation.mutate({ name, color, parentId, phase, projectId: currentProject.id });
  };

  const addDomain = (domain: string) => {
    if (!currentProject) return;
    addDomainMutation.mutate({ name: domain, projectId: currentProject.id });
  };

  const getTagDepth = (tagId: string): number => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag || !tag.parentId) return 0;
    return 1 + getTagDepth(tag.parentId);
  };

  const removeTag = (id: string) => {
    // This will be implemented later
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    // This will be implemented later
  };

  const removeDomain = (domain: string) => {
    // This will be implemented later
  };

  const getTagHierarchy = (tagId: string): Tag[] => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return [];

    const hierarchy: Tag[] = [tag];
    
    if (tag.parentId) {
      const parentHierarchy = getTagHierarchy(tag.parentId);
      return [...parentHierarchy, ...hierarchy];
    }
    
    return hierarchy;
  };

  const getFlatTagNames = (): string[] => {
    return tags.map(tag => getDisplayName(tag.name, tag.depth));
  };

  const getTagTree = (): Tag[] => {
    return tags.filter(tag => !tag.parentId);
  };

  const getTagColor = (tagId: string): string => {
    const tag = tags.find(t => t.id === tagId);
    return tag?.color || '#6B7280';
  };

  const getTagsByPhase = (phase: string): Tag[] => {
    return tags.filter(tag => tag.phase === phase);
  };

  const getTagDisplayName = (tagId: string): string => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return '';
    return getDisplayName(tag.name, tag.depth);
  };

  const getTagTooltip = (tagId: string): string => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return '';
    
    if (tag.parentId) {
      const parentTag = tags.find(t => t.id === tag.parentId);
      return `Child of ${getDisplayName(parentTag?.name || '', parentTag?.depth || 0)} • Depth: ${tag.depth}`;
    }
    
    return `Root tag • Depth: ${tag.depth}`;
  };

  const getDisplayName = (name: string, depth: number): string => {
    const cleanName = name.startsWith('#') ? name.slice(1) : name;
    return `${getDepthPrefix(depth)}${cleanName}`;
  };

  const getDepthPrefix = (depth: number): string => {
    if (depth === 0) return '#';
    return '#' + '>'.repeat(depth);
  };


  return (
    <TagsDomainsContext.Provider value={{
      tags,
      domains,
      addTag,
      removeTag,
      updateTag,
      addDomain,
      removeDomain,
      getTagHierarchy,
      getFlatTagNames,
      getTagTree,
      getTagColor,
      getTagsByPhase,
      getTagDisplayName,
      getTagTooltip
    }}>
      {children}
    </TagsDomainsContext.Provider>
  );
}

export const useTagsDomains = () => {
  const context = useContext(TagsDomainsContext);
  if (!context) {
    throw new Error('useTagsDomains must be used within TagsDomainsProvider');
  }
  return context;
};