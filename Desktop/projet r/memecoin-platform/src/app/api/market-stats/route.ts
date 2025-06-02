import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentPrice, formatPrice } from '@/utils/bondingCurve';

const prisma = new PrismaClient();

// Initialize market stats if they don't exist
async function ensureMarketStats() {
  const statsCount = await prisma.marketStats.count();
  
  if (statsCount === 0) {
    // Calculate initial supply from all users' PSP Coins
    const totalPspCoins = await prisma.user.aggregate({
      _sum: {
        pspCoins: true,
      },
    });
    
    // Create the initial market stats record
    await prisma.marketStats.create({
      data: {
        pspSupply: totalPspCoins._sum.pspCoins || 0,
        zthReserve: 0, // Start with 0 reserve or a predefined value
      }
    });
  }
}

export async function GET() {
  try {
    // Ensure we have market stats
    await ensureMarketStats();
    
    // Get the current market stats
    const marketStats = await prisma.marketStats.findFirst();
    
    if (!marketStats) {
      throw new Error("Failed to retrieve market stats");
    }
    
    // Calculate current price from supply
    const currentPrice = getCurrentPrice(marketStats.pspSupply);
    
    // Get aggregated total counts
    const totals = await prisma.user.aggregate({
      _sum: {
        zth: true,
        pspCoins: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalZth: totals._sum.zth || 0,
        totalPspCoins: totals._sum.pspCoins || 0,
        pspSupply: marketStats.pspSupply,
        zthReserve: marketStats.zthReserve,
        currentPrice: currentPrice,
        formattedPrice: formatPrice(currentPrice)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques du marché'
    }, { status: 500 });
  }
}
