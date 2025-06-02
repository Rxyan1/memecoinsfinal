const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllUsers() {
  try {
    // D'abord supprimer les tokens en raison des contraintes de clé étrangère
    const deletedTokens = await prisma.token.deleteMany();
    console.log(`Supprimé ${deletedTokens.count} tokens`);
    
    // Ensuite supprimer tous les utilisateurs
    const deletedUsers = await prisma.user.deleteMany();
    console.log(`Supprimé ${deletedUsers.count} utilisateurs`);
    
    console.log('Tous les utilisateurs ont été supprimés avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression des utilisateurs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllUsers();
