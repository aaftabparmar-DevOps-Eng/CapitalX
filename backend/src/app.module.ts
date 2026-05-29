import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './business/business.module';
import { InvestmentModule } from './investment/investment.module';
import { WalletModule } from './wallet/wallet.module';
import { AdminModule } from './admin/admin.module';
import { EscrowModule } from './escrow/escrow.module';
import { AiRiskModule } from './ai-risk/ai-risk.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { RecoveryModule } from './recovery/recovery.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    EmailModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    InvestmentModule,
    WalletModule,
    AdminModule,
    EscrowModule,
    AiRiskModule,
    NotificationsModule,
    PaymentsModule,
    RecoveryModule,
  ],
})
export class AppModule {}
