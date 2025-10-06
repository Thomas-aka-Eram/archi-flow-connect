
import React from 'react';
import { SmartAssignmentRedesigned } from './SmartAssignmentRedesigned';

export function SmartAssignment({ projectId }: { projectId: string | undefined}) {
  if (!projectId) return <div>Project not found</div>;
  return <SmartAssignmentRedesigned projectId={projectId} />;
}
