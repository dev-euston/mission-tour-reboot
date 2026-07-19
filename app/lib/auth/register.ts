import { db } from '@/lib/db'
import { Role, RoleStatus } from '@/lib/generated/prisma'
import { hashPassword } from './password'
import { signJwt } from './jwt'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/

type RegisterInput = {
  email: string
  username: string
  password: string
}

type RegisterResult = { userId: string; token: string } | { error: string }

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const { email, username, password } = input

  if (!EMAIL_RE.test(email)) return { error: 'Invalid email address' }
  if (!USERNAME_RE.test(username)) return { error: 'Username must be 3–20 characters and contain only letters, numbers, or underscores' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters' }

  const existingEmail = await db.user.findUnique({ where: { email } })
  if (existingEmail) return { error: 'Email already in use' }

  const existingUsername = await db.user.findUnique({ where: { username } })
  if (existingUsername) return { error: 'Username already taken' }

  const hashed = await hashPassword(password)

  const user = await db.user.create({
    data: {
      email,
      username,
      password: hashed,
      roles: {
        create: [
          { role: Role.PLAYER, status: RoleStatus.ACTIVE, activatedAt: new Date() },
          { role: Role.CREATOR, status: RoleStatus.ACTIVE, activatedAt: new Date() },
        ],
      },
    },
  })

  const token = await signJwt({
    userId: user.id,
    email: user.email,
    username: user.username,
    roles: [Role.PLAYER, Role.CREATOR],
  })

  return { userId: user.id, token }
}
