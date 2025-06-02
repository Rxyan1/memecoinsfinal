const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('monSuperMdp123', 10)

  const newUser = await prisma.user.create({
    data: {
      email: 'exemple@email.com',
      username: 'exempleUser',
      password: hashedPassword,
    },
  })

  console.log('Utilisateur créé :', newUser)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
