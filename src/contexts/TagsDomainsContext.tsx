
import React, { createContext, useContext, useState } from 'react';

export interface Tag {
  id: string;
  name: string;
  parent?: string;
  children: string[];
}

interface TagsDomainsContextType {
  tags: Tag[];
  domains: string[];
  addTag: (name: string, parentId?: string) => void;
  removeTag: (id: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  addDomain: (domain: string) => void;
  removeDomain: (domain: string) => void;
  getTagHierarchy: (tagId: string) => string[];
  getFlatTagNames: () => string[];
  getTagTree: () => Tag[];
}

const TagsDomainsContext = createContext<TagsDomainsContextType | undefined>(undefined);

const defaultTags: Tag[] = [
  { id: 'auth', name: '#authentication', children: ['login', 'signup', 'oauth', 'password'] },
  { id: 'login', name: '#login', parent: 'auth', children: [] },
  { id: 'signup', name: '#signup', parent: 'auth', children: [] },
  { id: 'oauth', name: '#oauth', parent: 'auth', children: ['google-oauth', 'github-oauth'] },
  { id: 'google-oauth', name: '#google-oauth', parent: 'oauth', children: [] },
  { id: 'github-oauth', name: '#github-oauth', parent: 'oauth', children: [] },
  { id: 'password', name: '#password', parent: 'auth', children: ['reset', 'hash'] },
  { id: 'reset', name: '#password-reset', parent: 'password', children: [] },
  { id: 'hash', name: '#password-hash', parent: 'password', children: [] },
  { id: 'ui', name: '#ui', children: ['forms', 'navigation', 'layout'] },
  { id: 'forms', name: '#forms', parent: 'ui', children: [] },
  { id: 'navigation', name: '#navigation', parent: 'ui', children: [] },
  { id: 'layout', name: '#layout', parent: 'ui', children: [] },
  { id: 'api', name: '#api', children: ['rest', 'graphql'] },
  { id: 'rest', name: '#rest-api', parent: 'api', children: [] },
  { id: 'graphql', name: '#graphql', parent: 'api', children: [] },
  { id: 'database', name: '#database', children: ['schema', 'migration'] },
  { id: 'schema', name: '#schema', parent: 'database', children: [] },
  { id: 'migration', name: '#migration', parent: 'database', children: [] },
  { id: 'testing', name: '#testing', children: ['unit', 'integration', 'e2e'] },
  { id: 'unit', name: '#unit-testing', parent: 'testing', children: [] },
  { id: 'integration', name: '#integration-testing', parent: 'testing', children: [] },
  { id: 'e2e', name: '#e2e-testing', parent: 'testing', children: [] },
];

const defaultDomains = [
  'API', 'UI', 'Frontend', 'Backend', 'Database', 'DB', 'BLogic', 
  'DevOps', 'Testing', 'Security', 'Mobile', 'Web'
];

export function TagsDomainsProvider({ children }: { children: React.ReactNode }) {
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [domains, setDomains] = useState<string[]>(defaultDomains);

  const addTag = (name: string, parentId?: string) => {
    const formattedName = name.startsWith('#') ? name : `#${name}`;
    const newId = `tag-${Date.now()}`;
    
    const newTag: Tag = {
      id: newId,
      name: formattedName,
      parent: parentId,
      children: []
    };

    setTags(prevTags => {
      const updatedTags = [...prevTags, newTag];
      
      // Update parent's children array if parentId is provided
      if (parentId) {
        return updatedTags.map(tag => 
          tag.id === parentId 
            ? { ...tag, children: [...tag.children, newId] }
            : tag
        );
      }
      
      return updatedTags;
    });
  };

  const removeTag = (id: string) => {
    setTags(prevTags => {
      const tagToRemove = prevTags.find(t => t.id === id);
      if (!tagToRemove) return prevTags;

      // Remove from parent's children array
      let updatedTags = prevTags.map(tag => 
        tag.children.includes(id)
          ? { ...tag, children: tag.children.filter(childId => childId !== id) }
          : tag
      );

      // Remove the tag and all its descendants
      const getDescendants = (tagId: string): string[] => {
        const tag = updatedTags.find(t => t.id === tagId);
        if (!tag) return [];
        
        let descendants = [tagId];
        tag.children.forEach(childId => {
          descendants = [...descendants, ...getDescendants(childId)];
        });
        return descendants;
      };

      const toRemove = getDescendants(id);
      return updatedTags.filter(tag => !toRemove.includes(tag.id));
    });
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    setTags(prevTags => 
      prevTags.map(tag => 
        tag.id === id ? { ...tag, ...updates } : tag
      )
    );
  };

  const addDomain = (domain: string) => {
    if (!domains.includes(domain)) {
      setDomains([...domains, domain]);
    }
  };

  const removeDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain));
  };

  // Get all parent tags for a given tag (including the tag itself)
  const getTagHierarchy = (tagId: string): string[] => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return [];

    const hierarchy: string[] = [tag.name];
    
    if (tag.parent) {
      const parentHierarchy = getTagHierarchy(tag.parent);
      return [...parentHierarchy, ...hierarchy];
    }
    
    return hierarchy;
  };

  const getFlatTagNames = (): string[] => {
    return tags.map(tag => tag.name);
  };

  const getTagTree = (): Tag[] => {
    return tags.filter(tag => !tag.parent); // Return only root tags
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
      getTagTree
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
