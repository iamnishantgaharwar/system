import prisma from '../lib/prisma';


async function main() {
  const roles = ['User', 'Student', 'Teacher', 'Organization', 'Admin'];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { role: roleName },
      update: {},
      create: {
        role: roleName,
      },
    });
  }

  console.log('Roles inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
