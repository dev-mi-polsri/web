'use client'
import { GithubIcon } from 'lucide-react'

import { LoginForm } from './login-form'
import { authClient } from '@/lib/auth.client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email: email, // required
      password: password, // required
      rememberMe: true,
      callbackURL: 'http://localhost:3000/dashboard',
    })
    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Login successful!')
    router.push('/dashboard')
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="https://github.com/dev-mi-polsri"
            target={'_blank'}
            className="flex items-center gap-2 font-medium hover:underline"
          >
            <GithubIcon className={'size-4'} />
            dev-mi-polsri
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSubmit={(values) => handleSignIn(values.email, values.password)} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/Hero-1.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
