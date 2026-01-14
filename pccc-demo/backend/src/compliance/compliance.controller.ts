import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { ComplianceRequestSchema } from '@pccc/shared';
import type { ComplianceRequest, ComplianceResponse } from '@pccc/shared';

@Controller('api/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('analyze')
  async analyze(@Body() body: unknown): Promise<ComplianceResponse> {
    // Validate request using Zod schema
    const result = ComplianceRequestSchema.safeParse(body);
    
    if (!result.success) {
      throw new BadRequestException({
        message: 'Invalid request',
        errors: result.error.flatten().fieldErrors
      });
    }

    return this.complianceService.analyze(result.data);
  }
}
