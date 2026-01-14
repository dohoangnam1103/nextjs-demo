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
import { CreateUserSchema } from '@/lib/schemas';

// Action Thêm User Mới (Validation with Zod)
export async function addUserAction(formData: FormData) {
    // 1. Lấy và chuẩn hóa dữ liệu từ Form
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        // Các trường này hiện UI chưa gửi lên, nhưng ta cứ get sẵn để sau này mở rộng
        phone: formData.get('phone') || undefined,
        website: formData.get('website') || undefined,
        companyName: formData.get('companyName') || undefined,
    };

    // 2. Validate bằng Zod Safe Parse (Không throw error)
    const result = CreateUserSchema.safeParse(rawData);

    // 3. Nếu validate thất bại
    if (!result.success) {
        // Lấy lỗi đầu tiên để hiển thị đơn giản
        const errorMessage = result.error.issues[0].message;
        return { success: false, message: errorMessage };
    }

    // 4. Validate thành công -> Dùng data sạch
    const data = result.data;

    try {
        await userService.createUser({
            name: data.name,
            email: data.email,
            phone: data.phone,
            website: data.website,
            company: data.companyName ? { name: data.companyName } : { name: 'New User Company' }
        });

        revalidatePath('/');
        return { success: true, message: 'Thêm người dùng mới thành công!' };
    } catch (error) {
        console.error('Add User Error:', error);
        return { success: false, message: 'Lỗi: Email có thể đã tồn tại' };
    }
}
