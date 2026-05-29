import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiRiskService } from './ai-risk.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('AI Risk')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai-risk')
export class AiRiskController {
  constructor(private aiRiskService: AiRiskService) {}

  @Post('score/:businessId')
  @Roles('ADMIN', 'SUPER_ADMIN')
  scoreRisk(@Param('businessId') businessId: string) {
    return this.aiRiskService.scoreBusinessRisk(businessId);
  }

  @Get(':businessId')
  getRiskScore(@Param('businessId') businessId: string) {
    return this.aiRiskService.getRiskScore(businessId);
  }
}
