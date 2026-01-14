import { z } from 'zod';

// Định nghĩa Schema cho việc tạo User
export const CreateUserSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  // Các field optional, nếu rỗng thì convert sang undefined
  username: z.string().optional(),
  phone: z.string().min(9, { message: "Số điện thoại quá ngắn" }).optional().or(z.literal('')), 
  website: z.string().url({ message: "Website phải là link hợp lệ (http://...)" }).optional().or(z.literal('')),
  companyName: z.string().optional()
});
