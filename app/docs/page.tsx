"use client";
import { useFetchSwagger } from "@/utils/hooks/useFetchSwagger";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const ApiDocs = () => {
  const { spec, isLoading } = useFetchSwagger();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spec) {
    return <div>Failed to load Swagger spec</div>;
  }

  return <SwaggerUI spec={spec} />;
};

export default ApiDocs;
