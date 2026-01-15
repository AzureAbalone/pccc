import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import {
    SYSTEM_PROMPT,
    SYSTEM_PROMPT_OVERVIEW,
    SYSTEM_PROMPT_ESCAPE,
    SYSTEM_PROMPT_FIRE_SPREAD,
    SYSTEM_PROMPT_TRAFFIC,
    SYSTEM_PROMPT_TECHNICAL
} from './system-prompt.js';

@Injectable()
export class ChatService {
    private readonly openRouterApiKey: string;
    private readonly siteUrl: string;
    private readonly siteName: string;

    constructor(private configService: ConfigService) {
        this.openRouterApiKey = this.configService.get<string>('OPEN_ROUTER_API_KEY') || '';
        this.siteUrl = this.configService.get<string>('SITE_URL') || 'http://localhost:3000';
        this.siteName = this.configService.get<string>('SITE_NAME') || 'PCCC Demo';
    }

    private getSystemPrompt(section?: string): string {
        switch (section) {
            case 'overview': return SYSTEM_PROMPT_OVERVIEW;
            case 'escape': return SYSTEM_PROMPT_ESCAPE;
            case 'fire_spread': return SYSTEM_PROMPT_FIRE_SPREAD;
            case 'traffic': return SYSTEM_PROMPT_TRAFFIC;
            case 'technical': return SYSTEM_PROMPT_TECHNICAL;
            default: return SYSTEM_PROMPT;
        }
    }

    private getMaxTokens(section?: string): number {
        // Each solution: ~80 words = ~100 tokens
        // 7 solutions + references + citations = ~1500-2000 tokens per section
        switch (section) {
            case 'overview': return 800;      // Building info only
            case 'escape': return 2500;       // 5-7 solutions
            case 'fire_spread': return 2500;  // 5-7 solutions
            case 'traffic': return 2000;      // 4-6 solutions
            case 'technical': return 2500;    // 5-7 solutions
            default: return 4000;             // Full analysis fallback
        }
    }

    async generateResponse(userPrompt: string, section?: string): Promise<any> {
        const systemPrompt = this.getSystemPrompt(section);
        const maxTokens = this.getMaxTokens(section);

        try {
            const response = await got.post('https://openrouter.ai/api/v1/chat/completions', {
                json: {
                    // Fallback to User's requested model: GPT-3.5 Turbo
                    model: this.configService.get<string>('MODEL_ID') || 'openai/gpt-4o-mini',
                    max_tokens: maxTokens,
                    temperature: 0.3,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt,
                        },
                        {
                            role: 'user',
                            content: userPrompt,
                        }
                    ],
                },
                headers: {
                    'Authorization': `Bearer ${this.openRouterApiKey}`,
                    'HTTP-Referer': this.siteUrl,
                    'X-Title': this.siteName,
                },
            }).json();

            return response;
        } catch (error: any) {
            console.error(`Error calling OpenRouter API (Section: ${section || 'default'}):`, error.response?.body || error.message);
            throw error;
        }
    }
}
