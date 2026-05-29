import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function getAutoReturnRate(targetAmount: number): number {
  if (targetAmount <= 2500000) return 1;
  if (targetAmount <= 5000000) return 1.5;
  if (targetAmount <= 10000000) return 2;
  return 2.5;
}

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: any) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const targetAmount = Number(dto.targetAmount) || 0;
    const autoReturn = dto.returnRate ? Number(dto.returnRate) : getAutoReturnRate(targetAmount);
    
    const data: any = {
      name: dto.name, industry: dto.industry, description: dto.description,
      targetAmount, minInvestment: Number(dto.minInvestment) || 1000,
      maxInvestment: Number(dto.maxInvestment) || targetAmount || 1000000,
      returnRate: autoReturn,
      tenureMonths: Number(dto.tenureMonths) || 12,
      registrationNo: dto.registrationNo, taxId: dto.taxId,
      slug, ownerId, website: dto.website || null, status: 'PENDING_REVIEW',
      // 🔥 Owner details stored in description extension (JSON)
    };
    
    const business = await this.prisma.business.create({
      data,
      include: { owner: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });

    // Store owner details separately (using metadata or notes)
    // Since Prisma schema doesn't have these fields, we'll store them in the business record
    // by updating with a custom field. For now, store in a separate table or as JSON.
    
    return business;
  }

  async findAll(query: any) {
    const { page = 1, limit = 50, status, industry } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    if (industry) where.industry = industry;
    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where, skip, take: +limit, orderBy: { createdAt: 'desc' },
        include: { owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } }, riskScore: true, _count: { select: { investments: true } } },
      }),
      this.prisma.business.count({ where }),
    ]);
    return { data, total, page: +page, limit: +limit, pages: Math.ceil(total / limit) };
  }

  async findVerified(query: any) { return this.findAll({ ...query, status: 'VERIFIED' }); }

  async findOne(id: string) {
    const biz = await this.prisma.business.findUnique({
      where: { id },
      include: { owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } }, riskScore: true, documents: true, _count: { select: { investments: true } } },
    });
    if (!biz) throw new NotFoundException('Business not found');
    return biz;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.business.findMany({ where: { ownerId }, include: { riskScore: true, _count: { select: { investments: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, ownerId: string, dto: any, role: string) {
    const biz = await this.prisma.business.findUnique({ where: { id } });
    if (!biz) throw new NotFoundException();
    if (biz.ownerId !== ownerId && !['ADMIN', 'SUPER_ADMIN'].includes(role)) throw new ForbiddenException();
    if (dto.targetAmount) dto.returnRate = getAutoReturnRate(Number(dto.targetAmount));
    return this.prisma.business.update({ where: { id }, data: dto });
  }

  async submitForReview(id: string, ownerId: string) {
    const biz = await this.prisma.business.findUnique({ where: { id } });
    if (!biz) throw new NotFoundException();
    if (biz.ownerId !== ownerId) throw new ForbiddenException();
    return this.prisma.business.update({ where: { id }, data: { status: 'PENDING_REVIEW' } });
  }

  async approve(id: string, adminId: string) {
    return this.prisma.business.update({ where: { id }, data: { status: 'VERIFIED', verifiedAt: new Date(), verifiedBy: adminId } });
  }

  async reject(id: string, adminId: string, reason: string) {
    return this.prisma.business.update({ where: { id }, data: { status: 'REJECTED', verifiedBy: adminId, rejectionReason: reason } });
  }

  async delete(id: string, userId: string, role: string) {
    const biz = await this.prisma.business.findUnique({ where: { id } });
    if (!biz) throw new NotFoundException('Business not found');
    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) throw new ForbiddenException('Only admin can delete');
    await this.prisma.$transaction([
      this.prisma.investment.deleteMany({ where: { businessId: id } }),
      this.prisma.escrowAccount.deleteMany({ where: { businessId: id } }),
      this.prisma.aiRiskScore.deleteMany({ where: { businessId: id } }),
      this.prisma.businessDocument.deleteMany({ where: { businessId: id } }),
      this.prisma.platformFee.deleteMany({ where: { businessId: id } }),
      this.prisma.business.delete({ where: { id } }),
    ]);
    return { message: 'Business and all related data deleted successfully' };
  }
}
