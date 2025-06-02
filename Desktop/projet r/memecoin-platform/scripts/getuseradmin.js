const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const USERNAME_OR_EMAIL = 'admin@ps.fr';

async function promoteToAdmin() {
  try {
    // Rechercher l'utilisateur par username ou email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: USERNAME_OR_EMAIL },
          { username: USERNAME_OR_EMAIL }
        ]
      }
    });

    if (!user) {
      console.error(`Utilisateur "${USERNAME_OR_EMAIL}" non trouvé.`);
      return;
    }

    // Promouvoir l'utilisateur en administrateur
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });

    console.log(`L'utilisateur ${updatedUser.username} (${updatedUser.email}) a été promu administrateur avec succès.`);
    
  } catch (error) {
    console.error('Erreur lors de la promotion de l\'utilisateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

promoteToAdmin();