import { useCallback, useState } from "react";
import { Insight } from "../schemas/insight.ts";

export const useInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      const res = await fetch("/api/insights");
      if (!res.ok) {
        setError("Failed to load insights");
        return;
      }
      const data: unknown[] = await res.json();
      setInsights(data.map((item) => Insight.parse(item)));
    } catch {
      setError("Failed to load insights");
    }
  }, []);

  return { insights, error, fetchInsights };
};
