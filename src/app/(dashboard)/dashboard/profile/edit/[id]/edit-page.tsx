'use client'

import type { Profile } from '@/schemas/ProfileTable'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { ProfileForm } from '@/app/(dashboard)/dashboard/profile/new/profile-form'
import { updateProfile } from '@/server-actions/profile'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type EditProfilePageProps = {
  profile: Profile
}

export default function EditProfilePage({ profile }: EditProfilePageProps) {
  const router = useRouter()

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
        onSubmit={async (values) => {
          let thumbnail
          if (values.thumbnail instanceof File) {
            thumbnail = await Base64Utils.toDataUrl(values.thumbnail)
          }

          const res = await updateProfile({
            id: profile.id,
            title: values.title,
            description: values.description,
            content: values.content!,
            scope: values.scope,
            thumbnail,
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
            return
          }

          toast.success('Profile berhasil diperbarui')
          router.push('/dashboard/profile')
          router.refresh()
        }}
        skipValidation={{ thumbnail: true }}
      />
    </div>
  )
}
