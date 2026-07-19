import { SignJWT, jwtVerify } from 'jose'

export type SessionPayload = {
  userId: string
  email: string
  username: string
  roles: string[]
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET env var is not set')
  return new TextEncoder().encode(secret)
}

function getExpirySeconds(): number {
  const raw = process.env.JWT_EXPIRY_SECONDS
  const parsed = raw ? parseInt(raw, 10) : NaN
  return Number.isFinite(parsed) ? parsed : 604800
}

export async function signJwt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${getExpirySeconds()}s`)
    .sign(getSecret())
}

export async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
