'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createUser } from '@/server-actions/auth'
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
          const res = await createUser({
            email: values.email,
            name: values.name,
            password: values.password,
            role: values.role,
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
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
