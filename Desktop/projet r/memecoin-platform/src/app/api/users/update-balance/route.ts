import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Mettre à jour le solde de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { zth: 100 }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Solde mis à jour avec succès',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          zth: updatedUser.zth,
          pspCoins: updatedUser.pspCoins
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du solde:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la mise à jour du solde' },
      { status: 500 }
    );
  }
}
