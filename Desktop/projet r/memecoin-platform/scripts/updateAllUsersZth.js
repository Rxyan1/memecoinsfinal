const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAllUsersZth() {
  try {
    // Récupérer tous les utilisateurs ayant 0 ZTH
    const usersWithZeroZth = await prisma.user.findMany({
      where: {
        zth: 0
      },
      select: {
        id: true,
        username: true,
        email: true,
        zth: true
      }
    });
    
    console.log(`Found ${usersWithZeroZth.length} users with 0 ZTH`);
    
    // Mettre à jour tous les utilisateurs pour leur donner 100 ZTH s'ils en ont 0
    const updateResult = await prisma.user.updateMany({
      where: {
        zth: 0
      },
      data: {
        zth: 100
      }
    });
    
    console.log(`Updated ${updateResult.count} users to 100 ZTH`);
    
    // Vérifier que la mise à jour a fonctionné
    const updatedUsers = await prisma.user.findMany({
      where: {
        id: {
          in: usersWithZeroZth.map(user => user.id)
        }
      },
      select: {
        id: true,
        username: true, 
        email: true,
        zth: true
      }
    });
    
    console.log('Updated users:');
    updatedUsers.forEach(user => {
      console.log(`- ${user.email}: ${user.zth} ZTH`);
    });
    
    console.log('Tous les utilisateurs ont maintenant 100 ZTH');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllUsersZth();
