// 1. GENERICS: Kiểu dữ liệu chuẩn cho phản hồi API
// <T> là tham số kiểu, nó sẽ được thay thế bằng dữ liệu thực tế khi sử dụng
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// 2. Definition cho User
export interface User {
  id: number
  name: string
  username?: string
  email: string
  phone?: string // Optional
  website?: string 
  image?: string | null
  emailVerified?: Date | null
  company?: {     
    name: string
    catchPhrase?: string
    bs?: string
  }
}

// 3. UTILITY TYPES
// - Omit<Type, Keys>: Loại bỏ các trường ID ra khỏi User để dùng việc tạo mới
export type CreateUserDTO = Omit<User, 'id'>

// - Pick<Type, Keys>: Chỉ lấy 1 vài trường (ví dụ chỉ cần name và email để hiển thị list nhỏ)
export type UserPreview = Pick<User, 'id' | 'name' | 'email'>

// - Partial<Type>: Biến tất cả các trường thành Optional (dùng cho việc Update/Patch)
export type UpdateUserDTO = Partial<CreateUserDTO>
