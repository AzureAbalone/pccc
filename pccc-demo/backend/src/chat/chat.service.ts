import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { SYSTEM_PROMPT } from './system-prompt.js';

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

    async generateResponse(userPrompt: string, systemPrompt: string = SYSTEM_PROMPT): Promise<any> {
        try {
            const response = await got.post('https://openrouter.ai/api/v1/chat/completions', {
                json: {
                    model: this.configService.get<string>('MODEL_ID') || 'google/gemini-3-pro-preview',
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
        } catch (error) {
            console.error('Error calling OpenRouter API:', error);
            throw error;
        }
    }
}
