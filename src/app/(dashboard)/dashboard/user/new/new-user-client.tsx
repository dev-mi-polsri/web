'use client'

import { authClient } from '@/lib/auth.client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import BackButton from '../../_components/back-button'
import { UserForm } from './user-form'

export default function NewUserClient() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <UserForm
        onSubmit={async (values) => {
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
        }}
      />
    </div>
  )
}
