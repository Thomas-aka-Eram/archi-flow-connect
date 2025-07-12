
import React, { createContext, useContext, useState } from 'react';

interface TagsDomainsContextType {
  tags: string[];
  domains: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addDomain: (domain: string) => void;
  removeDomain: (domain: string) => void;
}

const TagsDomainsContext = createContext<TagsDomainsContextType | undefined>(undefined);

const defaultTags = [
  '#authentication', '#login', '#oauth', '#password', '#security',
  '#ui', '#api', '#database', '#payment', '#checkout', '#user-management',
  '#testing', '#deployment', '#performance', '#monitoring'
];

const defaultDomains = [
  'API', 'UI', 'Frontend', 'Backend', 'Database', 'DB', 'BLogic', 
  'DevOps', 'Testing', 'Security', 'Mobile', 'Web'
];

export function TagsDomainsProvider({ children }: { children: React.ReactNode }) {
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [domains, setDomains] = useState<string[]>(defaultDomains);

  const addTag = (tag: string) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addDomain = (domain: string) => {
    if (!domains.includes(domain)) {
      setDomains([...domains, domain]);
    }
  };

  const removeDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain));
  };

  return (
    <TagsDomainsContext.Provider value={{
      tags,
      domains,
      addTag,
      removeTag,
      addDomain,
      removeDomain
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
