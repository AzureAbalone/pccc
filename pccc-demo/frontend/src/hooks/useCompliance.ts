import { useState, useCallback } from 'react';

// Types matching shared/ZodSchemas.ts
export interface ComplianceRequest {
  description: string;
  type?: 'F1.2' | 'F1.3' | 'Other';
  height?: number;
  floors?: number;
}

export interface Citation {
  source: string;
  text: string;
}

export interface ComplianceResponse {
  escapeSolutions: string[];
  fireSpreadPrevention: string[];
  fireTraffic: string[];
  technicalSystems: string[];
  citations: Citation[];
}

interface UseComplianceReturn {
  data: ComplianceResponse | null;
  isLoading: boolean;
  error: string | null;
  analyze: (request: ComplianceRequest) => Promise<ComplianceResponse | null>;
  reset: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useCompliance(): UseComplianceReturn {
  const [data, setData] = useState<ComplianceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (request: ComplianceRequest): Promise<ComplianceResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/compliance/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const result: ComplianceResponse = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    analyze,
    reset,
  };
}
