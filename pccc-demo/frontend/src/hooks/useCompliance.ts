import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { ComplianceRequest, ComplianceResponse } from '@pccc/shared';

export interface Citation {
  source: string;
  text: string;
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

    // Construct prompt locally
    let userPrompt = `Mô tả công trình:\n${request.description}\n`;
    if (request.type) userPrompt += `- Loại công trình: ${request.type}\n`;
    if (request.height) userPrompt += `- Chiều cao: ${request.height}m\n`;
    if (request.floors) userPrompt += `- Số tầng: ${request.floors}\n`;
    userPrompt += `\nHãy phân tích an toàn PCCC cho công trình này theo quy định hiện hành mới nhất.`;

    try {
      // Call unified Chat API
      const response = await api.post('api/chat', {
        json: { prompt: userPrompt },
      }).json<any>();

      const content = response?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Không nhận được phản hồi từ AI');
      }

      // Parse JSON from content (handle markdown blocks)
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      let result: ComplianceResponse;
      try {
        result = JSON.parse(jsonStr);
      } catch (e) {
        console.error('Failed to parse AI response:', content);
        throw new Error('Dữ liệu trả về không đúng định dạng JSON');
      }

      setData(result);
      localStorage.setItem('pccc_compliance_data', JSON.stringify(result));
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
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

