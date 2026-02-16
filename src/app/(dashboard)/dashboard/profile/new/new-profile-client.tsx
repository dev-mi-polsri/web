'use client'

import { ProfileForm } from './profile-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { useCreateProfile } from '@/app/(dashboard)/_hooks/profile'

export default function NewProfileClient() {
  const router = useRouter()
  const createMutation = useCreateProfile()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProfileForm
        onSubmit={async (values) => {
          await createMutation.mutateAsync({
            title: values.title,
            description: values.description,
            content: values.content!,
            scope: values.scope,
            thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
          })

          router.push('/dashboard/profile')
          router.refresh()
        }}
      />
    </div>
  )
}
