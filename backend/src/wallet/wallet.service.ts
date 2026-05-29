import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async deposit(userId: string, amount: number, description = 'Deposit') {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    const newBalance = Number(wallet.balance) + amount;
    const [updatedWallet] = await this.prisma.$transaction([
      this.prisma.wallet.update({ where: { userId }, data: { balance: newBalance } }),
      this.prisma.transaction.create({
        data: {
          walletId: wallet.id, type: 'DEPOSIT', status: 'COMPLETED',
          amount, balanceBefore: wallet.balance, balanceAfter: newBalance,
          description, processedAt: new Date(),
        },
      }),
    ]);
    return { wallet: updatedWallet };
  }

  async deductFunds(userId: string, amount: number, description = 'Deduction') {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (Number(wallet.balance) < amount) throw new BadRequestException('Insufficient funds');
    const newBalance = Number(wallet.balance) - amount;
    const newEscrow = Number(wallet.escrowBalance) + amount;
    await this.prisma.$transaction([
      this.prisma.wallet.update({ where: { userId }, data: { balance: newBalance, escrowBalance: newEscrow } }),
      this.prisma.transaction.create({
        data: {
          walletId: wallet.id, type: 'ESCROW_LOCK', status: 'COMPLETED',
          amount, balanceBefore: wallet.balance, balanceAfter: newBalance,
          description, processedAt: new Date(),
        },
      }),
    ]);
  }

  async withdraw(userId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (Number(wallet.balance) < amount) throw new BadRequestException('Insufficient balance');
    const newBalance = Number(wallet.balance) - amount;
    await this.prisma.$transaction([
      this.prisma.wallet.update({ where: { userId }, data: { balance: newBalance } }),
      this.prisma.transaction.create({
        data: {
          walletId: wallet.id, type: 'WITHDRAWAL', status: 'COMPLETED',
          amount, balanceBefore: wallet.balance, balanceAfter: newBalance,
          description: 'Withdrawal', processedAt: new Date(),
        },
      }),
    ]);
    return { balance: newBalance };
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { walletId: wallet.id },
        skip: skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where: { walletId: wallet.id } }),
    ]);
    return { data, total, page: pageNum, pages: Math.ceil(total / limitNum) };
  }
}
