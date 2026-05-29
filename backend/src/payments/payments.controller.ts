import { Controller, Post, Get, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return this.paymentsService.createOrder(user.id, body.amount);
  }

  @Post('verify/:txnId')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  manualVerify(@Param('txnId') txnId: string, @CurrentUser() user: any) {
    return this.paymentsService.manualVerify(txnId, user.id);
  }

  @Get('pending')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  getPending() {
    return this.paymentsService.getPendingDeposits();
  }
}
