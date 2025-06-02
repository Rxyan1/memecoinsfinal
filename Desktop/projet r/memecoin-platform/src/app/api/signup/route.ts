import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json({ 
        message: 'Tous les champs sont requis' 
      }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà' 
      }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,   
        pspCoins:10,
        zth: 100,
        
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ 
      message: 'Inscription réussie', 
      user: userWithoutPassword 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      message: 'Erreur lors de l\'inscription' 
    }, { status: 500 });
  }
}
