const { PrismaClient } = require('@prisma/client');
const { createHash } = require('crypto');

const prisma = new PrismaClient();

// Utiliser exactement la même fonction de hachage que dans l'API
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  try {
    // Nettoyer la base de données
    await prisma.token.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Database cleaned');

    // Créer un compte de test
    const testUser = await prisma.user.create({
      data: {
        username: 'test',
        email: 'test@example.com',
        password: hashPassword('password123'),
        zth: 100,
        pspCoins: 0
      }
    });
    console.log('Test user created:', {
      username: testUser.username,
      email: testUser.email,
      passwordHash: testUser.password
    });

    // Créer un autre utilisateur de test
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashPassword('admin123'),
        zth: 1000,
        pspCoins: 5000
      }
    });
    console.log('Admin user created');

    console.log('Database seeded successfully!');
    console.log('You can now log in with:');
    console.log('- Username: test, Password: password123');
    console.log('- Username: admin, Password: admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
