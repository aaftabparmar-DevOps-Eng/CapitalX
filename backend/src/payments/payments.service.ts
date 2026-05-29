import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentsService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async createOrder(userId: string, amount: number) {
    if (amount < 100) throw new BadRequestException('Minimum ₹100');

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new BadRequestException('Wallet not found');

    // Auto-approve & add to wallet immediately
    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore + amount;

    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await this.prisma.transaction.create({
      data: {
        type: 'DEPOSIT',
        amount,
        status: 'COMPLETED',
        description: `Auto-deposit via UPI/Bank`,
        walletId: wallet.id,
        balanceBefore,
        balanceAfter,
        reference: `AUTO-${Date.now()}`,
        processedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `₹${amount} added to wallet successfully!`,
      newBalance: balanceAfter,
    };
  }

  async manualVerify(txnId: string, adminId: string) {
    const txn = await this.prisma.transaction.findUnique({ 
      where: { id: txnId },
      include: { wallet: true },
    });
    if (!txn || txn.status !== 'PENDING') throw new BadRequestException('Invalid transaction');

    await this.walletService.deposit(
      txn.wallet.userId,
      Number(txn.amount),
      `Manual verification`,
    );

    await this.prisma.transaction.update({
      where: { id: txnId },
      data: { status: 'COMPLETED' },
    });

    return { success: true, message: `₹${txn.amount} added to wallet` };
  }

  async getPendingDeposits() {
    return this.prisma.transaction.findMany({
      where: { type: 'DEPOSIT', status: 'PENDING' },
      include: { wallet: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
