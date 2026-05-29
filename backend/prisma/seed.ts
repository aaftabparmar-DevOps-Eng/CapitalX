import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CapitalX database...');

  const adminHash = await bcrypt.hash('Admin@123456', 12);
  const investorHash = await bcrypt.hash('Investor@123', 12);
  const bizHash = await bcrypt.hash('Business@123', 12);

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@capitalx.io' },
    update: {},
    create: {
      email: 'admin@capitalx.io', passwordHash: adminHash,
      firstName: 'Super', lastName: 'Admin', role: 'SUPER_ADMIN',
      kycStatus: 'APPROVED', isEmailVerified: true, isActive: true,
      wallet: { create: { balance: 0 } },
    },
  });

  // Investor
  await prisma.user.upsert({
    where: { email: 'investor@capitalx.io' },
    update: {},
    create: {
      email: 'investor@capitalx.io', passwordHash: investorHash,
      firstName: 'John', lastName: 'Investor', role: 'INVESTOR',
      kycStatus: 'APPROVED', isEmailVerified: true, isActive: true,
      wallet: { create: { balance: 500000 } },
    },
  });

  // Business Owner
  await prisma.user.upsert({
    where: { email: 'business@capitalx.io' },
    update: {},
    create: {
      email: 'business@capitalx.io', passwordHash: bizHash,
      firstName: 'Jane', lastName: 'BusinessOwner', role: 'BUSINESS_OWNER',
      kycStatus: 'APPROVED', isEmailVerified: true, isActive: true,
      wallet: { create: { balance: 100000 } },
    },
  });

  console.log('✅ Users seeded (no fake businesses)');
  console.log('📧 admin@capitalx.io / Admin@123456');
  console.log('📧 investor@capitalx.io / Investor@123');
  console.log('📧 business@capitalx.io / Business@123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
