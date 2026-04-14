'use client'

import { ProfileForm } from './profile-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createProfile } from '@/server-actions/profile'
import { toast } from 'sonner'
import { useTransition } from 'react'

export default function NewProfileClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProfileForm
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              const result = await createProfile({
                title: values.title,
                description: values.description,
                content: values.content!,
                scope: values.scope,
                thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Profile berhasil dibuat')
              router.push('/dashboard/profile')
              router.refresh()
            } catch (error) {
              toast.error('Gagal membuat profile')
            }
          })
        }}
      />
    </div>
  )
}
