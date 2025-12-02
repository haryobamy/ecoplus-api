import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'admin@ecoplus.com',
      fullName: 'Admin User',
      password: 'securepasswordhash',
      role: 'ADMIN',
    },
  });
  console.log('✅ Seed completed');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
