import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { RegisterForm } from './register-form'

export default async function RegisterPage(): Promise<React.JSX.Element> {
  const session = await getSession()
  if (session) redirect('/')

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create your account
        </h1>
        <RegisterForm />
      </div>
    </main>
  )
}
