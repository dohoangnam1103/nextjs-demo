import prisma from '../src/lib/prisma';

async function checkSessions() {
  const sessions = await prisma.session.findMany({
    include: { user: true },
  });

  console.log('📊 Số lượng session trong DB:', sessions.length);
  
  if (sessions.length > 0) {
    console.log('Sessions:', sessions);
  } else {
    console.log('❌ KHÔNG có session nào trong database!');
    console.log('✅ Vì bạn đang dùng JWT strategy.');
  }
}

checkSessions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
