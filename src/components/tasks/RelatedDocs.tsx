import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RelatedDocsProps {
  domainId: string;
  tagIds: string[];
}

interface Block {
  id: string;
  blockGroupId: string;
  documentId: string;
  type: string;
  content: string;
  renderedHtml?: string;
  status: string;
  version: number;
  isCurrentVersion: boolean;
  createdBy: string;
  createdAt: string;
  orderIndex: number;
  tags: Tag[];
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Document {
  id: string;
  title: string;
  blocks: Block[];
}

export function RelatedDocs({ domainId, tagIds }: RelatedDocsProps) {
  const { data: relatedDocs, isLoading } = useQuery({
    queryKey: ['related-docs', domainId, tagIds],
    queryFn: async () => {
      const response = await apiClient.get('/documents/related', {
        params: { domainId, tagIds },
      });
      return response.data;
    },
    enabled: !!domainId,
  });

  if (isLoading) {
    return <div>Loading related documents...</div>;
  }

  if (!relatedDocs || relatedDocs.length === 0) {
    return <p>No related documents found.</p>;
  }

  return (
    <div>
      <h3 className="font-medium mb-3">Related SDLC Documents</h3>
      <Accordion type="multiple" className="w-full space-y-3">
        {relatedDocs.map((doc: Document) => (
          <Card key={doc.id}>
            <AccordionItem value={doc.id} className="border-0">
              <AccordionTrigger className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <h4 className="font-medium">{doc.title}</h4>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div className="prose max-w-none border-t pt-4">
                  {doc.blocks.map((block) => (
                    <div
                      key={block.id}
                      className="mb-4 p-2 border rounded markdown-content-white"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}
