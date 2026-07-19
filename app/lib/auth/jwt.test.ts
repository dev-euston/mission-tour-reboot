import { SignJWT } from 'jose'
import { signJwt, verifyJwt, type SessionPayload } from './jwt'

const SAMPLE_PAYLOAD: SessionPayload = {
  userId: 'user_123',
  email: 'test@example.com',
  username: 'testuser',
  roles: ['PLAYER', 'CREATOR'],
}

describe('lib/auth/jwt', () => {
  describe('signJwt', () => {
    it('returns a non-empty string', async () => {
      const token = await signJwt(SAMPLE_PAYLOAD)
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })
  })

  describe('verifyJwt', () => {
    it('decodes a valid token and returns the correct payload fields', async () => {
      const token = await signJwt(SAMPLE_PAYLOAD)
      const result = await verifyJwt(token)
      expect(result).not.toBeNull()
      expect(result?.userId).toBe(SAMPLE_PAYLOAD.userId)
      expect(result?.email).toBe(SAMPLE_PAYLOAD.email)
      expect(result?.username).toBe(SAMPLE_PAYLOAD.username)
      expect(result?.roles).toEqual(SAMPLE_PAYLOAD.roles)
    })

    it('returns null for a garbage token', async () => {
      expect(await verifyJwt('not.a.jwt')).toBeNull()
    })

    it('returns null for an expired token', async () => {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const pastDate = new Date(Date.now() - 1000)
      const token = await new SignJWT({ ...SAMPLE_PAYLOAD })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(pastDate)
        .sign(secret)
      expect(await verifyJwt(token)).toBeNull()
    })
  })
})
