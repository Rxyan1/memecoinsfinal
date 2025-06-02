import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Fonction simple de hachage avec crypto (intégré à Node.js)
// DOIT être identique à celle dans login/route.ts
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    
    // Debug log
    console.log('Register request:', { username, email });
    
    // Valider les données
    if (!username || !email || !password) {
      return NextResponse.json({ 
        message: 'Tous les champs sont requis' 
      }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (userExists) {
      return NextResponse.json({ 
        message: 'Cet utilisateur existe déjà' 
      }, { status: 409 });
    }

    // Hasher le mot de passe
    const hashedPassword = hashPassword(password);
    
    // Créer l'utilisateur avec 100 ZTH initiaux - FORCER la valeur à 100
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        zth: 100, // Explicitement défini à 100
        pspCoins: 0
      }
    });

    console.log('User created with ZTH:', {
      id: user.id,
      username: user.username,
      email: user.email,
      zth: user.zth // Vérifier que les ZTH sont bien à 100
    });

    // Retourner l'utilisateur créé (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      message: 'Erreur lors de la création du compte' 
    }, { status: 500 });
  }
}
