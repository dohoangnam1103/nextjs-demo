import prisma from '@/lib/prisma';
import { type User } from '@/types/common';
import { unstable_cache } from 'next/cache';

export const userService = {
  // 1. Lấy danh sách (Có Search)
  getUsers: async (query?: string): Promise<User[]> => {
    // Xây dựng điều kiện lọc (nếu có query)
    const whereCondition = query ? {
        OR: [
            { name: { contains: query, mode: 'insensitive' as const } }, // Tìm theo tên (ko phân biệt hoa thường)
            { email: { contains: query, mode: 'insensitive' as const } } // Tìm theo email
        ]
    } : {};

    const users = await prisma.user.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' }
    });
    
    // Convert Prisma Type -> App Type
    return users.map((u: any) => ({
        ...u,
        id: u.id, 
        company: u.company as any || {}, 
        address: {}, 
    }));
  },

  // 2. Lấy chi tiết (Có cache ISR với unstable_cache)
  getUserDetail: async (userId: string): Promise<User | null> => {
    const idNumber = parseInt(userId);
    if (isNaN(idNumber)) return null;

    const getCachedUser = unstable_cache(
      async (id: number) => {
        console.log(`⚡ QUERY DB FOR ID: ${id}`);
        const user = await prisma.user.findUnique({
            where: { id }
        });
        
        if (!user) return null;

        return {
            ...user,
            company: user.company as any || {},
            address: {}
        };
      },
      [`user-detail-${userId}`],
      {
        revalidate: 60,
        tags: [`user-${userId}`] 
      }
    );

    return getCachedUser(idNumber);
  },

  // 3. Xóa User (DB Only)
  deleteUser: async (id: number) => {
    await prisma.user.delete({
        where: { id }
    });
  },

  // 4. Tạo User
  createUser: async (data: any) => {
      // Hàm này sẽ được gọi bởi Server Action
      return await prisma.user.create({
          data: {
              name: data.name,
              email: data.email,
              username: data.username || data.email.split('@')[0],
              phone: data.phone,
              website: data.website,
              company: data.company ?? {},
          }
      });
  }
}
