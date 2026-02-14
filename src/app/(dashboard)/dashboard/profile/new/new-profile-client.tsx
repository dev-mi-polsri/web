'use client'

import { createProfile } from '@/server-actions/profile'
import { ProfileForm } from './profile-form'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'

export default function NewProfileClient() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProfileForm
        onSubmit={async (values) => {
          const res = await createProfile({
            title: values.title,
            description: values.description,
            content: values.content!,
            scope: values.scope,
            thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
            return
          }

          toast.success('Profile berhasil dibuat')
          router.push('/dashboard/profile')
          router.refresh()
        }}
      />
    </div>
  )
}
