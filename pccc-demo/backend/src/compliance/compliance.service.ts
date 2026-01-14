import { Injectable, Logger } from '@nestjs/common';
import { ComplianceRequest, ComplianceResponse, ComplianceResponseSchema } from '@pccc/shared';
import { ChatService } from '../chat/chat.service.js';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(private readonly chatService: ChatService) { }

  /**
   * Analyze building description and return fire safety compliance recommendations.
   * Uses AI to analyze the specific project details.
   */
  async analyze(request: ComplianceRequest): Promise<ComplianceResponse> {
    this.logger.log(`Analyzing compliance for project: ${request.description.substring(0, 50)}...`);

    // 1. Construct the prompt with all available details
    let userPrompt = `Mô tả công trình:\n${request.description}\n`;

    if (request.type) userPrompt += `- Loại công trình: ${request.type}\n`;
    if (request.height) userPrompt += `- Chiều cao: ${request.height}m\n`;
    if (request.floors) userPrompt += `- Số tầng: ${request.floors}\n`;

    userPrompt += `\n[YÊU CẦU: Phân tích tuân thủ]\nHãy phân tích an toàn PCCC cho công trình này và trả về kết quả JSON theo đúng cấu trúc đã định nghĩa.`;

    try {
      // 2. Call AI Service
      const aiResponse = await this.chatService.generateResponse(userPrompt);

      // 3. Extract content from AI response
      // OpenRouter response structure: { choices: [{ message: { content: "..." } }] }
      const content = aiResponse?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from AI service');
      }

      // 4. Parse JSON (handle potential markdown code blocks)
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      let parsedData;

      try {
        parsedData = JSON.parse(jsonStr);
      } catch (e) {
        this.logger.error('Failed to parse AI JSON response', e);
        this.logger.debug('Raw AI content:', content);
        throw new Error('AI returned invalid JSON format');
      }

      // 5. Validate against schema
      const result = ComplianceResponseSchema.parse(parsedData);

      return result;

    } catch (error) {
      this.logger.error('Error in compliance analysis', error);
      // Fallback or re-throw depending on requirements. For now, re-throw to let frontend handle it.
      throw error;
    }
  }
}
