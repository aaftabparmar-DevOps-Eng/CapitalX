import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutService {
  private readonly logger = new Logger(PayoutService.name);

  constructor(private prisma: PrismaService) {}

  // Auto-run every day at midnight — check if payouts due
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processMonthlyPayouts() {
    this.logger.log('🔄 Checking for monthly payouts...');
    
    const today = new Date();
    const activeInvestments = await this.prisma.investment.findMany({
      where: { status: 'ACTIVE' },
      include: {
        business: { select: { returnRate: true, tenureMonths: true, name: true } },
        investor: { select: { id: true, firstName: true } },
        payouts: { orderBy: { scheduledDate: 'desc' }, take: 1 },
      },
    });

    let totalPaid = 0;
    let payoutsProcessed = 0;

    for (const inv of activeInvestments) {
      // Check if payout already done this month
      const lastPayout = inv.payouts[0];
      if (lastPayout) {
        const lastDate = new Date(lastPayout.scheduledDate);
        if (lastDate.getMonth() === today.getMonth() && 
            lastDate.getFullYear() === today.getFullYear()) {
          continue; // Already paid this month
        }
      }

      // Calculate monthly payout
      const amount = Number(inv.amount);
      const tenure = inv.business.tenureMonths;
      const returnRate = Number(inv.business.returnRate);
      
      const monthlyPrincipal = amount / tenure;
      const monthlyReturn = amount * (returnRate / 100);
      const totalPayout = monthlyPrincipal + monthlyReturn;

      try {
        // Create payout record
        await this.prisma.payout.create({
          data: {
            investmentId: inv.id,
            amount: totalPayout,
            scheduledDate: today,
            processedDate: today,
            status: 'PROCESSED',
            notes: `${inv.business.name} — Monthly Return (Principal: ₹${Math.round(monthlyPrincipal)} + Return: ₹${Math.round(monthlyReturn)})`,
          },
        });

        // Add to investor wallet
        await this.prisma.wallet.update({
          where: { userId: inv.investorId },
          data: { balance: { increment: totalPayout } },
        });

        // Record transaction
        await this.prisma.transaction.create({
          data: {
            walletId: (await this.prisma.wallet.findUnique({ where: { userId: inv.investorId } }))!.id,
            investmentId: inv.id,
            type: 'RETURN',
            status: 'COMPLETED',
            amount: totalPayout,
            balanceBefore: 0,
            balanceAfter: totalPayout,
            description: `Monthly payout from ${inv.business.name}`,
            processedAt: today,
          },
        });

        // Update investment returns
        await this.prisma.investment.update({
          where: { id: inv.id },
          data: { actualReturns: { increment: monthlyReturn } },
        });

        payoutsProcessed++;
        totalPaid += totalPayout;

        // Check if investment completed (all principal returned)
        const totalPayouts = await this.prisma.payout.aggregate({
          where: { investmentId: inv.id, status: 'PROCESSED' },
          _sum: { amount: true },
        });
        
        const totalReturned = Number(totalPayouts._sum.amount || 0);
        if (totalReturned >= amount + (amount * returnRate * tenure / 100)) {
          await this.prisma.investment.update({
            where: { id: inv.id },
            data: { status: 'COMPLETED', completedAt: today },
          });
          this.logger.log(`✅ Investment ${inv.id} completed! Total returned: ₹${Math.round(totalReturned)}`);
        }

        this.logger.log(`💰 Paid ₹${Math.round(totalPayout)} to ${inv.investor.firstName} from ${inv.business.name}`);
      } catch (err) {
        this.logger.error(`❌ Failed payout for investment ${inv.id}:`, err);
      }
    }

    if (payoutsProcessed > 0) {
      this.logger.log(`✅ Processed ${payoutsProcessed} payouts | Total: ₹${Math.round(totalPaid)}`);
    }
  }

  // Manual trigger — for testing
  async triggerNow() {
    this.logger.log('🔧 Manual payout trigger...');
    await this.processMonthlyPayouts();
    return { message: 'Payouts processed', timestamp: new Date().toISOString() };
  }

  // Get payout history for an investor
  async getInvestorPayouts(investorId: string) {
    const investments = await this.prisma.investment.findMany({
      where: { investorId },
      select: { id: true },
    });

    const investmentIds = investments.map(i => i.id);

    return this.prisma.payout.findMany({
      where: { investmentId: { in: investmentIds } },
      include: {
        investment: {
          select: {
            amount: true,
            business: { select: { name: true, returnRate: true, tenureMonths: true } },
          },
        },
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  // Calculate estimated future payouts
  async estimatePayout(investmentId: string) {
    const inv = await this.prisma.investment.findUnique({
      where: { id: investmentId },
      include: { business: true, payouts: { where: { status: 'PROCESSED' } } },
    });

    if (!inv) throw new Error('Investment not found');

    const amount = Number(inv.amount);
    const tenure = inv.business.tenureMonths;
    const returnRate = Number(inv.business.returnRate);
    
    const monthlyPrincipal = amount / tenure;
    const monthlyReturn = amount * (returnRate / 100);
    const totalMonthly = monthlyPrincipal + monthlyReturn;
    
    const paidMonths = inv.payouts.length;
    const remainingMonths = tenure - paidMonths;
    
    const totalReturned = inv.payouts.reduce((s, p) => s + Number(p.amount), 0);
    const totalExpected = totalMonthly * tenure;
    const remainingPayout = totalExpected - totalReturned;

    return {
      investmentId,
      businessName: inv.business.name,
      investedAmount: amount,
      tenure,
      returnRate,
      monthlyBreakdown: {
        principal: Math.round(monthlyPrincipal),
        return: Math.round(monthlyReturn),
        total: Math.round(totalMonthly),
      },
      progress: {
        monthsPaid: paidMonths,
        monthsRemaining: remainingMonths,
        totalReturned: Math.round(totalReturned),
        totalExpected: Math.round(totalExpected),
        remainingPayout: Math.round(remainingPayout),
        completionPercent: Math.round((paidMonths / tenure) * 100),
      },
    };
  }
}
