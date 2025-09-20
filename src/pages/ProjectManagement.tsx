import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectManagement = () => {
  const { projectId } = useParams();
  return <div>{projectId} Manage Page</div>;
};

export default ProjectManagement;