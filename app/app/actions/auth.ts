'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { registerUser } from '@/lib/auth/register'
import { loginUser } from '@/lib/auth/login'

type RegisterState = { error: string; fields?: { email: string; username: string } } | undefined
type LoginState = { error: string } | undefined

const SESSION_MAX_AGE = 604800

async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = formData.get('email')
  const username = formData.get('username')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  if (
    typeof email !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof confirmPassword !== 'string'
  ) {
    return { error: 'Invalid form submission' }
  }

  const fields = { email, username }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match', fields }
  }

  const result = await registerUser({ email, username, password })
  if ('error' in result) return { error: result.error, fields }

  await setSessionCookie(result.token)
  redirect('/')
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Invalid form submission' }
  }

  const result = await loginUser({ email, password })
  if ('error' in result) return { error: result.error }

  await setSessionCookie(result.token)
  redirect('/')
}

export async function logoutAction(): Promise<never> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
