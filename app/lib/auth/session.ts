import { cookies } from 'next/headers'
import { verifyJwt, type SessionPayload } from './jwt'

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  return verifyJwt(token)
}
