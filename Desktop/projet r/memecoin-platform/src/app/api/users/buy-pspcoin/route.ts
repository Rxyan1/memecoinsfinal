import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        message: 'ID utilisateur requis' 
      }, { status: 400 });
    }

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ 
        message: 'Utilisateur non trouvé' 
      }, { status: 404 });
    }

    // Check if user has enough ZTH
    if (user.zth < 1) {
      return NextResponse.json({ 
        message: 'Solde ZTH insuffisant' 
      }, { status: 400 });
    }

    // Update user: subtract 1 ZTH and add 1 PSP Coin
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        zth: { decrement: 1 },
        pspCoins: { increment: 1 }
      }
    });

    return NextResponse.json({ 
      message: 'PSP Coin acheté avec succès',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        zth: updatedUser.zth,
        pspCoins: updatedUser.pspCoins
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error buying PSP Coin:', error);
    return NextResponse.json({ 
      message: 'Erreur lors de l\'achat du PSP Coin' 
    }, { status: 500 });
  }
}
