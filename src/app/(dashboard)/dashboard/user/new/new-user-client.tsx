'use client'

import { authClient } from '@/lib/auth.client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import BackButton from '../../_components/back-button'
import { UserForm } from './user-form'
import { useTransition } from 'react'

export default function NewUserClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <UserForm
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            const res = await authClient.admin.createUser({
              email: values.email,
              name: values.name,
              password: values.password,
              role: values.role,
            })

            if (res.error) {
              toast.error(res.error.message)
              return
            }

            toast.success('User berhasil dibuat')
            router.push('/dashboard/user')
            router.refresh()
          })
        }}
      />
    </div>
  )
}
