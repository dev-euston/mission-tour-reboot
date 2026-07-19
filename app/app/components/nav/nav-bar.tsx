import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import { ProfileMenu } from './profile-menu'

export async function NavBar(): Promise<React.JSX.Element> {
  const session = await getSession()

  return (
    <nav className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Mission: Tour
        </Link>

        {session ? (
          <ProfileMenu username={session.username} />
        ) : (
          <Link
            href="/login"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}
