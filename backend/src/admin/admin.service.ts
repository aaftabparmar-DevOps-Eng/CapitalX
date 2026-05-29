import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getFullDashboard() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers, totalBusinesses, totalInvestments, totalActiveInvestments,
      investors, businessOwners,
      todayUsers, todayInvestments,
      monthUsers, monthInvestments,
      allFees,
      recentUsers, recentInvestments,
      walletBalances,
      lockedEscrow,
      totalInvested,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.business.count(),
      this.prisma.investment.count(),
      this.prisma.investment.count({ where: { status: 'ACTIVE' } }),
      this.prisma.user.count({ where: { role: 'INVESTOR' } }),
      this.prisma.user.count({ where: { role: 'BUSINESS_OWNER' } }),
      this.prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.investment.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
      this.prisma.investment.count({ where: { createdAt: { gte: monthStart } } }),
      this.prisma.platformFee.findMany(),
      this.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true } }),
      this.prisma.investment.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { investor: { select: { firstName: true, email: true } }, business: { select: { name: true } } } }),
      this.prisma.wallet.aggregate({ _sum: { balance: true } }),
      this.prisma.escrowAccount.aggregate({ _sum: { amount: true }, where: { status: 'LOCKED' } }),
      this.prisma.investment.aggregate({ _sum: { amount: true }, where: { status: 'ACTIVE' } }),
    ]);

    const totalFeesAll = allFees.reduce((s, f) => s + Number(f.amount), 0);

    return {
      overview: {
        totalUsers,
        investors,
        businessOwners,
        totalBusinesses,
        totalInvestments,
        activeInvestments: totalActiveInvestments,
        totalInvested: totalInvested._sum.amount || 0,
        lockedEscrow: lockedEscrow._sum.amount || 0,
        totalWalletBalance: walletBalances._sum.balance || 0,
      },
      today: {
        newUsers: todayUsers,
        newInvestments: todayInvestments,
        feesCollected: totalFeesAll,
      },
      thisMonth: {
        newUsers: monthUsers,
        newInvestments: monthInvestments,
        feesCollected: totalFeesAll,
      },
      revenue: {
        today: totalFeesAll,
        thisMonth: totalFeesAll,
        allTime: totalFeesAll,
      },
      recentUsers,
      recentInvestments,
    };
  }
}
