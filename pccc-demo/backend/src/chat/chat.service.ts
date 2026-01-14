import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SYSTEM_PROMPT } from './system-prompt';

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

    async generateResponse(userPrompt: string): Promise<any> {
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: this.configService.get<string>('MODEL_ID') || 'google/gemini-2.0-flash-exp:free',
                    messages: [
                        {
                            role: 'system',
                            content: SYSTEM_PROMPT,
                        },
                        {
                            role: 'user',
                            content: userPrompt,
                        },
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openRouterApiKey}`,
                        'HTTP-Referer': this.siteUrl,
                        'X-Title': this.siteName,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data;
        } catch (error) {
            console.error('Error calling OpenRouter API:', error);
            throw error;
        }
    }
}
