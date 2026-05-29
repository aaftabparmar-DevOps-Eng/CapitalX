import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EscrowService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async lockFunds(investmentId: string, businessId: string, amount: number) {
    const feePercent = Number(this.config.get('ESCROW_PLATFORM_FEE_PERCENT', '3'));
    const platformFee = (amount * feePercent) / 100;
    return this.prisma.escrowAccount.create({
      data: { investmentId, businessId, amount, platformFee, status: 'LOCKED' },
    });
  }

  async releaseFunds(escrowId: string, adminId: string, notes?: string) {
    const escrow = await this.prisma.escrowAccount.findUnique({
      where: { id: escrowId },
      include: { investment: { include: { business: true } } },
    });
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status !== 'LOCKED') throw new BadRequestException('Already processed');

    const totalAmount = Number(escrow.amount);
    const platformFee = Number(escrow.platformFee);
    const netAmount = totalAmount - platformFee;

    await this.prisma.$transaction([
      this.prisma.escrowAccount.update({
        where: { id: escrowId },
        data: { status: 'RELEASED', releasedAt: new Date(), releasedBy: adminId, releaseNotes: notes },
      }),
      this.prisma.investment.update({
        where: { id: escrow.investmentId },
        data: { status: 'ACTIVE' },
      }),
      this.prisma.business.update({
        where: { id: escrow.businessId },
        data: { raisedAmount: { increment: Number(escrow.investment.amount) } },
      }),
      this.prisma.platformFee.create({
        data: { amount: platformFee, businessId: escrow.businessId, businessName: escrow.investment.business.name, escrowId: escrow.id },
      }),
      this.prisma.wallet.update({
        where: { userId: escrow.investment.business.ownerId },
        data: { balance: { increment: netAmount } },
      }),
    ]);

    return { message: 'Funds released & investment activated', totalAmount, platformFee, netAmount };
  }

  async refundFunds(escrowId: string, adminId: string, reason: string) {
    const escrow = await this.prisma.escrowAccount.findUnique({
      where: { id: escrowId },
      include: { investment: { include: { investor: { include: { wallet: true } } } } },
    });
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (!['LOCKED', 'PENDING_RELEASE'].includes(escrow.status)) throw new BadRequestException('Already processed');

    const wallet = escrow.investment.investor.wallet!;
    const amount = Number(escrow.amount);

    await this.prisma.$transaction([
      this.prisma.escrowAccount.update({ where: { id: escrowId }, data: { status: 'REFUNDED', refundedAt: new Date() } }),
      this.prisma.investment.update({ where: { id: escrow.investmentId }, data: { status: 'CANCELLED' } }),
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount }, escrowBalance: { decrement: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          type: 'REFUND', amount, status: 'COMPLETED',
          description: `Refund: ${reason}`, walletId: wallet.id,
          investmentId: escrow.investmentId,
          balanceBefore: Number(wallet.balance),
          balanceAfter: Number(wallet.balance) + amount,
          processedAt: new Date(),
        },
      }),
    ]);

    return { message: 'Refunded. Investment cancelled.', amount };
  }

  async findAll(query: any) {
    const { page = 1, limit = 50, status } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.escrowAccount.findMany({
        where, skip, take: +limit, orderBy: { createdAt: 'desc' },
        include: {
          investment: { include: { investor: { select: { id: true, firstName: true, lastName: true, email: true } } } },
          business: { select: { id: true, name: true } },
        },
      }),
      this.prisma.escrowAccount.count({ where }),
    ]);
    return { data, total, page: +page, pages: Math.ceil(total / limit) };
  }

  async getPlatformFees() {
    const allFees = await this.prisma.platformFee.aggregate({ _sum: { amount: true } });
    return {
      totalEarned: allFees._sum?.amount || 0,
      thisMonth: 0,
    };
  }
}
