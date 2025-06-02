import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    
    // Vérifiez si les champs requis sont présents
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    // Vérifiez si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }
    
    // Hachez le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créez l'utilisateur avec 100 ZTH par défaut
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        zth: 0, // Doit être changé à 100
        pspCoins: 0
      }
    });
    
    // Supprimez le mot de passe de la réponse
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Inscription réussie',
        user: userWithoutPassword
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
