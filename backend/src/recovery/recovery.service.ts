import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecoveryService {
  constructor(private prisma: PrismaService) {}

  async getAllCases() {
    return this.prisma.recoveryCase.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCase(data: {
    businessId: string; businessName: string; ownerName: string;
    ownerEmail: string; totalDue: number; investorsCount: number;
  }) {
    return this.prisma.recoveryCase.create({
      data: {
        ...data,
        status: 'WARNING',
        daysOverdue: 1,
        lastAction: 'Case created',
        actionDate: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: string, notes?: string) {
    const statusMap: Record<string, string> = {
      send_notice: 'NOTICE_SENT',
      mark_default: 'DEFAULTED',
      freeze: 'DEFAULTED',
      resolve: 'RESOLVED',
    };

    const newStatus = statusMap[status] || status;

    return this.prisma.recoveryCase.update({
      where: { id },
      data: {
        status: newStatus,
        lastAction: notes || `Status changed to ${newStatus}`,
        actionDate: new Date(),
        notes: notes,
        daysOverdue: newStatus === 'DEFAULTED' ? { increment: 0 } : undefined,
      },
    });
  }

  async getRecoveryStats() {
    const [total, active, defaulted, resolved] = await Promise.all([
      this.prisma.recoveryCase.aggregate({ _sum: { totalDue: true } }),
      this.prisma.recoveryCase.count({ where: { status: { in: ['WARNING', 'NOTICE_SENT'] } } }),
      this.prisma.recoveryCase.count({ where: { status: 'DEFAULTED' } }),
      this.prisma.recoveryCase.count({ where: { status: 'RESOLVED' } }),
    ]);

    return {
      totalDue: total._sum.totalDue || 0,
      activeCases: active,
      defaultedCases: defaulted,
      resolvedCases: resolved,
      totalCases: active + defaulted + resolved,
    };
  }
}
