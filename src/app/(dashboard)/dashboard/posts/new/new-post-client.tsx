'use client'
import { PostForm } from './post-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { useCreatePost } from '@/app/(dashboard)/_hooks/post'

export default function NewPostClient() {
  const router = useRouter()
  const createMutation = useCreatePost()

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <BackButton />
        </div>
        <PostForm
          onSubmit={async (values) => {
            await createMutation.mutateAsync({
              title: values.title,
              content: values.content!,
              type: values.type,
              scope: values.scope,
              isFeatured: values.isFeatured,
              isPublished: values.isPublished,
              thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
            })

            router.push('/dashboard/posts')
            router.refresh()
          }}
        />
      </div>
    </>
  )
}
