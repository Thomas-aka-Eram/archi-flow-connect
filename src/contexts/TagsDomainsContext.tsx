import React, { createContext, useContext, useState } from 'react';

export interface Tag {
  id: string;
  name: string;
  color: string;
  parent?: string;
  children: string[];
  phase?: string;
  depth: number;
}

interface TagsDomainsContextType {
  tags: Tag[];
  domains: string[];
  addTag: (name: string, color: string, parentId?: string, phase?: string) => void;
  removeTag: (id: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  addDomain: (domain: string) => void;
  removeDomain: (domain: string) => void;
  getTagHierarchy: (tagId: string) => string[];
  getFlatTagNames: () => string[];
  getTagTree: () => Tag[];
  getTagColor: (tagId: string) => string;
  getTagsByPhase: (phase: string) => Tag[];
}

const TagsDomainsContext = createContext<TagsDomainsContextType | undefined>(undefined);

// Helper function to soften colors for child tags
const softenColor = (color: string, level: number): string => {
  // Convert hex to HSL and lighten
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = 0;

  l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Lighten based on level
  l = Math.min(0.95, l + (level * 0.15));
  s = Math.max(0.3, s - (level * 0.1));

  // Convert back to hex
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r2, g2, b2;
  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1/3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
};

// Helper function to generate depth prefix
const getDepthPrefix = (depth: number): string => {
  if (depth === 0) return '#';
  return '#' + '>'.repeat(depth);
};

// Helper function to get display name with depth prefix
const getDisplayName = (name: string, depth: number): string => {
  const cleanName = name.startsWith('#') ? name.slice(1) : name;
  return `${getDepthPrefix(depth)}${cleanName}`;
};

const defaultTags: Tag[] = [
  { id: 'auth', name: 'authentication', color: '#3B82F6', children: ['login', 'signup', 'oauth', 'password'], phase: 'requirements', depth: 0 },
  { id: 'login', name: 'login', color: '#60A5FA', parent: 'auth', children: [], phase: 'requirements', depth: 1 },
  { id: 'signup', name: 'signup', color: '#60A5FA', parent: 'auth', children: [], phase: 'requirements', depth: 1 },
  { id: 'oauth', name: 'oauth', color: '#60A5FA', parent: 'auth', children: ['google-oauth', 'github-oauth'], phase: 'requirements', depth: 1 },
  { id: 'google-oauth', name: 'google-oauth', color: '#93C5FD', parent: 'oauth', children: [], phase: 'development', depth: 2 },
  { id: 'github-oauth', name: 'github-oauth', color: '#93C5FD', parent: 'oauth', children: [], phase: 'development', depth: 2 },
  { id: 'password', name: 'password', color: '#60A5FA', parent: 'auth', children: ['reset', 'hash'], phase: 'requirements', depth: 1 },
  { id: 'reset', name: 'password-reset', color: '#93C5FD', parent: 'password', children: [], phase: 'development', depth: 2 },
  { id: 'hash', name: 'password-hash', color: '#93C5FD', parent: 'password', children: [], phase: 'development', depth: 2 },
  { id: 'ui', name: 'ui', color: '#8B5CF6', children: ['forms', 'navigation', 'layout'], phase: 'design', depth: 0 },
  { id: 'forms', name: 'forms', color: '#A78BFA', parent: 'ui', children: [], phase: 'design', depth: 1 },
  { id: 'navigation', name: 'navigation', color: '#A78BFA', parent: 'ui', children: [], phase: 'design', depth: 1 },
  { id: 'layout', name: 'layout', color: '#A78BFA', parent: 'ui', children: [], phase: 'design', depth: 1 },
  { id: 'api', name: 'api', color: '#10B981', children: ['rest', 'graphql'], phase: 'development', depth: 0 },
  { id: 'rest', name: 'rest-api', color: '#34D399', parent: 'api', children: [], phase: 'development', depth: 1 },
  { id: 'graphql', name: 'graphql', color: '#34D399', parent: 'api', children: [], phase: 'development', depth: 1 },
  { id: 'database', name: 'database', color: '#F59E0B', children: ['schema', 'migration'], phase: 'development', depth: 0 },
  { id: 'schema', name: 'schema', color: '#FBBF24', parent: 'database', children: [], phase: 'development', depth: 1 },
  { id: 'migration', name: 'migration', color: '#FBBF24', parent: 'database', children: [], phase: 'development', depth: 1 },
  { id: 'testing', name: 'testing', color: '#EF4444', children: ['unit', 'integration', 'e2e'], phase: 'testing', depth: 0 },
  { id: 'unit', name: 'unit-testing', color: '#F87171', parent: 'testing', children: [], phase: 'testing', depth: 1 },
  { id: 'integration', name: 'integration-testing', color: '#F87171', parent: 'testing', children: [], phase: 'testing', depth: 1 },
  { id: 'e2e', name: 'e2e-testing', color: '#F87171', parent: 'testing', children: [], phase: 'testing', depth: 1 },
];

const defaultDomains = [
  'API', 'UI', 'Frontend', 'Backend', 'Database', 'DB', 'BLogic', 
  'DevOps', 'Testing', 'Security', 'Mobile', 'Web'
];

export function TagsDomainsProvider({ children }: { children: React.ReactNode }) {
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [domains, setDomains] = useState<string[]>(defaultDomains);

  const getTagDepth = (tagId: string): number => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag || !tag.parent) return 0;
    return 1 + getTagDepth(tag.parent);
  };

  const addTag = (name: string, color: string, parentId?: string, phase?: string) => {
    const cleanName = name.startsWith('#') ? name.slice(1) : name;
    const newId = `tag-${Date.now()}`;
    
    let finalColor = color;
    let depth = 0;
    
    if (parentId) {
      depth = getTagDepth(parentId) + 1;
      const parentTag = tags.find(t => t.id === parentId);
      const rootColor = parentTag ? getRootColor(parentTag.id) : color;
      finalColor = softenColor(rootColor, depth);
    }
    
    const newTag: Tag = {
      id: newId,
      name: cleanName,
      color: finalColor,
      parent: parentId,
      children: [],
      phase,
      depth
    };

    setTags(prevTags => {
      const updatedTags = [...prevTags, newTag];
      
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

  const getRootColor = (tagId: string): string => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return '#6B7280';
    if (!tag.parent) return tag.color;
    return getRootColor(tag.parent);
  };

  const removeTag = (id: string) => {
    setTags(prevTags => {
      const tagToRemove = prevTags.find(t => t.id === id);
      if (!tagToRemove) return prevTags;

      let updatedTags = prevTags.map(tag => 
        tag.children.includes(id)
          ? { ...tag, children: tag.children.filter(childId => childId !== id) }
          : tag
      );

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

  const getTagHierarchy = (tagId: string): string[] => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return [];

    const displayName = getDisplayName(tag.name, tag.depth);
    const hierarchy: string[] = [displayName];
    
    if (tag.parent) {
      const parentHierarchy = getTagHierarchy(tag.parent);
      return [...parentHierarchy, ...hierarchy];
    }
    
    return hierarchy;
  };

  const getFlatTagNames = (): string[] => {
    return tags.map(tag => getDisplayName(tag.name, tag.depth));
  };

  const getTagTree = (): Tag[] => {
    return tags.filter(tag => !tag.parent);
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
    
    if (tag.parent) {
      const parentTag = tags.find(t => t.id === tag.parent);
      return `Child of ${getDisplayName(parentTag?.name || '', parentTag?.depth || 0)} • Depth: ${tag.depth}`;
    }
    
    return `Root tag • Depth: ${tag.depth}`;
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
