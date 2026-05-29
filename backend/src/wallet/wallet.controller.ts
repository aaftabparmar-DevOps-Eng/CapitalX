import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  getWallet(@CurrentUser() user: any) {
    return this.walletService.getWallet(user.id);
  }

  @Post('deposit')
  deposit(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return this.walletService.deposit(user.id, body.amount);
  }

  @Post('withdraw')
  withdraw(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return this.walletService.withdraw(user.id, body.amount);
  }

  @Get('transactions')
  getTransactions(@CurrentUser() user: any, @Query('page') page: number, @Query('limit') limit: number) {
    return this.walletService.getTransactions(user.id, page, limit);
  }
}
