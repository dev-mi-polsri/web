'use client'

import type { Profile } from '@/schemas/ProfileTable'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { ProfileForm } from '@/app/(dashboard)/dashboard/profile/new/profile-form'
import { updateProfile } from '@/server-actions/profile'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTransition } from 'react'

type EditProfilePageProps = {
  profile: Profile
}

export default function EditProfilePage({ profile }: EditProfilePageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProfileForm
        title={`Edit Profile: ${profile.title}`}
        actionButtonLabel={'Simpan'}
        initialValues={{
          content: profile.content,
          title: profile.title,
          description: profile.description,
          scope: profile.scope,
        }}
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              let thumbnail
              if (values.thumbnail instanceof File) {
                thumbnail = await Base64Utils.toDataUrl(values.thumbnail)
              }

              const result = await updateProfile({
                id: profile.id,
                title: values.title,
                description: values.description,
                content: values.content!,
                scope: values.scope,
                thumbnail,
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Profile berhasil diperbarui')
              router.push('/dashboard/profile')
            } catch (error) {
              toast.error('Gagal memperbarui profile')
            }
          })
        }}
        skipValidation={{ thumbnail: true }}
      />
    </div>
  )
}
