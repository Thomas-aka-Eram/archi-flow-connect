import React from 'react';
import { useParams } from 'react-router-dom';

const Analytics = () => {
  const { projectId } = useParams();
  return <div>{projectId} Analytics Page</div>;
};

export default Analytics;