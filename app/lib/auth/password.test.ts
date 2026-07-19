import { hashPassword, verifyPassword } from './password'

describe('lib/auth/password', () => {
  describe('hashPassword', () => {
    it('produces a bcrypt hash string', async () => {
      const hash = await hashPassword('mysecretpassword')
      expect(hash).toMatch(/^\$2[ab]\$/)
    })

    it('produces different hashes for the same input', async () => {
      const hash1 = await hashPassword('same-password')
      const hash2 = await hashPassword('same-password')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('returns true for the correct password', async () => {
      const hash = await hashPassword('correct-horse')
      expect(await verifyPassword('correct-horse', hash)).toBe(true)
    })

    it('returns false for a wrong password', async () => {
      const hash = await hashPassword('correct-horse')
      expect(await verifyPassword('wrong-horse', hash)).toBe(false)
    })
  })
})
