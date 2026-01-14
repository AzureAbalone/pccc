import { Module } from '@nestjs/common';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';

import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [ComplianceController],
  providers: [ComplianceService],
})
export class ComplianceModule { }
