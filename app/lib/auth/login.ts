import { db } from '@/lib/db'
import { RoleStatus } from '@/lib/generated/prisma'
import { verifyPassword } from './password'
import { signJwt } from './jwt'

type LoginInput = {
  email: string
  password: string
}

type LoginResult = { userId: string; token: string } | { error: string }

export async function loginUser(input: LoginInput): Promise<LoginResult> {
  const { email, password } = input

  const user = await db.user.findUnique({
    where: { email },
    include: {
      roles: { where: { status: RoleStatus.ACTIVE } },
    },
  })

  if (!user) return { error: 'Invalid credentials' }

  const valid = await verifyPassword(password, user.password)
  if (!valid) return { error: 'Invalid credentials' }

  const roleNames = user.roles.map((r) => r.role as string)

  const token = await signJwt({
    userId: user.id,
    email: user.email,
    username: user.username,
    roles: roleNames,
  })

  return { userId: user.id, token }
}
