import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This API route adds ZTH to the market reserve
export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        message: 'Un montant positif est requis'
      }, { status: 400 });
    }
    
    // Get the current market stats
    let marketStats = await prisma.marketStats.findFirst();
    
    if (!marketStats) {
      // If no market stats exist, create them
      marketStats = await prisma.marketStats.create({
        data: {
          pspSupply: 0,
          zthReserve: amount
        }
      });
    } else {
      // Update existing market stats
      marketStats = await prisma.marketStats.update({
        where: { id: marketStats.id },
        data: {
          zthReserve: { increment: amount }
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `${amount} ZTH ajoutés à la réserve du marché`,
      data: marketStats
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error seeding market reserve:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réserve'
    }, { status: 500 });
  }
}
