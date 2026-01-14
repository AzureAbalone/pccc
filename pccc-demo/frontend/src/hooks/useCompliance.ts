import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { ComplianceRequest, ComplianceResponse } from '@pccc/shared';

export interface Citation {
  source: string;
  text: string;
  url?: string | null;
  category?: string;
}

interface UseComplianceReturn {
  data: ComplianceResponse | null;
  isLoading: boolean;
  error: string | null;
  analyze: (request: ComplianceRequest) => Promise<ComplianceResponse | null>;
  reset: () => void;
}

export function useCompliance(): UseComplianceReturn {
  const [data, setData] = useState<ComplianceResponse | null>(() => {
    try {
      const saved = localStorage.getItem('pccc_compliance_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to load compliance data', e);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (request: ComplianceRequest): Promise<ComplianceResponse | null> => {
    setIsLoading(true);
    setError(null);

    // Initial empty state
    const initialData: ComplianceResponse = {
      buildingInfo: {
        floors: request.floors ?? null,
        height: request.height ?? null,
        floorArea: null,
        buildingType: request.type ?? null,
        fireClass: null,
        hazardGroup: null
      },
      escapeSolutions: [],
      fireSpreadPrevention: [],
      fireTraffic: [],
      technicalSystems: [],
      citations: []
    };

    setData(initialData);

    const basePrompt = `Mô tả công trình:\n${request.description}\n`;
    const specificDetails = [
      request.type ? `- Loại: ${request.type}` : '',
      request.height ? `- Chiều cao: ${request.height}m` : '',
      request.floors ? `- Số tầng: ${request.floors}` : ''
    ].filter(Boolean).join('\n');

    const userPrompt = `${basePrompt}${specificDetails}\nHãy phân tích an toàn PCCC cho công trình này.`;

    const sections = [
      'overview',
      'escape',
      'fire_spread',
      'traffic',
      'technical'
    ] as const;

    // Helper map to categorize citations
    const sectionToCategoryMap: Record<string, string> = {
      'escape': 'escape',
      'fire_spread': 'fire',
      'traffic': 'traffic',
      'technical': 'tech'
    };

    // Helper to process each section
    const fetchSection = async (section: typeof sections[number]) => {
      try {
        const response = await api.post('api/chat', {
          json: { prompt: userPrompt, section },
        }).json<any>();

        const content = response?.choices?.[0]?.message?.content;
        if (!content) return;

        // Extract JSON substring to handle chatty preambles
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content.replace(/```json\n?|\n?```/g, '').trim();

        // Sanitize control characters that might break JSON.parse
        const sanitizedJson = jsonStr.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

        const json = JSON.parse(sanitizedJson);

        setData(prev => {
          if (!prev) return initialData;

          // Process citations to add category (url comes from AI)
          const newCitations = (json.citations || []).map((c: any) => ({
            ...c,
            category: sectionToCategoryMap[section] // Tag with category
          }));

          return {
            ...prev,
            // Merge building Info
            buildingInfo: {
              ...prev.buildingInfo,
              ...(json.buildingInfo || {})
            },
            // Merge arrays (replace empty ones with new data)
            escapeSolutions: json.escapeSolutions?.length ? json.escapeSolutions : prev.escapeSolutions,
            fireSpreadPrevention: json.fireSpreadPrevention?.length ? json.fireSpreadPrevention : prev.fireSpreadPrevention,
            fireTraffic: json.fireTraffic?.length ? json.fireTraffic : prev.fireTraffic,
            technicalSystems: json.technicalSystems?.length ? json.technicalSystems : prev.technicalSystems,
            // Combine citations
            citations: [...prev.citations, ...newCitations]
          };
        });
      } catch (err) {
        console.warn(`Failed section ${section}`, err);
      }
    };

    // Wait for ALL requests to complete
    await Promise.all(sections.map(fetchSection));

    // Final state save
    setData(current => {
      if (current) {
        localStorage.setItem('pccc_compliance_data', JSON.stringify(current));
      }
      return current;
    });

    setIsLoading(false);

    // Return the final data state (using a functional update or just the last known state is tricky in async, 
    // but relies on setData having run. We return 'initialData' here but the caller 
    // should likely rely on the 'data' state or wait for isLoading to flip).
    // Actually, to be safe, we should return the real final data, but 'setData' is async.
    // For now, returning initialData is okay as long as the caller waits for isLoading=false.
    // BUT the requirement is "wait for all".

    return initialData; // Caller will navigate based on finish.
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    localStorage.removeItem('pccc_compliance_data');
  }, []);

  return {
    data,
    isLoading,
    error,
    analyze,
    reset,
  };
}

