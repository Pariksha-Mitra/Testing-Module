"use client"
import SwaggerUI from 'swagger-ui-react';
import { useFetchSwagger } from '@/utils/hooks/useFetchSwagger';
import 'swagger-ui-react/swagger-ui.css';

// Add explicit return type
const ApiDocs: React.FC = () => {
  const { spec, isLoading } = useFetchSwagger();

  // Add better loading state UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading API documentation...
      </div>
    );
  }

  // Add better error state UI
  if (!spec) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load API documentation
      </div>
    );
  }

  return <SwaggerUI spec={spec} />;
};

export default ApiDocs;
