import { Module } from '@nestjs/common';
import { AiRiskController } from './ai-risk.controller';
import { AiRiskService } from './ai-risk.service';

@Module({ controllers: [AiRiskController], providers: [AiRiskService], exports: [AiRiskService] })
export class AiRiskModule {}
