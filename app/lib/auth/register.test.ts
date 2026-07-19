import { db } from '@/lib/db'
import { registerUser } from './register'

const TEST_EMAILS = ['reg1@test.com', 'dup@test.com', 'usernamedup@test.com', 'other@test.com']

async function cleanup(): Promise<void> {
  await db.userRole.deleteMany({ where: { user: { email: { in: TEST_EMAILS } } } })
  await db.user.deleteMany({ where: { email: { in: TEST_EMAILS } } })
}

describe('lib/auth/register', () => {
  describe('registerUser', () => {
    beforeEach(async () => { await cleanup() })
    afterAll(async () => { await cleanup() })

    it('creates a user with PLAYER and CREATOR roles and returns a token', async () => {
      const result = await registerUser({ email: 'reg1@test.com', username: 'testuser1', password: 'password123' })
      expect(result).not.toHaveProperty('error')
      if ('error' in result) return

      expect(typeof result.userId).toBe('string')
      expect(typeof result.token).toBe('string')

      const user = await db.user.findUnique({ where: { id: result.userId }, include: { roles: true } })
      expect(user?.roles).toHaveLength(2)
      const roleNames = user?.roles.map((r) => r.role)
      expect(roleNames).toContain('PLAYER')
      expect(roleNames).toContain('CREATOR')
    })

    it('returns an error for a duplicate email', async () => {
      await registerUser({ email: 'dup@test.com', username: 'dupuser1', password: 'password123' })
      const result = await registerUser({ email: 'dup@test.com', username: 'dupuser2', password: 'password123' })
      expect(result).toEqual({ error: 'Email already in use' })
    })

    it('returns an error for a duplicate username', async () => {
      await registerUser({ email: 'usernamedup@test.com', username: 'dupu', password: 'password123' })
      const result = await registerUser({ email: 'other@test.com', username: 'dupu', password: 'password123' })
      expect(result).toEqual({ error: 'Username already taken' })
    })

    it('returns an error for an invalid email', async () => {
      const result = await registerUser({ email: 'not-an-email', username: 'validuser', password: 'password123' })
      expect(result).toEqual({ error: 'Invalid email address' })
    })

    it('returns an error for a username that is too short', async () => {
      const result = await registerUser({ email: 'short@test.com', username: 'ab', password: 'password123' })
      expect(result).toHaveProperty('error')
    })

    it('returns an error for a password shorter than 8 characters', async () => {
      const result = await registerUser({ email: 'shortpw@test.com', username: 'validuser', password: 'pass' })
      expect(result).toEqual({ error: 'Password must be at least 8 characters' })
    })
  })
})
