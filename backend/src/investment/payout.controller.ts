import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PayoutService } from './payout.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Payouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payouts')
export class PayoutController {
  constructor(private payoutService: PayoutService) {}

  // Manual trigger — Admin only
  @Post('trigger')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  triggerPayouts() {
    return this.payoutService.triggerNow();
  }

  // Get my payouts
  @Get('my')
  getMyPayouts(@CurrentUser() user: any) {
    return this.payoutService.getInvestorPayouts(user.id);
  }

  // Estimate payout for an investment
  @Get('estimate/:investmentId')
  estimatePayout(@Param('investmentId') id: string) {
    return this.payoutService.estimatePayout(id);
  }
}
