import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvestmentService } from './investment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Investments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('investments')
export class InvestmentController {
  constructor(private investmentService: InvestmentService) {}

  @Post()
  @Roles('INVESTOR')
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.investmentService.create(user.id, dto);
  }

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN')
  findAll(@Query() query: any) {
    return this.investmentService.findAll(query);
  }

  @Get('my')
  @Roles('INVESTOR')
  findMine(@CurrentUser() user: any) {
    return this.investmentService.findByInvestor(user.id);
  }

  @Get('my/portfolio')
  @Roles('INVESTOR')
  getPortfolio(@CurrentUser() user: any) {
    return this.investmentService.getPortfolioStats(user.id);
  }

  @Get('ipf-stats')
  @Roles('ADMIN', 'SUPER_ADMIN')
  getIPFStats() {
    return this.investmentService.getIPFStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentService.findOne(id);
  }

  // 🔥 WITHDRAW INVESTMENT
  @Post(':id/withdraw')
  @Roles('INVESTOR')
  withdrawInvestment(@CurrentUser() user: any, @Param('id') id: string, @Body() body: { amount?: number }) {
    return this.investmentService.withdrawInvestment(user.id, id, body.amount);
  }
}
