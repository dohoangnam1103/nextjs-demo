'use server'

import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  // Giả lập delay mạng
  await new Promise(resolve => setTimeout(resolve, 1000))

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Validate Input (Giả lập check DB)
  if (email === 'admin@gmail.com' && password === '123123') {
    // 2. Tạo Session
    await createSession('1', 'Admin Nam')
    
    // 3. Redirect về trang chủ
    redirect('/')
  } else {
    return {
      message: 'Email hoặc mật khẩu không đúng!',
    }
  }
}

export async function logoutAction() {
  await deleteSession()
  redirect('/login')
}
