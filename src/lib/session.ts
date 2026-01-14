import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// Khóa bí mật để mã hóa Session (Tuyệt đối không lộ ra ngoài)
const secretKey = process.env.SESSION_SECRET
if (!secretKey) {
  throw new Error('Biến môi trường SESSION_SECRET chưa được cài đặt!')
}
const encodedKey = new TextEncoder().encode(secretKey)

// Format dữ liệu lưu trong Session
type SessionPayload = {
  userId: string
  name: string
  role: string
  expiresAt: Date
}

// 1. Mã hóa: Object -> JWT String
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Session sống 7 ngày
    .sign(encodedKey)
}

// 2. Giải mã: JWT String -> Object
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
    return null
  }
}

// 3. Tạo Session (Login thành công thì gọi hàm này)
export async function createSession(userId: string, name: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
  
  // Tạo token
  const session = await encrypt({ userId, name, role: 'user', expiresAt })
  
  // Lưu vào Cookie (HttpOnly)
  const cookieStore = await cookies()
  
  cookieStore.set('session', session, {
    httpOnly: true, // Javascript client không đọc được
    secure: true,   // Chỉ chạy trên HTTPS (Localhost vẫn chạy được)
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

// 4. Lấy Session hiện tại (Dùng ở Server Component)
export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  const payload = await decrypt(session)
  return payload
}

// 5. Xóa Session (Logout)
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
