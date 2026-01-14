import prisma from '../src/lib/prisma';

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  console.log('📧 User found:', user ? 'YES' : 'NO');
  if (user) {
    console.log('👤 Name:', user.name);
    console.log('🔑 Has password:', user.password ? 'YES' : 'NO');
    console.log('🔑 Password hash:', user.password?.substring(0, 20) + '...');
  }
}

checkUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
