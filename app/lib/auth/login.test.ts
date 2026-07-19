import { db } from '@/lib/db'
import { hashPassword } from './password'
import { verifyJwt } from './jwt'
import { loginUser } from './login'

const TEST_EMAIL = 'login_test@test.com'
const TEST_USERNAME = 'logintestuser'
const TEST_PASSWORD = 'loginpassword99'

async function cleanup(): Promise<void> {
  await db.userRole.deleteMany({ where: { user: { email: TEST_EMAIL } } })
  await db.user.deleteMany({ where: { email: TEST_EMAIL } })
}

describe('lib/auth/login', () => {
  describe('loginUser', () => {
    beforeAll(async () => {
      await cleanup()
      const hashed = await hashPassword(TEST_PASSWORD)
      await db.user.create({
        data: {
          email: TEST_EMAIL,
          username: TEST_USERNAME,
          password: hashed,
          roles: {
            create: [
              { role: 'PLAYER', status: 'ACTIVE', activatedAt: new Date() },
              { role: 'CREATOR', status: 'ACTIVE', activatedAt: new Date() },
            ],
          },
        },
      })
    })

    afterAll(async () => { await cleanup() })

    it('returns a token when credentials are correct', async () => {
      const result = await loginUser({ email: TEST_EMAIL, password: TEST_PASSWORD })
      expect(result).not.toHaveProperty('error')
      if ('error' in result) return
      expect(typeof result.token).toBe('string')
    })

    it('includes active roles in the token payload', async () => {
      const result = await loginUser({ email: TEST_EMAIL, password: TEST_PASSWORD })
      if ('error' in result) throw new Error('Expected success')
      const payload = await verifyJwt(result.token)
      expect(payload?.roles).toContain('PLAYER')
      expect(payload?.roles).toContain('CREATOR')
    })

    it('returns Invalid credentials for a wrong password', async () => {
      const result = await loginUser({ email: TEST_EMAIL, password: 'wrongpassword' })
      expect(result).toEqual({ error: 'Invalid credentials' })
    })

    it('returns Invalid credentials for an unknown email', async () => {
      const result = await loginUser({ email: 'nobody@test.com', password: TEST_PASSWORD })
      expect(result).toEqual({ error: 'Invalid credentials' })
    })
  })
})
