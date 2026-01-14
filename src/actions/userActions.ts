'use server'

import { userService } from '@/services/userService';
import { revalidatePath } from 'next/cache';

// Action Xóa User
export async function deleteUserAction(userId: number) {
    try {
        await userService.deleteUser(userId);
        revalidatePath('/'); // Làm mới trang chủ
        return { success: true, message: 'Đã xóa người dùng thành công (Server Action)' };
    } catch (error) {
        console.error('Delete User Error:', error);
        return { success: false, message: 'Lỗi khi xóa người dùng' };
    }
}

// Action Thêm User Mới
export async function addUserAction(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    // Validate cơ bản
    if (!name || !email) {
        return { success: false, message: 'Vui lòng nhập tên và email' };
    }

    try {
        await userService.createUser({
            name,
            email,
            // Mock các trường khác
            username: email.split('@')[0],
            phone: '0987654321',
            website: 'example.com',
            company: { name: 'New Company Inc', catchPhrase: 'Growth & Innovation' }
        });

        revalidatePath('/'); // Làm mới danh sách tức thì
        return { success: true, message: 'Thêm người dùng mới thành công!' };
    } catch (error) {
        console.error('Add User Error:', error);
        return { success: false, message: 'Lỗi khi thêm người dùng (Email trùng?)' };
    }
}
