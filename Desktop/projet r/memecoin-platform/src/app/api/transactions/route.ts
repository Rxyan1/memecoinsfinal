import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getBuyCost, getSellReturn } from '@/utils/bondingCurve';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, action, amount } = await request.json();
    
    if (!userId || !action || !amount || amount <= 0) {
      return NextResponse.json({ 
        success: false,
        message: 'Les données de la transaction sont incomplètes' 
      }, { status: 400 });
    }

    // S'assurer que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'Utilisateur non trouvé' 
      }, { status: 404 });
    }

    // Get current market stats
    const marketStats = await prisma.marketStats.findFirst();
    
    if (!marketStats) {
      return NextResponse.json({
        success: false,
        message: 'Erreur: données de marché indisponibles'
      }, { status: 500 });
    }

    let updatedUser;
    let updatedMarketStats;
    let costOrReturn;
    let pricePerToken;

    // Traiter l'achat de PSP coins (coûte des ZTH)
    if (action === 'buy') {
      // Calculate the total cost for buying 'amount' tokens
      costOrReturn = getBuyCost(marketStats.pspSupply, amount);
      pricePerToken = costOrReturn / amount;
      
      // Round up to ensure user has enough funds
      const totalCost = Math.ceil(costOrReturn);

      if (user.zth < totalCost) {
        return NextResponse.json({
          success: false,
          message: `Solde ZTH insuffisant. Coût total: ${totalCost} ZTH`
        }, { status: 400 });
      }

      // Update user balance and market stats in a transaction
      const result = await prisma.$transaction([
        // Update user
        prisma.user.update({
          where: { id: userId },
          data: {
            zth: { decrement: totalCost },
            pspCoins: { increment: amount }
          }
        }),
        // Update market stats
        prisma.marketStats.update({
          where: { id: marketStats.id },
          data: {
            pspSupply: { increment: amount },
            zthReserve: { increment: totalCost }
          }
        })
      ]);
      
      updatedUser = result[0];
      updatedMarketStats = result[1];
    } 
    // Traiter la vente de PSP coins (gagne des ZTH)
    else if (action === 'sell') {
      if (user.pspCoins < amount) {
        return NextResponse.json({
          success: false,
          message: 'Solde PSP coins insuffisant'
        }, { status: 400 });
      }
      
      // Calculate the return for selling 'amount' tokens
      costOrReturn = getSellReturn(marketStats.pspSupply, amount);
      pricePerToken = costOrReturn / amount;
      
      // Round down to prevent excess refunds
      const totalReturn = Math.floor(costOrReturn);
      
      // Don't allow selling if reserve is too low
      if (totalReturn > marketStats.zthReserve) {
        return NextResponse.json({
          success: false,
          message: 'Réserve ZTH insuffisante pour cette transaction'
        }, { status: 400 });
      }

      // Update user balance and market stats in a transaction
      const result = await prisma.$transaction([
        // Update user
        prisma.user.update({
          where: { id: userId },
          data: {
            zth: { increment: totalReturn },
            pspCoins: { decrement: amount }
          }
        }),
        // Update market stats
        prisma.marketStats.update({
          where: { id: marketStats.id },
          data: {
            pspSupply: { decrement: amount },
            zthReserve: { decrement: totalReturn }
          }
        })
      ]);
      
      updatedUser = result[0];
      updatedMarketStats = result[1];
    } else {
      return NextResponse.json({ 
        success: false,
        message: 'Action non reconnue' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      message: `Transaction ${action === 'buy' ? 'd\'achat' : 'de vente'} réussie à ${pricePerToken.toFixed(4)} ZTH par PSP Coin`,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        zth: updatedUser.zth,
        pspCoins: updatedUser.pspCoins
      },
      marketStats: {
        pspSupply: updatedMarketStats.pspSupply,
        zthReserve: updatedMarketStats.zthReserve
      },
      transaction: {
        action,
        amount,
        pricePerToken: pricePerToken,
        totalCost: costOrReturn
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Erreur lors de la transaction' 
    }, { status: 500 });
  }
}
