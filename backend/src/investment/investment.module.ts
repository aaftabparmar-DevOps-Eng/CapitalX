import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InvestmentController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { PayoutController } from './payout.controller';
import { PayoutService } from './payout.service';
import { EscrowModule } from '../escrow/escrow.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [ScheduleModule.forRoot(), EscrowModule, WalletModule],
  controllers: [InvestmentController, PayoutController],
  providers: [InvestmentService, PayoutService],
  exports: [InvestmentService, PayoutService],
})
export class InvestmentModule {}
