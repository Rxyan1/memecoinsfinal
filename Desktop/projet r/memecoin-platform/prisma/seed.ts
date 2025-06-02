// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ...existing seed code...

  await seedMarketStats();
}

// Add this after your existing seed data
async function seedMarketStats() {
  const statsExist = await prisma.marketStats.count() > 0;
  
  if (!statsExist) {
    // Calculate total PSP Coins in circulation
    const totalPspCoins = await prisma.user.aggregate({
      _sum: {
        pspCoins: true,
      },
    });
    
    await prisma.marketStats.create({
      data: {
        pspSupply: totalPspCoins._sum.pspCoins || 0,
        zthReserve: 0, // Start with 0 in reserve
      }
    });
    
    console.log('Market stats initialized');
  } else {
    console.log('Market stats already exist');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });