import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// Các route cần bảo vệ (không login thì không được vào)
const protectedRoutes = ['/', '/users']
// Các route công khai (đã login rồi thì không được vào lại login)
const publicRoutes = ['/login']

export default async function middleware(req: NextRequest) {
  // 1. Kiểm tra đường dẫn hiện tại
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/users/')
  const isPublicRoute = publicRoutes.includes(path)
 
  // 2. Lấy cookie session
  // Lưu ý: Middleware chạy ở Edge, nên cách lấy cookie hơi khác Server Component một chút
  // Nhưng req.cookies.get là cách chuẩn trong Middleware
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)
 
  // 3. Logic Redirect
  
  // Nếu vào trang bảo vệ mà chưa login -> Đá về /login
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  // Nếu đã login mà cố tình vào /login -> Đá về / (Trang chủ)
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Config để Middleware chỉ chạy trên các route cần thiết (Tối ưu performance)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
