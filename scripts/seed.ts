import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Tạo user mẫu
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      username: 'testuser',
    },
  });

  console.log('✅ Created test user:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
