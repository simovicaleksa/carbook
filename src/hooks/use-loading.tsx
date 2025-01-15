import { useState } from "react";

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const loading = {
    isLoading,
    start: () => setIsLoading(true),
    end: () => setIsLoading(false),
  };

  return loading;
}
