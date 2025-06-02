import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        zth: true,
        pspCoins: true,
        // Ne pas inclure le mot de passe et l'email pour des raisons de sécurité
      }
    });

    // Ensure we're returning an array even if findMany returns null or undefined
    return NextResponse.json({ users: users || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return an empty array in case of error to prevent "length of undefined" errors
    return NextResponse.json({ 
      users: [],
      message: 'Erreur lors de la récupération des utilisateurs' 
    }, { status: 500 });
  }
}
