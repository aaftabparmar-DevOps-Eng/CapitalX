import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { EscrowService } from '../escrow/escrow.service';

@Injectable()
export class InvestmentService {
  constructor(private prisma: PrismaService, private walletService: WalletService, private escrowService: EscrowService) {}

  async create(investorId: string, dto: { businessId: string; amount: number; notes?: string }) {
    const business = await this.prisma.business.findUnique({ where: { id: dto.businessId } });
    if (!business) throw new NotFoundException('Business not found');
    if (business.status !== 'VERIFIED') throw new BadRequestException('Business not accepting investments');
    const amount = Number(dto.amount);
    if (amount < Number(business.minInvestment)) throw new BadRequestException(`Minimum: ${business.minInvestment}`);
    if (amount > Number(business.maxInvestment)) throw new BadRequestException(`Maximum: ${business.maxInvestment}`);
    const remaining = Number(business.targetAmount) - Number(business.raisedAmount);
    if (amount > remaining) throw new BadRequestException(`Only ${remaining} remaining`);
    const ipfAmount = amount * 0.01; const escrowAmount = amount - ipfAmount;
    await this.walletService.deductFunds(investorId, amount, 'Investment — Pending admin approval');
    const investment = await this.prisma.investment.create({
      data: { investorId, businessId: dto.businessId, amount, status: 'PENDING', notes: dto.notes, maturityDate: new Date(Date.now() + business.tenureMonths * 30 * 24 * 60 * 60 * 1000) },
      include: { business: { select: { id: true, name: true, returnRate: true, tenureMonths: true, ownerId: true } } },
    });
    await this.escrowService.lockFunds(investment.id, dto.businessId, escrowAmount);
    await this.prisma.investorProtectionFund.create({ data: { amount: ipfAmount, investmentId: investment.id, investorId, businessId: dto.businessId, type: 'CONTRIBUTION', status: 'ACTIVE' } });
    return { ...investment, ipfContribution: ipfAmount, escrowLocked: escrowAmount, message: `Investment submitted.` };
  }

  // 🔥 WITHDRAW INVESTMENT — investor gets money back, business loses it
  async withdrawInvestment(investorId: string, investmentId: string, withdrawAmount?: number) {
    const investment = await this.prisma.investment.findUnique({
      where: { id: investmentId },
      include: { escrowAccount: true, business: { include: { owner: { include: { wallet: true } } } } },
    });
    if (!investment) throw new NotFoundException('Investment not found');
    if (investment.investorId !== investorId) throw new ForbiddenException('Not your investment');
    if (investment.status === 'COMPLETED' || investment.status === 'DEFAULTED') throw new BadRequestException('Cannot withdraw');

    const totalInvested = Number(investment.amount);
    const amount = withdrawAmount ? Math.min(Number(withdrawAmount), totalInvested) : totalInvested;
    const isFullWithdrawal = amount >= totalInvested;

    // 🔥 Business owner ke wallet se deduct karo
    const businessWallet = investment.business?.owner?.wallet;
    if (businessWallet && Number(businessWallet.balance) >= amount) {
      await this.prisma.wallet.update({
        where: { id: businessWallet.id },
        data: { balance: { decrement: amount } },
      });
    }

    // Business raised amount decrement
    if (investment.status === 'ACTIVE' && investment.escrowAccount) {
      await this.prisma.business.update({
        where: { id: investment.businessId },
        data: { raisedAmount: { decrement: amount } },
      });
    }

    // Investor ko refund
    await this.walletService.deposit(investorId, amount, `Withdrawal from ${investment.business?.name || 'Business'}`);

    // Update investment
    await this.prisma.investment.update({
      where: { id: investmentId },
      data: {
        amount: isFullWithdrawal ? 0 : totalInvested - amount,
        status: isFullWithdrawal ? 'COMPLETED' : 'ACTIVE',
      },
    });

    return {
      success: true,
      withdrawn: amount,
      remaining: isFullWithdrawal ? 0 : totalInvested - amount,
      isFullWithdrawal,
      businessDeducted: amount,
      message: isFullWithdrawal ? `Full investment withdrawn. ₹${amount} returned to you, deducted from business.` : `₹${amount} withdrawn. ₹${totalInvested - amount} remaining.`,
    };
  }

  async findAll(query: any) { const { page=1, limit=20, status } = query; const skip=(page-1)*limit; const where:any={}; if(status) where.status=status; const [data,total]=await Promise.all([this.prisma.investment.findMany({where,skip,take:+limit,orderBy:{createdAt:'desc'},include:{business:{select:{id:true,name:true,returnRate:true,tenureMonths:true}},escrowAccount:true}}),this.prisma.investment.count({where})]); return {data,total,page:+page,pages:Math.ceil(total/limit)}; }
  async findByInvestor(investorId: string) { return this.prisma.investment.findMany({ where:{investorId}, include:{business:{select:{id:true,name:true,returnRate:true,tenureMonths:true}},escrowAccount:true}, orderBy:{createdAt:'desc'} }); }
  async findOne(id:string) { const inv=await this.prisma.investment.findUnique({where:{id},include:{business:true,escrowAccount:true}}); if(!inv) throw new NotFoundException(); return inv; }
  async getPortfolioStats(investorId:string) { const investments=await this.prisma.investment.findMany({where:{investorId}}); const totalInvested=investments.filter(i=>i.status==='ACTIVE'||i.status==='PENDING').reduce((s,i)=>s+Number(i.amount),0); return {totalInvested,totalInvestments:investments.length,active:investments.filter(i=>i.status==='ACTIVE').length,pending:investments.filter(i=>i.status==='PENDING').length}; }
  async getIPFStats() { const [total,thisMonth]=await Promise.all([this.prisma.investorProtectionFund.aggregate({_sum:{amount:true},where:{status:'ACTIVE'}}),this.prisma.investorProtectionFund.aggregate({_sum:{amount:true},where:{status:'ACTIVE',createdAt:{gte:new Date(new Date().getFullYear(),new Date().getMonth(),1)}}})]); return {totalIPF:total._sum?.amount||0,thisMonthIPF:thisMonth._sum?.amount||0}; }
}
