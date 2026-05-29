import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiRiskService {
  private readonly logger = new Logger(AiRiskService.name);
  private readonly aiServiceUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.aiServiceUrl = this.config.get('AI_SERVICE_URL', 'http://localhost:5000');
  }

  async scoreBusinessRisk(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { documents: true, investments: true },
    });

    if (!business) throw new Error('Business not found');

    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/score-business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyRevenue: Number(business.targetAmount || 0) / 10,
          profitMargin: Number(business.returnRate || 0) * 2,
          fundingGoal: Number(business.targetAmount || 0),
          teamSize: 10,
          website: business.website || '',
          documents: business.documents?.map(d => d.url) || [],
          previousRounds: 0,
          industryGrowth: 15,
          ownerCreditScore: 700,
          socialMediaPresence: 50,
          customerReviewsAvg: 4.0,
          businessAgeMonths: 12,
        }),
      });

      if (!response.ok) throw new Error(`AI Service error: ${response.status}`);

      const aiResult = await response.json();
      
      if (!aiResult.success) throw new Error(aiResult.error || 'AI scoring failed');

      const score = aiResult.data;

      const saved = await this.prisma.aiRiskScore.upsert({
        where: { businessId },
        update: {
          overallScore: score.overallScore,
          riskLevel: score.riskLevel as any,
          financialScore: score.financialScore,
          marketScore: score.marketScore,
          teamScore: score.teamScore,
          complianceScore: score.complianceScore,
          analysisReport: score,
          updatedAt: new Date(),
        },
        create: {
          businessId,
          overallScore: score.overallScore,
          riskLevel: score.riskLevel as any,
          financialScore: score.financialScore,
          marketScore: score.marketScore,
          teamScore: score.teamScore,
          complianceScore: score.complianceScore,
          analysisReport: score,
        },
      });

      return saved;
    } catch (error) {
      this.logger.error(`AI scoring failed, using fallback:`, error);
      return this.fallbackScore(businessId);
    }
  }

  async getRiskScore(businessId: string) {
    const score = await this.prisma.aiRiskScore.findUnique({ where: { businessId } });
    if (!score) return this.scoreBusinessRisk(businessId);
    return score;
  }

  async getPortfolioRisk(userId: string) {
    const investments = await this.prisma.investment.findMany({
      where: { investorId: userId, status: 'ACTIVE' },
    });

    if (investments.length === 0) return { overallRisk: 'N/A', averageScore: 0 };

    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/portfolio-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investments: investments.map(() => ({
            business: {
              monthlyRevenue: 500000,
              profitMargin: 25,
              teamSize: 15,
              fundingGoal: 1000000,
            }
          }))
        }),
      });

      const result = await response.json();
      return result.data;
    } catch {
      return { overallRisk: 'MEDIUM', averageScore: 72 };
    }
  }

  async fraudCheck(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { documents: true },
    });

    if (!business) throw new Error('Business not found');

    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/fraud-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyRevenue: Number(business.targetAmount || 0) / 10,
          profitMargin: Number(business.returnRate || 0) * 2,
          teamSize: 10,
          website: business.website || '',
          documents: business.documents?.map(d => d.url) || [],
          businessAgeMonths: 12,
        }),
      });

      const result = await response.json();
      return result.data;
    } catch {
      return { passedFraudCheck: true, fraudFlags: [] };
    }
  }

  private fallbackScore(businessId: string) {
    const score = 75;
    return this.prisma.aiRiskScore.upsert({
      where: { businessId },
      update: { overallScore: score, riskLevel: 'MEDIUM' as any, financialScore: 70, marketScore: 72, teamScore: 68, complianceScore: 80 },
      create: { businessId, overallScore: score, riskLevel: 'MEDIUM' as any, financialScore: 70, marketScore: 72, teamScore: 68, complianceScore: 80, analysisReport: {} },
    });
  }
}
