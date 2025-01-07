import { useCallback, useState, useEffect } from "react";

export function useFetchSwagger() {
  const [isLoading, setIsLoading] = useState(false);
  const [spec, setSpec] = useState(null);

  const getSpec = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/swagger");
      if (!response.ok) {
        throw new Error("Failed to fetch swagger spec");
      }
      const data = await response.json();
      setSpec(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Ensure loading state is updated
    }
  }, []);

  useEffect(() => {
    getSpec();
  }, [getSpec]);

  return {
    isLoading,
    spec,
  };
}
