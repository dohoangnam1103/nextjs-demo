import { UserList } from '@/components/UserList';
import { userService } from '@/services/userService';

// Cache trang này trong 60 giây (ISR)
// Lưu ý: Khi có searchParams, Next.js sẽ tự động chuyển sang Dynamic Rendering (bỏ qua cache cứng này)
export const revalidate = 60;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: Props) {
  // Lấy từ khóa tìm kiếm từ URL (ví dụ: /?q=nam)
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : undefined;

  console.log(`[HOME PAGE] Rendering with query: "${query || ''}" at ${new Date().toISOString()}`);

  // DB Search (Server Side)
  const users = await userService.getUsers(query);

  return (
    <main className="min-h-screen p-24 bg-gray-50">

      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">User Management System (Server Component)</h1>

      {/* Truyền dữ liệu ban đầu từ Server xuống Client */}
      <UserList initialUsers={users} />
    </main>
  );
}
