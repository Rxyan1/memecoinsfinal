import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Fonction simple de hachage avec crypto (intégré à Node.js)
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received login request body:', body);
    
    // Accepter soit username soit email
    const { username, password, email } = body;
    const loginIdentifier = username || email;
    
    // Server-side validation - plus détaillée
    if (!loginIdentifier) {
      console.log('Missing login identifier');
      return NextResponse.json({ 
        message: 'Nom d\'utilisateur ou email requis' 
      }, { status: 400 });
    }
    
    if (!password) {
      console.log('Missing password');
      return NextResponse.json({ 
        message: 'Mot de passe requis' 
      }, { status: 400 });
    }

    // Check if it's an email or username login
    const isEmail = loginIdentifier.includes('@');
    
    console.log(`Searching user by ${isEmail ? 'email' : 'username'}: ${loginIdentifier}`);
    
    // DEBUG: Afficher tous les utilisateurs pour déboguer
    const allUsers = await prisma.user.findMany({
      select: { 
        id: true, 
        username: true, 
        email: true, 
        password: true 
      }
    });
    console.log('All users in DB:', allUsers);
    
    // Find the user - essayer de trouver par les deux champs pour plus de flexibilité
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginIdentifier },
          { username: loginIdentifier }
        ]
      }
    });

    // Log pour debug
    console.log('User found:', user ? user : 'no user found');

    // Check if user exists
    if (!user) {
      return NextResponse.json({ 
        message: 'Identifiants incorrects' 
      }, { status: 401 });
    }

    // Validate password
    const hashedPassword = hashPassword(password);
    console.log('Password check:', {
      inputPassword: password,
      inputHashed: hashedPassword,
      storedHash: user.password,
      match: user.password === hashedPassword
    });
    
    // Pour déboguer, temporairement autoriser la connexion sans vérification de mot de passe
    // COMMENTEZ CETTE SECTION EN PRODUCTION
    if (process.env.NODE_ENV !== 'production') {
      console.log('Debug mode: bypassing password check');
      return NextResponse.json({
        message: 'Connecté avec succès (debug mode)',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          zth: user.zth,
          pspCoins: user.pspCoins || 0
        }
      }, { status: 200 });
    }
    
    if (user.password !== hashedPassword) {
      return NextResponse.json({ 
        message: 'Identifiants incorrects' 
      }, { status: 401 });
    }

    console.log('Login successful for user:', user.username);

    // Return user data (excluding password)
    return NextResponse.json({
      message: 'Connecté avec succès',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        zth: user.zth,
        pspCoins: user.pspCoins || 0
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: 'Erreur lors de la connexion' 
    }, { status: 500 });
  }
}
